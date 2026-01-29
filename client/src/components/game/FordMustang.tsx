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
    maxSpeed: 69, // Tesla Model Y Performance: ~250 km/h (~155 mph)
    acceleration: 7.7, // 0-60 mph in ~3.5 seconds
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
        groupRef.current.position.set(-3, 0.15, 0);
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
        state.velocity.z *= 0.998;
      } else {
        state.velocity.z *= 0.985;
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
          material.color.setHex(0x1a237e); // Blue
          material.metalness = 0.9;
          material.roughness = 0.15;
          material.envMapIntensity = 1.5;
        }
        child.material = material;
      }
    }
  });

  return (
    <group ref={groupRef} position={[-3, 0.5, 0]} rotation={[0, 0, 0]}>
      <primitive object={clonedScene} scale={2.5} rotation={[0, Math.PI, 0]} />
      
      {/* Chrome trim accents */}
      <mesh position={[0, 0.35, 2.3]} castShadow>
        <boxGeometry args={[1.6, 0.03, 0.05]} />
        <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.35, -2]} castShadow>
        <boxGeometry args={[1.4, 0.03, 0.05]} />
        <meshStandardMaterial color="#C0C0C0" metalness={1} roughness={0.1} />
      </mesh>
      
      {/* Tesla logo glow on front */}
      <mesh position={[0, 0.4, 2.4]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#E82127" emissive="#E82127" emissiveIntensity={0.5} />
      </mesh>
      
      {/* LED headlight strips */}
      <mesh position={[0.55, 0.35, 2.45]}>
        <boxGeometry args={[0.4, 0.05, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.55, 0.35, 2.45]}>
        <boxGeometry args={[0.4, 0.05, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={1} />
      </mesh>
      
      {/* LED taillight strips */}
      <mesh position={[0.5, 0.35, -2.1]}>
        <boxGeometry args={[0.5, 0.08, 0.02]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.35, -2.1]}>
        <boxGeometry args={[0.5, 0.08, 0.02]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.35, -2.1]}>
        <boxGeometry args={[0.8, 0.04, 0.02]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.6} />
      </mesh>
      
      {/* Side mirrors */}
      <mesh position={[0.75, 0.5, 0.8]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.08, 0.2]} />
        <meshStandardMaterial color="#1a237e" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[-0.75, 0.5, 0.8]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.08, 0.2]} />
        <meshStandardMaterial color="#1a237e" metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Headlights */}
      <pointLight
        position={[0.6, 0.3, 2.5]}
        color="#FFFFFF"
        intensity={3}
        distance={25}
      />
      <pointLight
        position={[-0.6, 0.3, 2.5]}
        color="#FFFFFF"
        intensity={3}
        distance={25}
      />
      
      {/* Taillights */}
      <pointLight
        position={[0.5, 0.3, -2]}
        color="#E82127"
        intensity={2}
        distance={15}
      />
      <pointLight
        position={[-0.5, 0.3, -2]}
        color="#E82127"
        intensity={2}
        distance={15}
      />
    </group>
  );
}

useGLTF.preload("/models/tesla-model-y.glb");
