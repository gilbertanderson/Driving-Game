import { useEffect, useRef } from "react";
import { useRacing } from "@/lib/stores/useRacing";

export function ChristmasTree() {
  const { phase, treeState, startCountdown, advanceTree, goGreen } = useRacing();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (phase === "staging") {
      // Auto-start countdown after 2 seconds of staging
      timerRef.current = setTimeout(() => {
        startCountdown();
      }, 2000);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, startCountdown]);
  
  useEffect(() => {
    if (phase === "countdown") {
      // Progress through tree states
      if (treeState >= 1 && treeState < 4) {
        timerRef.current = setTimeout(() => {
          advanceTree();
        }, 500); // 0.5s between yellows
      } else if (treeState === 4) {
        // After last yellow, go green
        timerRef.current = setTimeout(() => {
          goGreen();
        }, 500);
      }
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, treeState, advanceTree, goGreen]);
  
  if (phase !== "staging" && phase !== "countdown" && phase !== "racing") {
    return null;
  }
  
  const getLightColor = (lightIndex: number): string => {
    if (treeState === 5) {
      // Green light is on
      return lightIndex === 4 ? "#00FF00" : "#333333";
    }
    
    // Yellow lights (1-3 are yellow positions)
    if (lightIndex >= 1 && lightIndex <= 3) {
      return treeState >= lightIndex + 1 ? "#FFCC00" : "#333333";
    }
    
    // Stage light (index 0)
    if (lightIndex === 0) {
      return treeState >= 1 ? "#0088FF" : "#333333";
    }
    
    // Green light not active yet
    return "#333333";
  };
  
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "15px",
        background: "rgba(0, 0, 0, 0.85)",
        borderRadius: "10px",
        border: "2px solid #444",
        zIndex: 100
      }}
    >
      <div style={{ color: "#FFF", fontSize: "14px", marginBottom: "8px", fontFamily: "monospace" }}>
        DRAG RACING
      </div>
      
      {/* Pre-stage / Stage */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: getLightColor(0),
            boxShadow: treeState >= 1 ? `0 0 15px ${getLightColor(0)}` : "none"
          }}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: getLightColor(0),
            boxShadow: treeState >= 1 ? `0 0 15px ${getLightColor(0)}` : "none"
          }}
        />
      </div>
      
      {/* Yellow lights (3 rows) */}
      {[1, 2, 3].map((row) => (
        <div key={row} style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: getLightColor(row),
              boxShadow: treeState >= row + 1 && treeState < 5 ? `0 0 20px ${getLightColor(row)}` : "none"
            }}
          />
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: getLightColor(row),
              boxShadow: treeState >= row + 1 && treeState < 5 ? `0 0 20px ${getLightColor(row)}` : "none"
            }}
          />
        </div>
      ))}
      
      {/* Green lights */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: getLightColor(4),
            boxShadow: treeState === 5 ? "0 0 30px #00FF00" : "none"
          }}
        />
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: getLightColor(4),
            boxShadow: treeState === 5 ? "0 0 30px #00FF00" : "none"
          }}
        />
      </div>
      
      <div style={{ color: "#888", fontSize: "12px", marginTop: "8px", fontFamily: "monospace" }}>
        {phase === "staging" && "STAGING..."}
        {phase === "countdown" && "READY..."}
        {phase === "racing" && "GO!"}
      </div>
    </div>
  );
}
