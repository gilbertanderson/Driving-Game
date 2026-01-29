import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";

import { DragStrip } from "./components/game/DragStrip";
import { FordMustang } from "./components/game/FordMustang";
import { OpponentTesla } from "./components/game/OpponentTesla";
import { RacingCamera } from "./components/game/RacingCamera";
import { HUD } from "./components/game/HUD";
import { Menu } from "./components/game/Menu";
import { Environment } from "./components/game/Environment";
import { ChristmasTree } from "./components/game/ChristmasTree";
import { PostProcessing } from "./components/game/PostProcessing";
import { TireSmoke } from "./components/game/TireSmoke";
import { EngineSound } from "./components/game/EngineSound";
import { TouchControls } from "./components/game/TouchControls";
import { useRacing } from "./lib/stores/useRacing";

enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  camera = "camera"
}

const keyMap = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.camera, keys: ["KeyC"] }
];

function CameraToggleHandler() {
  const { toggleCamera, phase } = useRacing();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyC" && (phase === "racing" || phase === "staging" || phase === "countdown")) {
        toggleCamera();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCamera, phase]);

  return null;
}

function LoadingScreen() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1A1A1A",
        color: "#FFFFFF",
        fontFamily: "'Rajdhani', 'Orbitron', 'Roboto', sans-serif",
        fontSize: 24,
        zIndex: 1000
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 60,
            height: 60,
            border: "4px solid #393C41",
            borderTop: "4px solid #E82127",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}
        />
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        Loading Tesla Drag Racing...
      </div>
    </div>
  );
}

function Game() {
  const { phase } = useRacing();
  const isRacing = phase === "staging" || phase === "countdown" || phase === "racing";

  return (
    <>
      <Canvas
        shadows
        camera={{
          position: [0, 15, -25],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance"
        }}
        style={{ background: "#87CEEB" }}
      >
        <Suspense fallback={null}>
          <Environment />
          <DragStrip />
          {isRacing && (
            <>
              <FordMustang />
              <OpponentTesla />
              <TireSmoke />
            </>
          )}
          <RacingCamera />
          <PostProcessing />
        </Suspense>
      </Canvas>

      <HUD />
      <Menu />
      <ChristmasTree />
      <TouchControls />
      <EngineSound />
      <CameraToggleHandler />
    </>
  );
}

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <KeyboardControls map={keyMap}>
        <Suspense fallback={<LoadingScreen />}>
          <Game />
        </Suspense>
      </KeyboardControls>
    </div>
  );
}

export default App;
