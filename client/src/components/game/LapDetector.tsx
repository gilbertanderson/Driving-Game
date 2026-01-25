import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRacing } from "@/lib/stores/useRacing";

export function LapDetector() {
  const { position, phase, completeLap, updateLapTime } = useRacing();
  
  const lastPosition = useRef(new THREE.Vector3(0, 0, 5));
  const hasPassedCheckpoint = useRef(false);
  const lapStartTime = useRef(Date.now());
  const crossedStartLine = useRef(false);

  const startLineZ = 0;
  const startLineXMin = -7.5;
  const startLineXMax = 7.5;
  
  const checkpointZ = -55;
  const checkpointXMin = 70;
  const checkpointXMax = 90;

  useEffect(() => {
    if (phase === "racing") {
      lapStartTime.current = Date.now();
      hasPassedCheckpoint.current = false;
      crossedStartLine.current = false;
      lastPosition.current.set(0, 0.5, 5);
    }
  }, [phase]);

  useFrame(() => {
    if (phase !== "racing") return;

    const currentPos = new THREE.Vector3(position.x, position.y, position.z);
    
    const elapsed = Date.now() - lapStartTime.current;
    updateLapTime(elapsed);
    
    if (
      currentPos.x >= checkpointXMin &&
      currentPos.x <= checkpointXMax &&
      Math.abs(currentPos.z - checkpointZ) < 10
    ) {
      hasPassedCheckpoint.current = true;
    }
    
    const crossedZ = (lastPosition.current.z > startLineZ && currentPos.z <= startLineZ) ||
                     (lastPosition.current.z < startLineZ && currentPos.z >= startLineZ);
    
    if (
      crossedZ &&
      currentPos.x >= startLineXMin &&
      currentPos.x <= startLineXMax &&
      hasPassedCheckpoint.current
    ) {
      completeLap();
      lapStartTime.current = Date.now();
      hasPassedCheckpoint.current = false;
    }
    
    lastPosition.current.copy(currentPos);
  });

  return null;
}
