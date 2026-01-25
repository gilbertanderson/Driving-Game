import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface TrackSegment {
  start: THREE.Vector3;
  end: THREE.Vector3;
  width: number;
}

export function Track() {
  const asphaltTexture = useTexture("/textures/asphalt.png");
  const grassTexture = useTexture("/textures/grass.png");
  
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(10, 10);
  
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(50, 50);

  const trackPoints = useMemo(() => [
    new THREE.Vector3(0, 0.01, 0),
    new THREE.Vector3(50, 0.01, 0),
    new THREE.Vector3(80, 0.01, -30),
    new THREE.Vector3(80, 0.01, -80),
    new THREE.Vector3(50, 0.01, -110),
    new THREE.Vector3(0, 0.01, -110),
    new THREE.Vector3(-30, 0.01, -80),
    new THREE.Vector3(-30, 0.01, -30),
    new THREE.Vector3(0, 0.01, 0),
  ], []);

  const trackCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(trackPoints, true, 'catmullrom', 0.5);
  }, [trackPoints]);

  const trackShape = useMemo(() => {
    const trackWidth = 15;
    const segments = 200;
    const points = trackCurve.getPoints(segments);
    
    const leftEdge: THREE.Vector3[] = [];
    const rightEdge: THREE.Vector3[] = [];
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const tangent = trackCurve.getTangentAt(i / segments);
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      
      leftEdge.push(point.clone().add(normal.clone().multiplyScalar(trackWidth / 2)));
      rightEdge.push(point.clone().add(normal.clone().multiplyScalar(-trackWidth / 2)));
    }
    
    return { leftEdge, rightEdge, centerLine: points };
  }, [trackCurve]);

  const trackGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const { leftEdge, rightEdge } = trackShape;
    
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    
    for (let i = 0; i < leftEdge.length; i++) {
      vertices.push(leftEdge[i].x, leftEdge[i].y, leftEdge[i].z);
      vertices.push(rightEdge[i].x, rightEdge[i].y, rightEdge[i].z);
      
      const u = i / (leftEdge.length - 1) * 10;
      uvs.push(0, u);
      uvs.push(1, u);
    }
    
    for (let i = 0; i < leftEdge.length - 1; i++) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, [trackShape]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, -0.01, -55]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>
      
      <mesh geometry={trackGeometry} receiveShadow>
        <meshStandardMaterial map={asphaltTexture} side={THREE.DoubleSide} />
      </mesh>
      
      <TrackBarriers trackShape={trackShape} />
      
      <StartFinishLine position={[0, 0.02, 0]} rotation={[0, 0, 0]} />
      
      <CheckpointMarker position={[80, 0, -55]} />
      <CheckpointMarker position={[25, 0, -110]} />
      <CheckpointMarker position={[-30, 0, -55]} />
    </group>
  );
}

function TrackBarriers({ trackShape }: { trackShape: { leftEdge: THREE.Vector3[]; rightEdge: THREE.Vector3[] } }) {
  const barrierHeight = 0.8;
  const barrierWidth = 0.3;
  
  const barrierPositions = useMemo(() => {
    const positions: { position: THREE.Vector3; rotation: number }[] = [];
    const step = 10;
    
    for (let i = 0; i < trackShape.leftEdge.length - 1; i += step) {
      const left = trackShape.leftEdge[i];
      const right = trackShape.rightEdge[i];
      const nextLeft = trackShape.leftEdge[Math.min(i + step, trackShape.leftEdge.length - 1)];
      const nextRight = trackShape.rightEdge[Math.min(i + step, trackShape.rightEdge.length - 1)];
      
      const leftDir = new THREE.Vector3().subVectors(nextLeft, left);
      const rightDir = new THREE.Vector3().subVectors(nextRight, right);
      
      positions.push({
        position: new THREE.Vector3(left.x, barrierHeight / 2, left.z),
        rotation: Math.atan2(leftDir.z, leftDir.x)
      });
      
      positions.push({
        position: new THREE.Vector3(right.x, barrierHeight / 2, right.z),
        rotation: Math.atan2(rightDir.z, rightDir.x)
      });
    }
    
    return positions;
  }, [trackShape]);

  return (
    <group>
      {barrierPositions.map((barrier, index) => (
        <mesh
          key={index}
          position={[barrier.position.x, barrier.position.y, barrier.position.z]}
          rotation={[0, -barrier.rotation, 0]}
          castShadow
        >
          <boxGeometry args={[5, barrierHeight, barrierWidth]} />
          <meshStandardMaterial color={index % 4 < 2 ? "#E82127" : "#FFFFFF"} />
        </mesh>
      ))}
    </group>
  );
}

function StartFinishLine({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 3]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[(i - 3.5) * 1.875, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.875, 1.5]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#FFFFFF" : "#1A1A1A"} />
        </mesh>
      ))}
      
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[16, 1, 0.5]} />
        <meshStandardMaterial color="#393C41" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[-8, 2.5, 0]}>
        <boxGeometry args={[0.3, 5, 0.3]} />
        <meshStandardMaterial color="#393C41" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[8, 2.5, 0]}>
        <boxGeometry args={[0.3, 5, 0.3]} />
        <meshStandardMaterial color="#393C41" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function CheckpointMarker({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={[position[0], 3, position[2]]}>
      <boxGeometry args={[0.5, 6, 0.5]} />
      <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={0.3} />
    </mesh>
  );
}

export function getTrackBounds() {
  return {
    minX: -50,
    maxX: 100,
    minZ: -130,
    maxZ: 20
  };
}

export function getTrackCurve() {
  const trackPoints = [
    new THREE.Vector3(0, 0.01, 0),
    new THREE.Vector3(50, 0.01, 0),
    new THREE.Vector3(80, 0.01, -30),
    new THREE.Vector3(80, 0.01, -80),
    new THREE.Vector3(50, 0.01, -110),
    new THREE.Vector3(0, 0.01, -110),
    new THREE.Vector3(-30, 0.01, -80),
    new THREE.Vector3(-30, 0.01, -30),
    new THREE.Vector3(0, 0.01, 0),
  ];
  
  return new THREE.CatmullRomCurve3(trackPoints, true, 'catmullrom', 0.5);
}
