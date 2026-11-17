#ifndef GRAPH_H
#define GRAPH_H

#include <string>
#include <vector>
#include <map>
#include <limits>
#include <iostream>

struct GraphEdge {
    int destIndex;
    double distanceKm;
    double travelTimeMins;
    std::string roadCondition;

    GraphEdge(int dest, double dist, double time, const std::string& condition = "Normal")
        : destIndex(dest), distanceKm(dist), travelTimeMins(time), roadCondition(condition) {}
};

struct LocationVertex {
    std::string name;
    std::string type;

    LocationVertex(const std::string& name, const std::string& type)
        : name(name), type(type) {}
};

class Graph {
private:
    std::vector<LocationVertex> vertices;
    std::vector<std::vector<GraphEdge>> adjList;
    std::map<std::string, int> nameToIndex;

    void dfsHelper(int u, std::vector<bool>& visited, std::vector<std::string>& order) const;

public:
    Graph();

    int addLocation(const std::string& name, const std::string& type);
    bool addRoad(const std::string& from, const std::string& to, double distanceKm, double travelTimeMins, bool bidirectional = true);

    int getVertexIndex(const std::string& name) const;
    std::string getVertexName(int index) const;
    std::string getVertexType(const std::string& name) const;
    bool hasLocation(const std::string& name) const;

    int getVertexCount() const;
    int getEdgeCount() const;
    const std::vector<LocationVertex>& getVertices() const;

    bool dijkstra(const std::string& src, const std::string& dest, double& outDistance, std::vector<std::string>& outPath) const;
    bool dijkstraFastest(const std::string& src, const std::string& dest, double& outTimeMins, std::vector<std::string>& outPath) const;

    std::vector<std::string> bfs(const std::string& startName) const;
    bool bfsShortestHops(const std::string& src, const std::string& dest, int& outHops, std::vector<std::string>& outPath) const;

    std::vector<std::string> dfs(const std::string& startName) const;
    bool isReachable(const std::string& src, const std::string& dest) const;

    void displayGraph() const;
};

#endif
