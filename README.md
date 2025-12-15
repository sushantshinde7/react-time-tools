# 🕒 React Time Tools

A sleek and minimal **React + Vite** application that combines multiple time-based utilities — **Stopwatch, World Clock, Timer, and Alarm** — in one clean, responsive interface.
> 🔗 Live Demo: [React Time Tools Live](https://react-time-tools.vercel.app/)

> 📦 Repository: [react-time-tools](https://github.com/sushantshinde7/react-time-tools)


This project focuses on modular structure, smooth UI, and modern UX.

---

## 🚀 Features

### ✅ Completed Tools
- **⏱️ Stopwatch** — Lap tracking & circular progress animation  
- **🌍 World Clock** — Multiple cities + timezone updates  
- **⏲️ Timer** — Custom countdown with animations  
- **⏰ Alarm** — Create, edit, delete, save alarms (sound + notifications coming soon)

---

## 🧭 Core UI Features
- Tabbed navigation  
- Mobile-friendly responsive layout  
- Smooth CSS animations  
- LocalStorage support  
- Modular components  

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

