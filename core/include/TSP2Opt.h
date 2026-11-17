#ifndef TSP2OPT_H
#define TSP2OPT_H

#include <vector>
#include <string>
#include <cmath>
#include <algorithm>
#include <limits>

/**
 * Multi-Stop Route Optimization (Nearest-Neighbour + 2-Opt Local Search)
 * 
 * TIME COMPLEXITY:
 * - Nearest Neighbour: O(K^2)
 * - 2-Opt Optimization: O(Iterations * K^2)
 * 
 * SPACE COMPLEXITY: O(K) where K is number of destination shelters.
 * 
 * WHY CHOSEN: Solves vehicle routing for relief supply trucks making multi-stop
 * deliveries across refugee shelters and distribution centers, minimizing fuel and transit time.
 */
struct TSPStep {
    int iteration;
    double currentDistance;
    std::string swapDescription;
};

struct RouteOptimizationResult {
    std::vector<std::string> initialTour;
    double initialDistance;
    std::vector<std::string> optimizedTour;
    double optimizedDistance;
    double improvementPercent;
    std::vector<TSPStep> steps;
};

class MultiStopRoutePlanner {
private:
    static double calculateTourDistance(const std::vector<int>& tour, const std::vector<std::vector<double>>& distMatrix) {
        double d = 0.0;
        for (size_t i = 0; i + 1 < tour.size(); ++i) {
            d += distMatrix[tour[i]][tour[i + 1]];
        }
        return d;
    }

public:
    static RouteOptimizationResult optimize(const std::vector<int>& targetNodes,
                                           const std::vector<std::vector<double>>& distMatrix,
                                           const std::vector<std::string>& nodeNames) {
        RouteOptimizationResult res;
        int k = static_cast<int>(targetNodes.size());
        if (k <= 2) {
            res.initialDistance = 0.0;
            res.optimizedDistance = 0.0;
            res.improvementPercent = 0.0;
            for (int idx : targetNodes) {
                res.initialTour.push_back(nodeNames[idx]);
                res.optimizedTour.push_back(nodeNames[idx]);
            }
            return res;
        }

        std::vector<bool> visited(k, false);
        std::vector<int> tour;
        tour.reserve(k);

        int current = 0;
        visited[current] = true;
        tour.push_back(targetNodes[current]);

        for (int step = 1; step < k; ++step) {
            int nextNearest = -1;
            double minDist = std::numeric_limits<double>::infinity();

            for (int candidate = 0; candidate < k; ++candidate) {
                if (!visited[candidate]) {
                    double d = distMatrix[targetNodes[current]][targetNodes[candidate]];
                    if (d < minDist) {
                        minDist = d;
                        nextNearest = candidate;
                    }
                }
            }
            if (nextNearest != -1) {
                visited[nextNearest] = true;
                tour.push_back(targetNodes[nextNearest]);
                current = nextNearest;
            }
        }

        for (int idx : tour) {
            res.initialTour.push_back(nodeNames[idx]);
        }
        res.initialDistance = calculateTourDistance(tour, distMatrix);

        std::vector<int> bestTour = tour;
        double bestDist = res.initialDistance;
        bool improvement = true;
        int iter = 1;

        while (improvement && iter <= 50) {
            improvement = false;
            for (int i = 1; i < k - 1; ++i) {
                for (int j = i + 1; j < k; ++j) {
                    std::vector<int> newTour = bestTour;
                    std::reverse(newTour.begin() + i, newTour.begin() + j + 1);
                    double newDist = calculateTourDistance(newTour, distMatrix);

                    if (newDist < bestDist - 1e-6) {
                        bestDist = newDist;
                        bestTour = newTour;
                        improvement = true;

                        TSPStep s;
                        s.iteration = iter++;
                        s.currentDistance = bestDist;
                        s.swapDescription = "2-Opt inversion between stop " + std::to_string(i) + " (" + nodeNames[bestTour[i]] +
                                            ") and stop " + std::to_string(j) + " (" + nodeNames[bestTour[j]] + ") reduced distance.";
                        res.steps.push_back(s);
                        break;
                    }
                }
                if (improvement) break;
            }
        }

        for (int idx : bestTour) {
            res.optimizedTour.push_back(nodeNames[idx]);
        }
        res.optimizedDistance = bestDist;
        res.improvementPercent = (res.initialDistance > 0.0)
            ? ((res.initialDistance - res.optimizedDistance) / res.initialDistance * 100.0)
            : 0.0;

        return res;
    }
};

#endif
