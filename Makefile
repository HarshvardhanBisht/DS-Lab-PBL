CXX = g++
CXXFLAGS = -std=c++14 -Wall -Wextra -O2 -static -static-libgcc -static-libstdc++ -Iinclude
TARGET = DisasterResponseSystem.exe
SRCS = src/Person.cpp src/Incident.cpp src/RescueTeam.cpp src/Shelter.cpp src/Graph.cpp src/EmergencySystem.cpp src/main.cpp
OBJS = $(SRCS:.cpp=.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	del /f /q src\*.o $(TARGET)
