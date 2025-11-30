🕒 React Time Tools

A sleek and minimal React + Vite application that brings together multiple time-based utilities — Stopwatch, World Clock, Timer, and Alarm — all in one clean, responsive interface.

This project focuses on smooth UI, modular components, and modern UX while keeping everything simple, fast, and user-friendly.

🚀 Features
✅ Completed Tools

⏱️ Stopwatch — Lap tracking, reset, and smooth circular progress animation

🌍 World Clock — Multi-city support with real-time timezone updates

⏲️ Timer — Custom countdown with animations

⏰ Alarm — Create, edit, delete, and save alarms with a clean UI (sound + notifications coming soon)

🧭 Core UI Features

Intuitive tabbed navigation

Responsive and mobile-friendly

Clean CSS-based animations

LocalStorage support for alarms

Modular component architecture

🛠️ Tech Stack
Frontend

React

Vite

Context API

React Hooks

Styling

CSS3

Custom animations and transitions

Build Tools

ESLint

Vite (Babel internal)

📦 Getting Started

Clone the repository:

git clone https://github.com/sushantshinde7/react-time-tools.git
cd react-time-tools


Install dependencies:

npm install


Start the development server:

npm run dev


Open in browser:

http://localhost:5173

📁 Folder Structure
REACT-TIME-TOOLS
│
├── node_modules/
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
│   │   │   ├── TimeStepper.jsx
│   │   │   └── TimeStepper.css
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

🧩 Roadmap
✔️ Completed

Stopwatch UI + laps + animations

World Clock with multiple cities

Timer with custom durations

Alarm (create, edit, delete, save)

🚧 Upcoming / In Progress

🔔 Alarm ring sound & notifications

📅 Repeat alarms (daily / custom days)

🎨 Theme customization (dark/light + color themes)

🔄 Drag-and-drop city clocks

⚡ UI/UX refinements and performance improvements

📄 License

This project is open-source and available under the MIT License.
