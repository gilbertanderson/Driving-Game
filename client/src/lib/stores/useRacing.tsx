import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "staging" | "countdown" | "racing" | "finished";
export type CameraMode = "chase" | "side";

interface DragRaceState {
  phase: GamePhase;
  speed: number;
  maxSpeed: number;
  cameraMode: CameraMode;
  
  // Drag race specific
  reactionTime: number | null;
  elapsedTime: number | null;
  trapSpeed: number | null;
  opponentReactionTime: number | null;
  opponentElapsedTime: number | null;
  opponentTrapSpeed: number | null;
  winner: "player" | "opponent" | null;
  
  // Countdown tree state (0-4: pre-stage, stage, yellow1, yellow2, yellow3, then green)
  treeState: number;
  greenLightTime: number | null;
  playerLaunchTime: number | null;
  
  // Track config
  trackLength: number; // quarter mile in meters (~402m)
  
  // Vehicle state
  velocity: { x: number; y: number; z: number };
  rotation: number;
  position: { x: number; y: number; z: number };
  
  // Opponent state
  opponentPosition: { x: number; y: number; z: number };
  opponentSpeed: number;
  opponentFinished: boolean;
  playerFinished: boolean;
  
  // Actions
  startStaging: () => void;
  startCountdown: () => void;
  advanceTree: () => void;
  goGreen: () => void;
  playerLaunch: () => void;
  finishRace: (winner: "player" | "opponent") => void;
  resetRace: () => void;
  
  setSpeed: (speed: number) => void;
  setOpponentSpeed: (speed: number) => void;
  setOpponentPosition: (position: { x: number; y: number; z: number }) => void;
  setOpponentFinished: (elapsedTime: number, trapSpeed: number) => void;
  setPlayerFinished: (elapsedTime: number, trapSpeed: number) => void;
  toggleCamera: () => void;
  setCameraMode: (mode: CameraMode) => void;
  
  updateVehicle: (position: { x: number; y: number; z: number }, rotation: number, velocity: { x: number; y: number; z: number }) => void;
}

export const useRacing = create<DragRaceState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    speed: 0,
    maxSpeed: 250,
    cameraMode: "chase",
    
    reactionTime: null,
    elapsedTime: null,
    trapSpeed: null,
    opponentReactionTime: null,
    opponentElapsedTime: null,
    opponentTrapSpeed: null,
    winner: null,
    
    treeState: 0,
    greenLightTime: null,
    playerLaunchTime: null,
    
    trackLength: 402, // quarter mile
    
    velocity: { x: 0, y: 0, z: 0 },
    rotation: 0,
    position: { x: 0, y: 0, z: 0 },
    
    opponentPosition: { x: 5, y: 0.5, z: 0 },
    opponentSpeed: 0,
    opponentFinished: false,
    playerFinished: false,
    
    startStaging: () => {
      set({
        phase: "staging",
        speed: 0,
        reactionTime: null,
        elapsedTime: null,
        trapSpeed: null,
        opponentReactionTime: null,
        opponentElapsedTime: null,
        opponentTrapSpeed: null,
        winner: null,
        treeState: 0,
        greenLightTime: null,
        playerLaunchTime: null,
        position: { x: -3, y: 0.5, z: 0 },
        rotation: 0,
        velocity: { x: 0, y: 0, z: 0 },
        opponentPosition: { x: 3, y: 0.5, z: 0 },
        opponentSpeed: 0,
        opponentFinished: false,
        playerFinished: false
      });
    },
    
    startCountdown: () => {
      set({ phase: "countdown", treeState: 1 });
    },
    
    advanceTree: () => {
      const { treeState } = get();
      if (treeState < 4) {
        set({ treeState: treeState + 1 });
      }
    },
    
    goGreen: () => {
      set({ 
        phase: "racing", 
        treeState: 5, 
        greenLightTime: Date.now() 
      });
    },
    
    playerLaunch: () => {
      const { greenLightTime, playerLaunchTime, phase } = get();
      if (playerLaunchTime !== null) return; // Already launched
      
      const now = Date.now();
      
      if (phase === "countdown") {
        // False start - jumped the green
        set({ 
          reactionTime: -1, // Indicate false start
          playerLaunchTime: now
        });
      } else if (greenLightTime !== null) {
        const reaction = (now - greenLightTime) / 1000;
        set({ 
          reactionTime: reaction,
          playerLaunchTime: now
        });
      }
    },
    
    finishRace: (winner) => {
      set({ phase: "finished", winner });
    },
    
    resetRace: () => {
      set({
        phase: "menu",
        speed: 0,
        reactionTime: null,
        elapsedTime: null,
        trapSpeed: null,
        opponentReactionTime: null,
        opponentElapsedTime: null,
        opponentTrapSpeed: null,
        winner: null,
        treeState: 0,
        greenLightTime: null,
        playerLaunchTime: null,
        position: { x: -3, y: 0.5, z: 0 },
        rotation: 0,
        velocity: { x: 0, y: 0, z: 0 },
        opponentPosition: { x: 3, y: 0.5, z: 0 },
        opponentSpeed: 0,
        opponentFinished: false,
        playerFinished: false
      });
    },
    
    setSpeed: (speed: number) => {
      set({ speed: Math.max(0, Math.min(speed, get().maxSpeed)) });
    },
    
    setOpponentSpeed: (speed: number) => {
      set({ opponentSpeed: speed });
    },
    
    setOpponentPosition: (position) => {
      set({ opponentPosition: position });
    },
    
    setOpponentFinished: (elapsedTime: number, trapSpeed: number) => {
      const { winner, phase, reactionTime } = get();
      
      // Guard: if race already finished, ignore
      if (phase === "finished" || winner !== null) return;
      
      const opponentReaction = 0.15 + Math.random() * 0.1; // AI reaction between 0.15-0.25s
      
      set({ 
        opponentElapsedTime: elapsedTime,
        opponentTrapSpeed: trapSpeed,
        opponentFinished: true,
        opponentReactionTime: opponentReaction
      });
      
      // Check if player had a false start - opponent auto-wins
      if (reactionTime !== null && reactionTime < 0) {
        set({ 
          phase: "finished",
          winner: "opponent"
        });
        return;
      }
      
      // Check if player already finished
      const { elapsedTime: playerET } = get();
      if (playerET !== null) {
        // Both finished - compare times
        set({ 
          phase: "finished",
          winner: playerET < elapsedTime ? "player" : "opponent"
        });
      }
      // If player hasn't finished, wait for them
    },
    
    setPlayerFinished: (elapsedTime: number, trapSpeed: number) => {
      const { opponentFinished, opponentElapsedTime, winner, phase, reactionTime } = get();
      
      // Guard: if race already finished, ignore
      if (phase === "finished" || winner !== null) return;
      
      set({ 
        elapsedTime,
        trapSpeed,
        playerFinished: true
      });
      
      // Check for false start - opponent wins
      if (reactionTime !== null && reactionTime < 0) {
        set({ 
          phase: "finished",
          winner: "opponent"
        });
        return;
      }
      
      if (opponentFinished) {
        // Both finished - compare times
        set({ 
          phase: "finished",
          winner: elapsedTime < (opponentElapsedTime || Infinity) ? "player" : "opponent"
        });
      }
      // If opponent hasn't finished, player wins (they crossed first)
      else {
        set({
          phase: "finished",
          winner: "player"
        });
      }
    },
    
    toggleCamera: () => {
      const { cameraMode } = get();
      set({ cameraMode: cameraMode === "chase" ? "side" : "chase" });
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
