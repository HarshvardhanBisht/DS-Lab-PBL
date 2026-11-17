#ifndef STACK_H
#define STACK_H

#include <vector>
#include <stdexcept>

/**
 * Stack Template Class
 * 
 * TIME COMPLEXITY:
 * - Push: O(1) amortized
 * - Pop: O(1)
 * - Top / Peek: O(1)
 * 
 * SPACE COMPLEXITY: O(N) where N is number of action frames.
 * 
 * WHY CHOSEN: Implements undo functionality for emergency operations
 * (reverting dispatch, reopening resolved incidents, restoring road blocks).
 */
template <typename T>
class Stack {
private:
    std::vector<T> elements;

public:
    Stack() {}

    void push(const T& val) {
        elements.push_back(val);
    }

    T pop() {
        if (elements.empty()) {
            throw std::underflow_error("Stack is empty");
        }
        T topVal = elements.back();
        elements.pop_back();
        return topVal;
    }

    T& top() {
        if (elements.empty()) {
            throw std::underflow_error("Stack is empty");
        }
        return elements.back();
    }

    const T& top() const {
        if (elements.empty()) {
            throw std::underflow_error("Stack is empty");
        }
        return elements.back();
    }

    bool empty() const { return elements.empty(); }
    size_t size() const { return elements.size(); }
    void clear() { elements.clear(); }
};

#endif
