import React from "react";
import "./AlarmItem.css";

const AlarmItem = ({ alarm, onToggle }) => {
  return (
    <div className="alarm-row">
      {/* LEFT */}
      <div className="alarm-info">
        <p className="alarm-time">{alarm.time}</p>

        {alarm.name && <p className="alarm-label">{alarm.name}</p>}

        <p className="alarm-repeat">
          {alarm.repeat === "once" ? "Once" : "Mon Tue Fri"}
        </p>
      </div>

      {/* RIGHT SWITCH */}
      <label className="alarm-switch">
        <input
          type="checkbox"
          checked={alarm.isOn}
          onChange={() => onToggle(alarm.id)}
        />
        <span className="alarm-slider"></span>
      </label>
    </div>
  );
};

export default AlarmItem;
