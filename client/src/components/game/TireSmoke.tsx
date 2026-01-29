import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRacing } from "@/lib/stores/useRacing";

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

export function TireSmoke() {
  const { position, rotation, speed, phase } = useRacing();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const maxParticles = 100;
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  
  const particles = useMemo(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      arr.push({
        position: new THREE.Vector3(0, -100, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        life: 0,
        maxLife: 1,
        size: 0
      });
    }
    return arr;
  }, []);
  
  useFrame((_, delta) => {
    if (phase !== "racing" || !meshRef.current) return;
    
    const clampedDelta = Math.min(delta, 0.05);
    
    const shouldEmit = speed > 30;
    const emissionRate = shouldEmit ? Math.min((speed - 30) / 100, 1) : 0;
    
    if (shouldEmit && Math.random() < emissionRate * 0.5) {
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].life <= 0) {
          const offsetX = (Math.random() - 0.5) * 1.5;
          const offsetZ = -2 + Math.random() * 0.5;
          
          const cos = Math.cos(rotation);
          const sin = Math.sin(rotation);
          const worldOffsetX = offsetX * cos - offsetZ * sin;
          const worldOffsetZ = offsetX * sin + offsetZ * cos;
          
          particles[i].position.set(
            position.x + worldOffsetX,
            0.2,
            position.z + worldOffsetZ
          );
          
          particles[i].velocity.set(
            (Math.random() - 0.5) * 2,
            1 + Math.random() * 2,
            (Math.random() - 0.5) * 2
          );
          
          particles[i].life = 1;
          particles[i].maxLife = 0.8 + Math.random() * 0.4;
          particles[i].size = 0.3 + Math.random() * 0.3;
          break;
        }
      }
    }
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      if (p.life > 0) {
        p.life -= clampedDelta / p.maxLife;
        p.position.add(p.velocity.clone().multiplyScalar(clampedDelta));
        p.velocity.y -= 2 * clampedDelta;
        p.velocity.multiplyScalar(0.98);
        
        const scale = p.size * (0.5 + p.life * 0.5);
        tempObject.position.copy(p.position);
        tempObject.scale.setScalar(scale);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
        
        tempColor.setRGB(0.8, 0.8, 0.8);
        meshRef.current.setColorAt(i, tempColor);
      } else {
        tempObject.position.set(0, -100, 0);
        tempObject.scale.setScalar(0);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, maxParticles]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.4} color="#CCCCCC" />
    </instancedMesh>
  );
}
