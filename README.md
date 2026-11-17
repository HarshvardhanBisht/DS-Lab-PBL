# 🚨 AURA-EMS: Adaptive Urban Routing & Allocation for Emergency Services

[![C++17](https://img.shields.io/badge/Language-C%2B%2B17-blue.svg?style=flat-square&logo=c%2B%2B)](https://en.cppreference.com/w/cpp/17)
[![HTML5/Canvas](https://img.shields.io/badge/Frontend-HTML5%20%2F%20Canvas%20%2F%20CSS3-orange.svg?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Network](https://img.shields.io/badge/Backend-WinSock%20REST%20Micro--Server-brightgreen.svg?style=flat-square)](https://learn.microsoft.com/en-us/windows/win32/winsock/)
[![Institution](https://img.shields.io/badge/Institution-JIIT%20Noida%20(CSE)-red.svg?style=flat-square)](https://www.jiit.ac.in)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat-square)](LICENSE)

An institutional Data Structures & Algorithms (PBL) project simulating an **Adaptive Urban Emergency Response System** for the Noida / NCR sector grid (Sector 62, Fortis Hospital, Hindan River basin). Built from scratch in pure **C++17** with zero third-party graph dependencies, featuring an interactive HTML5/Canvas Command Dashboard with real-time socket communication.

---

## 👥 Project Team & Faculty Supervisor

- **Supervisor / Faculty:** Mr. Varun Srivastava (Department of Computer Science & Engineering)
- **Institution:** Jaypee Institute of Information Technology (JIIT), Noida, India

| S.No | Enrolment Number | Name | Batch | Viva Presentation Focus |
| :---: | :---: | :--- | :---: | :--- |
| 1 | `2501030051` | **Harshvardhan Bisht** | B10 | Motivation, Problem Statement, Objectives & Project Scope |
| 2 | `2501030041` | **Kashish** | B10 | Core Development, OOP Architecture & C++17 Engineering |
| 3 | `2501030031` | **Syed Ali Baquir Mehdi** | B10 | Data Structures, Algorithmic Engine & Complexity Analysis |
| 4 | `992501030235` | **Sanskriti Kaushik** | B10 | Simulation Center, Live Disaster Scenarios & Verification |

---

## 🌟 Key Features

1. **Dynamic Dijkstra Perimeter Rerouting (*O*((V + E) log V)):**
   - Automatically detects flood breaches, roadblocks, and structural collapses.
   - Computes real-time detour perimeters around hazardous ground zero zones.

2. **Wait-Time Emergency Triage Aging (*O*(log N)):**
   - Implements dynamic priority aging: `Priority = Severity * 10 + (WaitMinutes / 60) * 2`.
   - Prevents starvation of lower-severity incidents during major disasters.

3. **Complete 3-Leg Humanitarian Rescue Lifecycle:**
   - Depot Dispatch $\to$ Shelter Staging / Supply Load $\to$ Ground Zero Extraction $\to$ Evacuation to Shelter with verified capacity.

4. **Kruskal's Minimum Spanning Tree via DSU (*O*(E log E)):**
   - Uses Disjoint Set Union with Path Compression and Union by Rank ($\alpha(V) \approx 1$) to compute the optimal emergency telecommunications backbone.

5. **Multi-Criteria Mission Audit Log Sorting:**
   - In-memory custom in-place **QuickSort** and stable **MergeSort** to audit mission histories by severity, response duration, and rescued civilian count without STL `std::sort`.

6. **Interactive HTML5/Canvas Live Command Map:**
   - Real-time road network visualization with color-coded nodes (Hospitals, Metro, Fire Stations, Shelters, Villages) and glowing neon dispatch routes.

---

## 📊 Data Structures & Algorithmic Complexity

| Data Structure / Algorithm | Practical Purpose | Theoretical Time | Theoretical Space | Empirical Avg (N=1000) |
| :--- | :--- | :---: | :---: | :---: |
| **Adjacency List Graph** | Sparse urban road network representation | *O*(deg(*u*)) | *O*(*V* + *E*) | < 0.05 ms |
| **Dijkstra + Binary Min-Heap** | Shortest hazard-evasive ambulance route | *O*(( *V* + *E* ) log *V*) | *O*(*V*) | 0.42 ms |
| **Emergency Triage Min-Heap** | Priority incident dispatch queue | *O*(log *N*) | *O*(*N*) | 0.08 ms |
| **Disjoint Set Union (DSU)** | Cycle detection in Kruskal's MST | *O*(*α*(*V*)) ≈ *O*(1) | *O*(*V*) | < 0.01 ms |
| **Kruskal's Algorithm** | Emergency telecom network backbone | *O*(*E* log *E*) | *O*(*V*) | 0.85 ms |
| **Doubly Linked List** | Bidirectional completed mission audit log | *O*(1) insert / del | *O*(*M*) | < 0.01 ms |
| **In-Place QuickSort** | Mission log sorting by Severity / Casualties | *O*(*M* log *M*) | *O*(log *M*) | 0.65 ms |
| **Stable MergeSort** | Mission log sorting with order preservation | *O*(*M* log *M*) | *O*(*M*) | 0.78 ms |

---

## 🛠️ Project Directory Structure

```plaintext
DS PBL/
├── core/                       # Core C++17 Header and Source Implementations
│   ├── Graph.h / Graph.cpp     # Adjacency List Graph & Dijkstra Engine
│   ├── PriorityQueue.h         # Templated Binary Min-Heap
│   ├── DSU.h                   # Disjoint Set Union with Rank & Path Compression
│   ├── DoublyLinkedList.h      # Linked List for Mission History
│   ├── Person.h                # OOP Base Class & Polymorphic Responders
│   └── Incident.h / Shelter.h  # Emergency Domain Entities
├── server/                     # C++17 WinSock REST Micro-Server (Port 8080)
├── web/                        # HTML5 Canvas Frontend Command Map & UI
│   ├── index.html              # Modern Dark-Themed Glassmorphism Dashboard
│   ├── style.css               # Responsive Layout & Animation Stylesheets
│   └── app.js                  # Canvas Graph Renderer & Socket API Client
├── report_assets/              # High-Resolution Architectural Figures & Screenshots
├── AURA_EMS_Project_Report.pdf # Official 27-Page JIIT Project Report (PDF)
├── AURA_EMS_Project_Report.docx# Editable Word Document Format
├── build.bat                   # 1-Click C++ Compiler Script (g++ / MinGW)
└── start_server.bat            # 1-Click Backend Server Launcher
```

---

## 🚀 How to Run the Project Locally

### Prerequisites
- Windows 10 / 11
- MinGW-w64 (g++ with C++17 support)
- Modern web browser (Chrome, Edge, Firefox)

### 1-Click Startup
1. **Compile Backend:**
   ```powershell
   .\build.bat
   ```
2. **Start REST Server:**
   ```powershell
   .\start_server.bat
   ```
   *(Server starts listening on `http://localhost:8080`)*
3. **Open Dashboard:**
   Simply double-click `web/index.html` in your browser.

---

## 📄 Documentation & Reports
- **Full 27-Page Project Report (PDF):** [`AURA_EMS_Project_Report.pdf`](AURA_EMS_Project_Report.pdf)
- **Full Word Document (.docx):** [`AURA_EMS_Project_Report.docx`](AURA_EMS_Project_Report.docx)
- **Interactive Report (HTML):** [`AURA_EMS_Project_Report.html`](AURA_EMS_Project_Report.html)
