import React, { useEffect, useState } from "react";
import "./AnalogClock.css";

const AnalogClock = ({ gmt }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, ms: 0 });

  const getCityTime = (gmt) => {
    const offset = parseInt(gmt.replace("GMT", ""), 10);
    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const cityDate = new Date(utc + offset * 3600000);
    return {
      hours: cityDate.getHours(),
      minutes: cityDate.getMinutes(),
      seconds: cityDate.getSeconds(),
      ms: cityDate.getMilliseconds(),
    };
  };

  useEffect(() => {
    let animationFrameId;

    const updateClock = () => {
      setTime(getCityTime(gmt));
      animationFrameId = requestAnimationFrame(updateClock);
    };

    animationFrameId = requestAnimationFrame(updateClock);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gmt]);

  const isDay = time.hours >= 6 && time.hours < 18;

  // Degrees
  const hourDeg = (time.hours % 12) * 30 + time.minutes * 0.5;
  const minuteDeg = time.minutes * 6 + time.seconds * 0.1;
  const secondDeg = time.seconds * 6 + (time.ms / 1000) * 6;

  return (
    <div className={`analog-clock ${isDay ? "day" : "night"}`}>
      <div className="hour-hand" style={{ transform: `rotate(${hourDeg}deg)` }} />
      <div className="minute-hand" style={{ transform: `rotate(${minuteDeg}deg)` }} />
      <div className="second-dot" style={{ transform: `rotate(${secondDeg}deg)` }} />
    </div>
  );
};

export default AnalogClock;

