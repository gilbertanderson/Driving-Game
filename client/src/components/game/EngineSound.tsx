import { useEffect, useRef } from "react";
import { useRacing } from "@/lib/stores/useRacing";
import { useAudio } from "@/lib/stores/useAudio";

export function EngineSound() {
  const { speed, phase } = useRacing();
  const { isMuted } = useAudio();
  const engineRef = useRef<HTMLAudioElement | null>(null);
  const isInitialized = useRef(false);
  
  useEffect(() => {
    if (!isInitialized.current) {
      engineRef.current = new Audio("/sounds/background.mp3");
      engineRef.current.loop = true;
      engineRef.current.volume = 0.3;
      isInitialized.current = true;
    }
    
    return () => {
      if (engineRef.current) {
        engineRef.current.pause();
        engineRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!engineRef.current) return;
    
    if (phase === "racing" && !isMuted) {
      engineRef.current.play().catch(() => {});
    } else {
      engineRef.current.pause();
      engineRef.current.currentTime = 0;
    }
  }, [phase, isMuted]);
  
  useEffect(() => {
    if (!engineRef.current || phase !== "racing") return;
    
    const normalizedSpeed = Math.min(speed / 180, 1);
    const volume = isMuted ? 0 : 0.2 + normalizedSpeed * 0.4;
    engineRef.current.volume = volume;
    
    const playbackRate = 0.8 + normalizedSpeed * 0.7;
    engineRef.current.playbackRate = playbackRate;
  }, [speed, phase, isMuted]);
  
  return null;
}
