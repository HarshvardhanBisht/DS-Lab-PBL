#ifndef HASHMAP_H
#define HASHMAP_H

#include <string>
#include <vector>
#include <cstddef>

template <typename K>
struct HashFunction {
    size_t operator()(const K& key, size_t tableSize) const {
        return static_cast<size_t>(key) % tableSize;
    }
};

template <>
struct HashFunction<std::string> {
    size_t operator()(const std::string& key, size_t tableSize) const {
        size_t hashVal = 5381;
        for (char c : key) {
            hashVal = ((hashVal << 5) + hashVal) + static_cast<unsigned char>(c);
        }
        return hashVal % tableSize;
    }
};

template <typename K, typename V, typename Hash = HashFunction<K>>
class HashMap {
private:
    struct HashNode {
        K key;
        V value;
        HashNode* next;
        HashNode(const K& k, const V& v) : key(k), value(v), next(nullptr) {}
    };

    HashNode** table;
    size_t capacity;
    size_t elementCount;
    Hash hashFunc;

    void rehash(size_t newCapacity) {
        HashNode** newTable = new HashNode*[newCapacity];
        for (size_t i = 0; i < newCapacity; ++i) {
            newTable[i] = nullptr;
        }

        for (size_t i = 0; i < capacity; ++i) {
            HashNode* curr = table[i];
            while (curr != nullptr) {
                HashNode* nextNode = curr->next;
                size_t newIndex = hashFunc(curr->key, newCapacity);

                curr->next = newTable[newIndex];
                newTable[newIndex] = curr;

                curr = nextNode;
            }
        }

        delete[] table;
        table = newTable;
        capacity = newCapacity;
    }

public:
    HashMap(size_t initialCapacity = 31)
        : capacity(initialCapacity), elementCount(0) {
        table = new HashNode*[capacity];
        for (size_t i = 0; i < capacity; ++i) {
            table[i] = nullptr;
        }
    }

    ~HashMap() {
        clear();
        delete[] table;
    }

    HashMap(const HashMap& other) : capacity(other.capacity), elementCount(0) {
        table = new HashNode*[capacity];
        for (size_t i = 0; i < capacity; ++i) {
            table[i] = nullptr;
        }
        for (size_t i = 0; i < other.capacity; ++i) {
            HashNode* curr = other.table[i];
            while (curr != nullptr) {
                insert(curr->key, curr->value);
                curr = curr->next;
            }
        }
    }

    HashMap& operator=(const HashMap& other) {
        if (this != &other) {
            clear();
            delete[] table;

            capacity = other.capacity;
            elementCount = 0;
            table = new HashNode*[capacity];
            for (size_t i = 0; i < capacity; ++i) {
                table[i] = nullptr;
            }

            for (size_t i = 0; i < other.capacity; ++i) {
                HashNode* curr = other.table[i];
                while (curr != nullptr) {
                    insert(curr->key, curr->value);
                    curr = curr->next;
                }
            }
        }
        return *this;
    }

    void insert(const K& key, const V& value) {
        if (static_cast<double>(elementCount + 1) / capacity > 0.75) {
            rehash(capacity * 2 + 1);
        }

        size_t index = hashFunc(key, capacity);
        HashNode* curr = table[index];

        while (curr != nullptr) {
            if (curr->key == key) {
                curr->value = value;
                return;
            }
            curr = curr->next;
        }

        HashNode* newNode = new HashNode(key, value);
        newNode->next = table[index];
        table[index] = newNode;
        elementCount++;
    }

    bool get(const K& key, V& outValue) const {
        size_t index = hashFunc(key, capacity);
        HashNode* curr = table[index];

        while (curr != nullptr) {
            if (curr->key == key) {
                outValue = curr->value;
                return true;
            }
            curr = curr->next;
        }
        return false;
    }

    V* find(const K& key) {
        size_t index = hashFunc(key, capacity);
        HashNode* curr = table[index];

        while (curr != nullptr) {
            if (curr->key == key) {
                return &(curr->value);
            }
            curr = curr->next;
        }
        return nullptr;
    }

    const V* find(const K& key) const {
        size_t index = hashFunc(key, capacity);
        HashNode* curr = table[index];

        while (curr != nullptr) {
            if (curr->key == key) {
                return &(curr->value);
            }
            curr = curr->next;
        }
        return nullptr;
    }

    bool contains(const K& key) const {
        size_t index = hashFunc(key, capacity);
        HashNode* curr = table[index];

        while (curr != nullptr) {
            if (curr->key == key) {
                return true;
            }
            curr = curr->next;
        }
        return false;
    }

    bool remove(const K& key) {
        size_t index = hashFunc(key, capacity);
        HashNode* curr = table[index];
        HashNode* prev = nullptr;

        while (curr != nullptr) {
            if (curr->key == key) {
                if (prev == nullptr) {
                    table[index] = curr->next;
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

    size_t size() const {
        return elementCount;
    }

    bool empty() const {
        return elementCount == 0;
    }

    void clear() {
        for (size_t i = 0; i < capacity; ++i) {
            HashNode* curr = table[i];
            while (curr != nullptr) {
                HashNode* nextNode = curr->next;
                delete curr;
                curr = nextNode;
            }
            table[i] = nullptr;
        }
        elementCount = 0;
    }

    std::vector<K> getAllKeys() const {
        std::vector<K> keys;
        keys.reserve(elementCount);
        for (size_t i = 0; i < capacity; ++i) {
            HashNode* curr = table[i];
            while (curr != nullptr) {
                keys.push_back(curr->key);
                curr = curr->next;
            }
        }
        return keys;
    }

    std::vector<V> getAllValues() const {
        std::vector<V> values;
        values.reserve(elementCount);
        for (size_t i = 0; i < capacity; ++i) {
            HashNode* curr = table[i];
            while (curr != nullptr) {
                values.push_back(curr->value);
                curr = curr->next;
            }
        }
        return values;
    }
};

#endif
