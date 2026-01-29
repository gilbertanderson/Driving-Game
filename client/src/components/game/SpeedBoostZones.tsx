import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BOOST_ZONES, BoostZone } from "@/lib/boostZones";

export function SpeedBoostZones() {
  return (
    <group>
      {BOOST_ZONES.map((zone, index) => (
        <BoostZoneVisual key={index} zone={zone} index={index} />
      ))}
    </group>
  );
}

function BoostZoneVisual({ zone, index }: { zone: BoostZone; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const arrowsRef = useRef<THREE.Group>(null);
  
  const arrowMaterials = useMemo(() => {
    return [0, 1, 2].map(() => new THREE.MeshBasicMaterial({
      color: "#00FF00",
      transparent: true,
      opacity: 0.8
    }));
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current || !arrowsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const pulse = Math.sin(time * 4 + index) * 0.3 + 0.7;
    
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = pulse * 0.8;
    
    arrowsRef.current.children.forEach((arrow, i) => {
      const offset = (time * 2 + i * 0.5) % 1;
      arrow.position.z = (offset - 0.5) * zone.length * 0.8;
      arrowMaterials[i].opacity = 0.8 - offset * 0.6;
    });
  });
  
  return (
    <group position={zone.position} rotation={[0, zone.rotation, 0]}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[zone.width, zone.length]} />
        <meshStandardMaterial
          color="#00FF00"
          emissive="#00FF00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      <group ref={arrowsRef}>
        {arrowMaterials.map((material, i) => (
          <mesh key={i} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
            <coneGeometry args={[1.5, 3, 3]} />
          </mesh>
        ))}
      </group>
      
      <mesh position={[-zone.width / 2 - 0.5, 2, 0]}>
        <boxGeometry args={[0.3, 4, 0.3]} />
        <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[zone.width / 2 + 0.5, 2, 0]}>
        <boxGeometry args={[0.3, 4, 0.3]} />
        <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}
