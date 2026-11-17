#ifndef GRAPH_H
#define GRAPH_H

#include <string>
#include <vector>
#include <map>
#include <queue>
#include <chrono>
#include <cmath>
#include "RouteStrategy.h"

/**
 * Weighted Dynamic City Graph
 * 
 * SPACE COMPLEXITY: O(V + E) Adjacency list representation
 * 
 * FEATURES:
 * - Dynamic road blocking/unblocking with instantaneous topology updates
 * - Visual (X, Y) canvas spatial coordinates for UI rendering
 * - Step-by-step algorithm trace recording for Dijkstra, A*, BFS, and DFS
 */
struct CityNode {
    int id;
    std::string name;
    std::string type;
    double x;
    double y;

    CityNode(int id, const std::string& name, const std::string& type, double x, double y)
        : id(id), name(name), type(type), x(x), y(y) {}
};

struct CityRoad {
    int from;
    int to;
    double distanceKm;
    double travelTimeMins;
    int capacity;
    bool isBlocked;
    std::string condition;

    CityRoad(int from, int to, double dist, double time, int cap = 500, bool blocked = false, const std::string& cond = "Normal")
        : from(from), to(to), distanceKm(dist), travelTimeMins(time), capacity(cap), isBlocked(blocked), condition(cond) {}
};

class Graph {
private:
    std::vector<CityNode> nodes;
    std::vector<std::vector<CityRoad>> adj;
    std::map<std::string, int> nameToId;

    double heuristic(int u, int v) const {
        double dx = nodes[u].x - nodes[v].x;
        double dy = nodes[u].y - nodes[v].y;
        return std::sqrt(dx * dx + dy * dy) * 0.05;
    }

public:
    Graph();

    int addNode(const std::string& name, const std::string& type, double x, double y);
    bool addRoad(const std::string& from, const std::string& to, double dist, double time, int capacity = 500, bool bidirectional = true);

    bool setRoadBlocked(const std::string& from, const std::string& to, bool blocked);
    bool isRoadBlocked(const std::string& from, const std::string& to) const;

    int getNodeIndex(const std::string& name) const;
    std::string getNodeName(int index) const;
    const CityNode& getNode(int index) const;
    const std::vector<CityNode>& getAllNodes() const;
    const std::vector<std::vector<CityRoad>>& getAdjList() const;
    std::vector<CityRoad> getAllUniqueRoads() const;

    int getNodeCount() const { return static_cast<int>(nodes.size()); }
    int getRoadCount() const;

    RouteResult runDijkstra(const std::string& src, const std::string& dest) const;
    RouteResult runAStar(const std::string& src, const std::string& dest) const;
    RouteComparison compareDijkstraAndAStar(const std::string& src, const std::string& dest) const;

    RouteResult runBFS(const std::string& src) const;
    RouteResult runDFS(const std::string& src) const;

    std::vector<std::vector<double>> getDistanceMatrix() const;
    std::vector<std::vector<int>> getCapacityMatrix() const;
    std::vector<std::vector<int>> getUnweightedAdjList() const;
    std::vector<std::vector<std::pair<int, double>>> getWeightedAdjList() const;
};

#endif
