import { useRef, useEffect } from "react";
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
    maxSpeed: 65, // m/s (~234 km/h) - slightly faster than opponent
    acceleration: 14, // Tesla Model Y Performance
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
    
    // Detect launch attempt
    if ((phase === "countdown" || phase === "racing") && keys.forward && !state.hasLaunched) {
      playerLaunch();
      state.hasLaunched = true;
      state.startTime = Date.now();
    }
    
    // Only move when racing and green light is on
    if (phase === "racing" && greenLightTime !== null && playerLaunchTime !== null && !state.finished) {
      const accelerating = keys.forward;
      
      if (accelerating) {
        // Accelerate in Z direction (forward on drag strip)
        const currentSpeed = state.velocity.z;
        if (currentSpeed < config.maxSpeed) {
          state.velocity.z += config.acceleration * clampedDelta;
          state.velocity.z = Math.min(state.velocity.z, config.maxSpeed);
        }
      } else {
        // Slight deceleration when not accelerating
        state.velocity.z *= 0.995;
      }
      
      // Minor steering to stay in lane (very limited for drag racing)
      const steerAmount = 0.5;
      if (keys.left) {
        state.position.x -= steerAmount * clampedDelta;
      }
      if (keys.right) {
        state.position.x += steerAmount * clampedDelta;
      }
      
      // Clamp to left lane
      state.position.x = Math.max(-6, Math.min(-1, state.position.x));
      
      // Move forward
      state.position.z += state.velocity.z * clampedDelta;
      state.position.y = config.groundHeight;
      
      state.wheelRotation += state.velocity.z * clampedDelta * 2;
      
      // Check finish line
      if (state.position.z >= trackLength && !state.finished && elapsedTime === null) {
        state.finished = true;
        const et = (Date.now() - state.startTime) / 1000;
        const trapSpeed = state.velocity.z * 3.6; // km/h
        setPlayerFinished(et, trapSpeed);
      }
    }
    
    // Update visual position
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
    }
  });

  return (
    <group ref={groupRef} position={[-3, 0.5, 0]} rotation={[0, 0, 0]}>
      <primitive object={clonedScene} scale={2.5} rotation={[0, Math.PI, 0]} />
      
      {/* Headlights - front of car (positive Z direction) */}
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
      
      {/* Taillights - back of car (negative Z direction) */}
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

useGLTF.preload("/models/tesla-model-y.glb");
