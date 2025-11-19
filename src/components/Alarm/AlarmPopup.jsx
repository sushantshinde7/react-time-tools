import React, { useState } from "react";
import "./AlarmPopup.css";
import TimeStepper from "./TimeStepper";

const AlarmPopup = ({ onClose, onSave }) => {
  const [alarmTime, setAlarmTime] = useState("07:00 AM");

  const handleSave = () => {
    onSave(alarmTime); // Todo: later include full alarm object
  };

  return (
    <div className="alarm-popup-overlay">
      <div className="alarm-popup">
        {/* Header */}
        <div className="popup-header">
          <button className="popup-close" onClick={onClose}>
            ×
          </button>
          <h3 className="popup-title">New Alarm</h3>
          <button className="popup-save" onClick={handleSave}>
            ✓
          </button>
        </div>

        {/* Scrollable body */}
        <div className="popup-scroll">
          {/* Ring time */}
          <p className="ring-time-text">Alarm will ring in 23h 52m</p>

          {/* Section: TimeStepper */}
            <h4>Time</h4>
            <div className="time-stepper-wrapper">
              <TimeStepper
                initialTime={alarmTime}
                onTimeSelect={setAlarmTime}
              />
            </div>

          {/* Section: Repeat */}
          <div className="popup-section">
            <h4>Repeat</h4>
            <div className="repeat-section">
              <button className="repeat-btn active">Ring Once</button>
              <button className="repeat-btn">Custom ▼</button>
            </div>
          </div>

          {/* Section: Alarm Name */}
          <div className="popup-section">
            <h4>Alarm Name</h4>
            <input type="text" className="text-input" placeholder="Optional" />
          </div>

          {/* Section: Ringtone */}
          <div className="popup-section">
            <h4>Ringtone</h4>
            <select className="select-input">
              <option>Default</option>
            </select>
          </div>

          {/* Section: Toggles */}
          <div className="popup-section toggle-wrapper">
            <div className="toggle-row">
              <span>Vibrate</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-row">
              <span>Snooze</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmPopup;
