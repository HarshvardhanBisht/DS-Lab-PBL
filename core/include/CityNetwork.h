#ifndef CITYNETWORK_H
#define CITYNETWORK_H

#include <string>
#include <vector>
#include <memory>
#include "Graph.h"
#include "Person.h"
#include "Incident.h"
#include "RescueTeam.h"
#include "Shelter.h"
#include "MissionRecord.h"
#include "IndexedMaxHeap.h"
#include "MinHeap.h"
#include "CustomHashTable.h"
#include "DoublyLinkedList.h"
#include "Stack.h"
#include "Trie.h"
#include "LRUCache.h"
#include "UnionFind.h"
#include "FenwickTree.h"
#include "Tarjan.h"
#include "MST.h"
#include "MaxFlow.h"
#include "Knapsack.h"
#include "TSP2Opt.h"
#include "TopologicalSort.h"

struct UndoAction {
    std::string type;
    std::string targetId;
    std::string payload;
};

class CityNetwork {
private:
    Graph cityGraph;
    CustomHashTable<Incident*> incidentMap;
    IndexedMaxHeap incidentPQ;
    CustomHashTable<RescueTeam*> teamMap;
    MinHeap teamHeap;
    CustomHashTable<Shelter*> shelterMap;
    DoublyLinkedList<MissionRecord> missionHistory;
    Stack<UndoAction> undoStack;
    Trie locationTrie;
    LRUCache searchCache;
    UnionFind connectivity;
    FenwickTree rescueTracker;

    int incidentCounter;
    int missionCounter;
    long long simulationClockMinutes;

    void updateConnectivity();
    void syncTeamHeap();

public:
    CityNetwork();
    ~CityNetwork();

    void seedRealisticScenario();

    Graph& getGraph() { return cityGraph; }
    const Graph& getGraph() const { return cityGraph; }

    bool registerIncident(Incident* inc);
    Incident* getIncident(const std::string& id);
    std::vector<Incident*> getAllIncidents() const;
    bool updateIncidentSeverity(const std::string& id, int newSeverity);
    bool closeIncident(const std::string& id);

    bool addRescueTeam(RescueTeam* team);
    RescueTeam* getRescueTeam(const std::string& id);
    std::vector<RescueTeam*> getAllTeams() const;

    bool addShelter(Shelter* shelter);
    Shelter* getShelter(const std::string& id);
    std::vector<Shelter*> getAllShelters() const;

    bool dispatchNext(MissionRecord& outMission);
    std::vector<MissionRecord> dispatchAll();
    bool undoLastAction();

    bool toggleRoadBlock(const std::string& u, const std::string& v, bool blocked);

    std::vector<std::pair<std::string, std::string>> searchLocations(const std::string& prefix);
    LRUCache& getSearchCache() { return searchCache; }

    const DoublyLinkedList<MissionRecord>& getHistory() const { return missionHistory; }
    std::vector<MissionRecord> getHistoryVector() const { return missionHistory.toVector(); }

    TarjanResult runTarjanAnalysis();
    MSTResult runKruskal();
    MSTResult runPrim();
    MaxFlowResult runMaxFlowEvacuation(const std::string& sourceName, const std::string& sinkName);
    KnapsackResult runReliefTruckKnapsack(double capacityKg, const std::vector<SupplyItem>& items);
    RouteOptimizationResult runMultiStopSupplyRoute(const std::vector<std::string>& shelterNames);
    TopoSortResult runTaskDependencyScheduling();

    IndexedMaxHeap& getIncidentPQ() { return incidentPQ; }
    const IndexedMaxHeap& getIncidentPQ() const { return incidentPQ; }
    CustomHashTable<Incident*>& getIncidentMap() { return incidentMap; }
    const CustomHashTable<Incident*>& getIncidentMap() const { return incidentMap; }
    MinHeap& getTeamHeap() { return teamHeap; }
    const MinHeap& getTeamHeap() const { return teamHeap; }
    UnionFind& getConnectivity() { return connectivity; }
    FenwickTree& getRescueTracker() { return rescueTracker; }

    void advanceSimulationTime(int minutes = 5);
    long long getSimulationTime() const { return simulationClockMinutes; }
};

#endif
