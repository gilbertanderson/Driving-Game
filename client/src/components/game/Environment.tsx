import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export function Environment() {
  return (
    <group>
      <Sky />
      <Lighting />
      <Scenery />
    </group>
  );
}

function Sky() {
  const skyTexture = useTexture("/textures/sky.png");
  
  return (
    <mesh>
      <sphereGeometry args={[500, 32, 32]} />
      <meshBasicMaterial map={skyTexture} side={THREE.BackSide} />
    </mesh>
  );
}

function Lighting() {
  return (
    <group>
      <ambientLight intensity={0.4} color="#87CEEB" />
      
      <directionalLight
        position={[100, 100, 50]}
        intensity={1.2}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={300}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      
      <directionalLight
        position={[-50, 50, -50]}
        intensity={0.3}
        color="#FFE4B5"
      />
      
      <hemisphereLight
        args={["#87CEEB", "#3D9140", 0.3]}
      />
    </group>
  );
}

function Scenery() {
  const treePositions = useMemo(() => {
    const positions: { x: number; z: number; scale: number; rotation: number }[] = [];
    const seed = 12345;
    
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i * 9999) * 10000;
      return x - Math.floor(x);
    };
    
    for (let i = 0; i < 60; i++) {
      const angle = seededRandom(i) * Math.PI * 2;
      const distance = 80 + seededRandom(i + 100) * 100;
      
      positions.push({
        x: Math.cos(angle) * distance + 25,
        z: Math.sin(angle) * distance - 55,
        scale: 1 + seededRandom(i + 200) * 0.5,
        rotation: seededRandom(i + 300) * Math.PI * 2
      });
    }
    
    return positions;
  }, []);

  return (
    <group>
      {treePositions.map((tree, index) => (
        <Tree
          key={index}
          position={[tree.x, 0, tree.z]}
          scale={tree.scale}
          rotation={tree.rotation}
        />
      ))}
      
      <Billboard position={[60, 0, 20]} rotation={Math.PI * 0.75} text="TESLA" color="#E82127" />
      <Billboard position={[-40, 0, -20]} rotation={Math.PI * 0.25} text="MODEL Y" color="#00D4FF" />
      <Billboard position={[100, 0, -80]} rotation={Math.PI * 1.5} text="RACE" color="#FFFFFF" />
    </group>
  );
}

function Tree({ position, scale, rotation }: { position: [number, number, number]; scale: number; rotation: number }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[2, 6, 8]} />
        <meshStandardMaterial color="#2D5A27" />
      </mesh>
      
      <mesh position={[0, 5.5, 0]} castShadow>
        <coneGeometry args={[1.5, 4, 8]} />
        <meshStandardMaterial color="#3D7A37" />
      </mesh>
      
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.5, 8]} />
        <meshStandardMaterial color="#4A3728" />
      </mesh>
    </group>
  );
}

function Billboard({ position, rotation, text, color }: { position: [number, number, number]; rotation: number; text: string; color: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[8, 4, 0.3]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      
      <mesh position={[0, 4, 0.16]}>
        <planeGeometry args={[7.5, 3.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      
      <mesh position={[-3, 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
        <meshStandardMaterial color="#393C41" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[3, 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
        <meshStandardMaterial color="#393C41" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
