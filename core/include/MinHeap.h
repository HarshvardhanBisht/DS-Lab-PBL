#ifndef MINHEAP_H
#define MINHEAP_H

#include <vector>
#include <string>
#include <stdexcept>
#include <utility>

/**
 * MinHeap Class for Workload-Balanced Rescue Team Dispatch
 * 
 * TIME COMPLEXITY:
 * - Insert (push): O(log K)
 * - Extract Minimum Workload (popMin): O(log K)
 * - Peek Minimum (peekMin): O(1)
 * - Heapify / Rebuild: O(K)
 * 
 * SPACE COMPLEXITY: O(K) where K is number of active rescue teams.
 * 
 * WHY CHOSEN: Selects the least-loaded team (fewest active emergency missions)
 * in O(log K) to balance dispatch load across response squads.
 */
struct TeamWorkloadItem {
    std::string teamId;
    int activeMissions;

    TeamWorkloadItem(const std::string& id, int missions)
        : teamId(id), activeMissions(missions) {}

    bool operator<(const TeamWorkloadItem& o) const {
        if (activeMissions != o.activeMissions) return activeMissions < o.activeMissions;
        return teamId < o.teamId;
    }
};

class MinHeap {
private:
    std::vector<TeamWorkloadItem> data;

    void heapifyUp(int idx) {
        while (idx > 0) {
            int p = (idx - 1) / 2;
            if (data[idx] < data[p]) {
                std::swap(data[idx], data[p]);
                idx = p;
            } else {
                break;
            }
        }
    }

    void heapifyDown(int idx) {
        int n = static_cast<int>(data.size());
        while (true) {
            int left = 2 * idx + 1;
            int right = 2 * idx + 2;
            int smallest = idx;

            if (left < n && data[left] < data[smallest]) smallest = left;
            if (right < n && data[right] < data[smallest]) smallest = right;

            if (smallest != idx) {
                std::swap(data[idx], data[smallest]);
                idx = smallest;
            } else {
                break;
            }
        }
    }

public:
    MinHeap() {}

    bool empty() const { return data.empty(); }
    size_t size() const { return data.size(); }

    void push(const std::string& teamId, int activeMissions) {
        data.emplace_back(teamId, activeMissions);
        heapifyUp(static_cast<int>(data.size()) - 1);
    }

    TeamWorkloadItem popMin() {
        if (data.empty()) throw std::underflow_error("MinHeap is empty");
        TeamWorkloadItem root = data[0];
        data[0] = data.back();
        data.pop_back();
        if (!data.empty()) heapifyDown(0);
        return root;
    }

    TeamWorkloadItem peekMin() const {
        if (data.empty()) throw std::underflow_error("MinHeap is empty");
        return data[0];
    }

    void rebuild(const std::vector<std::pair<std::string, int>>& teams) {
        data.clear();
        for (const auto& t : teams) {
            data.emplace_back(t.first, t.second);
        }
        for (int i = static_cast<int>(data.size() / 2) - 1; i >= 0; --i) {
            heapifyDown(i);
        }
    }

    const std::vector<TeamWorkloadItem>& getItems() const {
        return data;
    }

    void clear() { data.clear(); }
};

#endif
