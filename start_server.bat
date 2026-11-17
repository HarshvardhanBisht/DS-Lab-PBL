@echo off
echo ========================================================
echo  DISASTER RESPONSE ^& RESOURCE MANAGEMENT SYSTEM
echo ========================================================
echo Starting C++ REST API Server on http://localhost:8080 ...
echo Opening Web UI in your default browser...
start http://localhost:8080

if exist server\server.exe (
    server\server.exe 8080
) else (
    echo [ERROR] server\server.exe not found. Please run build_all.bat first.
    pause
)
