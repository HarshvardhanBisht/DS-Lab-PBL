#ifndef LRUCACHE_H
#define LRUCACHE_H

#include <string>
#include <vector>
#include <list>
#include <unordered_map>
#include <utility>

/**
 * LRU Cache (Least Recently Used) Class
 * 
 * TIME COMPLEXITY:
 * - Get: O(1)
 * - Put: O(1)
 * 
 * SPACE COMPLEXITY: O(Capacity)
 * 
 * PURPOSE: Caches location search prefix queries to accelerate repeat searches
 * and provides live hit/miss diagnostics for the examiner visualizer.
 */
class LRUCache {
public:
    struct CacheItem {
        std::string prefix;
        std::vector<std::pair<std::string, std::string>> results;
    };

private:
    size_t capacity;
    std::list<CacheItem> itemsList;
    std::unordered_map<std::string, std::list<CacheItem>::iterator> lookup;
    size_t hits;
    size_t misses;

public:
    LRUCache(size_t cap = 8) : capacity(cap), hits(0), misses(0) {}

    bool get(const std::string& prefix, std::vector<std::pair<std::string, std::string>>& outResults) {
        auto it = lookup.find(prefix);
        if (it == lookup.end()) {
            misses++;
            return false;
        }
        hits++;
        itemsList.splice(itemsList.begin(), itemsList, it->second);
        outResults = it->second->results;
        return true;
    }

    void put(const std::string& prefix, const std::vector<std::pair<std::string, std::string>>& results) {
        auto it = lookup.find(prefix);
        if (it != lookup.end()) {
            it->second->results = results;
            itemsList.splice(itemsList.begin(), itemsList, it->second);
            return;
        }

        if (itemsList.size() >= capacity) {
            std::string oldest = itemsList.back().prefix;
            lookup.erase(oldest);
            itemsList.pop_back();
        }

        itemsList.push_front({prefix, results});
        lookup[prefix] = itemsList.begin();
    }

    size_t getHits() const { return hits; }
    size_t getMisses() const { return misses; }
    double getHitRate() const {
        size_t total = hits + misses;
        return (total == 0) ? 0.0 : (static_cast<double>(hits) / total * 100.0);
    }
    size_t getCapacity() const { return capacity; }
    size_t size() const { return itemsList.size(); }

    std::vector<std::string> getCachedKeys() const {
        std::vector<std::string> keys;
        for (const auto& item : itemsList) {
            keys.push_back(item.prefix);
        }
        return keys;
    }

    void clear() {
        itemsList.clear();
        lookup.clear();
        hits = 0;
        misses = 0;
    }
};

#endif
