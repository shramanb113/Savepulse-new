# 🚑 SavePulse
### *Connecting patients to the right hospital, in the moments that matter most.*

[![Demo Video](https://img.shields.io/badge/▶_Demo_Video-Watch_Now-red?style=for-the-badge)](PASTE_DRIVE_LINK_HERE)
![Stack](https://img.shields.io/badge/Stack-Next.js_·_Node.js_·_FastAPI_·_PostgreSQL-blue?style=for-the-badge)

---

## The Problem

In a medical emergency, every second counts. Yet most people don't know which hospital to go to — they either go to the nearest one (which may not have the right facilities) or waste precious time calling around. Ambulances get dispatched without knowing if the destination hospital even has ICU beds available. People die not because help wasn't close enough, but because it wasn't the *right* help.

**SavePulse fixes this.**

---

## How It Works

SavePulse connects patients directly to the most suitable hospital for their emergency — in real time.

```
Patient hits SOS
       ↓
Selects emergency type  →  cardiac / trauma / general
       ↓
SavePulse ML engine scores all hospitals
based on location, availability, facilities & rating
       ↓
Patient sees Top 5 best-matched hospitals
       ↓
Patient selects one  →  Request sent to hospital
       ↓
Hospital accepts or rejects
       ↓
Ambulance dispatched to patient's location
```

No guesswork. No wasted time. The right hospital, every time.

---

## ✨ Key Features

- **Smart SOS Flow** — patient selects emergency type and is shown the 5 most suitable hospitals ranked by our ML engine, not just distance
- **Real-Time Hospital Response** — hospitals receive requests live and accept or reject with one tap
- **Ambulance Dispatch** — once accepted, an ambulance is immediately dispatched to the patient
- **Real Kolkata Hospital Data** — 50 real hospitals with accurate coordinates from OpenStreetMap, correctly tagged for trauma and cardiac capabilities
- **Road Distance Routing** — uses OSRM for real road distances, falls back to Haversine if unavailable

---

## 🤖 The Recommendation Engine

When a patient triggers SOS, our ML engine scores every hospital in the city simultaneously using **4 weighted features**:

| Feature | What it measures |
|---|---|
| 🗺️ Distance Score | Real road distance via OSRM (`1 / (1 + km)`) |
| 🛏️ Availability Score | Available ICU + general + oxygen beds vs total capacity |
| ⭐ Rating Score | Normalized hospital rating |
| 🏥 Facility Match | Does this hospital have the right unit? (cardiac center for cardiac, trauma center for trauma) |

Weights are **computed dynamically per request** using variance — features that differ more between hospitals for that specific request carry more weight automatically. A cardiac emergency near many cardiac centers will weight facility match lower and distance higher. No static assumptions.

---

## 🗂️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | Node.js · Express · Bun |
| Database | PostgreSQL 16 (Docker) · Drizzle ORM |
| ML Recommender | Python · FastAPI · NumPy · Pandas |
| Distance API | OSRM (Haversine fallback) |
| Hospital Data | OpenStreetMap — 50 real Kolkata hospitals |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│              Next.js Frontend            │
│   SOS flow · Hospital selection · Map   │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Node.js / Express Backend        │
│   Request management · Status updates   │
└───────────┬─────────────┬───────────────┘
            │             │
┌───────────▼──┐   ┌──────▼──────────────┐
│  PostgreSQL  │   │  Python FastAPI      │
│  (Docker)    │   │  ML Recommender      │
│              │   │  ↓                   │
│  hospitals   │   │  OSRM Road Distance  │
│  requests    │   │  + Haversine fallback│
└──────────────┘   └─────────────────────┘
```

---

## 🚀 Running Locally

### Prerequisites
- Docker
- Node.js + Bun
- Python 3.10+

### 1. Clone the repo
```bash
git clone https://github.com/Koustav-github/Savepulse-new.git
cd Savepulse-new
```

### 2. Start the database
```bash
cd backend
docker-compose up -d
```

### 3. Start the backend
```bash
cd backend
bun run server.ts
```

### 4. Start the ML recommender
```bash
cd recommender
source venv/Scripts/activate      # Windows
# source venv/bin/activate        # Mac / Linux
uvicorn recommender.main:app --reload --port 8000
```

### 5. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Reference

### ML Recommender — `localhost:8000`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/recommend` | Takes `{ request_id }`, returns top 5 scored hospitals |
| `GET` | `/health` | Health check |

### Backend — `localhost:3001`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/requests` | Create a new emergency request |
| `GET` | `/api/requests/:id` | Get request details |
| `PUT` | `/api/requests/:id` | Update status / assign hospital |
| `GET` | `/api/hospitals` | List all hospitals |
| `POST` | `/api/recommend` | Proxy to ML recommender |

---

## 📹 Demo

🎥 [Watch the full demo](PASTE_DRIVE_LINK_HERE)

---

## 👥 Team

| Name | Role |
|---|---|
| Souradeep Roy | ML Recommender System|
| Anurag Biswas | Frontend and UI/UX |
| Shraman Banerjee | Backend and Database |
| Koustav Manna | Frontend and Integration |

---
