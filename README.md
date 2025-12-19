# 🕒 React Time Tools

A sleek and minimal **React + Vite** application that combines multiple time-based utilities — **Stopwatch, World Clock, Timer, and Alarm** — in one clean, responsive interface.
> 🔗 Live Demo: [React Time Tools Live](https://react-time-tools.vercel.app/)

> 📦 Repository: [react-time-tools](https://github.com/sushantshinde7/react-time-tools)


This project focuses on modular structure, smooth UI, and modern UX.

---

## 🚀 Features

## 🚀 Core Capabilities

| Feature | Description |
|-------|-------------|
| Reliable alarm triggering | Alarms fire accurately based on time, repeat rules, and snooze state |
| Smart alarm scheduling | Prevents duplicate rings, prioritizes snoozed alarms, and queues alarms safely |
| Persistent state | Alarms, cities, stopwatch state, and preferences survive reloads |
| Progressive alarm volume | Alarm sound fades in gradually instead of starting loud |
| Auto alarm cleanup | One-time and completed repeat alarms turn off automatically |
| Snooze intelligence | Snoozed alarms ring once, expire correctly, and never stack |
| Offline-safe usage | All tools work without internet after first load |
| Performance-optimized loading | Tools load only when opened to keep the app fast |
| Safe auto-dismiss | Alarms stop automatically if unattended |
| Single-alarm focus | Only one alarm rings at a time to avoid chaos |

---

## ⏱️ Tool Capabilities

| Feature | Description |
|-------|-------------|
| Create and manage alarms | Add, edit, toggle, and delete alarms easily |
| Custom repeat schedules | Ring once, every day, or on selected weekdays |
| Alarm labels | Name alarms for clarity and context |
| Multiple ringtones | Choose from classic and modern alarm sounds |
| Ringtone preview | Preview alarm sounds before saving |
| Snooze support | Snooze active alarms with safe re-triggering |
| Remaining-time preview | See how long until an alarm rings |
| World clock with cities | Track time across multiple global cities |
| Live timezone updates | City times update every second |
| Reorder cities | Drag-and-drop city order with edit mode |
| Analog + digital clocks | Visual clock face with real-time digital readout |
| Stopwatch with laps | Track elapsed time and record laps |
| Lap comparison | Highlights fastest and slowest laps automatically |
| Stopwatch persistence | Resume stopwatch state after reload |
| Keyboard shortcuts | Control stopwatch using keyboard keys |
| Timer modes | Pomodoro, short break, and long break presets |
| Visual timer progress | Live progress bar reflects remaining time |
| Pause and resume timers | Full control without losing progress |

---

## 🎨 UX & Interaction Quality

| Feature | Description |
|-------|-------------|
| Tabbed navigation | Clean switching between tools |
| Mobile-first layout | Optimized for phones and small screens |
| Touch-friendly controls | Large, accessible buttons and switches |
| Smooth animations | Subtle transitions for state changes |
| Drag-safe interactions | Prevents accidental actions while reordering |
| Click-outside behavior | Edit and popup modes close naturally |
| Clear empty states | Helpful messages when no data exists |
| Keyboard accessibility | Core actions usable without a mouse |
| Visual day/night cues | Clocks adapt visually based on time |
| Non-intrusive feedback | No blocking alerts or disruptive popups |
| Consistent UI patterns | Same interaction logic across all tools |


---

## 🛠️ Tech Stack

### Frontend
- React  
- Vite  
- React Hooks  
- Context API  

### Styling
- CSS3  
- Custom transitions  

### Build Tools
- ESLint  
- Vite (with internal Babel)

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sushantshinde7/react-time-tools.git
cd react-time-tools
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 📁 Folder Structure

```text
REACT-TIME-TOOLS
│
├── node_modules/
│
├── public/
│   └── vite.svg
│
├── src/
│   ├── assets/
│   │   └── react.svg
│   │
│   ├── utils/
│   │   └── repeatFormatter.js
│   │
│   ├── components/
│   │   ├── Alarm/
│   │   │   ├── Alarm.jsx
│   │   │   ├── Alarm.css
│   │   │   ├── AlarmItem.jsx
│   │   │   ├── AlarmItem.css
│   │   │   ├── AlarmPopup.jsx
│   │   │   ├── AlarmPopup.css
│   │   │   ├── RingingModal.jsx
│   │   │   ├── RingingModal.css
│   │   │   ├── TimeStepper.jsx
│   │   │   └──TimeStepper.css 
│   │   │
│   │   ├── Clock/
│   │   │   ├── AnalogClock.jsx
│   │   │   ├── AnalogClock.css
│   │   │   ├── CityClock.jsx
│   │   │   ├── Clock.css
│   │   │   └── Clock.jsx
│   │   │
│   │   ├── Stopwatch/
│   │   │   ├── Stopwatch.jsx
│   │   │   └── Stopwatch.css
│   │   │
│   │   └── Timer/
│   │       ├── Timer.jsx
│   │       └── Timer.css
│   │
│   ├── sounds/
│   │    ├── airtel.mp3
│   │    ├── docomo.mp3
│   │    ├── galaxy_1.mp3
│   │    ├── galaxy_2.mp3
│   │    ├── nokia_classic.mp3
│   │    ├── realme.mp3
│   │    └── reliance.mp3
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js

```

---

## 🧩 Roadmap

### ✔️ Completed
- Stopwatch UI + laps + animations  
- World Clock (multi-city support)  
- Timer with custom durations  
- Alarm (add / edit / delete / persist)  

### 🚧 Upcoming
- Alarm ringtone + browser notifications  
- Repeat alarms (daily / custom days)  
- Dark/Light mode + color themes  
- Drag-and-drop city clocks  
- UI/UX improvements  

---

## 📄 License

This project is available under the **MIT License**.

