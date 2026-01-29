import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRacing } from "@/lib/stores/useRacing";

export function RacingCamera() {
  const { camera } = useThree();
  const { position, cameraMode, phase, opponentPosition } = useRacing();
  
  const smoothPosition = useRef(new THREE.Vector3(0, 10, -20));
  const smoothLookAt = useRef(new THREE.Vector3(0, 0, 50));
  
  useFrame((_, delta) => {
    if (phase !== "staging" && phase !== "countdown" && phase !== "racing") return;
    
    const clampedDelta = Math.min(delta, 0.05);
    const vehiclePos = new THREE.Vector3(position.x, position.y, position.z);
    
    let targetPosition: THREE.Vector3;
    let targetLookAt: THREE.Vector3;
    
    if (cameraMode === "chase") {
      // Behind and above the player car
      targetPosition = new THREE.Vector3(
        vehiclePos.x - 3, // Offset to see both cars
        6,
        vehiclePos.z - 15
      );
      
      // Look ahead of the car
      targetLookAt = new THREE.Vector3(
        0, // Center between lanes
        1,
        vehiclePos.z + 30
      );
    } else {
      // Side view - positioned to the side of the track
      const midZ = (vehiclePos.z + opponentPosition.z) / 2;
      
      targetPosition = new THREE.Vector3(
        -25, // Far to the side
        5,
        midZ
      );
      
      // Look at the midpoint between cars
      targetLookAt = new THREE.Vector3(
        0,
        1,
        midZ + 10
      );
    }
    
    // Smooth camera movement
    const smoothFactor = 5;
    smoothPosition.current.lerp(targetPosition, clampedDelta * smoothFactor);
    smoothLookAt.current.lerp(targetLookAt, clampedDelta * smoothFactor);
    
    camera.position.copy(smoothPosition.current);
    camera.lookAt(smoothLookAt.current);
  });

  useEffect(() => {
    if (phase === "menu" || phase === "finished") {
      // Overview camera for menu
      camera.position.set(0, 15, -25);
      camera.lookAt(0, 0, 50);
    } else if (phase === "staging") {
      // Reset camera for staging
      smoothPosition.current.set(-3, 6, -15);
      smoothLookAt.current.set(0, 1, 30);
      camera.position.copy(smoothPosition.current);
      camera.lookAt(smoothLookAt.current);
    }
  }, [phase, camera]);

  return null;
}
