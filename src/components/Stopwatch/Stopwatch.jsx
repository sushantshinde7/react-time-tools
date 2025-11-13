import React, { useRef, useState, useEffect } from "react";
import "./Stopwatch.css";

function formatTime(ms) {
  const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  const seconds = String(Math.floor((ms / 1000) % 60)).padStart(2, "0");
  const minutes = String(Math.floor((ms / 60000) % 60)).padStart(2, "0");
  const hours = Math.floor(ms / 3600000);
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${minutes}:${seconds}.${centiseconds}`
    : `${minutes}:${seconds}.${centiseconds}`;
}

/* --- clean, compact diff format --- */
function formatLapDiff(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return min > 0
    ? `+${min}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`
    : `+${sec}.${String(cs).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const interval = useRef(null);

  /* ---------- Restore state ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("stopwatch-state"));
    if (saved) {
      setTime(saved.time || 0);
      setIsRunning(false); // never auto-run on load
      setLaps(saved.laps || []);
    }
  }, []);

  /* ---------- Persist state ---------- */
  useEffect(() => {
    localStorage.setItem(
      "stopwatch-state",
      JSON.stringify({ time, laps, isRunning })
    );
  }, [time, laps, isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    const startTimestamp = Date.now() - time;
    interval.current = setInterval(() => {
      setTime(Date.now() - startTimestamp);
    }, 10);
  };

  const handlePause = () => {
    setIsRunning(false);
    clearInterval(interval.current);
  };

  const handleReset = () => {
    setTime(0);
    setLaps([]);
    setIsRunning(false);
    clearInterval(interval.current);
    localStorage.removeItem("stopwatch-state");
  };

  const handleLap = () => {
    setLaps((prev) => [time, ...prev]);
  };

  /* ---------- Keyboard Shortcuts ---------- */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        isRunning ? handlePause() : handleStart();
      }
      if (e.key.toLowerCase() === "l" && isRunning) handleLap();
      if (e.key.toLowerCase() === "r" && !isRunning && time > 0) handleReset();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning, time]);

  /* ---------- Visual rotation ---------- */
  const totalSeconds = time / 1000;
  const degrees = (totalSeconds / 60) * 360;
  const TICKS = 120;
  const angleStep = 360 / TICKS;
  const ticksPerSecond = TICKS / 60;
  const secondsInMinute = totalSeconds % 60;
  const ticksPassed = secondsInMinute * ticksPerSecond;

  const tickRadius = 89;
  const dotRadius = 83;

  /* ---------- Lap highlights ---------- */
  const fastest =
    laps.length > 1 ? Math.min(...laps.map((lap, i) => lap - (laps[i + 1] || 0))) : null;
  const slowest =
    laps.length > 1 ? Math.max(...laps.map((lap, i) => lap - (laps[i + 1] || 0))) : null;

  return (
    <div className="stopwatch-container">
      <div className="stopwatch-wrapper">
        <div className="stopwatch-circle">
          {[...Array(TICKS)].map((_, i) => {
            const isPast = i <= ticksPassed;
            return (
              <div
                key={i}
                className={`tick ${isPast ? "active" : ""}`}
                style={{
                  transform: `rotate(${i * angleStep}deg) translateY(-${tickRadius}px)`
                }}
              />
            );
          })}

          <div
            className="red-dot"
            style={{
              transform: `rotate(${degrees}deg) translateY(-${dotRadius}px)`
            }}
          />
        </div>

        <div className="stopwatch-display">{formatTime(time)}</div>
      </div>

      <div className="button-row">
        {!isRunning && time === 0 && (
          <button className="start-btn" onClick={handleStart}>
            Start
          </button>
        )}
        {isRunning && (
          <>
            <button className="lap-btn" onClick={handleLap}>Lap</button>
            <button className="pause-btn" onClick={handlePause}>Pause</button>
          </>
        )}
        {!isRunning && time > 0 && (
          <>
            <button className="reset-btn" onClick={handleReset}>Reset</button>
            <button className="start-btn" onClick={handleStart}>Resume</button>
          </>
        )}
      </div>

      {laps.length > 0 && (
        <div className="laps-list">
          {laps.map((lap, idx) => {
            const diff = lap - (laps[idx + 1] || 0);
            const isFast = diff === fastest;
            const isSlow = diff === slowest;
            return (
              <div
                className={`lap-row fade-in ${isFast ? "fast" : ""} ${isSlow ? "slow" : ""}`}
                key={idx}
              >
                <span>Lap {laps.length - idx}</span>
                <span>{formatTime(lap)}</span>
                <span>
                  {idx === laps.length - 1 ? "" : formatLapDiff(diff)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

