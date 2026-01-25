import { useCallback } from "react";
import { useRacing } from "@/lib/stores/useRacing";

export function HUD() {
  const {
    phase,
    speed,
    currentLap,
    totalLaps,
    currentLapTime,
    bestLapTime,
    cameraMode,
    toggleCamera
  } = useRacing();

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  }, []);

  if (phase !== "racing") return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        fontFamily: "'Rajdhani', 'Orbitron', 'Roboto', sans-serif",
        zIndex: 100
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
          pointerEvents: "auto"
        }}
      >
        <div
          style={{
            background: "rgba(26, 26, 26, 0.9)",
            borderRadius: 15,
            padding: "20px 30px",
            border: "2px solid #00D4FF",
            minWidth: 200
          }}
        >
          <div style={{ color: "#666", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>
            Speed
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ color: "#FFFFFF", fontSize: 48, fontWeight: 700 }}>
              {Math.round(speed)}
            </span>
            <span style={{ color: "#00D4FF", fontSize: 18 }}>km/h</span>
          </div>
          
          <div
            style={{
              marginTop: 10,
              height: 4,
              background: "#333",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${Math.min((speed / 200) * 100, 100)}%`,
                height: "100%",
                background: speed > 150 ? "#E82127" : "#00D4FF",
                transition: "width 0.1s ease-out, background 0.3s"
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          display: "flex",
          flexDirection: "column",
          gap: 15
        }}
      >
        <div
          style={{
            background: "rgba(26, 26, 26, 0.9)",
            borderRadius: 15,
            padding: "15px 25px",
            border: "2px solid #E82127"
          }}
        >
          <div style={{ color: "#666", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>
            Lap
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ color: "#FFFFFF", fontSize: 36, fontWeight: 700 }}>
              {currentLap}
            </span>
            <span style={{ color: "#666", fontSize: 24 }}>/</span>
            <span style={{ color: "#E82127", fontSize: 24 }}>{totalLaps}</span>
          </div>
        </div>

        <div
          style={{
            background: "rgba(26, 26, 26, 0.9)",
            borderRadius: 15,
            padding: "15px 25px",
            border: "2px solid #393C41"
          }}
        >
          <div style={{ color: "#666", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>
            Current Lap
          </div>
          <div style={{ color: "#FFFFFF", fontSize: 28, fontWeight: 600, fontFamily: "monospace" }}>
            {formatTime(currentLapTime)}
          </div>
        </div>

        {bestLapTime !== null && (
          <div
            style={{
              background: "rgba(26, 26, 26, 0.9)",
              borderRadius: 15,
              padding: "15px 25px",
              border: "2px solid #00D4FF"
            }}
          >
            <div style={{ color: "#00D4FF", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>
              Best Lap
            </div>
            <div style={{ color: "#00D4FF", fontSize: 24, fontWeight: 600, fontFamily: "monospace" }}>
              {formatTime(bestLapTime)}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          top: 30,
          right: 30,
          display: "flex",
          flexDirection: "column",
          gap: 10,
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
            letterSpacing: 1,
            transition: "border-color 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00D4FF")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#393C41")}
        >
          Camera: {cameraMode === "chase" ? "Chase" : "Cockpit"}
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 30,
          background: "rgba(26, 26, 26, 0.85)",
          borderRadius: 10,
          padding: "10px 15px",
          border: "1px solid #393C41"
        }}
      >
        <div style={{ color: "#666", fontSize: 10, marginBottom: 5, textTransform: "uppercase" }}>
          Controls
        </div>
        <div style={{ display: "flex", gap: 15, color: "#FFFFFF", fontSize: 12 }}>
          <span><kbd style={{ background: "#393C41", padding: "2px 6px", borderRadius: 3 }}>W</kbd> Accelerate</span>
          <span><kbd style={{ background: "#393C41", padding: "2px 6px", borderRadius: 3 }}>S</kbd> Brake</span>
          <span><kbd style={{ background: "#393C41", padding: "2px 6px", borderRadius: 3 }}>A</kbd><kbd style={{ background: "#393C41", padding: "2px 6px", borderRadius: 3, marginLeft: 2 }}>D</kbd> Steer</span>
          <span><kbd style={{ background: "#393C41", padding: "2px 6px", borderRadius: 3 }}>C</kbd> Camera</span>
        </div>
      </div>
    </div>
  );
}
