#ifndef MAXFLOW_H
#define MAXFLOW_H

#include <vector>
#include <queue>
#include <string>
#include <algorithm>
#include <climits>

/**
 * Edmonds-Karp Algorithm for Maximum Evacuation Flow
 * 
 * TIME COMPLEXITY: O(V * E^2) using Breadth-First Search for shortest augmenting paths.
 * SPACE COMPLEXITY: O(V^2) for residual capacity adjacency matrix.
 * 
 * WHY CHOSEN: Models evacuation bottleneck throughput from flood/earthquake disaster zones
 * to humanitarian relief shelters along roads with traffic vehicle-per-hour capacities.
 */
struct FlowEdge {
    int u;
    int v;
    int flow;
    int capacity;
    std::string uName;
    std::string vName;
};

struct AugmentingPathStep {
    int stepNumber;
    std::vector<std::string> pathNodes;
    int bottleneckCapacity;
    int cumulativeFlow;
    std::string explanation;
};

struct MaxFlowResult {
    int maxFlow;
    std::vector<FlowEdge> edgeFlows;
    std::vector<AugmentingPathStep> steps;
};

class EdmondsKarpMaxFlow {
public:
    static MaxFlowResult compute(int n, int source, int sink,
                                const std::vector<std::vector<int>>& capacity,
                                const std::vector<std::string>& nodeNames) {
        MaxFlowResult result;
        result.maxFlow = 0;

        std::vector<std::vector<int>> residual = capacity;
        std::vector<std::vector<int>> flowMatrix(n, std::vector<int>(n, 0));
        std::vector<int> parent(n);

        int stepCounter = 1;

        while (true) {
            std::fill(parent.begin(), parent.end(), -1);
            parent[source] = -2;
            std::queue<std::pair<int, int>> q;
            q.push({source, INT_MAX});

            while (!q.empty()) {
                int cur = q.front().first;
                int flow = q.front().second;
                q.pop();

                if (cur == sink) break;

                for (int next = 0; next < n; ++next) {
                    if (parent[next] == -1 && residual[cur][next] > 0) {
                        parent[next] = cur;
                        int newFlow = std::min(flow, residual[cur][next]);
                        if (next == sink) {
                            parent[next] = cur;
                            q = std::queue<std::pair<int, int>>();
                            q.push({sink, newFlow});
                            break;
                        }
                        q.push({next, newFlow});
                    }
                }
            }

            if (parent[sink] == -1) break;

            int pathFlow = INT_MAX;
            int curr = sink;
            std::vector<int> pathIndices;
            while (curr != source) {
                pathIndices.push_back(curr);
                int prev = parent[curr];
                pathFlow = std::min(pathFlow, residual[prev][curr]);
                curr = prev;
            }
            pathIndices.push_back(source);
            std::reverse(pathIndices.begin(), pathIndices.end());

            for (size_t i = 0; i + 1 < pathIndices.size(); ++i) {
                int u = pathIndices[i];
                int v = pathIndices[i + 1];
                residual[u][v] -= pathFlow;
                residual[v][u] += pathFlow;
                flowMatrix[u][v] += pathFlow;
                flowMatrix[v][u] -= pathFlow;
            }

            result.maxFlow += pathFlow;

            AugmentingPathStep step;
            step.stepNumber = stepCounter++;
            step.bottleneckCapacity = pathFlow;
            step.cumulativeFlow = result.maxFlow;
            for (int idx : pathIndices) {
                step.pathNodes.push_back(nodeNames[idx]);
            }
            step.explanation = "Found augmenting path with bottleneck capacity of " + std::to_string(pathFlow) + " evacuees/hr.";
            result.steps.push_back(step);
        }

        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (capacity[i][j] > 0) {
                    FlowEdge fe;
                    fe.u = i;
                    fe.v = j;
                    fe.capacity = capacity[i][j];
                    fe.flow = std::max(0, flowMatrix[i][j]);
                    fe.uName = nodeNames[i];
                    fe.vName = nodeNames[j];
                    result.edgeFlows.push_back(fe);
                }
            }
        }

        return result;
    }
};

#endif
