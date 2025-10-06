import React from "react";
import "./Clock.css";

export default function Clock() {
  return (
    <div className="stopwatch-container">
      <div className="timer-wrapper">
        <div className="circle">
          {/* Optional: placeholder for future Clock UI */}
        </div>
        <div className="timer-display">🕒 Clock Feature Coming Soon!</div>
      </div>

      {/*<div className="button-row">
        <button className="start-btn" disabled>Start</button>
        <button className="pause-btn" disabled>Pause</button>
        <button className="reset-btn" disabled>Reset</button>
      </div>*/}
    </div>
  );
}
