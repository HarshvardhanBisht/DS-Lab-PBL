#ifndef QUEUE_H
#define QUEUE_H

#include <stdexcept>

template <typename T>
class Queue {
private:
    struct Node {
        T data;
        Node* next;
        Node(const T& val) : data(val), next(nullptr) {}
    };

    Node* head;
    Node* tail;
    int count;

public:
    Queue() : head(nullptr), tail(nullptr), count(0) {}

    ~Queue() {
        clear();
    }

    Queue(const Queue& other) : head(nullptr), tail(nullptr), count(0) {
        Node* curr = other.head;
        while (curr != nullptr) {
            enqueue(curr->data);
            curr = curr->next;
        }
    }

    Queue& operator=(const Queue& other) {
        if (this != &other) {
            clear();
            Node* curr = other.head;
            while (curr != nullptr) {
                enqueue(curr->data);
                curr = curr->next;
            }
        }
        return *this;
    }

    void enqueue(const T& val) {
        Node* newNode = new Node(val);
        if (tail == nullptr) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            tail = newNode;
        }
        count++;
    }

    T dequeue() {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty");
        }
        Node* temp = head;
        T val = temp->data;
        head = head->next;
        if (head == nullptr) {
            tail = nullptr;
        }
        delete temp;
        count--;
        return val;
    }

    T& front() {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty");
        }
        return head->data;
    }

    const T& front() const {
        if (isEmpty()) {
            throw std::underflow_error("Queue is empty");
        }
        return head->data;
    }

    bool isEmpty() const {
        return count == 0;
    }

    int size() const {
        return count;
    }

    void clear() {
        while (!isEmpty()) {
            dequeue();
        }
    }
};

#endif
