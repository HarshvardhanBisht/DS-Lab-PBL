#ifndef HEAP_H
#define HEAP_H

#include <vector>
#include <stdexcept>
#include <utility>
#include "Queue.h"
#include "Incident.h"

template <typename T, typename Comparator>
class BinaryHeap {
private:
    std::vector<T> data;
    Comparator comp;

    void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;
            if (comp(data[index], data[parent])) {
                std::swap(data[index], data[parent]);
                index = parent;
            } else {
                break;
            }
        }
    }

    void heapifyDown(int index) {
        int n = static_cast<int>(data.size());
        while (true) {
            int left = 2 * index + 1;
            int right = 2 * index + 2;
            int best = index;

            if (left < n && comp(data[left], data[best])) {
                best = left;
            }
            if (right < n && comp(data[right], data[best])) {
                best = right;
            }

            if (best != index) {
                std::swap(data[index], data[best]);
                index = best;
            } else {
                break;
            }
        }
    }

public:
    BinaryHeap(Comparator c = Comparator()) : comp(c) {}

    void push(const T& val) {
        data.push_back(val);
        heapifyUp(static_cast<int>(data.size()) - 1);
    }

    T pop() {
        if (data.empty()) {
            throw std::underflow_error("Heap is empty");
        }
        T root = data[0];
        data[0] = data.back();
        data.pop_back();
        if (!data.empty()) {
            heapifyDown(0);
        }
        return root;
    }

    const T& top() const {
        if (data.empty()) {
            throw std::underflow_error("Heap is empty");
        }
        return data[0];
    }

    bool empty() const {
        return data.empty();
    }

    size_t size() const {
        return data.size();
    }

    void clear() {
        data.clear();
    }
};

template <typename T>
struct MinComparator {
    bool operator()(const T& a, const T& b) const {
        return a < b;
    }
};

template <typename T>
struct MaxComparator {
    bool operator()(const T& a, const T& b) const {
        return a > b;
    }
};

template <typename T>
using MinHeap = BinaryHeap<T, MinComparator<T>>;

template <typename T>
using MaxHeap = BinaryHeap<T, MaxComparator<T>>;

class IncidentPriorityQueue {
private:
    Queue<Incident*> buckets[5];
    int totalCount;

public:
    IncidentPriorityQueue() : totalCount(0) {}

    void enqueue(Incident* incident) {
        if (incident == nullptr) return;
        int sev = incident->getSeverity();
        if (sev < 1) sev = 1;
        if (sev > 5) sev = 5;
        buckets[sev - 1].enqueue(incident);
        totalCount++;
    }

    Incident* dequeue() {
        if (isEmpty()) {
            throw std::underflow_error("Incident priority queue is empty");
        }
        for (int i = 4; i >= 0; --i) {
            if (!buckets[i].isEmpty()) {
                Incident* inc = buckets[i].dequeue();
                totalCount--;
                return inc;
            }
        }
        return nullptr;
    }

    Incident* peek() const {
        if (isEmpty()) {
            throw std::underflow_error("Incident priority queue is empty");
        }
        for (int i = 4; i >= 0; --i) {
            if (!buckets[i].isEmpty()) {
                return buckets[i].front();
            }
        }
        return nullptr;
    }

    bool isEmpty() const {
        return totalCount == 0;
    }

    int size() const {
        return totalCount;
    }

    void clear() {
        for (int i = 0; i < 5; ++i) {
            buckets[i].clear();
        }
        totalCount = 0;
    }
};

struct TeamLoad {
    std::string teamId;
    int activeMissions;

    TeamLoad() : teamId(""), activeMissions(0) {}
    TeamLoad(const std::string& id, int missions) : teamId(id), activeMissions(missions) {}

    bool operator<(const TeamLoad& other) const {
        if (activeMissions != other.activeMissions) {
            return activeMissions < other.activeMissions;
        }
        return teamId < other.teamId;
    }

    bool operator>(const TeamLoad& other) const {
        if (activeMissions != other.activeMissions) {
            return activeMissions > other.activeMissions;
        }
        return teamId > other.teamId;
    }
};

class TeamWorkloadHeap {
private:
    MinHeap<TeamLoad> heap;

public:
    TeamWorkloadHeap() {}

    void insert(const std::string& teamId, int activeMissions) {
        heap.push(TeamLoad(teamId, activeMissions));
    }

    TeamLoad extractMin() {
        return heap.pop();
    }

    TeamLoad peekMin() const {
        return heap.top();
    }

    bool empty() const {
        return heap.empty();
    }

    size_t size() const {
        return heap.size();
    }

    void clear() {
        heap.clear();
    }

    void rebuild(const std::vector<std::pair<std::string, int>>& teamLoads) {
        heap.clear();
        for (size_t i = 0; i < teamLoads.size(); ++i) {
            heap.push(TeamLoad(teamLoads[i].first, teamLoads[i].second));
        }
    }
};

#endif
