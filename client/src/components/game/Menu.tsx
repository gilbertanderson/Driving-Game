import { useRacing } from "@/lib/stores/useRacing";

export function Menu() {
  const { 
    phase, 
    startStaging, 
    resetRace, 
    winner,
    reactionTime,
    elapsedTime,
    trapSpeed,
    opponentReactionTime,
    opponentElapsedTime,
    opponentTrapSpeed
  } = useRacing();

  if (phase === "staging" || phase === "countdown" || phase === "racing") return null;

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
        background: phase === "menu" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.85)",
        zIndex: 200,
        fontFamily: "'Rajdhani', 'Orbitron', 'Roboto', sans-serif"
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: 50,
          background: "rgba(26, 26, 26, 0.95)",
          borderRadius: 20,
          border: "3px solid #E82127",
          maxWidth: 600
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "#00D4FF",
            letterSpacing: 4,
            marginBottom: 10,
            textTransform: "uppercase"
          }}
        >
          Tesla Drag Racing
        </div>
        
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#FFFFFF",
            margin: "0 0 10px 0",
            textTransform: "uppercase",
            letterSpacing: 3
          }}
        >
          1/4 Mile
        </h1>
        
        <div
          style={{
            fontSize: 16,
            color: "#393C41",
            marginBottom: 40
          }}
        >
          Model Y vs Model Y
        </div>

        {phase === "finished" && (
          <div
            style={{
              marginBottom: 30,
              padding: 20,
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: 15,
              border: "1px solid #393C41"
            }}
          >
            <div 
              style={{ 
                color: winner === "player" ? "#00FF00" : "#FF4444", 
                fontSize: 28, 
                marginBottom: 20, 
                textTransform: "uppercase",
                fontWeight: "bold"
              }}
            >
              {winner === "player" ? "You Win!" : "You Lose!"}
            </div>
            
            {/* Results comparison */}
            <div style={{ display: "flex", gap: "30px", justifyContent: "center" }}>
              {/* Player stats */}
              <div style={{ textAlign: "center", minWidth: "150px" }}>
                <div style={{ color: "#E82127", fontSize: "14px", marginBottom: "10px", fontWeight: "bold" }}>YOUR CAR</div>
                
                {reactionTime !== null && (
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ color: "#888", fontSize: "11px" }}>REACTION</div>
                    <div style={{ 
                      color: reactionTime < 0 ? "#FF0000" : "#FFFFFF", 
                      fontSize: "18px",
                      fontFamily: "monospace"
                    }}>
                      {reactionTime < 0 ? "FALSE START" : `${reactionTime.toFixed(3)}s`}
                    </div>
                  </div>
                )}
                
                {elapsedTime !== null && (
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ color: "#888", fontSize: "11px" }}>E.T.</div>
                    <div style={{ 
                      color: winner === "player" ? "#00FF00" : "#FFFFFF", 
                      fontSize: "24px",
                      fontWeight: "bold",
                      fontFamily: "monospace"
                    }}>
                      {elapsedTime.toFixed(3)}s
                    </div>
                  </div>
                )}
                
                {trapSpeed !== null && (
                  <div>
                    <div style={{ color: "#888", fontSize: "11px" }}>TRAP SPEED</div>
                    <div style={{ color: "#FFFFFF", fontSize: "16px", fontFamily: "monospace" }}>
                      {Math.round(trapSpeed)} km/h
                    </div>
                  </div>
                )}
              </div>
              
              {/* VS divider */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                color: "#666", 
                fontSize: "20px",
                fontWeight: "bold"
              }}>
                VS
              </div>
              
              {/* Opponent stats */}
              <div style={{ textAlign: "center", minWidth: "150px" }}>
                <div style={{ color: "#3949ab", fontSize: "14px", marginBottom: "10px", fontWeight: "bold" }}>OPPONENT</div>
                
                {opponentReactionTime !== null && (
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ color: "#888", fontSize: "11px" }}>REACTION</div>
                    <div style={{ color: "#FFFFFF", fontSize: "18px", fontFamily: "monospace" }}>
                      {opponentReactionTime.toFixed(3)}s
                    </div>
                  </div>
                )}
                
                {opponentElapsedTime !== null && (
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ color: "#888", fontSize: "11px" }}>E.T.</div>
                    <div style={{ 
                      color: winner === "opponent" ? "#00FF00" : "#FFFFFF", 
                      fontSize: "24px",
                      fontWeight: "bold",
                      fontFamily: "monospace"
                    }}>
                      {opponentElapsedTime.toFixed(3)}s
                    </div>
                  </div>
                )}
                
                {opponentTrapSpeed !== null && (
                  <div>
                    <div style={{ color: "#888", fontSize: "11px" }}>TRAP SPEED</div>
                    <div style={{ color: "#FFFFFF", fontSize: "16px", fontFamily: "monospace" }}>
                      {Math.round(opponentTrapSpeed)} km/h
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={phase === "finished" ? startStaging : startStaging}
          style={{
            background: "linear-gradient(180deg, #E82127 0%, #B81A1F 100%)",
            border: "none",
            borderRadius: 10,
            padding: "18px 50px",
            color: "#FFFFFF",
            fontSize: 20,
            fontWeight: 700,
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: 3,
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 20px rgba(232, 33, 39, 0.4)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 30px rgba(232, 33, 39, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(232, 33, 39, 0.4)";
          }}
        >
          {phase === "finished" ? "Race Again" : "Start Drag Race"}
        </button>

        {phase === "finished" && (
          <button
            onClick={resetRace}
            style={{
              background: "transparent",
              border: "2px solid #393C41",
              borderRadius: 10,
              padding: "14px 40px",
              color: "#FFFFFF",
              fontSize: 16,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginTop: 15,
              marginLeft: 15,
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00D4FF")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#393C41")}
          >
            Main Menu
          </button>
        )}

        <div
          style={{
            marginTop: 40,
            color: "#666",
            fontSize: 12
          }}
        >
          <p>Hold <strong>W</strong> to accelerate when the light turns green</p>
          <p>React quickly for a faster start!</p>
          <p>Press <strong>C</strong> to change camera view</p>
        </div>
      </div>
    </div>
  );
}
