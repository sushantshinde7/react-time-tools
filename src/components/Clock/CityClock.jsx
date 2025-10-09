import React, { useEffect, useState } from "react";

/**
 * Displays one city's current time + name + GMT
 */
const CityClock = ({ city, editMode, onRemove }) => {
  const [time, setTime] = useState("");

  // Function to calculate current time using GMT offset
  const getCityTime = (gmt) => {
    const offset = parseInt(gmt.replace("GMT", ""), 10);
    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const cityDate = new Date(utc + offset * 3600000);
    return cityDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Update every second
  useEffect(() => {
    const updateTime = () => setTime(getCityTime(city.gmt));
    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [city.gmt]);

  return (
    <div className="city-item">
      <span className="city-info">
        {city.name} <small>({city.gmt})</small>
      </span>

      {/* Digital Time */}
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
