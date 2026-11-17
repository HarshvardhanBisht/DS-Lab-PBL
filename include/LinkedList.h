#ifndef LINKEDLIST_H
#define LINKEDLIST_H

#include <vector>
#include <stdexcept>

template <typename T>
class LinkedList {
private:
    struct Node {
        T data;
        Node* prev;
        Node* next;
        Node(const T& val) : data(val), prev(nullptr), next(nullptr) {}
    };

    Node* head;
    Node* tail;
    int count;

public:
    LinkedList() : head(nullptr), tail(nullptr), count(0) {}

    ~LinkedList() {
        clear();
    }

    LinkedList(const LinkedList& other) : head(nullptr), tail(nullptr), count(0) {
        Node* curr = other.head;
        while (curr != nullptr) {
            insertTail(curr->data);
            curr = curr->next;
        }
    }

    LinkedList& operator=(const LinkedList& other) {
        if (this != &other) {
            clear();
            Node* curr = other.head;
            while (curr != nullptr) {
                insertTail(curr->data);
                curr = curr->next;
            }
        }
        return *this;
    }

    void insertTail(const T& val) {
        Node* newNode = new Node(val);
        if (tail == nullptr) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
        count++;
    }

    void insertHead(const T& val) {
        Node* newNode = new Node(val);
        if (head == nullptr) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }
        count++;
    }

    bool remove(const T& val) {
        Node* curr = head;
        while (curr != nullptr) {
            if (curr->data == val) {
                if (curr->prev != nullptr) {
                    curr->prev->next = curr->next;
                } else {
                    head = curr->next;
                }

                if (curr->next != nullptr) {
                    curr->next->prev = curr->prev;
                } else {
                    tail = curr->prev;
                }

                delete curr;
                count--;
                return true;
            }
            curr = curr->next;
        }
        return false;
    }

    T get(int index) const {
        if (index < 0 || index >= count) {
            throw std::out_of_range("Index out of range in LinkedList");
        }
        Node* curr = head;
        for (int i = 0; i < index; ++i) {
            curr = curr->next;
        }
        return curr->data;
    }

    int size() const {
        return count;
    }

    bool isEmpty() const {
        return count == 0;
    }

    void clear() {
        Node* curr = head;
        while (curr != nullptr) {
            Node* nxt = curr->next;
            delete curr;
            curr = nxt;
        }
        head = nullptr;
        tail = nullptr;
        count = 0;
    }

    std::vector<T> toVector() const {
        std::vector<T> vec;
        vec.reserve(count);
        Node* curr = head;
        while (curr != nullptr) {
            vec.push_back(curr->data);
            curr = curr->next;
        }
        return vec;
    }
};

#endif
