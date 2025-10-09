import React, { useState, useEffect } from "react";
import AnalogClock from "./AnalogClock";
import "./Clock.css";

const CityClock = ({ city, editMode, onRemove }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const offset = parseInt(city.gmt.replace("GMT", ""), 10);
      const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
      const cityDate = new Date(utc + offset * 3600000);
      const hours = cityDate.getHours();
      const minutes = cityDate.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      setTime(`${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [city.gmt]);

  return (
    <div className="city-item">
      <AnalogClock gmt={city.gmt} />
      <span className="city-info">
        {city.name} <small>({city.gmt})</small>
      </span>
      <span className="city-time">{time}</span>
      {editMode && (
        <button className="remove-btn" onClick={() => onRemove(city.name)}>
          ✕
        </button>
      )}
    </div>
  );
};

export default CityClock;
