import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRacing } from "@/lib/stores/useRacing";

export function OpponentTesla() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/ford-mustang.glb");
  
  const { 
    phase, 
    greenLightTime, 
    setOpponentPosition, 
    setOpponentSpeed,
    setOpponentFinished,
    opponentFinished,
    trackLength
  } = useRacing();
  
  const opponentState = useRef({
    position: new THREE.Vector3(3, 0.15, 0),
    velocity: 0,
    hasLaunched: false,
    launchDelay: 0.15 + Math.random() * 0.1, // 0.15-0.25s reaction time
    launchTime: 0,
    finished: false,
    startTime: 0
  });

  const config = {
    maxSpeed: 69, // Ford Mustang GT: ~250 km/h (~155 mph)
    acceleration: 6.7, // 0-60 mph in ~4.0 seconds
    topSpeedReached: 0.7
  };

  useEffect(() => {
    // Reset opponent state when race starts
    if (phase === "staging") {
      opponentState.current = {
        position: new THREE.Vector3(3, 0.15, 0),
        velocity: 0,
        hasLaunched: false,
        launchDelay: 0.15 + Math.random() * 0.1,
        launchTime: 0,
        finished: false,
        startTime: 0
      };
      if (groupRef.current) {
        groupRef.current.position.set(3, 0.15, 0);
      }
    }
  }, [phase]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const state = opponentState.current;
    const clampedDelta = Math.min(delta, 0.05);
    
    if (phase === "racing" && greenLightTime !== null && !state.finished) {
      const timeSinceGreen = (Date.now() - greenLightTime) / 1000;
      
      // Check if AI should launch
      if (!state.hasLaunched && timeSinceGreen >= state.launchDelay) {
        state.hasLaunched = true;
        state.launchTime = Date.now();
        state.startTime = Date.now();
      }
      
      // AI is racing
      if (state.hasLaunched) {
        // Accelerate towards max speed
        if (state.velocity < config.maxSpeed) {
          state.velocity += config.acceleration * clampedDelta;
          state.velocity = Math.min(state.velocity, config.maxSpeed);
        }
        
        // Move forward (positive Z direction)
        state.position.z += state.velocity * clampedDelta;
        
        // Update store
        setOpponentSpeed(state.velocity * 3.6); // Convert to km/h
        setOpponentPosition({
          x: state.position.x,
          y: state.position.y,
          z: state.position.z
        });
        
        // Check finish line
        if (state.position.z >= trackLength && !state.finished && !opponentFinished) {
          state.finished = true;
          const elapsedTime = (Date.now() - state.startTime) / 1000;
          const trapSpeed = state.velocity * 3.6; // km/h
          setOpponentFinished(elapsedTime, trapSpeed);
        }
      }
    }
    
    // Update visual position
    groupRef.current.position.copy(state.position);
  });

  const clonedScene = scene.clone();
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      // Make opponent Tesla a different color (blue instead of default)
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
    <group ref={groupRef} position={[3, 0.15, 0]} rotation={[0, 0, 0]}>
      <primitive object={clonedScene} scale={2.5} rotation={[0, 0, 0]} />
      
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
