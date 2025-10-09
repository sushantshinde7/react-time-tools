import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const navRef = useRef(null);

  /** Add city if not already present */
  const handleAddCity = useCallback((city) => {
    setCities((prev) =>
      prev.some((c) => c.name === city.name) ? prev : [...prev, city]
    );
    setShowCityList(false);
  }, []);

  /** Remove city from list */
  const handleRemoveCity = useCallback(
    (cityName) => setCities((prev) => prev.filter((c) => c.name !== cityName)),
    []
  );

  /** Close both popups if clicked outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !event.target.classList.contains("add-btn")
      ) {
        setShowCityList(false);
      }

      if (
        editMode &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setEditMode(false);
      }
    };

    if (showCityList || editMode) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCityList, editMode]);

  return (
    <div className="clock-container">
      {/* Top Navigation */}
      <div className="clock-nav" ref={navRef}>
        <button
          className={`nav-btn ${editMode ? "active" : ""}`}
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? "Done" : "Edit"}
        </button>

        <h2 className="nav-title">World Clock</h2>

        <button
          className="nav-btn add-btn"
          onClick={() => setShowCityList((prev) => !prev)}
        >
          +
        </button>
      </div>

      {/* Added Cities */}
      <div className="city-list">
        {cities.length === 0 ? (
          <p className="placeholder">No cities added</p>
        ) : (
          cities.map((city) => (
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
          ))
        )}
      </div>

      {/* Add City Popup */}
      {showCityList && (
        <div className="city-popup" ref={popupRef}>
          {ALL_CITIES.map((city) => {
            const alreadyAdded = cities.some((c) => c.name === city.name);
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
