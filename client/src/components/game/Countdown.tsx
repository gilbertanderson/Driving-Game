import { useState, useEffect } from "react";
import { useRacing } from "@/lib/stores/useRacing";

export function Countdown() {
  const { phase } = useRacing();
  const [count, setCount] = useState<number | string | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  
  useEffect(() => {
    if (phase === "racing") {
      setShowCountdown(true);
      setCount(3);
      
      const timer1 = setTimeout(() => setCount(2), 1000);
      const timer2 = setTimeout(() => setCount(1), 2000);
      const timer3 = setTimeout(() => setCount("GO!"), 3000);
      const timer4 = setTimeout(() => {
        setShowCountdown(false);
        setCount(null);
      }, 4000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [phase]);
  
  if (!showCountdown || count === null) return null;
  
  const isGo = count === "GO!";
  
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
        pointerEvents: "none",
        zIndex: 100
      }}
    >
      <div
        key={count}
        style={{
          fontSize: isGo ? "120px" : "200px",
          fontWeight: "bold",
          fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
          color: isGo ? "#00FF00" : "#FFFFFF",
          textShadow: `
            0 0 20px ${isGo ? "#00FF00" : "#E82127"},
            0 0 40px ${isGo ? "#00FF00" : "#E82127"},
            0 0 60px ${isGo ? "#00FF00" : "#E82127"},
            4px 4px 0px #000000
          `,
          animation: "countdownPop 0.5s ease-out",
          WebkitTextStroke: "2px #000000"
        }}
      >
        {count}
        <style>
          {`
            @keyframes countdownPop {
              0% {
                transform: scale(2);
                opacity: 0;
              }
              50% {
                transform: scale(0.9);
                opacity: 1;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}
