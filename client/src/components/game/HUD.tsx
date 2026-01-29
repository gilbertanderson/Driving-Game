import { useRacing } from "@/lib/stores/useRacing";

export function HUD() {
  const { 
    phase, 
    speed, 
    reactionTime, 
    elapsedTime, 
    trapSpeed,
    position,
    opponentPosition,
    trackLength,
    cameraMode,
    toggleCamera
  } = useRacing();
  
  if (phase === "menu" || phase === "finished") return null;
  
  const playerProgress = Math.min((position.z / trackLength) * 100, 100);
  const opponentProgress = Math.min((opponentPosition.z / trackLength) * 100, 100);
  
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        fontFamily: "'Rajdhani', 'Roboto', sans-serif",
        zIndex: 50
      }}
    >
      {/* Bottom HUD */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.8))"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Speed display */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px", fontWeight: "bold", lineHeight: 1, color: "#FFFFFF" }}>
              {Math.round(speed)}
            </div>
            <div style={{ fontSize: "16px", color: "#888", marginTop: "-5px" }}>KM/H</div>
          </div>
          
          {/* Race progress bar */}
          <div style={{ flex: 1, margin: "0 40px", maxWidth: "500px" }}>
            <div style={{ position: "relative", height: "40px", background: "#222", borderRadius: "8px", overflow: "hidden" }}>
              {/* Track markers */}
              {[25, 50, 75].map((mark) => (
                <div
                  key={mark}
                  style={{
                    position: "absolute",
                    left: `${mark}%`,
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    background: "#444"
                  }}
                />
              ))}
              
              {/* Player progress (top half) */}
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  height: "16px",
                  width: `calc(${playerProgress}% - 4px)`,
                  background: "linear-gradient(90deg, #E82127, #FF4444)",
                  borderRadius: "4px",
                  transition: "width 0.1s"
                }}
              />
              
              {/* Opponent progress (bottom half) */}
              <div
                style={{
                  position: "absolute",
                  bottom: "2px",
                  left: "2px",
                  height: "16px",
                  width: `calc(${opponentProgress}% - 4px)`,
                  background: "linear-gradient(90deg, #1a237e, #3949ab)",
                  borderRadius: "4px",
                  transition: "width 0.1s"
                }}
              />
              
              {/* Labels */}
              <div style={{ position: "absolute", right: "10px", top: "4px", fontSize: "10px", color: "#E82127" }}>YOU</div>
              <div style={{ position: "absolute", right: "10px", bottom: "4px", fontSize: "10px", color: "#3949ab" }}>OPP</div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "12px", color: "#666" }}>
              <span>START</span>
              <span>1/4 MILE</span>
            </div>
          </div>
          
          {/* Race stats */}
          <div style={{ textAlign: "right", minWidth: "150px" }}>
            {reactionTime !== null && (
              <div style={{ marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", color: "#888" }}>REACTION</div>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "bold",
                  color: reactionTime < 0 ? "#FF0000" : reactionTime < 0.1 ? "#00FF00" : "#FFFFFF"
                }}>
                  {reactionTime < 0 ? "FALSE START" : `${reactionTime.toFixed(3)}s`}
                </div>
              </div>
            )}
            
            {elapsedTime !== null && (
              <div>
                <div style={{ fontSize: "12px", color: "#888" }}>E.T.</div>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#00FF00" }}>
                  {elapsedTime.toFixed(3)}s
                </div>
              </div>
            )}
            
            {trapSpeed !== null && (
              <div>
                <div style={{ fontSize: "12px", color: "#888" }}>TRAP SPEED</div>
                <div style={{ fontSize: "20px", fontWeight: "bold", color: "#FFFFFF" }}>
                  {Math.round(trapSpeed)} km/h
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Controls hint */}
        <div style={{ textAlign: "center", marginTop: "15px", fontSize: "12px", color: "#666" }}>
          Hold W or Arrow Up to accelerate | A/D for minor lane adjustment | C to change camera
        </div>
      </div>
      
      {/* Camera toggle button */}
      <div
        style={{
          position: "absolute",
          top: 30,
          right: 30,
          pointerEvents: "auto"
        }}
      >
        <button
          onClick={toggleCamera}
          style={{
            background: "rgba(26, 26, 26, 0.9)",
            border: "2px solid #393C41",
            borderRadius: 10,
            padding: "10px 20px",
            color: "#FFFFFF",
            fontSize: 14,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: 1
          }}
        >
          Camera: {cameraMode === "chase" ? "Chase" : "Side"}
        </button>
      </div>
    </div>
  );
}
