import { useEffect, useRef, useState } from "react";
import { useRacing } from "@/lib/stores/useRacing";

interface TouchState {
  forward: boolean;
  left: boolean;
  right: boolean;
}

export function TouchControls() {
  const { phase, playerLaunch } = useRacing();
  const [touchState, setTouchState] = useState<TouchState>({
    forward: false,
    left: false,
    right: false
  });
  const hasLaunched = useRef(false);
  
  useEffect(() => {
    if (phase === "staging") {
      hasLaunched.current = false;
    }
  }, [phase]);
  
  useEffect(() => {
    const simulateKey = (key: string, pressed: boolean) => {
      const event = new KeyboardEvent(pressed ? "keydown" : "keyup", {
        code: key,
        bubbles: true
      });
      window.dispatchEvent(event);
    };
    
    if (touchState.forward) {
      simulateKey("KeyW", true);
      if ((phase === "countdown" || phase === "racing") && !hasLaunched.current) {
        playerLaunch();
        hasLaunched.current = true;
      }
    } else {
      simulateKey("KeyW", false);
    }
    
    simulateKey("KeyA", touchState.left);
    simulateKey("KeyD", touchState.right);
  }, [touchState, phase, playerLaunch]);
  
  const handleTouchStart = (control: keyof TouchState) => {
    setTouchState(prev => ({ ...prev, [control]: true }));
  };
  
  const handleTouchEnd = (control: keyof TouchState) => {
    setTouchState(prev => ({ ...prev, [control]: false }));
  };
  
  if (phase === "menu" || phase === "finished") return null;
  
  const buttonStyle = (active: boolean): React.CSSProperties => ({
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: active 
      ? "rgba(232, 33, 39, 0.9)" 
      : "rgba(50, 50, 50, 0.8)",
    border: `3px solid ${active ? "#FF6666" : "#666"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontSize: "24px",
    fontWeight: "bold",
    userSelect: "none",
    touchAction: "none",
    cursor: "pointer",
    transition: "background 0.1s, transform 0.1s",
    transform: active ? "scale(0.95)" : "scale(1)",
    boxShadow: active 
      ? "0 2px 10px rgba(232, 33, 39, 0.5)" 
      : "0 4px 15px rgba(0, 0, 0, 0.3)"
  });
  
  const steerButtonStyle = (active: boolean): React.CSSProperties => ({
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    background: active 
      ? "rgba(0, 212, 255, 0.9)" 
      : "rgba(50, 50, 50, 0.8)",
    border: `2px solid ${active ? "#00D4FF" : "#555"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontSize: "20px",
    fontWeight: "bold",
    userSelect: "none",
    touchAction: "none",
    cursor: "pointer",
    transition: "background 0.1s"
  });
  
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "20px",
        pointerEvents: "none",
        zIndex: 150
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          maxWidth: "100%",
          padding: "0 10px"
        }}
      >
        {/* Left side - Steering controls */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            pointerEvents: "auto"
          }}
        >
          <div
            style={steerButtonStyle(touchState.left)}
            onTouchStart={(e) => { e.preventDefault(); handleTouchStart("left"); }}
            onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd("left"); }}
            onMouseDown={() => handleTouchStart("left")}
            onMouseUp={() => handleTouchEnd("left")}
            onMouseLeave={() => handleTouchEnd("left")}
          >
            ◀
          </div>
          <div
            style={steerButtonStyle(touchState.right)}
            onTouchStart={(e) => { e.preventDefault(); handleTouchStart("right"); }}
            onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd("right"); }}
            onMouseDown={() => handleTouchStart("right")}
            onMouseUp={() => handleTouchEnd("right")}
            onMouseLeave={() => handleTouchEnd("right")}
          >
            ▶
          </div>
        </div>
        
        {/* Right side - Accelerate button */}
        <div
          style={{
            pointerEvents: "auto"
          }}
        >
          <div
            style={buttonStyle(touchState.forward)}
            onTouchStart={(e) => { e.preventDefault(); handleTouchStart("forward"); }}
            onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd("forward"); }}
            onMouseDown={() => handleTouchStart("forward")}
            onMouseUp={() => handleTouchEnd("forward")}
            onMouseLeave={() => handleTouchEnd("forward")}
          >
            GAS
          </div>
        </div>
      </div>
    </div>
  );
}
