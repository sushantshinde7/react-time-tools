// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";

// lazy load components for better performance (optional)
const Stopwatch = lazy(() => import("./components/Stopwatch/Stopwatch"));
const Alarm = lazy(() => import("./components/Alarm/Alarm"));
const Clock = lazy(() => import("./components/Clock/Clock"));
const Timer = lazy(() => import("./components/Timer/Timer"));

export default function App() {
  return (
    <Router>
      <div className="app-root">
        <h1 className="app-title">Time Tools</h1>

        <nav className="tabs" role="tablist" aria-label="Time tools">
          <NavLink to="/alarm" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Alarm
          </NavLink>
          <NavLink to="/clock" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Clock
          </NavLink>
          <NavLink to="/stopwatch" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Stopwatch
          </NavLink>
          <NavLink to="/timer" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
            Timer
          </NavLink>
        </nav>

        <main className="tab-content">
          <Suspense fallback={<div style={{textAlign:"center", padding:20}}>Loading…</div>}>
            <Routes>
              <Route path="/" element={<Navigate replace to="/alarm" />} />
              <Route path="/stopwatch" element={<Stopwatch />} />
              <Route path="/alarm" element={<Alarm />} />
              <Route path="/clock" element={<Clock />} />
              <Route path="/timer" element={<Timer />} />
              {/* 404 fallback */}
              <Route path="*" element={<div style={{padding:20}}>Page not found</div>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}
