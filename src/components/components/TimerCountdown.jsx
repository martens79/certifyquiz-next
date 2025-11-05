// ⏱️ TimerCountdown.jsx
import { useEffect, useState } from "react";

const TimerCountdown = ({ minutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(() => minutes * 60);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp(); // ⏳ Tempo scaduto → invia quiz
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="text-center py-2 text-lg font-semibold text-white bg-blue-600 rounded mb-4">
      ⏳ Tempo rimasto: {formatTime(secondsLeft)}
    </div>
  );
};

export default TimerCountdown;
