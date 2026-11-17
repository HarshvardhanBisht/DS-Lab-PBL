# System Architecture & API Documentation

## 1. Overview
The Disaster Response & Resource Management System simulates an Emergency Control Center (ECC) deployed in Noida & Delhi-NCR. It coordinates disaster registrations, team allocations, Dijkstra/A* routing, Edmonds-Karp evacuation flows, and supply distribution via custom data structures.

## 2. Directory Structure
```
DS PBL/
├── core/
│   ├── include/
│   │   ├── Person.h             (Base Person, Volunteer, RescueOfficer, MedicalOfficer)
│   │   ├── Incident.h           (Base Incident, Fire, Flood, Earthquake, Landslide)
│   │   ├── RescueTeam.h         (Team inventory and dispatch management)
│   │   ├── Shelter.h            (Shelter capacities and resource tracking)
│   │   ├── MissionRecord.h      (Mission audit frame)
│   │   ├── Graph.h              (Dynamic weighted city road network)
│   │   ├── RouteStrategy.h      (Strategy pattern for Dijkstra & A*)
│   │   ├── IndexedMaxHeap.h     (Dynamic priority queue with wait-time aging)
│   │   ├── MinHeap.h            (Workload-balanced team selector)
│   │   ├── CustomHashTable.h    (Separate chaining with dynamic rehashing)
│   │   ├── DoublyLinkedList.h   (Dynamic mission audit trail)
│   │   ├── Stack.h              (LIFO undo stack)
│   │   ├── Trie.h               (Prefix search autocomplete)
│   │   ├── LRUCache.h           (Search query caching with hit/miss counter)
│   │   ├── UnionFind.h          (Disjoint set for road connectivity)
│   │   ├── Tarjan.h             (Critical bridges and articulation points)
│   │   ├── MST.h                (Kruskal and Prim minimum spanning trees)
│   │   ├── MaxFlow.h            (Edmonds-Karp evacuation capacity planner)
│   │   ├── Knapsack.h           (Fractional knapsack relief truck packing)
│   │   ├── TSP2Opt.h            (Nearest-neighbour + 2-opt supply routing)
│   │   ├── TopologicalSort.h    (Task precedence scheduling and cycle detection)
│   │   ├── Sorting.h            (Custom QuickSort and MergeSort)
│   │   ├── FenwickTree.h        (Binary Indexed Tree range queries)
│   │   └── CityNetwork.h        (Unified coordinator)
│   └── src/
│       ├── Graph.cpp
│       └── CityNetwork.cpp
├── server/
│   ├── httplib.h                (Single-header C++ HTTP server)
│   ├── json.hpp                 (Single-header JSON library)
│   └── main_server.cpp          (REST API implementation)
├── tests/
│   └── test_suite.cpp           (12 edge case unit tests)
├── web/                         (Frontend UI)
├── docs/                        (Architecture and complexity tables)
├── build_all.bat
└── start_server.bat
```

## 3. Core REST API Endpoints
- `GET /api/health`: System health and high-level counters.
- `GET /api/city`: Spatial nodes (X, Y) and dynamic roads.
- `POST /api/roads/toggle`: Block/unblock road, update connectivity.
- `GET /api/incidents`: Active and registered disaster incidents.
- `POST /api/incidents`: Register new incident (Fire, Flood, Earthquake, Landslide).
- `GET /api/teams`: Rescue squads and polymorphic personnel roster.
- `GET /api/shelters`: Shelter capacities and occupancy.
- `POST /api/dispatch/next`: Dispatch highest priority emergency via Indexed Max-Heap.
- `POST /api/dispatch/all`: Batch dispatch all waiting emergencies.
- `POST /api/undo`: Revert last mission or road block via Stack.
- `GET /api/history`: Completed mission history log via Doubly Linked List.
- `GET /api/search?q=prefix`: Prefix autocomplete via Trie + LRU Cache.
- `GET /api/trace/dijkstra?start=X&end=Y`: Full step trace for algorithm visualizer.
- `GET /api/trace/astar?start=X&end=Y`: Heuristic search trace and comparison metrics.
- `GET /api/trace/tarjan`: Critical bridges and articulation junctions.
- `GET /api/trace/mst?algo=kruskal|prim`: Step-by-step MST road clearing tree.
- `GET /api/trace/maxflow?source=X&sink=Y`: Edmonds-Karp evacuation augmenting paths.
- `POST /api/resources/knapsack`: Fractional knapsack relief cargo optimization.
- `POST /api/resources/route2opt`: 2-Opt multi-stop relief delivery routing.
- `GET /api/resources/tasks`: Topological sort task board with cycle detection.
- `GET /api/ds/priority-queue`: Binary tree and array view of Indexed Max-Heap.
- `GET /api/ds/hash-table`: Hash table bucket diagnostics and chain lengths.
- `GET /api/ds/union-find`: Disjoint set components.
- `GET /api/ds/lru-cache`: LRU cache statistics and hits/misses.
- `GET /api/reports?sort=severity|rescued|distance&algo=quick|merge`: Reports via custom sorting.
- `GET /api/reports/fenwick?startDay=X&endDay=Y`: Prefix range queries.
- `GET /api/benchmarks`: Empirical time complexity validation suite.
- `GET /api/complexity`: Complete complexity cheat-sheet.
