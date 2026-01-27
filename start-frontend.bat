@echo off
echo ========================================
echo Finance Tracker - Starting Frontend
echo ========================================
echo.

cd frontend

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting React development server...
echo The app will open in your browser at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start
