#ifndef FENWICKTREE_H
#define FENWICKTREE_H

#include <vector>

/**
 * Fenwick Tree (Binary Indexed Tree)
 * 
 * TIME COMPLEXITY:
 * - Point Update (add): O(log N)
 * - Prefix Sum Query: O(log N)
 * - Range Query [L, R]: O(log N)
 * - Tree Initialization: O(N log N)
 * 
 * SPACE COMPLEXITY: O(N)
 * 
 * WHY CHOSEN: Enables sub-millisecond range queries over temporal disaster analytics
 * (e.g., total rescued people or resources expended between Day X and Day Y).
 */
class FenwickTree {
private:
    int n;
    std::vector<long long> tree;

public:
    FenwickTree(int size = 0) : n(size), tree(size + 1, 0) {}

    void resize(int size) {
        n = size;
        tree.assign(size + 1, 0);
    }

    void add(int index, long long delta) {
        for (int i = index; i <= n; i += (i & -i)) {
            tree[i] += delta;
        }
    }

    long long queryPrefix(int index) const {
        if (index > n) index = n;
        long long sum = 0;
        for (int i = index; i > 0; i -= (i & -i)) {
            sum += tree[i];
        }
        return sum;
    }

    long long queryRange(int l, int r) const {
        if (l > r || l < 1) return 0;
        return queryPrefix(r) - queryPrefix(l - 1);
    }

    int size() const { return n; }
};

#endif
