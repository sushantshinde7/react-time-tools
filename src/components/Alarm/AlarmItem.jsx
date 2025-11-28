import React from "react";
import "./AlarmItem.css";
import { formatRepeatText } from "../../utils/repeatFormatter";


const AlarmItem = ({ alarm, onToggle }) => {
  return (
    <div className="alarm-item">
      {/* LEFT */}
      <div className="alarm-info">
        <p className="alarm-time">{alarm.time}</p>

        {alarm.name && <p className="alarm-label">{alarm.name}</p>}

        <p className="alarm-repeat">
          {formatRepeatText(alarm.repeatDays)}
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
