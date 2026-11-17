#ifndef SORTING_H
#define SORTING_H

#include <vector>
#include <utility>

template <typename T, typename Comparator>
int partition(std::vector<T>& arr, int low, int high, Comparator comp) {
    T pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; ++j) {
        if (comp(arr[j], pivot)) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

template <typename T, typename Comparator>
void quickSortInternal(std::vector<T>& arr, int low, int high, Comparator comp) {
    if (low < high) {
        int pi = partition(arr, low, high, comp);
        quickSortInternal(arr, low, pi - 1, comp);
        quickSortInternal(arr, pi + 1, high, comp);
    }
}

template <typename T, typename Comparator>
void quickSort(std::vector<T>& arr, Comparator comp) {
    if (!arr.empty()) {
        quickSortInternal(arr, 0, static_cast<int>(arr.size()) - 1, comp);
    }
}

template <typename T, typename Comparator>
void merge(std::vector<T>& arr, int left, int mid, int right, Comparator comp) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    std::vector<T> leftArr;
    std::vector<T> rightArr;
    leftArr.reserve(n1);
    rightArr.reserve(n2);

    for (int i = 0; i < n1; ++i) {
        leftArr.push_back(arr[left + i]);
    }
    for (int j = 0; j < n2; ++j) {
        rightArr.push_back(arr[mid + 1 + j]);
    }

    int i = 0;
    int j = 0;
    int k = left;

    while (i < n1 && j < n2) {
        if (comp(leftArr[i], rightArr[j]) || (!comp(rightArr[j], leftArr[i]))) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = leftArr[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = rightArr[j];
        j++;
        k++;
    }
}

template <typename T, typename Comparator>
void mergeSortInternal(std::vector<T>& arr, int left, int right, Comparator comp) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSortInternal(arr, left, mid, comp);
        mergeSortInternal(arr, mid + 1, right, comp);
        merge(arr, left, mid, right, comp);
    }
}

template <typename T, typename Comparator>
void mergeSort(std::vector<T>& arr, Comparator comp) {
    if (!arr.empty()) {
        mergeSortInternal(arr, 0, static_cast<int>(arr.size()) - 1, comp);
    }
}

#endif
