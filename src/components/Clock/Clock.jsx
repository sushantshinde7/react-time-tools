import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Clock.css";
import CityClock from "./CityClock";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ALL_CITIES = [
  { name: "New Delhi", gmt: "GMT+5.5" },
  { name: "Mumbai", gmt: "GMT+5.5" },
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
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem("cities");
    return saved ? JSON.parse(saved) : [];
  });

  const [showCityList, setShowCityList] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const popupRef = useRef(null);
  const navRef = useRef(null);

  // ✅ Save cities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  // ✅ Add city (prevents duplicates)
  const handleAddCity = useCallback((city) => {
    setCities((prev) => {
      if (prev.some((c) => c.name === city.name)) return prev;
      return [...prev, city];
    });
    setShowCityList(false);
  }, []);

  // ✅ Remove city
  const handleRemoveCity = useCallback((cityName) => {
    setCities((prev) => prev.filter((c) => c.name !== cityName));
  }, []);

  // ✅ Reorder city list
  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const updated = Array.from(cities);
      const [moved] = updated.splice(result.source.index, 1);
      updated.splice(result.destination.index, 0, moved);
      setCities(updated);
    },
    [cities]
  );

  // ✅ Hide popup/edit when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsidePopup =
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !event.target.closest(".add-btn");
      const clickedOutsideNav =
        navRef.current && !navRef.current.contains(event.target);

      if (clickedOutsidePopup) setShowCityList(false);
      if (editMode && clickedOutsideNav) setEditMode(false);
    };

    if (showCityList || editMode) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCityList, editMode]);

  return (
    <div className="clock-container">
      {/* Navbar */}
      <div className="clock-nav" ref={navRef}>
        <button
          className={`nav-btn ${editMode ? "active" : ""}`}
          onClick={() => setEditMode((p) => !p)}
          aria-pressed={editMode}
        >
          {editMode ? "Done" : "Edit"}
        </button>

        <h2 className="nav-title">World Clock</h2>

        <button
          className="nav-btn add-btn"
          onClick={() => setShowCityList((p) => !p)}
          aria-expanded={showCityList}
        >
          +
        </button>
      </div>

      {/* City List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="city-list">
          {(provided) => (
            <div
              className="city-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {cities.length === 0 ? (
                <p className="placeholder">No cities added</p>
              ) : (
                cities.map((city, index) => (
                  <Draggable
                    key={city.name}
                    draggableId={city.name}
                    index={index}
                    isDragDisabled={!editMode}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`draggable-item ${
                          snapshot.isDragging ? "dragging" : ""
                        }`}
                      >
                        {/* Drag handle */}
                        {editMode && (
                          <div
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            role="button"
                            tabIndex={0}
                            aria-label={`Drag ${city.name}`}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            ☰
                          </div>
                        )}

                        <CityClock
                          city={city}
                          editMode={editMode}
                          onRemove={handleRemoveCity}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Popup City Selector */}
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
                aria-disabled={alreadyAdded}
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

