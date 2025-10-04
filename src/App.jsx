import React from "react";
import "./App.css";
import Stopwatch from "./components/Stopwatch";

export default function App() {
  return (
    <div className="app-root">
      <h1 className="app-title">Stopwatch</h1>
      <Stopwatch />
    </div>
  );
}

