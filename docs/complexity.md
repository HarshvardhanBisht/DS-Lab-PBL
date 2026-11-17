# Data Structures & Algorithms Complexity Table

| Data Structure / Algorithm | Module | Time Complexity | Space Complexity | Real-World Disaster Response Application |
| :--- | :--- | :--- | :--- | :--- |
| **Dynamic City Graph (Weighted)** | City Road Network | $\mathcal{O}(V + E)$ | $\mathcal{O}(V + E)$ | Models road segments, transit times, and road blocks (landslide/flood closures). |
| **Dijkstra's Algorithm** | Shortest Route Navigation | $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V + E)$ | Finds the shortest path to nearest available team base or capacity shelter. |
| **A\* Heuristic Search** | Directed Navigation | $\mathcal{O}(E)$ best, $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V + E)$ | Reduces explored state space using Euclidean distance heuristics towards destination. |
| **Indexed Max-Heap (with Aging)** | Incident Priority Queue | $\mathcal{O}(\log N)$ push/pop/update | $\mathcal{O}(N)$ | Serves Severity 5 emergencies first; increases priority over wait time to prevent starvation. |
| **Custom Hash Table** | ID Record Direct Access | $\mathcal{O}(1)$ avg, $\mathcal{O}(N)$ worst | $\mathcal{O}(N + B)$ | Instantaneous lookup of incidents, teams, and shelters using polynomial rolling hash. |
| **Min-Heap** | Workload Dispatcher | $\mathcal{O}(\log K)$ push/pop | $\mathcal{O}(K)$ | Selects the least-loaded rescue team (fewest active missions) for load balancing. |
| **Doubly Linked List** | Mission History Audit Log | $\mathcal{O}(1)$ insertion | $\mathcal{O}(M)$ | Constant-time dynamic record appending without array resizing or reallocation. |
| **Stack** | Operation Undo Controller | $\mathcal{O}(1)$ push/pop | $\mathcal{O}(U)$ | LIFO undo for misdispatches, incident registrations, and road closures. |
| **Trie (Prefix Tree)** | Location Autocomplete | $\mathcal{O}(M)$ prefix query | $\mathcal{O}(\Sigma \cdot M \cdot N)$ | Keystroke search suggestions across hospitals, shelters, and villages. |
| **LRU Cache** | Location Query Accelerator | $\mathcal{O}(1)$ get/put | $\mathcal{O}(C)$ | Caches repeated prefix lookups and tracks live hit/miss rates. |
| **Union-Find (DSU)** | Road Network Connectivity | $\mathcal{O}(\alpha(V)) \approx \mathcal{O}(1)$ | $\mathcal{O}(V)$ | Dynamically checks connected components and detects isolated sectors when roads fail. |
| **Tarjan's Algorithm** | Bottleneck & Bridge Analysis | $\mathcal{O}(V + E)$ single DFS | $\mathcal{O}(V + E)$ | Detects critical bridges and articulation junctions whose loss disconnects the city. |
| **Kruskal's & Prim's MST** | Emergency Clearing Backbone | $\mathcal{O}(E \log E)$ / $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V + E)$ | Calculates minimum cost road clearance tree to reconnect all disaster sectors. |
| **Edmonds-Karp Max-Flow** | Mass Evacuation Capacity | $\mathcal{O}(V \cdot E^2)$ | $\mathcal{O}(V^2)$ | Calculates bottleneck vehicle throughput (evacuees/hr) from disaster spots to shelters. |
| **Fractional Knapsack** | Relief Truck Loading | $\mathcal{O}(N \log N)$ greedy sort | $\mathcal{O}(N)$ | Maximizes total urgency points for weight-constrained supply trucks. |
| **Nearest-Neighbour + 2-Opt** | Multi-Stop Supply Loop | $\mathcal{O}(I \cdot K^2)$ | $\mathcal{O}(K)$ | Heuristic + local search optimization for multi-shelter supply drop-offs. |
| **Topological Sort** | Task Dependency Scheduling | $\mathcal{O}(V + E)$ | $\mathcal{O}(V + E)$ | Orders disaster response tasks by precedence with circular deadlock detection. |
| **Fenwick Tree (BIT)** | Temporal Range Analytics | $\mathcal{O}(\log D)$ update/query | $\mathcal{O}(D)$ | Computes total citizens rescued between Day X and Day Y in $\mathcal{O}(\log D)$. |
| **Custom QuickSort & MergeSort**| Analytics Report Generator | $\mathcal{O}(N \log N)$ | $\mathcal{O}(N)$ / $\mathcal{O}(\log N)$ | Sorts mission records by severity, rescues, date, or distance without STL sort. |
