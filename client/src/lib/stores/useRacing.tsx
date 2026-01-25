import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "racing" | "paused" | "finished";
export type CameraMode = "chase" | "cockpit";

interface LapData {
  lapNumber: number;
  time: number;
}

interface RacingState {
  phase: GamePhase;
  speed: number;
  maxSpeed: number;
  currentLap: number;
  totalLaps: number;
  lapTimes: LapData[];
  currentLapTime: number;
  bestLapTime: number | null;
  raceStartTime: number | null;
  cameraMode: CameraMode;
  
  // Vehicle state
  velocity: { x: number; y: number; z: number };
  rotation: number;
  position: { x: number; y: number; z: number };
  
  // Actions
  startRace: () => void;
  pauseRace: () => void;
  resumeRace: () => void;
  finishRace: () => void;
  resetRace: () => void;
  
  setSpeed: (speed: number) => void;
  updateLapTime: (time: number) => void;
  completeLap: () => void;
  toggleCamera: () => void;
  setCameraMode: (mode: CameraMode) => void;
  
  updateVehicle: (position: { x: number; y: number; z: number }, rotation: number, velocity: { x: number; y: number; z: number }) => void;
}

export const useRacing = create<RacingState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    speed: 0,
    maxSpeed: 200,
    currentLap: 1,
    totalLaps: 3,
    lapTimes: [],
    currentLapTime: 0,
    bestLapTime: null,
    raceStartTime: null,
    cameraMode: "chase",
    
    velocity: { x: 0, y: 0, z: 0 },
    rotation: 0,
    position: { x: 0, y: 0, z: 0 },
    
    startRace: () => {
      set({
        phase: "racing",
        speed: 0,
        currentLap: 1,
        lapTimes: [],
        currentLapTime: 0,
        raceStartTime: Date.now(),
        position: { x: 0, y: 0.5, z: 0 },
        rotation: 0,
        velocity: { x: 0, y: 0, z: 0 }
      });
    },
    
    pauseRace: () => {
      const { phase } = get();
      if (phase === "racing") {
        set({ phase: "paused" });
      }
    },
    
    resumeRace: () => {
      const { phase } = get();
      if (phase === "paused") {
        set({ phase: "racing" });
      }
    },
    
    finishRace: () => {
      set({ phase: "finished" });
    },
    
    resetRace: () => {
      set({
        phase: "menu",
        speed: 0,
        currentLap: 1,
        lapTimes: [],
        currentLapTime: 0,
        bestLapTime: null,
        raceStartTime: null,
        position: { x: 0, y: 0.5, z: 0 },
        rotation: 0,
        velocity: { x: 0, y: 0, z: 0 }
      });
    },
    
    setSpeed: (speed: number) => {
      set({ speed: Math.max(0, Math.min(speed, get().maxSpeed)) });
    },
    
    updateLapTime: (time: number) => {
      set({ currentLapTime: time });
    },
    
    completeLap: () => {
      const { currentLap, totalLaps, currentLapTime, bestLapTime, lapTimes } = get();
      
      const newLapData: LapData = {
        lapNumber: currentLap,
        time: currentLapTime
      };
      
      const newBestTime = bestLapTime === null || currentLapTime < bestLapTime
        ? currentLapTime
        : bestLapTime;
      
      if (currentLap >= totalLaps) {
        set({
          phase: "finished",
          lapTimes: [...lapTimes, newLapData],
          bestLapTime: newBestTime
        });
      } else {
        set({
          currentLap: currentLap + 1,
          lapTimes: [...lapTimes, newLapData],
          currentLapTime: 0,
          bestLapTime: newBestTime
        });
      }
    },
    
    toggleCamera: () => {
      const { cameraMode } = get();
      set({ cameraMode: cameraMode === "chase" ? "cockpit" : "chase" });
    },
    
    setCameraMode: (mode: CameraMode) => {
      set({ cameraMode: mode });
    },
    
    updateVehicle: (position, rotation, velocity) => {
      const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2) * 3.6;
      set({ position, rotation, velocity, speed });
    }
  }))
);
