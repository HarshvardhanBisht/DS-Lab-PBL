#ifndef TARJAN_H
#define TARJAN_H

#include <vector>
#include <string>
#include <utility>
#include <algorithm>

/**
 * Tarjan's Algorithm for Articulation Points and Bridges
 * 
 * TIME COMPLEXITY: O(V + E) single DFS traversal
 * SPACE COMPLEXITY: O(V + E) recursion stack and low/disc discovery arrays
 * 
 * PURPOSE: Identifies single points of failure in the city road network.
 * - Bridges: Critical road segments whose destruction isolates sectors.
 * - Articulation Points: Critical junctions/intersections that must be defended.
 */
struct TarjanResult {
    std::vector<int> articulationPoints;
    std::vector<std::pair<int, int>> bridges;
    std::vector<std::string> stepTrace;
};

class TarjanBridgeFinder {
private:
    int timer;

    void dfs(int u, int p, const std::vector<std::vector<int>>& adj,
             std::vector<int>& tin, std::vector<int>& low,
             std::vector<bool>& isCutVertex,
             std::vector<std::pair<int, int>>& bridges,
             std::vector<std::string>& steps) {
        tin[u] = low[u] = ++timer;
        int children = 0;
        steps.push_back("Visiting Node " + std::to_string(u) + " (tin=" + std::to_string(tin[u]) + ")");

        for (int v : adj[u]) {
            if (v == p) continue;
            if (tin[v] != -1) {
                low[u] = std::min(low[u], tin[v]);
                steps.push_back("Back-edge found: " + std::to_string(u) + " -> " + std::to_string(v) + ", low[" + std::to_string(u) + "]=" + std::to_string(low[u]));
            } else {
                children++;
                dfs(v, u, adj, tin, low, isCutVertex, bridges, steps);
                low[u] = std::min(low[u], low[v]);

                if (low[v] > tin[u]) {
                    bridges.push_back({u, v});
                    steps.push_back("CRITICAL BRIDGE DETECTED: Road (" + std::to_string(u) + " <-> " + std::to_string(v) + ") is a single point of failure!");
                }
                if (p != -1 && low[v] >= tin[u]) {
                    isCutVertex[u] = true;
                    steps.push_back("ARTICULATION POINT DETECTED: Node " + std::to_string(u) + " is a critical junction!");
                }
            }
        }
        if (p == -1 && children > 1) {
            isCutVertex[u] = true;
            steps.push_back("ROOT ARTICULATION POINT: Root node " + std::to_string(u) + " has " + std::to_string(children) + " independent subtrees!");
        }
    }

public:
    TarjanBridgeFinder() : timer(0) {}

    TarjanResult findCriticalInfrastructures(int n, const std::vector<std::vector<int>>& adj) {
        TarjanResult result;
        timer = 0;
        std::vector<int> tin(n, -1);
        std::vector<int> low(n, -1);
        std::vector<bool> isCut(n, false);

        for (int i = 0; i < n; ++i) {
            if (tin[i] == -1) {
                dfs(i, -1, adj, tin, low, isCut, result.bridges, result.stepTrace);
            }
        }

        for (int i = 0; i < n; ++i) {
            if (isCut[i]) {
                result.articulationPoints.push_back(i);
            }
        }
        return result;
    }
};

#endif
