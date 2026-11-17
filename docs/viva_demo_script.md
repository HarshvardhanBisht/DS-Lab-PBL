# 5-Minute Viva Demo Script & Examiner Walkthrough
**Disaster Response & Resource Management System Using Data Structures and Algorithms**  
*Submitted by:* Harshvardhan Bisht, Kashish, Syed Ali Baquir Mehdi, Sanskriti Kaushik  
*Course:* CSE 2nd Year, Data Structures Lab (PBL), JIIT Noida  

---

## 🕒 Overview of the 5-Minute Demo Flow

| Time | Section | Page / Component | Key Data Structure / Algorithm Highlighted |
| :--- | :--- | :--- | :--- |
| **0:00 - 1:00** | Introduction & Live Command Map | Page 1: Live Command Map | Weighted Dynamic Graph, Real-Time Road Blocking, Tarjan Cut-Vertices, Union-Find |
| **1:00 - 2:00** | Algorithm Visualizer | Page 2: Algorithm Visualizer | Dijkstra vs A* Search Space Comparison, Prim/Kruskal MST, Edmonds-Karp Max-Flow |
| **2:00 - 3:00** | Data Structure Inspector | Page 3: DS Inspector | Indexed Max-Heap (Dynamic Aging), Custom Hash Table (Rehashing), Trie + LRU Cache |
| **3:00 - 4:00** | Logistics & Evacuation Optimization | Page 5: Resources & Evacuation | Fractional Knapsack Cargo Packer, TSP 2-Opt Loop, Kahn's Topological Sort |
| **4:00 - 5:00** | Audit Logs & Empirical Benchmarks | Page 6: Reports & Benchmarks | Custom Quick/Merge Sort, Fenwick Tree Range Queries, Empirical $O$-Curve Benchmarking |

---

## 🎙️ Step-by-Step Viva Presentation Script

### **Minute 1: Introduction & Live Command Map (Page 1)**
1. **Open the browser at `http://localhost:8080`**.
2. **What to say to the Examiner:**
   > *"Good morning Sir/Ma'am. Our project is an Emergency Operations Center deployed across the Noida/NCR road network (25 locations, 35 roads). All core data structures and algorithms are custom-coded from scratch in modern C++ without relying on STL containers like priority_queue, unordered_map, or std::sort."*
3. **Action:** Click on the road between **JIIT Sector 62** and **Mamura Village**.
   * **Highlight:** Point out the road turning dashed red (`BLOCKED`).
   * **What to say:**
     > *"Notice that roads can be dynamically blocked in real time. We maintain connected city components using a custom Disjoint Set Union (Union-Find) with path compression and union by rank in near $\mathcal{O}(1)$ amortized time."*
4. **Action:** Toggle the **"Tarjan Cut-Vertices & Bridges"** switch in the map controls.
   * **Highlight:** Articulation nodes pulse purple and bridges glow.
   * **What to say:**
     > *"Using Tarjan's single-pass DFS bridge-finding algorithm in $\mathcal{O}(V + E)$, we detect single points of failure so disaster dispatchers never isolate a sector."*
5. **Action:** Click **"Dispatch Next"**.
   * **Highlight:** The banner slides in and a vehicle animates along the shortest path.
   * **What to say:**
     > *"Dispatching instantly picks the highest priority disaster from our Indexed Max-Heap, queries the multi-source shortest path, and logs the mission into our Doubly Linked List audit trail."*

---

### **Minute 2: Algorithm Visualizer (Page 2)**
1. **Action:** Click **"Algorithm Visualizer"** in the sidebar.
2. **Select "Dijkstra vs A* Side-by-Side"** from the Algorithm dropdown, set Start as `JIIT Sector 62`, End as `Jaypee Hospital Sector 128`, and click **Play**.
3. **What to say to the Examiner:**
   > *"Here is the direct comparison between Dijkstra's uniform-cost search and A\* guided heuristic search using Euclidean distance. Notice that Dijkstra explores 23 nodes, whereas A\* explores only 10 nodes — achieving a 57% reduction in search space while maintaining mathematical optimality."*
4. **Action:** Switch to **"Edmonds-Karp Max-Flow"** and step through.
   * **What to say:**
     > *"For flood evacuation from Mamura Village to Sector 128 Sports Complex, we compute maximum evacuee throughput using the Edmonds-Karp algorithm with BFS augmenting paths in $\mathcal{O}(V \cdot E^2)$. Edge labels display live flow over capacity ($f / c$)."*
5. **Point to the Sidebar:**
   * Highlight the **Pseudocode Line Trace** moving line-by-line in sync with the algorithm.
   * Highlight the **Frontier Queue** and **Settled Visited Set**.

---

### **Minute 3: Data Structure Inspector (Page 3)**
1. **Action:** Click **"Data Structure Inspector"** in the sidebar.
2. **Showcase 1: Indexed Max-Heap**
   * **Action:** Click **"Age (+15m)"**.
   * **What to say:**
     > *"Our custom Indexed Max-Heap stores disasters ordered by dynamic priority: $P = \text{Severity} \times 100 + \text{WaitMinutes} \times 1.5$. When time advances, lower-severity incidents age so they never starve. Notice how the binary tree canvas dynamically reorganizes itself!"*
   * **Action:** Click **"Extract Max"** to demonstrate $\mathcal{O}(\log N)$ sift-down.
3. **Showcase 2: Custom Hash Table**
   * **Action:** Click any colored bucket in the bucket grid (e.g., Bucket `20`).
   * **What to say:**
     > *"We implemented separate chaining with a polynomial rolling hash function. Clicking bucket 20 shows the linked-list chain. If we click 'Rehash', the table doubles its capacity from 23 to 47 buckets, reducing the load factor below 0.75."*
4. **Showcase 3: Trie Walk & LRU Cache**
   * **Action:** Type `JIIT` into the search box.
   * **What to say:**
     > *"Every keystroke walks the Trie prefix tree: Root ➔ J ➔ I ➔ I ➔ T. Query results are cached in our Least Recently Used (LRU) Cache, with real-time tracking of cache hits, misses, and hit rate."*

---

### **Minute 4: Resources, Cargo Knapsack & 2-Opt Loop (Page 5)**
1. **Action:** Click **"Resources & Evacuation"** in the sidebar.
2. **Showcase 1: Fractional Knapsack**
   * **Action:** Click **"Compute Optimal Load"**.
   * **What to say:**
     > *"When loading emergency relief trucks with weight limits (500 kg), we use a greedy Fractional Knapsack algorithm. Items like Inflatable Boats, Trauma Kits, and Water Purification Tablets are sorted by Urgency-to-Weight ratio ($U / W$) in $\mathcal{O}(N \log N)$ to maximize life-saving utility."*
3. **Showcase 2: Multi-Stop Supply Loop (2-Opt)**
   * **Action:** Click **"Optimize Delivery Loop"**.
   * **What to say:**
     > *"For multi-shelter supply drops, we first construct a route using the Nearest-Neighbour heuristic, then iteratively untangle crossing edges using 2-Opt inversions, cutting total travel distance by up to 18%."*
4. **Showcase 3: Kahn's Topological Sort**
   * **Point to Task Board:**
     > *"Disaster operations have strict precedence constraints (e.g., Bridge Inspection before Convoy Movement). Kahn's in-degree queue algorithm produces a valid execution schedule and detects deadlocks/cycles."*

---

### **Minute 5: Reports, Fenwick Tree & Complexity Benchmarks (Page 6)**
1. **Action:** Click **"Reports & Benchmarks"** in the sidebar.
2. **Showcase 1: Custom Sort Comparison**
   * **Action:** Select Sort by Severity, toggle between **QuickSort** (in-place) and **MergeSort** (stable).
   * **What to say:**
     > *"Our mission audit table is sorted using our custom recursive QuickSort with median-of-three pivot and MergeSort — without using std::sort."*
3. **Showcase 2: Fenwick Tree (Binary Indexed Tree)**
   * **Action:** Enter Day 1 to 14 and click **"Query Range"**.
   * **What to say:**
     > *"To answer temporal range queries ('How many citizens were rescued between Day L and Day R?'), a naïve array loop takes $\mathcal{O}(N)$. Our Fenwick Tree answers prefix sums and point updates in $\mathcal{O}(\log D)$ using bitwise two's complement operations (`i += i & (-i)`)."*
4. **Showcase 3: Live Benchmark Suite**
   * **Action:** Click **"Run Live Benchmark"**.
   * **What to say:**
     > *"We benchmarked our custom data structures across input sizes $N \in \{100, 1000, 10000, 100000\}$. The empirical timings directly validate our theoretical $\mathcal{O}(N \log N)$ curves for sorting and $\mathcal{O}(1)$ average time for our custom hash table versus $\mathcal{O}(N)$ linear scan."*

---

## 🎯 Top Examiner Viva Questions & Model Answers

### Q1: *"Why did you use an Indexed Max-Heap instead of a standard priority queue?"*
> **Answer:** *"In a standard heap, locating an arbitrary element takes $\mathcal{O}(N)$, making priority updates like aging or severity escalation $\mathcal{O}(N)$. In our custom Indexed Max-Heap, we maintain a position hash table that maps incident IDs to their heap array indices. This allows `updateKey` and wait-time aging re-heapification to complete in $\mathcal{O}(\log N)$."*

### Q2: *"How does Tarjan's algorithm detect bridges and cut-vertices in one pass?"*
> **Answer:** *"During DFS traversal, we assign each node an entry discovery time `tin[u]` and compute `low[u]`, the lowest discovery time reachable via back-edges. An edge $(u, v)$ is a critical bridge if `low[v] > tin[u]`, meaning vertex $v$ has no alternative back-edge to reach ancestors of $u$. A vertex $u$ is an articulation point if `low[v] >= tin[u]`."*

### Q3: *"Why did you implement both Dijkstra and A\*?"*
> **Answer:** *"Dijkstra is a uniform-cost search that expands in all directions equally. In contrast, A\* uses an admissible Euclidean heuristic $h(n) = \sqrt{(x_n - x_{\text{dest}})^2 + (y_n - y_{\text{dest}})^2} / \text{speed}_{\text{max}}$. Because the Euclidean distance never overestimates true road distance, A\* guarantees the shortest path while exploring up to 57% fewer nodes."*

### Q4: *"How does your Undo system work without breaking consistency?"*
> **Answer:** *"Every state modification (dispatching a team, changing shelter occupancy, blocking a road) pushes an `UndoAction` record onto our custom LIFO Stack in $\mathcal{O}(1)$. When Undo is triggered, the stack pops the last action and executes its inverse (e.g., unassigning the squad, reducing shelter occupancy, and re-inserting the incident back into the Indexed Max-Heap) in $\mathcal{O}(1)$."*
