import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

export function DragStrip() {
  const asphaltTexture = useTexture("/textures/asphalt.png");
  const grassTexture = useTexture("/textures/grass.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  
  useMemo(() => {
    asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
    asphaltTexture.repeat.set(2, 60);
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(30, 120);
    sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(3, 60);
  }, [asphaltTexture, grassTexture, sandTexture]);

  const trackLength = 550;
  const trackWidth = 15;
  const laneWidth = 6;
  const sandWidth = 8;
  
  return (
    <group>
      {/* Extended road - before start line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -50]} receiveShadow>
        <planeGeometry args={[trackWidth, 100]} />
        <meshStandardMaterial map={asphaltTexture} roughness={0.8} />
      </mesh>
      
      {/* Main asphalt strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, trackLength / 2]} receiveShadow>
        <planeGeometry args={[trackWidth, trackLength]} />
        <meshStandardMaterial map={asphaltTexture} roughness={0.8} />
      </mesh>
      
      {/* Sand/dirt strips along the road sides */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-trackWidth / 2 - sandWidth / 2, 0.005, trackLength / 2 - 25]} receiveShadow>
        <planeGeometry args={[sandWidth, trackLength + 150]} />
        <meshStandardMaterial map={sandTexture} roughness={1} color="#C4A574" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[trackWidth / 2 + sandWidth / 2, 0.005, trackLength / 2 - 25]} receiveShadow>
        <planeGeometry args={[sandWidth, trackLength + 150]} />
        <meshStandardMaterial map={sandTexture} roughness={1} color="#C4A574" />
      </mesh>
      
      {/* Grass on both sides - beyond the sand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-50, 0, trackLength / 2 - 25]} receiveShadow>
        <planeGeometry args={[80, trackLength + 200]} />
        <meshStandardMaterial map={grassTexture} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, 0, trackLength / 2 - 25]} receiveShadow>
        <planeGeometry args={[80, trackLength + 200]} />
        <meshStandardMaterial map={grassTexture} roughness={1} />
      </mesh>
      
      {/* Center lane divider - dashed white line */}
      {Array.from({ length: 55 }).map((_, i) => (
        <mesh 
          key={`divider-${i}`}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0.02, i * 10 + 5]}
        >
          <planeGeometry args={[0.15, 4]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
      
      {/* Outer lane markers - solid yellow lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-laneWidth, 0.02, trackLength / 2]}>
        <planeGeometry args={[0.15, trackLength]} />
        <meshStandardMaterial color="#FFCC00" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[laneWidth, 0.02, trackLength / 2]}>
        <planeGeometry args={[0.15, trackLength]} />
        <meshStandardMaterial color="#FFCC00" />
      </mesh>
      
      {/* Start line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 5]}>
        <planeGeometry args={[trackWidth, 0.5]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Finish line at 402m (quarter mile) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 402]}>
        <planeGeometry args={[trackWidth, 1]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Checkered finish pattern */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh 
          key={`checker-${i}`}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[(i - 3.5) * 1.8, 0.025, 402]}
        >
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#000000" : "#FFFFFF"} />
        </mesh>
      ))}
      
      {/* Staging area markers - two beams at start */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -2]}>
        <planeGeometry args={[trackWidth, 0.3]} />
        <meshStandardMaterial color="#FFCC00" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[trackWidth, 0.3]} />
        <meshStandardMaterial color="#FFCC00" />
      </mesh>
      
      {/* Rock formations along the track */}
      {[50, 120, 200, 280, 350, 420].map((distance, idx) => (
        <group key={`rocks-${distance}`}>
          {/* Left side rocks */}
          <group position={[-trackWidth / 2 - sandWidth - 3, 0, distance]}>
            <mesh position={[0, 1.2, 0]} rotation={[0.2, idx * 0.5, 0.1]} castShadow>
              <dodecahedronGeometry args={[1.5 + (idx % 3) * 0.3, 0]} />
              <meshStandardMaterial color="#8B7355" roughness={0.9} />
            </mesh>
            <mesh position={[1.5, 0.8, 0.5]} rotation={[0.3, idx * 0.7, -0.1]} castShadow>
              <dodecahedronGeometry args={[1 + (idx % 2) * 0.2, 0]} />
              <meshStandardMaterial color="#9C8A6E" roughness={0.9} />
            </mesh>
            <mesh position={[-0.8, 0.5, -0.3]} rotation={[-0.1, idx * 0.3, 0.2]} castShadow>
              <icosahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial color="#7A6B5A" roughness={0.95} />
            </mesh>
          </group>
          {/* Right side rocks */}
          <group position={[trackWidth / 2 + sandWidth + 3, 0, distance + 15]}>
            <mesh position={[0, 1, 0]} rotation={[-0.15, idx * 0.4, 0.2]} castShadow>
              <dodecahedronGeometry args={[1.3 + (idx % 2) * 0.4, 0]} />
              <meshStandardMaterial color="#8B7355" roughness={0.9} />
            </mesh>
            <mesh position={[-1.2, 0.6, 0.4]} rotation={[0.1, idx * 0.6, -0.15]} castShadow>
              <icosahedronGeometry args={[0.9, 0]} />
              <meshStandardMaterial color="#9C8A6E" roughness={0.9} />
            </mesh>
          </group>
        </group>
      ))}
      
      {/* Christmas tree tower in center */}
      <mesh position={[0, 5, -5]}>
        <boxGeometry args={[1, 10, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}
