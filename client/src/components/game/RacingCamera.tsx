import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRacing } from "@/lib/stores/useRacing";

export function RacingCamera() {
  const { camera } = useThree();
  const { position, rotation, cameraMode, phase } = useRacing();
  
  const targetPosition = useRef(new THREE.Vector3(0, 5, 15));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const smoothPosition = useRef(new THREE.Vector3(0, 5, 15));
  
  useFrame((_, delta) => {
    if (phase !== "racing") return;
    
    const clampedDelta = Math.min(delta, 0.05);
    const vehiclePos = new THREE.Vector3(position.x, position.y, position.z);
    
    if (cameraMode === "chase") {
      const cameraDistance = 12;
      const cameraHeight = 5;
      const lookAheadDistance = 8;
      
      const behindOffset = new THREE.Vector3(
        -Math.sin(rotation) * cameraDistance,
        cameraHeight,
        -Math.cos(rotation) * cameraDistance
      );
      
      targetPosition.current.copy(vehiclePos).add(behindOffset);
      
      const lookAhead = new THREE.Vector3(
        Math.sin(rotation) * lookAheadDistance,
        1,
        Math.cos(rotation) * lookAheadDistance
      );
      targetLookAt.current.copy(vehiclePos).add(lookAhead);
    } else {
      const cockpitOffset = new THREE.Vector3(
        Math.sin(rotation) * 0.5,
        1.5,
        Math.cos(rotation) * 0.5
      );
      
      targetPosition.current.copy(vehiclePos).add(cockpitOffset);
      
      const lookForward = new THREE.Vector3(
        Math.sin(rotation) * 10,
        1,
        Math.cos(rotation) * 10
      );
      targetLookAt.current.copy(vehiclePos).add(lookForward);
    }
    
    const smoothFactor = cameraMode === "chase" ? 5 : 10;
    smoothPosition.current.lerp(targetPosition.current, clampedDelta * smoothFactor);
    
    camera.position.copy(smoothPosition.current);
    camera.lookAt(targetLookAt.current);
  });

  useEffect(() => {
    if (phase === "menu") {
      camera.position.set(30, 20, 30);
      camera.lookAt(0, 0, -55);
    }
  }, [phase, camera]);

  return null;
}
