#ifndef INDEXEDMAXHEAP_H
#define INDEXEDMAXHEAP_H

#include <vector>
#include <string>
#include <unordered_map>
#include <stdexcept>
#include <algorithm>

/**
 * IndexedMaxHeap Class with Dynamic Aging
 * 
 * TIME COMPLEXITY:
 * - Insert (push): O(log N)
 * - Extract Max (popMax): O(log N)
 * - Peek Max: O(1)
 * - Update Key / Priority (updatePriority): O(log N)
 * - Dynamic Aging (ageAll): O(N)
 * 
 * SPACE COMPLEXITY: O(N) for heap array and position lookup table.
 * 
 * PURPOSE: Ensures critical disasters (severity 5) are dispatched first,
 * while preventing starvation of lower-severity incidents via wait-time aging.
 */
struct HeapNode {
    std::string id;
    double priority;
    int originalSeverity;
    int waitMinutes;

    HeapNode(const std::string& id, double p, int sev, int wait = 0)
        : id(id), priority(p), originalSeverity(sev), waitMinutes(wait) {}
};

class IndexedMaxHeap {
private:
    std::vector<HeapNode> heap;
    std::unordered_map<std::string, int> positionMap;

    void swapNodes(int i, int j) {
        std::swap(heap[i], heap[j]);
        positionMap[heap[i].id] = i;
        positionMap[heap[j].id] = j;
    }

    void heapifyUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap[i].priority > heap[parent].priority) {
                swapNodes(i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }

    void heapifyDown(int i) {
        int n = static_cast<int>(heap.size());
        while (true) {
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            int largest = i;

            if (left < n && heap[left].priority > heap[largest].priority) {
                largest = left;
            }
            if (right < n && heap[right].priority > heap[largest].priority) {
                largest = right;
            }

            if (largest != i) {
                swapNodes(i, largest);
                i = largest;
            } else {
                break;
            }
        }
    }

public:
    IndexedMaxHeap() {}

    bool empty() const { return heap.empty(); }
    size_t size() const { return heap.size(); }

    bool contains(const std::string& id) const {
        return positionMap.find(id) != positionMap.end();
    }

    void push(const std::string& id, double priority, int originalSeverity, int waitMinutes = 0) {
        if (contains(id)) {
            updatePriority(id, priority);
            return;
        }
        int idx = static_cast<int>(heap.size());
        heap.emplace_back(id, priority, originalSeverity, waitMinutes);
        positionMap[id] = idx;
        heapifyUp(idx);
    }

    HeapNode popMax() {
        if (heap.empty()) {
            throw std::underflow_error("IndexedMaxHeap is empty");
        }
        HeapNode root = heap[0];
        positionMap.erase(root.id);

        if (heap.size() > 1) {
            heap[0] = heap.back();
            positionMap[heap[0].id] = 0;
            heap.pop_back();
            heapifyDown(0);
        } else {
            heap.pop_back();
        }
        return root;
    }

    HeapNode peekMax() const {
        if (heap.empty()) {
            throw std::underflow_error("IndexedMaxHeap is empty");
        }
        return heap[0];
    }

    bool updatePriority(const std::string& id, double newPriority) {
        auto it = positionMap.find(id);
        if (it == positionMap.end()) return false;
        int idx = it->second;
        double oldPriority = heap[idx].priority;
        heap[idx].priority = newPriority;

        if (newPriority > oldPriority) {
            heapifyUp(idx);
        } else if (newPriority < oldPriority) {
            heapifyDown(idx);
        }
        return true;
    }

    void ageAll(double agingFactor = 1.5, int deltaMinutes = 1) {
        for (size_t i = 0; i < heap.size(); ++i) {
            heap[i].waitMinutes += deltaMinutes;
            heap[i].priority = static_cast<double>(heap[i].originalSeverity) * 100.0 +
                               static_cast<double>(heap[i].waitMinutes) * agingFactor;
        }
        for (int i = static_cast<int>(heap.size() / 2) - 1; i >= 0; --i) {
            heapifyDown(i);
        }
    }

    const std::vector<HeapNode>& getRawHeap() const {
        return heap;
    }

    void clear() {
        heap.clear();
        positionMap.clear();
    }
};

#endif
