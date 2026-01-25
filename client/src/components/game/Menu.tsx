import { useRacing } from "@/lib/stores/useRacing";

export function Menu() {
  const { phase, startRace, resetRace, lapTimes, bestLapTime } = useRacing();

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  if (phase === "racing") return null;

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
          maxWidth: 500
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
          Tesla Racing Experience
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
          Model Y
        </h1>
        
        <div
          style={{
            fontSize: 16,
            color: "#393C41",
            marginBottom: 40
          }}
        >
          Track Day Challenge
        </div>

        {phase === "finished" && lapTimes.length > 0 && (
          <div
            style={{
              marginBottom: 30,
              padding: 20,
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: 15,
              border: "1px solid #393C41"
            }}
          >
            <div style={{ color: "#00D4FF", fontSize: 18, marginBottom: 15, textTransform: "uppercase" }}>
              Race Complete!
            </div>
            
            <div style={{ marginBottom: 15 }}>
              {lapTimes.map((lap, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #333",
                    color: lap.time === bestLapTime ? "#00D4FF" : "#FFFFFF"
                  }}
                >
                  <span>Lap {lap.lapNumber}</span>
                  <span style={{ fontFamily: "monospace" }}>{formatTime(lap.time)}</span>
                </div>
              ))}
            </div>
            
            {bestLapTime !== null && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  color: "#00D4FF",
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                <span>Best Lap</span>
                <span style={{ fontFamily: "monospace" }}>{formatTime(bestLapTime)}</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={phase === "finished" ? resetRace : startRace}
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
          {phase === "finished" ? "Race Again" : "Start Race"}
        </button>

        {phase === "finished" && (
          <button
            onClick={() => {
              resetRace();
            }}
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
          <p>Use <strong>W/S</strong> to accelerate/brake</p>
          <p>Use <strong>A/D</strong> to steer</p>
          <p>Press <strong>C</strong> to change camera</p>
        </div>
      </div>
    </div>
  );
}
