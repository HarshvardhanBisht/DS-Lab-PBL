#ifndef TRIE_H
#define TRIE_H

#include <string>
#include <vector>
#include <map>
#include <cctype>

class Trie {
private:
    struct TrieNode {
        bool isEndOfWord;
        std::string locationType;
        std::string canonicalName;
        std::map<char, TrieNode*> children;

        TrieNode() : isEndOfWord(false), locationType(""), canonicalName("") {}

        ~TrieNode() {
            for (auto it = children.begin(); it != children.end(); ++it) {
                delete it->second;
            }
            children.clear();
        }
    };

    TrieNode* root;

    std::string toLower(const std::string& str) const {
        std::string res = str;
        for (size_t i = 0; i < res.length(); ++i) {
            res[i] = static_cast<char>(std::tolower(static_cast<unsigned char>(res[i])));
        }
        return res;
    }

    void collectAllWords(TrieNode* node, std::vector<std::pair<std::string, std::string>>& results, int limit) const {
        if (node == nullptr || static_cast<int>(results.size()) >= limit) {
            return;
        }

        if (node->isEndOfWord) {
            results.push_back(std::make_pair(node->canonicalName, node->locationType));
            if (static_cast<int>(results.size()) >= limit) {
                return;
            }
        }

        for (auto it = node->children.begin(); it != node->children.end(); ++it) {
            collectAllWords(it->second, results, limit);
            if (static_cast<int>(results.size()) >= limit) {
                return;
            }
        }
    }

public:
    Trie() {
        root = new TrieNode();
    }

    ~Trie() {
        delete root;
    }

    void insert(const std::string& locationName, const std::string& locationType = "") {
        if (locationName.empty()) return;
        TrieNode* curr = root;
        std::string lowerKey = toLower(locationName);

        for (char c : lowerKey) {
            if (curr->children.find(c) == curr->children.end()) {
                curr->children[c] = new TrieNode();
            }
            curr = curr->children[c];
        }

        curr->isEndOfWord = true;
        curr->locationType = locationType;
        curr->canonicalName = locationName;
    }

    bool search(const std::string& locationName) const {
        if (locationName.empty()) return false;
        TrieNode* curr = root;
        std::string lowerKey = toLower(locationName);

        for (char c : lowerKey) {
            if (curr->children.find(c) == curr->children.end()) {
                return false;
            }
            curr = curr->children[c];
        }

        return curr->isEndOfWord;
    }

    bool startsWith(const std::string& prefix) const {
        if (prefix.empty()) return true;
        TrieNode* curr = root;
        std::string lowerPrefix = toLower(prefix);

        for (char c : lowerPrefix) {
            if (curr->children.find(c) == curr->children.end()) {
                return false;
            }
            curr = curr->children[c];
        }

        return true;
    }

    std::vector<std::pair<std::string, std::string>> autocomplete(const std::string& prefix, int limit = 10) const {
        std::vector<std::pair<std::string, std::string>> results;
        TrieNode* curr = root;
        std::string lowerPrefix = toLower(prefix);

        for (char c : lowerPrefix) {
            if (curr->children.find(c) == curr->children.end()) {
                return results;
            }
            curr = curr->children[c];
        }

        collectAllWords(curr, results, limit);
        return results;
    }

    void clear() {
        delete root;
        root = new TrieNode();
    }
};

#endif
