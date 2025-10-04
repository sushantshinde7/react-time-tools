import React, { useState } from "react";
import "./App.css";
import Stopwatch from "./components/Stopwatch";
import Alarm from "./components/Alarm";
import Clock from "./components/Clock";
import Timer from "./components/Timer";

export default function App() {
  const [activeTab, setActiveTab] = useState("Stopwatch");

  const renderTab = () => {
    switch (activeTab) {
      case "Alarm":
        return <Alarm />;
      case "Clock":
        return <Clock />;
      case "Stopwatch":
        return <Stopwatch />;
      case "Timer":
        return <Timer />;
      default:
        return <Stopwatch />;
    }
  };

  return (
    <div className="app-root">
      <h1 className="app-title">{activeTab}</h1>

      <div className="tabs">
        {["Alarm", "Clock", "Stopwatch", "Timer"].map((tab) => (
          <span
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="tab-content">{renderTab()}</div>
    </div>
  );
}

