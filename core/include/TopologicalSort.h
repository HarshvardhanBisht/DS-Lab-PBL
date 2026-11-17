#ifndef TOPOLOGICALSORT_H
#define TOPOLOGICALSORT_H

#include <vector>
#include <string>
#include <queue>

/**
 * Topological Sort (Kahn's Algorithm & Cycle Detection)
 * 
 * TIME COMPLEXITY: O(V + E)
 * SPACE COMPLEXITY: O(V + E)
 * 
 * WHY CHOSEN: Manages operational task precedence in disaster recovery protocols,
 * ensuring dependent actions (e.g. debris clearance -> triage field hospital) occur in valid order,
 * with automatic deadlock/circular dependency warnings.
 */
struct TaskNode {
    int id;
    std::string name;
    std::string role;
    int estimatedMinutes;
};

struct TaskEdge {
    int from;
    int to;
};

struct TopoSortResult {
    bool hasCycle;
    std::vector<TaskNode> executionOrder;
    std::string message;
};

class TaskScheduler {
public:
    static TopoSortResult schedule(const std::vector<TaskNode>& tasks, const std::vector<TaskEdge>& dependencies) {
        TopoSortResult res;
        int n = static_cast<int>(tasks.size());
        std::vector<int> inDegree(n, 0);
        std::vector<std::vector<int>> adj(n);

        for (const auto& dep : dependencies) {
            if (dep.from >= 0 && dep.from < n && dep.to >= 0 && dep.to < n) {
                adj[dep.from].push_back(dep.to);
                inDegree[dep.to]++;
            }
        }

        std::queue<int> q;
        for (int i = 0; i < n; ++i) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }

        int processed = 0;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            res.executionOrder.push_back(tasks[u]);
            processed++;

            for (int v : adj[u]) {
                inDegree[v]--;
                if (inDegree[v] == 0) {
                    q.push(v);
                }
            }
        }

        if (processed < n) {
            res.hasCycle = true;
            res.message = "WARNING: Circular dependency detected in disaster response task board! Protocol deadlock.";
        } else {
            res.hasCycle = false;
            res.message = "Tasks scheduled successfully in optimal precedence order.";
        }
        return res;
    }
};

#endif
