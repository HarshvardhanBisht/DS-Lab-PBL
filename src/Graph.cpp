#include "../include/Graph.h"
#include <queue>
#include <algorithm>
#include <iomanip>

Graph::Graph() {}

int Graph::addLocation(const std::string& name, const std::string& type) {
    if (nameToIndex.find(name) != nameToIndex.end()) {
        return nameToIndex[name];
    }
    int newIndex = static_cast<int>(vertices.size());
    vertices.push_back(LocationVertex(name, type));
    adjList.push_back(std::vector<GraphEdge>());
    nameToIndex[name] = newIndex;
    return newIndex;
}

bool Graph::addRoad(const std::string& from, const std::string& to, double distanceKm, double travelTimeMins, bool bidirectional) {
    if (!hasLocation(from) || !hasLocation(to)) {
        return false;
    }
    int u = nameToIndex[from];
    int v = nameToIndex[to];

    adjList[u].push_back(GraphEdge(v, distanceKm, travelTimeMins));
    if (bidirectional) {
        adjList[v].push_back(GraphEdge(u, distanceKm, travelTimeMins));
    }
    return true;
}

int Graph::getVertexIndex(const std::string& name) const {
    auto it = nameToIndex.find(name);
    if (it != nameToIndex.end()) {
        return it->second;
    }
    return -1;
}

std::string Graph::getVertexName(int index) const {
    if (index >= 0 && index < static_cast<int>(vertices.size())) {
        return vertices[index].name;
    }
    return "";
}

std::string Graph::getVertexType(const std::string& name) const {
    int idx = getVertexIndex(name);
    if (idx != -1) {
        return vertices[idx].type;
    }
    return "Unknown";
}

bool Graph::hasLocation(const std::string& name) const {
    return nameToIndex.find(name) != nameToIndex.end();
}

int Graph::getVertexCount() const {
    return static_cast<int>(vertices.size());
}

int Graph::getEdgeCount() const {
    int total = 0;
    for (size_t i = 0; i < adjList.size(); ++i) {
        total += static_cast<int>(adjList[i].size());
    }
    return total;
}

const std::vector<LocationVertex>& Graph::getVertices() const {
    return vertices;
}

bool Graph::dijkstra(const std::string& src, const std::string& dest, double& outDistance, std::vector<std::string>& outPath) const {
    outPath.clear();
    outDistance = -1.0;

    int srcIdx = getVertexIndex(src);
    int destIdx = getVertexIndex(dest);

    if (srcIdx == -1 || destIdx == -1) {
        return false;
    }

    int n = static_cast<int>(vertices.size());
    std::vector<double> dist(n, std::numeric_limits<double>::infinity());
    std::vector<int> parent(n, -1);
    std::vector<bool> visited(n, false);

    typedef std::pair<double, int> DistNodePair;
    std::priority_queue<DistNodePair, std::vector<DistNodePair>, std::greater<DistNodePair>> pq;

    dist[srcIdx] = 0.0;
    pq.push(std::make_pair(0.0, srcIdx));

    while (!pq.empty()) {
        DistNodePair top = pq.top();
        pq.pop();

        double d = top.first;
        int u = top.second;

        if (visited[u]) continue;
        visited[u] = true;

        if (u == destIdx) break;

        for (size_t i = 0; i < adjList[u].size(); ++i) {
            const GraphEdge& edge = adjList[u][i];
            int v = edge.destIndex;
            double weight = edge.distanceKm;

            if (!visited[v] && dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                parent[v] = u;
                pq.push(std::make_pair(dist[v], v));
            }
        }
    }

    if (dist[destIdx] == std::numeric_limits<double>::infinity()) {
        return false;
    }

    outDistance = dist[destIdx];

    int curr = destIdx;
    while (curr != -1) {
        outPath.push_back(vertices[curr].name);
        curr = parent[curr];
    }
    std::reverse(outPath.begin(), outPath.end());
    return true;
}

bool Graph::dijkstraFastest(const std::string& src, const std::string& dest, double& outTimeMins, std::vector<std::string>& outPath) const {
    outPath.clear();
    outTimeMins = -1.0;

    int srcIdx = getVertexIndex(src);
    int destIdx = getVertexIndex(dest);

    if (srcIdx == -1 || destIdx == -1) {
        return false;
    }

    int n = static_cast<int>(vertices.size());
    std::vector<double> time(n, std::numeric_limits<double>::infinity());
    std::vector<int> parent(n, -1);
    std::vector<bool> visited(n, false);

    typedef std::pair<double, int> TimeNodePair;
    std::priority_queue<TimeNodePair, std::vector<TimeNodePair>, std::greater<TimeNodePair>> pq;

    time[srcIdx] = 0.0;
    pq.push(std::make_pair(0.0, srcIdx));

    while (!pq.empty()) {
        TimeNodePair top = pq.top();
        pq.pop();

        int u = top.second;

        if (visited[u]) continue;
        visited[u] = true;

        if (u == destIdx) break;

        for (size_t i = 0; i < adjList[u].size(); ++i) {
            const GraphEdge& edge = adjList[u][i];
            int v = edge.destIndex;
            double weight = edge.travelTimeMins;

            if (!visited[v] && time[u] + weight < time[v]) {
                time[v] = time[u] + weight;
                parent[v] = u;
                pq.push(std::make_pair(time[v], v));
            }
        }
    }

    if (time[destIdx] == std::numeric_limits<double>::infinity()) {
        return false;
    }

    outTimeMins = time[destIdx];

    int curr = destIdx;
    while (curr != -1) {
        outPath.push_back(vertices[curr].name);
        curr = parent[curr];
    }
    std::reverse(outPath.begin(), outPath.end());
    return true;
}

std::vector<std::string> Graph::bfs(const std::string& startName) const {
    std::vector<std::string> result;
    int startIdx = getVertexIndex(startName);
    if (startIdx == -1) return result;

    int n = static_cast<int>(vertices.size());
    std::vector<bool> visited(n, false);
    std::queue<int> q;

    visited[startIdx] = true;
    q.push(startIdx);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(vertices[u].name);

        for (size_t i = 0; i < adjList[u].size(); ++i) {
            int v = adjList[u][i].destIndex;
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    return result;
}

bool Graph::bfsShortestHops(const std::string& src, const std::string& dest, int& outHops, std::vector<std::string>& outPath) const {
    outPath.clear();
    outHops = -1;

    int srcIdx = getVertexIndex(src);
    int destIdx = getVertexIndex(dest);

    if (srcIdx == -1 || destIdx == -1) return false;

    int n = static_cast<int>(vertices.size());
    std::vector<bool> visited(n, false);
    std::vector<int> parent(n, -1);
    std::vector<int> hops(n, -1);
    std::queue<int> q;

    visited[srcIdx] = true;
    hops[srcIdx] = 0;
    q.push(srcIdx);

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        if (u == destIdx) break;

        for (size_t i = 0; i < adjList[u].size(); ++i) {
            int v = adjList[u][i].destIndex;
            if (!visited[v]) {
                visited[v] = true;
                parent[v] = u;
                hops[v] = hops[u] + 1;
                q.push(v);
            }
        }
    }

    if (!visited[destIdx]) return false;

    outHops = hops[destIdx];
    int curr = destIdx;
    while (curr != -1) {
        outPath.push_back(vertices[curr].name);
        curr = parent[curr];
    }
    std::reverse(outPath.begin(), outPath.end());
    return true;
}

void Graph::dfsHelper(int u, std::vector<bool>& visited, std::vector<std::string>& order) const {
    visited[u] = true;
    order.push_back(vertices[u].name);

    for (size_t i = 0; i < adjList[u].size(); ++i) {
        int v = adjList[u][i].destIndex;
        if (!visited[v]) {
            dfsHelper(v, visited, order);
        }
    }
}

std::vector<std::string> Graph::dfs(const std::string& startName) const {
    std::vector<std::string> result;
    int startIdx = getVertexIndex(startName);
    if (startIdx == -1) return result;

    int n = static_cast<int>(vertices.size());
    std::vector<bool> visited(n, false);
    dfsHelper(startIdx, visited, result);
    return result;
}

bool Graph::isReachable(const std::string& src, const std::string& dest) const {
    int srcIdx = getVertexIndex(src);
    int destIdx = getVertexIndex(dest);
    if (srcIdx == -1 || destIdx == -1) return false;

    int n = static_cast<int>(vertices.size());
    std::vector<bool> visited(n, false);
    std::queue<int> q;

    visited[srcIdx] = true;
    q.push(srcIdx);

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        if (u == destIdx) return true;

        for (size_t i = 0; i < adjList[u].size(); ++i) {
            int v = adjList[u][i].destIndex;
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    return false;
}

void Graph::displayGraph() const {
    std::cout << "================================================================================" << std::endl;
    std::cout << "                 CITY ROAD NETWORK TOPOLOGY (WEIGHTED GRAPH)                   " << std::endl;
    std::cout << "================================================================================" << std::endl;
    std::cout << "Total Locations (Vertices): " << vertices.size()
              << " | Total Road Segments (Directed Edges): " << getEdgeCount() << std::endl << std::endl;

    for (size_t i = 0; i < vertices.size(); ++i) {
        std::cout << "[" << std::setw(2) << i << "] " << vertices[i].name
                  << " (" << vertices[i].type << ")" << std::endl;
        for (size_t j = 0; j < adjList[i].size(); ++j) {
            const GraphEdge& edge = adjList[i][j];
            std::cout << "      --> " << vertices[edge.destIndex].name
                      << " [Distance: " << std::fixed << std::setprecision(1) << edge.distanceKm << " km"
                      << ", Est Time: " << edge.travelTimeMins << " mins]" << std::endl;
        }
        std::cout << std::endl;
    }
}
