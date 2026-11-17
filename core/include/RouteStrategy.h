#ifndef ROUTESTRATEGY_H
#define ROUTESTRATEGY_H

#include <string>
#include <vector>
#include <map>
#include <cmath>

/**
 * Strategy Pattern for Swappable Navigation Routing
 * 
 * TIME COMPLEXITY:
 * - Dijkstra: O((V + E) log V)
 * - A* Search: O(E) best-case with admissible heuristic, O((V + E) log V) worst-case
 * 
 * SPACE COMPLEXITY: O(V + E)
 * 
 * WHY CHOSEN: Demonstrates the Strategy design pattern, allowing the emergency dispatcher
 * to swap routing algorithms at runtime while generating detailed step-by-step traces for examiners.
 */
struct RouteStep {
    int stepNumber;
    int currentNodeIndex;
    std::string currentNodeName;
    std::vector<std::string> visitedNodes;
    std::vector<std::pair<std::string, double>> frontier;
    std::map<std::string, double> tentativeDistances;
    std::string relaxedEdge;
    std::string explanation;
};

struct RouteResult {
    bool found;
    std::string algorithmName;
    std::vector<std::string> path;
    double totalDistanceKm;
    double totalTimeMins;
    int nodesExplored;
    long long executionTimeMicroseconds;
    std::vector<RouteStep> steps;
};

struct RouteComparison {
    RouteResult dijkstraResult;
    RouteResult astarResult;
    double pathDistanceDifference;
    int explorationReductionPercent;
    std::string summary;
};

class IRouteStrategy {
public:
    virtual ~IRouteStrategy() {}
    virtual std::string getName() const = 0;
};

#endif
