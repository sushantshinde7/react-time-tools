import React from "react";
import "./RingingModal.css";

export default function RingingModal({ alarm, onStop, onSnooze }) {
  if (!alarm) return null;

  return (
    <div className="ringing-overlay">
      <div className="ringing-card scale-in">

        {/* Smaller animation */}
        <div className="ringing-animation">
          <div className="rect rect-1"></div>
          <div className="rect rect-2"></div>
          <div className="rect rect-3"></div>
          <div className="rect rect-4"></div>
          <div className="rect rect-5"></div>
          <div className="rect rect-6"></div>
          <div className="rect rect-7"></div>
          <div className="rect rect-8"></div>
          <div className="rect rect-9"></div>
          <div className="rect rect-10"></div>
          <div className="rect rect-11"></div>
          <div className="rect rect-12"></div>
        </div>

        <h1 className="ringing-time">{alarm.time}</h1>
        <p className="ringing-name">{alarm.name || "Alarm"}</p>

        <div className="ringing-buttons">
          <button className="stop-btn" onClick={onStop}>Stop</button>
          {alarm.snooze && (
            <button className="snooze-btn" onClick={onSnooze}>Snooze</button>
          )}
        </div>
      </div>
    </div>
  );
}

