import React from "react";
import "./Timer.css";

export default function Timer() {
  return (
    <div className="timer-container">
      <div className="timer-wrapper">
        <div className="circle"></div>
        <div className="timer-display">⏱ Timer Feature Coming Soon!</div>
      </div>
      <div className="button-row">
        <button className="start-btn" disabled>Start</button>
        <button className="pause-btn" disabled>Pause</button>
        <button className="reset-btn" disabled>Reset</button>
      </div>
    </div>
  );
}
