#ifndef UNIONFIND_H
#define UNIONFIND_H

#include <vector>
#include <unordered_map>
#include <string>

/**
 * Union-Find (Disjoint Set Union with Path Compression & Union by Rank)
 * 
 * TIME COMPLEXITY:
 * - Find (with path compression): O(alpha(V)) ~ O(1) practically
 * - Union (by rank): O(alpha(V)) ~ O(1) practically
 * - Connected query: O(alpha(V))
 * 
 * SPACE COMPLEXITY: O(V) where V is the number of city locations.
 * 
 * WHY CHOSEN: Dynamically tracks connected road components as roads are blocked
 * by floods, fallen bridges, or landslides, alerting dispatchers if a sector becomes isolated.
 */
class UnionFind {
private:
    std::vector<int> parent;
    std::vector<int> rank;
    int numComponents;

public:
    UnionFind(int n = 0) : numComponents(n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; ++i) {
            parent[i] = i;
        }
    }

    void reset(int n) {
        numComponents = n;
        parent.resize(n);
        rank.assign(n, 0);
        for (int i = 0; i < n; ++i) {
            parent[i] = i;
        }
    }

    int find(int i) {
        if (parent[i] != i) {
            parent[i] = find(parent[i]);
        }
        return parent[i];
    }

    bool unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI == rootJ) return false;

        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
        } else {
            parent[rootJ] = rootI;
            rank[rootI]++;
        }
        numComponents--;
        return true;
    }

    bool connected(int i, int j) {
        return find(i) == find(j);
    }

    int getNumComponents() const {
        return numComponents;
    }

    std::unordered_map<int, std::vector<int>> getComponents(int n) {
        std::unordered_map<int, std::vector<int>> comps;
        for (int i = 0; i < n; ++i) {
            int root = find(i);
            comps[root].push_back(i);
        }
        return comps;
    }
};

#endif
