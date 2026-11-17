@echo off
set CXX="C:\Program Files\CodeBlocks\MinGW\bin\g++.exe"
if not exist %CXX% set CXX=g++
%CXX% -std=c++14 -O2 -static -static-libgcc -static-libstdc++ -Iinclude src\Person.cpp src\Incident.cpp src\RescueTeam.cpp src\Shelter.cpp src\Graph.cpp src\EmergencySystem.cpp src\main.cpp -o DisasterResponseSystem.exe
if %ERRORLEVEL% EQU 0 (
    echo Build successful. Starting Disaster Response System...
    echo.
    DisasterResponseSystem.exe
) else (
    echo Build failed with error code %ERRORLEVEL%.
)
echo.
pause
