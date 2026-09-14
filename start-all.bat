@echo off
echo Starting RouteResQ Full-Stack Platform (SIH 2026)...
echo [1/2] Launching Python Flask REST API Server (Port 5000)...
start "RouteResQ Backend" cmd /k "cd backend && python app.py"

echo [2/2] Launching React/Vite GIS Client (Port 5173)...
start "RouteResQ Client" cmd /k "cd client && npm run dev"

echo.
echo RouteResQ Platform is online!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api/health
echo.
