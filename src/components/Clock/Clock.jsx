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
  const [cities, setCities] = useState([]);
  const [showCityList, setShowCityList] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const popupRef = useRef(null);
  const navRef = useRef(null);

  const handleAddCity = useCallback((city) => {
    setCities((prev) => (prev.some((c) => c.name === city.name) ? prev : [...prev, city]));
    setShowCityList(false);
  }, []);

  const handleRemoveCity = useCallback((cityName) => {
    setCities((prev) => prev.filter((c) => c.name !== cityName));
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(cities);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setCities(items);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !event.target.classList.contains("add-btn")
      ) {
        setShowCityList(false);
      }
      if (editMode && navRef.current && !navRef.current.contains(event.target)) {
        setEditMode(false);
      }
    };

    if (showCityList || editMode) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCityList, editMode]);

  return (
    <div className="clock-container">
      <div className="clock-nav" ref={navRef}>
        <button className={`nav-btn ${editMode ? "active" : ""}`} onClick={() => setEditMode((p) => !p)}>
          {editMode ? "Done" : "Edit"}
        </button>
        <h2 className="nav-title">World Clock</h2>
        <button className="nav-btn add-btn" onClick={() => setShowCityList((p) => !p)}>
          +
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="city-list">
          {(provided) => (
            <div className="city-list" {...provided.droppableProps} ref={provided.innerRef}>
              {cities.length === 0 ? (
                <p className="placeholder">No cities added</p>
              ) : (
                cities.map((city, index) => (
                  <Draggable
                    key={city.name}
                    draggableId={city.name}
                    index={index}
                    isDragDisabled={!editMode} // Only draggable in edit mode
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}               // draggable props on wrapper
                        className={`draggable-item ${snapshot.isDragging ? "dragging" : ""}`}
                      >
                        {/* drag handle — apply dragHandleProps only to this element */}
                        {editMode && (
                          <div
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            aria-label={`Drag ${city.name}`}
                            role="button"
                            onMouseDown={(e) => e.stopPropagation()} // prevent parent mousedown handlers
                          >
                            ☰
                          </div>
                        )}

                        {/* CityClock (contains remove button) */}
                        <CityClock city={city} editMode={editMode} onRemove={handleRemoveCity} />
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

