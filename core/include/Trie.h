#ifndef TRIE_H
#define TRIE_H

#include <string>
#include <vector>
#include <map>
#include <cctype>
#include <utility>

/**
 * Trie (Prefix Tree) Class
 * 
 * TIME COMPLEXITY:
 * - Insert: O(M) where M is length of location string
 * - Search exact: O(M)
 * - Autocomplete prefix query: O(P + K) where P is prefix length and K is total descendant characters
 * 
 * SPACE COMPLEXITY: O(ALPHABET_SIZE * N * M) where N is number of stored location names.
 * 
 * WHY CHOSEN: Enables instantaneous keystroke autocomplete for emergency call-takers
 * searching for city landmarks, hospitals, and relief shelters.
 */
class Trie {
public:
    struct TrieNode {
        bool isEndOfWord;
        std::string canonicalName;
        std::string locationType;
        std::map<char, TrieNode*> children;

        TrieNode() : isEndOfWord(false), canonicalName(""), locationType("") {}
        ~TrieNode() {
            for (auto& pair : children) {
                delete pair.second;
            }
            children.clear();
        }
    };

private:
    TrieNode* root;

    std::string toLower(const std::string& str) const {
        std::string s = str;
        for (char& c : s) {
            c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
        }
        return s;
    }

    void collectWords(TrieNode* node, std::vector<std::pair<std::string, std::string>>& results, size_t limit) const {
        if (!node || results.size() >= limit) return;
        if (node->isEndOfWord) {
            results.push_back({node->canonicalName, node->locationType});
            if (results.size() >= limit) return;
        }
        for (auto& pair : node->children) {
            collectWords(pair.second, results, limit);
            if (results.size() >= limit) return;
        }
    }

public:
    Trie() { root = new TrieNode(); }
    ~Trie() { delete root; }

    void insert(const std::string& name, const std::string& type) {
        if (name.empty()) return;
        TrieNode* curr = root;
        std::string lower = toLower(name);
        for (char c : lower) {
            if (curr->children.find(c) == curr->children.end()) {
                curr->children[c] = new TrieNode();
            }
            curr = curr->children[c];
        }
        curr->isEndOfWord = true;
        curr->canonicalName = name;
        curr->locationType = type;
    }

    std::vector<std::pair<std::string, std::string>> autocomplete(const std::string& prefix, size_t limit = 10) const {
        std::vector<std::pair<std::string, std::string>> results;
        if (prefix.empty()) return results;
        TrieNode* curr = root;
        std::string lower = toLower(prefix);
        for (char c : lower) {
            if (curr->children.find(c) == curr->children.end()) {
                return results;
            }
            curr = curr->children[c];
        }
        collectWords(curr, results, limit);
        return results;
    }

    void clear() {
        delete root;
        root = new TrieNode();
    }
};

#endif
