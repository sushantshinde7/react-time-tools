import React, { useState, useEffect, useRef } from "react";
import "./Timer.css";

const Timer = () => {
  const MODES = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 10 * 60,
  };

  const [mode, setMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (intervalRef.current !== null) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setTimeLeft(MODES[mode]);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode]);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className={`timer-container ${mode}`}>
      <nav className="timer-nav">
        {["pomodoro", "short", "long"].map((m) => (
          <div
            key={m}
            className={`nav-item ${mode === m ? "active" : ""}`}
            onClick={() => handleModeChange(m)}
          >
            {m === "pomodoro"
              ? "Pomodoro"
              : m === "short"
              ? "Short Break"
              : "Long Break"}
          </div>
        ))}
      </nav>

      {/* Full-width Linear Progress Bar under Navbar */}
      <div className="progress-container-full">
        <div
          className="progress-bar-full"
          style={{
            width: `${((MODES[mode] - timeLeft) / MODES[mode]) * 100}%`,
          }}
        >
          <div className="progress-shimmer-full"></div>
        </div>
      </div>

      <div className="time-display">{formatTime(timeLeft)}</div>

      <div className="timer-controls">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className={isRunning ? "pause-btn" : "start-btn"}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer} className="reset-btn">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
