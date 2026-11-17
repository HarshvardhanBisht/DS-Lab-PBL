#ifndef MST_H
#define MST_H

#include <vector>
#include <string>
#include <queue>
#include <algorithm>
#include "UnionFind.h"

/**
 * Minimum Spanning Tree Algorithms (Kruskal & Prim)
 * 
 * KRUSKAL COMPLEXITY: O(E log E) sorting + O(E alpha(V)) union-find
 * PRIM COMPLEXITY: O((V + E) log V) with binary heap
 * SPACE COMPLEXITY: O(V + E)
 * 
 * WHY CHOSEN: Computes the minimum cost road network to clear and reconnect
 * all emergency sectors following city-wide seismic or flood devastation.
 */
struct MSTEdge {
    int u;
    int v;
    double weight;
    std::string uName;
    std::string vName;
};

struct MSTStep {
    int stepNumber;
    std::string description;
    int u;
    int v;
    double weight;
    bool accepted;
    double currentTotalWeight;
};

struct MSTResult {
    std::vector<MSTEdge> mstEdges;
    double totalWeight;
    std::vector<MSTStep> steps;
};

class KruskalMST {
public:
    static MSTResult compute(int n, std::vector<MSTEdge> edges) {
        MSTResult res;
        res.totalWeight = 0.0;
        std::sort(edges.begin(), edges.end(), [](const MSTEdge& a, const MSTEdge& b) {
            return a.weight < b.weight;
        });

        UnionFind uf(n);
        int stepIdx = 1;

        for (const auto& e : edges) {
            bool united = uf.unite(e.u, e.v);
            MSTStep s;
            s.stepNumber = stepIdx++;
            s.u = e.u;
            s.v = e.v;
            s.weight = e.weight;
            s.accepted = united;

            if (united) {
                res.mstEdges.push_back(e);
                res.totalWeight += e.weight;
                s.description = "Road (" + e.uName + " - " + e.vName + ") weight " + std::to_string(e.weight) + " km added to MST.";
            } else {
                s.description = "Road (" + e.uName + " - " + e.vName + ") rejected: forms a cycle.";
            }
            s.currentTotalWeight = res.totalWeight;
            res.steps.push_back(s);

            if (res.mstEdges.size() == static_cast<size_t>(n - 1)) break;
        }
        return res;
    }
};

class PrimMST {
public:
    static MSTResult compute(int n, const std::vector<std::vector<std::pair<int, double>>>& adj,
                            const std::vector<std::string>& nodeNames) {
        MSTResult res;
        res.totalWeight = 0.0;
        if (n == 0) return res;

        std::vector<bool> inMST(n, false);
        typedef std::pair<double, std::pair<int, int>> EdgeEntry;
        std::priority_queue<EdgeEntry, std::vector<EdgeEntry>, std::greater<EdgeEntry>> pq;

        inMST[0] = true;
        for (const auto& edge : adj[0]) {
            pq.push({edge.second, {0, edge.first}});
        }

        int stepIdx = 1;
        while (!pq.empty() && res.mstEdges.size() < static_cast<size_t>(n - 1)) {
            auto top = pq.top();
            pq.pop();

            double w = top.first;
            int u = top.second.first;
            int v = top.second.second;

            MSTStep s;
            s.stepNumber = stepIdx++;
            s.u = u;
            s.v = v;
            s.weight = w;

            if (inMST[v]) {
                s.accepted = false;
                s.description = "Edge (" + nodeNames[u] + " - " + nodeNames[v] + ") already in visited cut. Skipped.";
                s.currentTotalWeight = res.totalWeight;
                res.steps.push_back(s);
                continue;
            }

            inMST[v] = true;
            MSTEdge me;
            me.u = u;
            me.v = v;
            me.weight = w;
            me.uName = nodeNames[u];
            me.vName = nodeNames[v];
            res.mstEdges.push_back(me);
            res.totalWeight += w;

            s.accepted = true;
            s.description = "Added lightest edge crossing cut: (" + me.uName + " - " + me.vName + ") [" + std::to_string(w) + " km]";
            s.currentTotalWeight = res.totalWeight;
            res.steps.push_back(s);

            for (const auto& edge : adj[v]) {
                if (!inMST[edge.first]) {
                    pq.push({edge.second, {v, edge.first}});
                }
            }
        }
        return res;
    }
};

#endif
