#include "../include/Graph.h"
#include <algorithm>
#include <limits>
#include <chrono>

Graph::Graph() {}

int Graph::addNode(const std::string& name, const std::string& type, double x, double y) {
    auto it = nameToId.find(name);
    if (it != nameToId.end()) {
        return it->second;
    }
    int id = static_cast<int>(nodes.size());
    nodes.emplace_back(id, name, type, x, y);
    adj.push_back({});
    nameToId[name] = id;
    return id;
}

bool Graph::addRoad(const std::string& from, const std::string& to, double dist, double time, int capacity, bool bidirectional) {
    int u = getNodeIndex(from);
    int v = getNodeIndex(to);
    if (u == -1 || v == -1) return false;

    adj[u].emplace_back(u, v, dist, time, capacity, false, "Normal");
    if (bidirectional) {
        adj[v].emplace_back(v, u, dist, time, capacity, false, "Normal");
    }
    return true;
}

bool Graph::setRoadBlocked(const std::string& from, const std::string& to, bool blocked) {
    int u = getNodeIndex(from);
    int v = getNodeIndex(to);
    if (u == -1 || v == -1) return false;

    bool found = false;
    for (auto& r : adj[u]) {
        if (r.to == v) {
            r.isBlocked = blocked;
            r.condition = blocked ? "Blocked" : "Normal";
            found = true;
        }
    }
    for (auto& r : adj[v]) {
        if (r.to == u) {
            r.isBlocked = blocked;
            r.condition = blocked ? "Blocked" : "Normal";
            found = true;
        }
    }
    return found;
}

bool Graph::isRoadBlocked(const std::string& from, const std::string& to) const {
    int u = getNodeIndex(from);
    int v = getNodeIndex(to);
    if (u == -1 || v == -1) return true;
    for (const auto& r : adj[u]) {
        if (r.to == v) return r.isBlocked;
    }
    return true;
}

int Graph::getNodeIndex(const std::string& name) const {
    auto it = nameToId.find(name);
    return (it != nameToId.end()) ? it->second : -1;
}

std::string Graph::getNodeName(int index) const {
    if (index >= 0 && index < static_cast<int>(nodes.size())) {
        return nodes[index].name;
    }
    return "";
}

const CityNode& Graph::getNode(int index) const {
    return nodes.at(index);
}

const std::vector<CityNode>& Graph::getAllNodes() const {
    return nodes;
}

const std::vector<std::vector<CityRoad>>& Graph::getAdjList() const {
    return adj;
}

std::vector<CityRoad> Graph::getAllUniqueRoads() const {
    std::vector<CityRoad> uniqueRoads;
    for (size_t u = 0; u < adj.size(); ++u) {
        for (const auto& road : adj[u]) {
            if (road.from < road.to) {
                uniqueRoads.push_back(road);
            }
        }
    }
    return uniqueRoads;
}

int Graph::getRoadCount() const {
    return static_cast<int>(getAllUniqueRoads().size());
}

RouteResult Graph::runDijkstra(const std::string& src, const std::string& dest) const {
    RouteResult res;
    res.algorithmName = "Dijkstra";
    res.found = false;
    res.totalDistanceKm = 0.0;
    res.totalTimeMins = 0.0;
    res.nodesExplored = 0;

    int sIdx = getNodeIndex(src);
    int dIdx = getNodeIndex(dest);
    if (sIdx == -1 || dIdx == -1) return res;

    auto tStart = std::chrono::high_resolution_clock::now();
    int n = static_cast<int>(nodes.size());

    std::vector<double> dist(n, std::numeric_limits<double>::infinity());
    std::vector<double> timeArr(n, std::numeric_limits<double>::infinity());
    std::vector<int> parent(n, -1);
    std::vector<bool> visited(n, false);

    typedef std::pair<double, int> PQItem;
    std::priority_queue<PQItem, std::vector<PQItem>, std::greater<PQItem>> pq;

    dist[sIdx] = 0.0;
    timeArr[sIdx] = 0.0;
    pq.push({0.0, sIdx});

    int stepNum = 1;

    while (!pq.empty()) {
        auto top = pq.top();
        pq.pop();
        double d = top.first;
        int u = top.second;

        if (visited[u]) continue;
        visited[u] = true;
        res.nodesExplored++;

        RouteStep step;
        step.stepNumber = stepNum++;
        step.currentNodeIndex = u;
        step.currentNodeName = nodes[u].name;

        for (int i = 0; i < n; ++i) {
            if (visited[i]) step.visitedNodes.push_back(nodes[i].name);
            if (dist[i] < std::numeric_limits<double>::infinity()) {
                step.tentativeDistances[nodes[i].name] = dist[i];
            }
        }

        if (u == dIdx) {
            step.explanation = "Reached destination " + nodes[u].name + ". Shortest path discovered.";
            res.steps.push_back(step);
            break;
        }

        std::string relaxedStr = "None";
        for (const auto& road : adj[u]) {
            int v = road.to;
            if (road.isBlocked) continue;

            double weight = road.distanceKm;
            if (!visited[v] && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                timeArr[v] = timeArr[u] + road.travelTimeMins;
                parent[v] = u;
                pq.push({dist[v], v});
                relaxedStr = nodes[u].name + " -> " + nodes[v].name + " (new dist=" + std::to_string(dist[v]) + " km)";
            }
        }

        std::priority_queue<PQItem, std::vector<PQItem>, std::greater<PQItem>> copyPQ = pq;
        while (!copyPQ.empty()) {
            auto item = copyPQ.top();
            copyPQ.pop();
            step.frontier.push_back({nodes[item.second].name, item.first});
        }
        step.relaxedEdge = relaxedStr;
        step.explanation = "Expanded node " + nodes[u].name + " with distance " + std::to_string(d) + " km.";
        res.steps.push_back(step);
    }

    auto tEnd = std::chrono::high_resolution_clock::now();
    res.executionTimeMicroseconds = std::chrono::duration_cast<std::chrono::microseconds>(tEnd - tStart).count();

    if (dist[dIdx] < std::numeric_limits<double>::infinity()) {
        res.found = true;
        res.totalDistanceKm = dist[dIdx];
        res.totalTimeMins = timeArr[dIdx];
        int curr = dIdx;
        while (curr != -1) {
            res.path.push_back(nodes[curr].name);
            curr = parent[curr];
        }
        std::reverse(res.path.begin(), res.path.end());
    }

    return res;
}

RouteResult Graph::runAStar(const std::string& src, const std::string& dest) const {
    RouteResult res;
    res.algorithmName = "A* Search";
    res.found = false;
    res.totalDistanceKm = 0.0;
    res.totalTimeMins = 0.0;
    res.nodesExplored = 0;

    int sIdx = getNodeIndex(src);
    int dIdx = getNodeIndex(dest);
    if (sIdx == -1 || dIdx == -1) return res;

    auto tStart = std::chrono::high_resolution_clock::now();
    int n = static_cast<int>(nodes.size());

    std::vector<double> gScore(n, std::numeric_limits<double>::infinity());
    std::vector<double> timeArr(n, std::numeric_limits<double>::infinity());
    std::vector<int> parent(n, -1);
    std::vector<bool> closed(n, false);

    typedef std::pair<double, int> AStarItem;
    std::priority_queue<AStarItem, std::vector<AStarItem>, std::greater<AStarItem>> openSet;

    gScore[sIdx] = 0.0;
    timeArr[sIdx] = 0.0;
    double startH = heuristic(sIdx, dIdx);
    openSet.push({startH, sIdx});

    int stepNum = 1;

    while (!openSet.empty()) {
        auto top = openSet.top();
        openSet.pop();
        double f = top.first;
        int u = top.second;

        if (closed[u]) continue;
        closed[u] = true;
        res.nodesExplored++;

        RouteStep step;
        step.stepNumber = stepNum++;
        step.currentNodeIndex = u;
        step.currentNodeName = nodes[u].name;

        for (int i = 0; i < n; ++i) {
            if (closed[i]) step.visitedNodes.push_back(nodes[i].name);
            if (gScore[i] < std::numeric_limits<double>::infinity()) {
                step.tentativeDistances[nodes[i].name] = gScore[i];
            }
        }

        if (u == dIdx) {
            step.explanation = "Target reached with heuristic-guided search!";
            res.steps.push_back(step);
            break;
        }

        std::string relaxedStr = "None";
        for (const auto& road : adj[u]) {
            int v = road.to;
            if (road.isBlocked) continue;

            double tentativeG = gScore[u] + road.distanceKm;
            if (tentativeG < gScore[v]) {
                gScore[v] = tentativeG;
                timeArr[v] = timeArr[u] + road.travelTimeMins;
                parent[v] = u;
                double h = heuristic(v, dIdx);
                openSet.push({tentativeG + h, v});
                relaxedStr = nodes[u].name + " -> " + nodes[v].name + " (g=" + std::to_string(tentativeG) + ", h=" + std::to_string(h) + ")";
            }
        }

        std::priority_queue<AStarItem, std::vector<AStarItem>, std::greater<AStarItem>> copyOpen = openSet;
        while (!copyOpen.empty()) {
            auto item = copyOpen.top();
            copyOpen.pop();
            step.frontier.push_back({nodes[item.second].name, item.first});
        }
        step.relaxedEdge = relaxedStr;
        step.explanation = "Exploring node " + nodes[u].name + " with f-score " + std::to_string(f);
        res.steps.push_back(step);
    }

    auto tEnd = std::chrono::high_resolution_clock::now();
    res.executionTimeMicroseconds = std::chrono::duration_cast<std::chrono::microseconds>(tEnd - tStart).count();

    if (gScore[dIdx] < std::numeric_limits<double>::infinity()) {
        res.found = true;
        res.totalDistanceKm = gScore[dIdx];
        res.totalTimeMins = timeArr[dIdx];
        int curr = dIdx;
        while (curr != -1) {
            res.path.push_back(nodes[curr].name);
            curr = parent[curr];
        }
        std::reverse(res.path.begin(), res.path.end());
    }

    return res;
}

RouteComparison Graph::compareDijkstraAndAStar(const std::string& src, const std::string& dest) const {
    RouteComparison comp;
    comp.dijkstraResult = runDijkstra(src, dest);
    comp.astarResult = runAStar(src, dest);

    comp.pathDistanceDifference = std::abs(comp.dijkstraResult.totalDistanceKm - comp.astarResult.totalDistanceKm);

    int dijExplored = comp.dijkstraResult.nodesExplored;
    int astarExplored = comp.astarResult.nodesExplored;
    comp.explorationReductionPercent = (dijExplored > 0)
        ? static_cast<int>(std::round((static_cast<double>(dijExplored - astarExplored) / dijExplored) * 100.0))
        : 0;

    comp.summary = "A* explored " + std::to_string(astarExplored) + " nodes vs Dijkstra's " +
                   std::to_string(dijExplored) + " nodes (a " +
                   std::to_string(comp.explorationReductionPercent) + "% reduction in search space).";
    return comp;
}

RouteResult Graph::runBFS(const std::string& src) const {
    RouteResult res;
    res.algorithmName = "BFS";
    res.found = true;
    res.totalDistanceKm = 0.0;
    res.nodesExplored = 0;

    int sIdx = getNodeIndex(src);
    if (sIdx == -1) return res;

    int n = static_cast<int>(nodes.size());
    std::vector<bool> visited(n, false);
    std::queue<int> q;

    visited[sIdx] = true;
    q.push(sIdx);
    int stepNum = 1;

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        res.nodesExplored++;
        res.path.push_back(nodes[u].name);

        RouteStep step;
        step.stepNumber = stepNum++;
        step.currentNodeIndex = u;
        step.currentNodeName = nodes[u].name;

        for (int i = 0; i < n; ++i) {
            if (visited[i]) step.visitedNodes.push_back(nodes[i].name);
        }

        for (const auto& road : adj[u]) {
            int v = road.to;
            if (!road.isBlocked && !visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }

        std::queue<int> copyQ = q;
        while (!copyQ.empty()) {
            step.frontier.push_back({nodes[copyQ.front()].name, 0.0});
            copyQ.pop();
        }
        step.explanation = "Visited " + nodes[u].name + " at hop boundary.";
        res.steps.push_back(step);
    }
    return res;
}

RouteResult Graph::runDFS(const std::string& src) const {
    RouteResult res;
    res.algorithmName = "DFS";
    res.found = true;
    res.totalDistanceKm = 0.0;
    res.nodesExplored = 0;

    int sIdx = getNodeIndex(src);
    if (sIdx == -1) return res;

    int n = static_cast<int>(nodes.size());
    std::vector<bool> visited(n, false);
    std::vector<int> stack;

    stack.push_back(sIdx);
    int stepNum = 1;

    while (!stack.empty()) {
        int u = stack.back();
        stack.pop_back();

        if (visited[u]) continue;
        visited[u] = true;
        res.nodesExplored++;
        res.path.push_back(nodes[u].name);

        RouteStep step;
        step.stepNumber = stepNum++;
        step.currentNodeIndex = u;
        step.currentNodeName = nodes[u].name;

        for (int i = 0; i < n; ++i) {
            if (visited[i]) step.visitedNodes.push_back(nodes[i].name);
        }

        for (const auto& road : adj[u]) {
            int v = road.to;
            if (!road.isBlocked && !visited[v]) {
                stack.push_back(v);
            }
        }
        for (int sVal : stack) {
            step.frontier.push_back({nodes[sVal].name, 0.0});
        }
        step.explanation = "DFS recursive depth traversal exploring " + nodes[u].name;
        res.steps.push_back(step);
    }
    return res;
}

std::vector<std::vector<double>> Graph::getDistanceMatrix() const {
    int n = static_cast<int>(nodes.size());
    std::vector<std::vector<double>> matrix(n, std::vector<double>(n, std::numeric_limits<double>::infinity()));

    for (int i = 0; i < n; ++i) {
        matrix[i][i] = 0.0;
    }
    for (size_t u = 0; u < adj.size(); ++u) {
        for (const auto& road : adj[u]) {
            if (!road.isBlocked) {
                matrix[u][road.to] = std::min(matrix[u][road.to], road.distanceKm);
            }
        }
    }
    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (matrix[i][k] + matrix[k][j] < matrix[i][j]) {
                    matrix[i][j] = matrix[i][k] + matrix[k][j];
                }
            }
        }
    }
    return matrix;
}

std::vector<std::vector<int>> Graph::getCapacityMatrix() const {
    int n = static_cast<int>(nodes.size());
    std::vector<std::vector<int>> matrix(n, std::vector<int>(n, 0));
    for (size_t u = 0; u < adj.size(); ++u) {
        for (const auto& road : adj[u]) {
            if (!road.isBlocked) {
                matrix[u][road.to] += road.capacity;
            }
        }
    }
    return matrix;
}

std::vector<std::vector<int>> Graph::getUnweightedAdjList() const {
    int n = static_cast<int>(nodes.size());
    std::vector<std::vector<int>> result(n);
    for (size_t u = 0; u < adj.size(); ++u) {
        for (const auto& road : adj[u]) {
            if (!road.isBlocked) {
                result[u].push_back(road.to);
            }
        }
    }
    return result;
}

std::vector<std::vector<std::pair<int, double>>> Graph::getWeightedAdjList() const {
    int n = static_cast<int>(nodes.size());
    std::vector<std::vector<std::pair<int, double>>> result(n);
    for (size_t u = 0; u < adj.size(); ++u) {
        for (const auto& road : adj[u]) {
            if (!road.isBlocked) {
                result[u].push_back({road.to, road.distanceKm});
            }
        }
    }
    return result;
}
