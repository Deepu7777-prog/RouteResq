# RouteResQ

**AI-Powered Smart Logistics & Accessibility Intelligence Platform**

- **Problem Statement ID**: SIH26002
- **Theme**: Transportation & Logistics
- **Category**: Software

---

## 📌 Problem Statement
Heavy rainfall, landslides, floods, and infrastructure damage frequently disrupt critical transport corridors in mountain and disaster-prone regions like the North Eastern Region (NER) of India. When major highways (such as NH-39 or NH-44) get blocked, essential medical supplies, oxygen cylinders, and food rations face severe delays. Standard navigation apps often fail to update road accessibility in real time, leading drivers directly into blocked passes or impassable bottlenecks.

---

## 💡 Solution Overview
**RouteResQ** is a disruption-aware smart logistics and road accessibility intelligence platform. It bridges ground-level incident reporting, environmental risk scoring, dynamic weighted graph accessibility updates, and Dijkstra-based alternative pathfinding. Instead of static routing, RouteResQ continuously re-evaluates road corridor safety and automatically dispatches role-specific alerts to drivers, logistics managers, and government authorities.

---

## 🔑 Main Features
1. **Real-Time Ground Incident Reporting**: Field response officers submit geo-tagged landslide, flood, or road closure reports with photos and severity indicators.
2. **Dynamic Risk Scoring & Accessibility Engine**: Assesses environmental conditions and road incidents to assign risk scores (SAFE, MEDIUM_RISK, HIGH_RISK, BLOCKED) and dynamic graph edge penalties.
3. **Dijkstra-Based Safe Bypass Pathfinding**: Automatically calculates the safest alternative corridor (e.g. Jowai Safe Bypass) to keep essential supply trucks moving.
4. **Targeted Multi-Role Alerts**: Dispatches real-time alerts to driver HUDs, logistics manager fleet tracking dashboards, and government command centers.
5. **Interactive GIS Maps**: Dual-layer GIS map support featuring interactive Leaflet / CARTO dark mode tiles with full Google Maps API integration fallback.
6. **Automated SIH 2026 Panel Demo Mode**: Self-playing 8-step + Final Solution presentation overlay with browser speech synthesis narration for panel demonstrations.

---

## 👥 User Roles & Access
1. **Government Authority / Admin** (`AuthorityDashboard.jsx`): Monitors regional transport corridors, disaster risk levels, and emergency response operations.
2. **Logistics Manager** (`LogisticsDashboard.jsx`): Tracks essential cargo fleet vehicles, monitors delivery delays, and confirms alternative reroutes.
3. **Emergency Vehicle Driver** (`DriverDashboard.jsx` / `MyRoute.jsx`): Mobile HUD view with live route safety status, hazard warnings, and 1-click alternative route acceptance.
4. **Field Response Officer** (`FieldOfficerPortal.jsx`): Ground portal to report road blockages, landslips, and weather hazards in real time.
5. **Citizen Emergency User** (`CitizenDashboard.jsx`): 1-Click SOS emergency trigger, medical assistance requests, and rescue tracking.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router
- **Mapping & GIS**: Leaflet, React-Leaflet, CARTO Dark-Matter tiles, Google Maps JavaScript API fallback
- **Backend API**: Python 3 (Flask), Flask-SQLAlchemy, RESTful JSON endpoints
- **Secondary Node Server**: Node.js / Express.js API proxy (`server/index.js`)
- **Database**: SQLite (`backend/database/app.db`)
- **Speech Synthesis**: Browser Native `window.speechSynthesis` API

---

## 🔄 System Workflow
```text
PROBLEM (Road Disruption)
   ↓
GROUND INCIDENT REPORTED (Field Officer / Weather Hazard)
   ↓
RISK INTELLIGENCE EVALUATION (Risk Score 85/100 → BLOCKED)
   ↓
ACCESSIBILITY UPDATE (Weighted Graph Edge Penalty Applied)
   ↓
AFFECTED FLEET IDENTIFIED (Medical Supply Delivery RR-1042)
   ↓
SMART REROUTING (Dijkstra Pathfinding → Jowai Safe Bypass)
   ↓
ROLE-TARGETED ALERTS DISPATCHED (Driver, Logistics, Authority)
   ↓
DRIVER ACCEPTS SAFER ROUTE (Driver HUD Rerouted)
   ↓
CENTRALIZED ECOSYSTEM MONITORING (Resilient Transport Sustained)
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Git

### 1. Combined 1-Command Startup (Unified App)
```bash
# Install root & subfolder dependencies
npm install

# Start Combined Platform (Builds UI & launches backend server on http://localhost:5000)
npm start
```

### 2. Frontend Development (React + Vite)
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

### 3. Backend Setup (Flask REST API)
```bash
# Navigate to backend directory
cd backend

# Install Python requirements
pip install -r requirements.txt

# Start Flask backend server (runs on http://localhost:5000)
python app.py
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` in both root and `client/` folders:

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Google Maps API Key (Optional - Leaflet CARTO fallback is active by default)
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

*Note: RouteResQ automatically uses Leaflet + CARTO GIS tiles if no Google Maps API key is configured.*

---

## 🎬 Presentation & Demo Mode
RouteResQ includes two presentation tools designed for Smart India Hackathon 2026:
1. **▶ Play RouteResQ Demo**: Prominent top navbar button launching an automated 8-step self-playing presentation overlay with speech synthesis and 1-line script visual captions.
2. **1-Click Role Selection**: Direct demo login for judges allowing instant switching between all 5 role dashboards without typing credentials.

---

## ⚠️ Prototype Status & Limitations
This repository contains a functional hackathon prototype built for SIH 2026. 
- **Route Optimization**: Implemented using a weighted graph representation and Dijkstra shortest-path pathfinding over regional North-Eastern transport nodes.
- **Risk Scoring**: Evaluated using rule-based hazard classification and field incident reports.
- *Disclaimer*: This prototype uses simulated historical and rule-based risk data; it does not claim production-grade machine learning predictive models.

---

## 🔮 Future Scope
- Integration with Indian Meteorological Department (IMD) live weather APIs.
- Satellite radar landslide susceptibility mapping.
- Offline mesh networking for driver HUDs in dead-zone mountain passes.
- Automated multi-vehicle convoy coordination for essential relief supplies.
