import React, { useState, useRef, useEffect } from "react";
import "./Clock.css";

const ALL_CITIES = [
  { name: "New York", gmt: "GMT-4" },
  { name: "London", gmt: "GMT+1" },
  { name: "Tokyo", gmt: "GMT+9" },
  { name: "Sydney", gmt: "GMT+10" },
  { name: "Paris", gmt: "GMT+2" },
  { name: "Dubai", gmt: "GMT+4" },
  { name: "Singapore", gmt: "GMT+8" },
  { name: "Moscow", gmt: "GMT+3" },
  { name: "Toronto", gmt: "GMT-4" },
  { name: "Los Angeles", gmt: "GMT-7" },
];

const Clock = () => {
  const [cities, setCities] = useState([]);
  const [showCityList, setShowCityList] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const popupRef = useRef(null);
  const navRef = useRef(null); // new ref for container nav

  const handleAddCity = (city) => {
    if (!cities.find((c) => c.name === city.name)) {
      setCities([...cities, city]);
    }
    setShowCityList(false);
  };

  const handleRemoveCity = (cityName) => {
    setCities(cities.filter((c) => c.name !== cityName));
  };

  // Close add-city popup if click outside
  useEffect(() => {
    const handleClickOutsidePopup = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowCityList(false);
      }
    };
    if (showCityList) {
      document.addEventListener("mousedown", handleClickOutsidePopup);
    } else {
      document.removeEventListener("mousedown", handleClickOutsidePopup);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopup);
    };
  }, [showCityList]);

  // Close edit mode if click outside nav
  useEffect(() => {
    const handleClickOutsideNav = (event) => {
      if (editMode && navRef.current && !navRef.current.contains(event.target)) {
        setEditMode(false);
      }
    };
    if (editMode) {
      document.addEventListener("mousedown", handleClickOutsideNav);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideNav);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNav);
    };
  }, [editMode]);

  return (
    <div className="clock-container">
      {/* Top Navigation */}
      <div className="clock-nav" ref={navRef}>
        <button
          className={`nav-btn ${editMode ? "active" : ""}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Done" : "Edit"}
        </button>

        <h2 className="nav-title">World Clock</h2>

        <button
          className="nav-btn add-btn"
          onClick={() => setShowCityList(!showCityList)}
        >
          +
        </button>
      </div>

      {/* City List (added) */}
      <div className="city-list">
        {cities.length === 0 && <p className="placeholder">No cities added</p>}

        {cities.map((city) => (
          <div key={city.name} className="city-item">
            <span>
              {city.name} <small>({city.gmt})</small>
            </span>
            {editMode && (
              <button
                className="remove-btn"
                onClick={() => handleRemoveCity(city.name)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add City Popup */}
      {showCityList && (
        <div className="city-popup" ref={popupRef}>
          {ALL_CITIES.map((city) => {
            const alreadyAdded = !!cities.find((c) => c.name === city.name);
            return (
              <button
                key={city.name}
                className={`city-option ${alreadyAdded ? "selected" : ""}`}
                onClick={() => handleAddCity(city)}
                disabled={alreadyAdded}
              >
                {city.name} <small>{city.gmt}</small>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Clock;

