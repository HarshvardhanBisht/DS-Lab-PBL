#ifndef CUSTOMHASHTABLE_H
#define CUSTOMHASHTABLE_H

#include <string>
#include <vector>
#include <cstddef>
#include <algorithm>

/**
 * CustomHashTable Class (Separate Chaining with Dynamic Rehashing)
 * 
 * TIME COMPLEXITY:
 * - Insert: O(1) average, O(N) worst-case (collisions)
 * - Lookup (find / get): O(1) average, O(N) worst-case
 * - Remove: O(1) average, O(N) worst-case
 * - Rehashing: O(N) amortized
 * 
 * SPACE COMPLEXITY: O(N + B) where N is items and B is bucket array capacity.
 * 
 * WHY CHOSEN: Guarantees constant-time O(1) direct access to incidents,
 * rescue teams, and shelters by unique alphanumeric ID (e.g., "INC-101").
 */
template <typename V>
class CustomHashTable {
public:
    struct HashEntry {
        std::string key;
        V value;
        HashEntry* next;
        HashEntry(const std::string& k, const V& v) : key(k), value(v), next(nullptr) {}
    };

    struct Diagnostics {
        size_t capacity;
        size_t size;
        double loadFactor;
        size_t collisions;
        size_t maxChainLength;
        std::vector<size_t> chainLengths;
    };

private:
    HashEntry** buckets;
    size_t capacity;
    size_t elementCount;
    double maxLoadFactor;

    size_t hashFunction(const std::string& key) const {
        size_t hashVal = 5381;
        for (char c : key) {
            hashVal = ((hashVal << 5) + hashVal) + static_cast<unsigned char>(c);
        }
        return hashVal % capacity;
    }

    void rehash(size_t newCapacity) {
        HashEntry** newBuckets = new HashEntry*[newCapacity];
        for (size_t i = 0; i < newCapacity; ++i) {
            newBuckets[i] = nullptr;
        }

        for (size_t i = 0; i < capacity; ++i) {
            HashEntry* curr = buckets[i];
            while (curr != nullptr) {
                HashEntry* nextNode = curr->next;
                size_t newIdx = 5381;
                for (char c : curr->key) {
                    newIdx = ((newIdx << 5) + newIdx) + static_cast<unsigned char>(c);
                }
                newIdx %= newCapacity;

                curr->next = newBuckets[newIdx];
                newBuckets[newIdx] = curr;
                curr = nextNode;
            }
        }

        delete[] buckets;
        buckets = newBuckets;
        capacity = newCapacity;
    }

public:
    CustomHashTable(size_t initialCapacity = 23, double loadFactor = 0.75)
        : capacity(initialCapacity), elementCount(0), maxLoadFactor(loadFactor) {
        buckets = new HashEntry*[capacity];
        for (size_t i = 0; i < capacity; ++i) {
            buckets[i] = nullptr;
        }
    }

    ~CustomHashTable() {
        clear();
        delete[] buckets;
    }

    void insert(const std::string& key, const V& value) {
        if (static_cast<double>(elementCount + 1) / capacity > maxLoadFactor) {
            rehash(capacity * 2 + 1);
        }

        size_t idx = hashFunction(key);
        HashEntry* curr = buckets[idx];

        while (curr != nullptr) {
            if (curr->key == key) {
                curr->value = value;
                return;
            }
            curr = curr->next;
        }

        HashEntry* newNode = new HashEntry(key, value);
        newNode->next = buckets[idx];
        buckets[idx] = newNode;
        elementCount++;
    }

    bool get(const std::string& key, V& outValue) const {
        size_t idx = hashFunction(key);
        HashEntry* curr = buckets[idx];
        while (curr != nullptr) {
            if (curr->key == key) {
                outValue = curr->value;
                return true;
            }
            curr = curr->next;
        }
        return false;
    }

    V* find(const std::string& key) {
        size_t idx = hashFunction(key);
        HashEntry* curr = buckets[idx];
        while (curr != nullptr) {
            if (curr->key == key) {
                return &(curr->value);
            }
            curr = curr->next;
        }
        return nullptr;
    }

    bool contains(const std::string& key) const {
        size_t idx = hashFunction(key);
        HashEntry* curr = buckets[idx];
        while (curr != nullptr) {
            if (curr->key == key) return true;
            curr = curr->next;
        }
        return false;
    }

    bool remove(const std::string& key) {
        size_t idx = hashFunction(key);
        HashEntry* curr = buckets[idx];
        HashEntry* prev = nullptr;

        while (curr != nullptr) {
            if (curr->key == key) {
                if (prev == nullptr) {
                    buckets[idx] = curr->next;
                } else {
                    prev->next = curr->next;
                }
                delete curr;
                elementCount--;
                return true;
            }
            prev = curr;
            curr = curr->next;
        }
        return false;
    }

    size_t size() const { return elementCount; }
    size_t getCapacity() const { return capacity; }
    bool empty() const { return elementCount == 0; }

    void clear() {
        for (size_t i = 0; i < capacity; ++i) {
            HashEntry* curr = buckets[i];
            while (curr != nullptr) {
                HashEntry* nxt = curr->next;
                delete curr;
                curr = nxt;
            }
            buckets[i] = nullptr;
        }
        elementCount = 0;
    }

    std::vector<std::string> getAllKeys() const {
        std::vector<std::string> keys;
        keys.reserve(elementCount);
        for (size_t i = 0; i < capacity; ++i) {
            HashEntry* curr = buckets[i];
            while (curr != nullptr) {
                keys.push_back(curr->key);
                curr = curr->next;
            }
        }
        return keys;
    }

    std::vector<V> getAllValues() const {
        std::vector<V> vals;
        vals.reserve(elementCount);
        for (size_t i = 0; i < capacity; ++i) {
            HashEntry* curr = buckets[i];
            while (curr != nullptr) {
                vals.push_back(curr->value);
                curr = curr->next;
            }
        }
        return vals;
    }

    Diagnostics getDiagnostics() const {
        Diagnostics diag;
        diag.capacity = capacity;
        diag.size = elementCount;
        diag.loadFactor = static_cast<double>(elementCount) / capacity;
        diag.collisions = 0;
        diag.maxChainLength = 0;
        diag.chainLengths.resize(capacity, 0);

        for (size_t i = 0; i < capacity; ++i) {
            size_t len = 0;
            HashEntry* curr = buckets[i];
            while (curr != nullptr) {
                len++;
                curr = curr->next;
            }
            diag.chainLengths[i] = len;
            if (len > 1) {
                diag.collisions += (len - 1);
            }
            if (len > diag.maxChainLength) {
                diag.maxChainLength = len;
            }
        }
        return diag;
    }

    std::vector<std::vector<std::string>> getBucketChains() const {
        std::vector<std::vector<std::string>> chains(capacity);
        for (size_t i = 0; i < capacity; ++i) {
            HashEntry* curr = buckets[i];
            while (curr != nullptr) {
                chains[i].push_back(curr->key);
                curr = curr->next;
            }
        }
        return chains;
    }

    void rehashManual() {
        rehash(capacity * 2 + 1);
    }
};

#endif
