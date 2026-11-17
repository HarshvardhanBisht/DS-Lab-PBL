#ifndef DOUBLYLINKEDLIST_H
#define DOUBLYLINKEDLIST_H

#include <vector>
#include <stdexcept>

/**
 * DoublyLinkedList Template Class
 * 
 * TIME COMPLEXITY:
 * - Insert at Tail (insertTail): O(1)
 * - Insert at Head (insertHead): O(1)
 * - Delete at Tail (removeTail): O(1)
 * - Traversal / ToVector: O(N)
 * 
 * SPACE COMPLEXITY: O(N) where N is number of stored nodes.
 * 
 * WHY CHOSEN: Dynamic constant-time O(1) appending of emergency mission logs
 * without fixed-size pre-allocation, supporting bidirectional audit trails.
 */
template <typename T>
class DoublyLinkedList {
private:
    struct Node {
        T data;
        Node* prev;
        Node* next;
        Node(const T& val) : data(val), prev(nullptr), next(nullptr) {}
    };

    Node* head;
    Node* tail;
    size_t count;

public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), count(0) {}

    ~DoublyLinkedList() {
        clear();
    }

    DoublyLinkedList(const DoublyLinkedList& o) : head(nullptr), tail(nullptr), count(0) {
        Node* curr = o.head;
        while (curr) {
            insertTail(curr->data);
            curr = curr->next;
        }
    }

    DoublyLinkedList& operator=(const DoublyLinkedList& o) {
        if (this != &o) {
            clear();
            Node* curr = o.head;
            while (curr) {
                insertTail(curr->data);
                curr = curr->next;
            }
        }
        return *this;
    }

    void insertTail(const T& val) {
        Node* n = new Node(val);
        if (!tail) {
            head = tail = n;
        } else {
            tail->next = n;
            n->prev = tail;
            tail = n;
        }
        count++;
    }

    void insertHead(const T& val) {
        Node* n = new Node(val);
        if (!head) {
            head = tail = n;
        } else {
            n->next = head;
            head->prev = n;
            head = n;
        }
        count++;
    }

    bool removeTail(T& outVal) {
        if (!tail) return false;
        outVal = tail->data;
        Node* prevNode = tail->prev;
        delete tail;
        tail = prevNode;
        if (tail) tail->next = nullptr;
        else head = nullptr;
        count--;
        return true;
    }

    size_t size() const { return count; }
    bool empty() const { return count == 0; }

    void clear() {
        Node* curr = head;
        while (curr) {
            Node* nxt = curr->next;
            delete curr;
            curr = nxt;
        }
        head = tail = nullptr;
        count = 0;
    }

    std::vector<T> toVector() const {
        std::vector<T> vec;
        vec.reserve(count);
        Node* curr = head;
        while (curr) {
            vec.push_back(curr->data);
            curr = curr->next;
        }
        return vec;
    }
};

#endif
