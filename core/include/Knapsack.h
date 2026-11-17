#ifndef KNAPSACK_H
#define KNAPSACK_H

#include <vector>
#include <string>
#include <algorithm>

/**
 * Fractional Knapsack (Greedy Algorithm) for Relief Supply Truck Loading
 * 
 * TIME COMPLEXITY: O(N log N) sorting + O(N) greedy selection
 * SPACE COMPLEXITY: O(N) for item selection records
 * 
 * WHY CHOSEN: Maximizes life-saving utility when packing weight-constrained
 * emergency supply trucks with items of varying urgency and payload mass.
 */
struct SupplyItem {
    std::string name;
    double weightKg;
    double urgencyValue;
    double ratio;

    SupplyItem(const std::string& n, double w, double v)
        : name(n), weightKg(w), urgencyValue(v), ratio(w > 0 ? (v / w) : 0.0) {}
};

struct PackedItem {
    std::string name;
    double weightLoadedKg;
    double fractionTaken;
    double valueContributed;
    double ratio;
};

struct KnapsackResult {
    double totalCapacityKg;
    double totalWeightLoadedKg;
    double totalUrgencyAchieved;
    std::vector<PackedItem> packedItems;
};

class FractionalKnapsack {
public:
    static KnapsackResult loadTruck(double capacityKg, std::vector<SupplyItem> items) {
        KnapsackResult result;
        result.totalCapacityKg = capacityKg;
        result.totalWeightLoadedKg = 0.0;
        result.totalUrgencyAchieved = 0.0;

        std::sort(items.begin(), items.end(), [](const SupplyItem& a, const SupplyItem& b) {
            return a.ratio > b.ratio;
        });

        double currentCapacity = capacityKg;

        for (const auto& item : items) {
            if (currentCapacity <= 0.0) break;

            if (item.weightKg <= currentCapacity) {
                PackedItem pi;
                pi.name = item.name;
                pi.weightLoadedKg = item.weightKg;
                pi.fractionTaken = 1.0;
                pi.valueContributed = item.urgencyValue;
                pi.ratio = item.ratio;

                result.packedItems.push_back(pi);
                result.totalWeightLoadedKg += item.weightKg;
                result.totalUrgencyAchieved += item.urgencyValue;
                currentCapacity -= item.weightKg;
            } else {
                double fraction = currentCapacity / item.weightKg;
                PackedItem pi;
                pi.name = item.name;
                pi.weightLoadedKg = currentCapacity;
                pi.fractionTaken = fraction;
                pi.valueContributed = item.urgencyValue * fraction;
                pi.ratio = item.ratio;

                result.packedItems.push_back(pi);
                result.totalWeightLoadedKg += currentCapacity;
                result.totalUrgencyAchieved += (item.urgencyValue * fraction);
                currentCapacity = 0.0;
                break;
            }
        }

        return result;
    }
};

#endif
