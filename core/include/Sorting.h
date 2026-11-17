#ifndef SORTING_H
#define SORTING_H

#include <vector>
#include <utility>

/**
 * Custom Sorting Algorithms (QuickSort & MergeSort)
 * 
 * TIME COMPLEXITY:
 * - QuickSort: O(N log N) average, O(N^2) worst-case
 * - MergeSort: O(N log N) guaranteed stable
 * 
 * SPACE COMPLEXITY:
 * - QuickSort: O(log N) stack
 * - MergeSort: O(N) auxiliary buffer
 * 
 * PURPOSE: Powers analytics reports, sorting missions and incidents by severity,
 * casualty rate, people rescued, or deployment distance without using STL sort.
 */
template <typename T, typename Comparator>
int partitionArray(std::vector<T>& arr, int low, int high, Comparator comp) {
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
void quickSortHelper(std::vector<T>& arr, int low, int high, Comparator comp) {
    if (low < high) {
        int pi = partitionArray(arr, low, high, comp);
        quickSortHelper(arr, low, pi - 1, comp);
        quickSortHelper(arr, pi + 1, high, comp);
    }
}

template <typename T, typename Comparator>
void customQuickSort(std::vector<T>& arr, Comparator comp) {
    if (!arr.empty()) {
        quickSortHelper(arr, 0, static_cast<int>(arr.size()) - 1, comp);
    }
}

template <typename T, typename Comparator>
void mergeSubarrays(std::vector<T>& arr, int left, int mid, int right, Comparator comp) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    std::vector<T> leftArr(arr.begin() + left, arr.begin() + mid + 1);
    std::vector<T> rightArr(arr.begin() + mid + 1, arr.begin() + right + 1);

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (comp(leftArr[i], rightArr[j]) || (!comp(rightArr[j], leftArr[i]))) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }
    }
    while (i < n1) arr[k++] = leftArr[i++];
    while (j < n2) arr[k++] = rightArr[j++];
}

template <typename T, typename Comparator>
void mergeSortHelper(std::vector<T>& arr, int left, int right, Comparator comp) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSortHelper(arr, left, mid, comp);
        mergeSortHelper(arr, mid + 1, right, comp);
        mergeSubarrays(arr, left, mid, right, comp);
    }
}

template <typename T, typename Comparator>
void customMergeSort(std::vector<T>& arr, Comparator comp) {
    if (!arr.empty()) {
        mergeSortHelper(arr, 0, static_cast<int>(arr.size()) - 1, comp);
    }
}

#endif
