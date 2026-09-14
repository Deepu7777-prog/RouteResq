@echo off
echo Starting RouteResQ Full-Stack Platform...
echo [1/2] Launching Node/Express API Server (Port 5000)...
start "RouteResQ Server" cmd /k "cd server && npm start"

echo [2/2] Launching React/Vite GIS Client (Port 5173)...
start "RouteResQ Client" cmd /k "cd client && npm run dev"

echo.
echo RouteResQ is online!
echo Open http://localhost:5173 in your browser.
echo.
