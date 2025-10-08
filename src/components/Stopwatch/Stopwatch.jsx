import React, { useRef, useState } from "react";
import "./Stopwatch.css";

function formatTime(ms) {
  const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  const seconds = String(Math.floor((ms / 1000) % 60)).padStart(2, "0");
  const minutes = String(Math.floor((ms / 60000) % 60)).padStart(2, "0");
  return `${minutes}:${seconds}.${centiseconds}`;
}

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const interval = useRef(null);

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
  };

  const handleLap = () => {
    setLaps([time, ...laps]);
  };

  // continuous rotation
  const totalSeconds = time / 1000;
  const degrees = (totalSeconds / 60) * 360; // continuous clockwise angle

  // ticks logic for configurable number of ticks
  const TICKS = 120; // change here to any N
  const angleStep = 360 / TICKS;
  const ticksPerSecond = TICKS / 60; // 2 when TICKS=120

  // how many ticks are considered "passed" within current minute (fractional)
  const secondsInMinute = totalSeconds % 60; // 0..59.999
  const ticksPassed = secondsInMinute * ticksPerSecond; // fractional

  // visual radii (tweak as needed)
  const tickRadius = 89; // distance used for ticks (matches your CSS translateY)
  const dotRadius = 83;  // inner dot radius (matches your CSS translateY)
  
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
          {laps.map((lap, idx) => (
            <div className="lap-row" key={idx}>
              <span>Lap {laps.length - idx}</span>
              <span>{formatTime(lap)}</span>
              <span>{idx === 0 ? "" : "+" + formatTime(lap - laps[idx - 1])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
