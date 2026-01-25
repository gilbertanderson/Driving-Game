import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useRacing } from "@/lib/stores/useRacing";

interface VehicleProps {
  onPositionUpdate?: (position: THREE.Vector3, rotation: number) => void;
}

export function TeslaModelY({ onPositionUpdate }: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/tesla-model-y.glb");
  
  const { phase, updateVehicle } = useRacing();
  
  const [, getKeys] = useKeyboardControls();
  
  const vehicleState = useRef({
    position: new THREE.Vector3(0, 0.5, 5),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: Math.PI,
    angularVelocity: 0,
    acceleration: 0,
    braking: false,
    wheelRotation: 0,
    steeringAngle: 0
  });

  const config = {
    maxSpeed: 55,
    acceleration: 25,
    brakeForce: 40,
    friction: 0.98,
    turnSpeed: 2.5,
    maxTurnAngle: 0.6,
    turnFriction: 0.95,
    groundHeight: 0.5
  };

  useFrame((_, delta) => {
    if (phase !== "racing" || !groupRef.current) return;
    
    const keys = getKeys();
    const state = vehicleState.current;
    
    const clampedDelta = Math.min(delta, 0.05);
    
    let accelerationInput = 0;
    if (keys.forward) accelerationInput = 1;
    if (keys.backward) accelerationInput = -0.5;
    
    let steeringInput = 0;
    if (keys.left) steeringInput = 1;
    if (keys.right) steeringInput = -1;
    
    const speed = state.velocity.length();
    const speedRatio = Math.min(speed / config.maxSpeed, 1);
    
    if (accelerationInput !== 0) {
      const force = accelerationInput * config.acceleration * clampedDelta;
      const direction = new THREE.Vector3(
        Math.sin(state.rotation),
        0,
        Math.cos(state.rotation)
      );
      state.velocity.add(direction.multiplyScalar(force));
    }
    
    if (keys.backward && speed > 0.1) {
      state.velocity.multiplyScalar(1 - config.brakeForce * clampedDelta * 0.1);
    }
    
    state.velocity.multiplyScalar(config.friction);
    
    const currentSpeed = state.velocity.length();
    if (currentSpeed > config.maxSpeed) {
      state.velocity.normalize().multiplyScalar(config.maxSpeed);
    }
    
    if (steeringInput !== 0 && speed > 0.5) {
      const turnMultiplier = 1 - speedRatio * 0.5;
      state.rotation += steeringInput * config.turnSpeed * turnMultiplier * clampedDelta;
      
      state.steeringAngle = THREE.MathUtils.lerp(
        state.steeringAngle,
        steeringInput * config.maxTurnAngle,
        0.2
      );
    } else {
      state.steeringAngle = THREE.MathUtils.lerp(state.steeringAngle, 0, 0.1);
    }
    
    state.position.add(state.velocity.clone().multiplyScalar(clampedDelta));
    state.position.y = config.groundHeight;
    
    state.wheelRotation += speed * clampedDelta * 2;
    
    groupRef.current.position.copy(state.position);
    groupRef.current.rotation.y = state.rotation;
    
    updateVehicle(
      { x: state.position.x, y: state.position.y, z: state.position.z },
      state.rotation,
      { x: state.velocity.x, y: state.velocity.y, z: state.velocity.z }
    );
    
    if (onPositionUpdate) {
      onPositionUpdate(state.position.clone(), state.rotation);
    }
  });

  useEffect(() => {
    if (phase === "racing") {
      vehicleState.current = {
        position: new THREE.Vector3(0, 0.5, 5),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: Math.PI,
        angularVelocity: 0,
        acceleration: 0,
        braking: false,
        wheelRotation: 0,
        steeringAngle: 0
      };
      if (groupRef.current) {
        groupRef.current.position.set(0, 0.5, 5);
        groupRef.current.rotation.y = Math.PI;
      }
    }
  }, [phase]);

  const clonedScene = scene.clone();
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 5]} rotation={[0, Math.PI, 0]}>
      <primitive object={clonedScene} scale={2.5} />
      
      <pointLight
        position={[0.6, 0.3, 1.8]}
        color="#FFFFFF"
        intensity={2}
        distance={20}
      />
      <pointLight
        position={[-0.6, 0.3, 1.8]}
        color="#FFFFFF"
        intensity={2}
        distance={20}
      />
      
      <pointLight
        position={[0.5, 0.3, -1.5]}
        color="#E82127"
        intensity={1}
        distance={10}
      />
      <pointLight
        position={[-0.5, 0.3, -1.5]}
        color="#E82127"
        intensity={1}
        distance={10}
      />
    </group>
  );
}

useGLTF.preload("/models/tesla-model-y.glb");
