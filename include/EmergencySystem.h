#ifndef EMERGENCYSYSTEM_H
#define EMERGENCYSYSTEM_H

#include <string>
#include <vector>
#include "Person.h"
#include "Incident.h"
#include "RescueTeam.h"
#include "Shelter.h"
#include "MissionRecord.h"
#include "LinkedList.h"
#include "Queue.h"
#include "HashMap.h"
#include "Heap.h"
#include "Trie.h"
#include "Graph.h"
#include "Sorting.h"

class EmergencySystem {
private:
    Graph cityGraph;
    HashMap<std::string, Incident*> incidentMap;
    IncidentPriorityQueue incidentPQ;
    HashMap<std::string, RescueTeam*> teamMap;
    TeamWorkloadHeap teamWorkloadHeap;
    HashMap<std::string, Shelter*> shelterMap;
    LinkedList<MissionRecord> missionHistory;
    Trie locationTrie;

    int incidentCounter;
    int missionCounter;

    std::string getCurrentDateTime() const;
    void refreshTeamHeap();

public:
    EmergencySystem();
    ~EmergencySystem();

    void initializeDefaultData();

    bool registerIncident(Incident* incident);
    Incident* getIncident(const std::string& id);
    bool updateIncidentStatus(const std::string& id, const std::string& newStatus);
    bool updateIncidentSeverity(const std::string& id, int newSeverity);
    bool closeIncident(const std::string& id);
    void listAllIncidents() const;
    void listWaitingIncidents() const;

    bool dispatchNextIncident();
    void dispatchAllIncidents();

    bool planShortestRoute(const std::string& src, const std::string& dest, double& distance, std::vector<std::string>& path) const;
    bool planFastestRoute(const std::string& src, const std::string& dest, double& timeMins, std::vector<std::string>& path) const;
    std::vector<std::string> getReachableLocationsBFS(const std::string& startLoc) const;
    std::vector<std::string> getConnectedLocationsDFS(const std::string& startLoc) const;
    bool checkReachability(const std::string& src, const std::string& dest) const;
    void displayCityMap() const;

    bool addRescueTeam(RescueTeam* team);
    RescueTeam* getRescueTeam(const std::string& id);
    void listAllRescueTeams() const;
    void displayTeamWorkloadStatus() const;
    bool addPersonToTeam(const std::string& teamId, Person* person);

    bool addShelter(Shelter* shelter);
    Shelter* getShelter(const std::string& id);
    void listAllShelters() const;
    bool evacuateCitizens(const std::string& shelterId, int count);
    bool releaseCitizens(const std::string& shelterId, int count);

    std::vector<std::pair<std::string, std::string>> searchLocations(const std::string& prefix) const;

    void listMissionHistory() const;
    int getMissionCount() const;

    void generateReports(int sortChoice, int algoChoice);
    void displaySystemOverview() const;

    void runIntegratedSimulation();
    void runComplexityBenchmarks();

    bool saveStateToFiles(const std::string& directory = "data") const;
    bool loadStateFromFiles(const std::string& directory = "data");
};

#endif
