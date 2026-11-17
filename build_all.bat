@echo off
set CXX="C:\Program Files\CodeBlocks\MinGW\bin\g++.exe"
if not exist %CXX% set CXX=g++

echo ========================================================
echo  BUILDING DATA STRUCTURES CORE ^& UNIT TEST SUITE
echo ========================================================
%CXX% -std=c++17 -O2 -static -static-libgcc -static-libstdc++ -Icore/include core/src/Graph.cpp core/src/CityNetwork.cpp tests/test_suite.cpp -o tests/test_suite.exe
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Test suite compilation failed.
    exit /b %ERRORLEVEL%
)

echo.
echo Running unit tests...
tests\test_suite.exe
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] One or more unit tests failed.
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo  BUILDING C++ REST API SERVER
echo ========================================================
%CXX% -std=c++17 -O2 -D_WIN32_WINNT=0x0A00 -static -static-libgcc -static-libstdc++ -Icore/include -Iserver core/src/Graph.cpp core/src/CityNetwork.cpp server/main_server.cpp -lws2_32 -lcrypt32 -o server/server.exe
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Server compilation failed.
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo  BUILD COMPLETE!
echo ========================================================
echo Execute start_server.bat to start the system.
pause
