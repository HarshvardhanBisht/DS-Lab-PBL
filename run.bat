@echo off
if exist DisasterResponseSystem.exe (
    DisasterResponseSystem.exe
) else (
    echo DisasterResponseSystem.exe not found. Please run build.bat first.
)
echo.
pause
