import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useRacing } from "@/lib/stores/useRacing";

interface VehicleProps {
  onPositionUpdate?: (position: THREE.Vector3, rotation: number) => void;
}

export function FordMustang({ onPositionUpdate }: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/ford-mustang.glb");
  
  const { 
    phase, 
    updateVehicle, 
    playerLaunch, 
    greenLightTime,
    playerLaunchTime,
    setPlayerFinished,
    trackLength,
    elapsedTime
  } = useRacing();
  
  const [, getKeys] = useKeyboardControls();
  
  const vehicleState = useRef({
    position: new THREE.Vector3(-3, 0.5, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: 0,
    wheelRotation: 0,
    hasLaunched: false,
    startTime: 0,
    finished: false
  });

  const config = {
    maxSpeed: 65,
    acceleration: 14,
    groundHeight: 0.5
  };

  useEffect(() => {
    if (phase === "staging") {
      vehicleState.current = {
        position: new THREE.Vector3(-3, 0.5, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: 0,
        wheelRotation: 0,
        hasLaunched: false,
        startTime: 0,
        finished: false
      };
      if (groupRef.current) {
        groupRef.current.position.set(-3, 0.5, 0);
        groupRef.current.rotation.y = 0;
      }
    }
  }, [phase]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const keys = getKeys();
    const state = vehicleState.current;
    const clampedDelta = Math.min(delta, 0.05);
    
    if ((phase === "countdown" || phase === "racing") && keys.forward && !state.hasLaunched) {
      playerLaunch();
      state.hasLaunched = true;
      state.startTime = Date.now();
    }
    
    if (phase === "racing" && greenLightTime !== null && playerLaunchTime !== null && !state.finished) {
      const accelerating = keys.forward;
      
      if (accelerating) {
        const currentSpeed = state.velocity.z;
        if (currentSpeed < config.maxSpeed) {
          state.velocity.z += config.acceleration * clampedDelta;
          state.velocity.z = Math.min(state.velocity.z, config.maxSpeed);
        }
      } else {
        state.velocity.z *= 0.995;
      }
      
      const steerAmount = 0.5;
      if (keys.left) {
        state.position.x -= steerAmount * clampedDelta;
      }
      if (keys.right) {
        state.position.x += steerAmount * clampedDelta;
      }
      
      state.position.x = Math.max(-6, Math.min(-1, state.position.x));
      
      state.position.z += state.velocity.z * clampedDelta;
      state.position.y = config.groundHeight;
      
      state.wheelRotation += state.velocity.z * clampedDelta * 2;
      
      if (state.position.z >= trackLength && !state.finished && elapsedTime === null) {
        state.finished = true;
        const et = (Date.now() - state.startTime) / 1000;
        const trapSpeed = state.velocity.z * 3.6;
        setPlayerFinished(et, trapSpeed);
      }
    }
    
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

  const clonedScene = scene.clone();
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        const material = (child.material as THREE.MeshStandardMaterial).clone();
        if (material.color) {
          material.color.setHex(0xE82127); // Red
        }
        child.material = material;
      }
    }
  });

  return (
    <group ref={groupRef} position={[-3, 0.5, 0]} rotation={[0, 0, 0]}>
      <primitive object={clonedScene} scale={2.5} rotation={[0, -Math.PI / 2, 0]} />
      
      <pointLight
        position={[0.6, 0.3, 2.5]}
        color="#FFFFFF"
        intensity={2}
        distance={20}
      />
      <pointLight
        position={[-0.6, 0.3, 2.5]}
        color="#FFFFFF"
        intensity={2}
        distance={20}
      />
      
      <pointLight
        position={[0.5, 0.3, -2]}
        color="#E82127"
        intensity={1}
        distance={10}
      />
      <pointLight
        position={[-0.5, 0.3, -2]}
        color="#E82127"
        intensity={1}
        distance={10}
      />
    </group>
  );
}

useGLTF.preload("/models/ford-mustang.glb");
