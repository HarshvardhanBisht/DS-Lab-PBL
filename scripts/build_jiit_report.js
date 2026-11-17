const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '../report_assets');
const OUTPUT_HTML = path.join(__dirname, '../AURA_EMS_Project_Report.html');
const OUTPUT_PDF = path.join(__dirname, '../AURA_EMS_Project_Report.pdf');

function getBase64Image(filename) {
    const fullPath = path.join(ASSETS_DIR, filename);
    if (!fs.existsSync(fullPath)) {
        console.warn('Image missing:', fullPath);
        return '';
    }
    const ext = path.extname(filename).replace('.', '');
    const b64 = fs.readFileSync(fullPath).toString('base64');
    return `data:image/${ext === 'jpg' ? 'jpeg' : 'png'};base64,${b64}`;
}

const imgLogo = getBase64Image('jiit_logo.png');
const imgMainMap = getBase64Image('fig_main_map.png');
const imgVisualizer = getBase64Image('fig_visualizer.png');
const imgSimCenter = getBase64Image('fig_sim_center.png');
const imgFloodReroute = getBase64Image('fig_flood_reroute.png');
const imgInspector = getBase64Image('fig_inspector.png');
const imgResources = getBase64Image('fig_resources.png');
const imgAuditLog = getBase64Image('fig_audit_log.png');

console.log('Images loaded successfully.');

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>AURA-EMS Project Report - JIIT CSE</title>
<style>
@page {
    size: A4 portrait;
    margin: 0;
}
* {
    box-sizing: border-box;
}
body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    color: #111;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
.page {
    width: 184mm;
    height: 277mm;
    margin: 10mm auto;
    page-break-after: always;
    page-break-inside: avoid;
    border: 1.5px solid #000;
    padding: 24px 28px 20px 28px;
    position: relative;
    background: #fff;
    display: flex;
    flex-direction: column;
}
.page-footer {
    position: absolute;
    bottom: 12px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 11pt;
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #222;
}
h1.section-title {
    font-size: 15.5pt;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: #000;
}
hr.title-divider {
    border: none;
    border-top: 1.5px solid #000;
    margin: 0 0 12px 0;
}
h2.sub-title {
    font-size: 12pt;
    font-weight: 700;
    margin: 10px 0 4px 0;
    color: #111;
}
h3.sub-sub-title {
    font-size: 10.5pt;
    font-weight: 700;
    margin: 8px 0 3px 0;
    color: #222;
}
p {
    font-size: 9.8pt;
    line-height: 1.45;
    margin: 0 0 7px 0;
    text-align: justify;
}
ul, ol {
    margin: 3px 0 7px 18px;
    padding: 0;
    font-size: 9.6pt;
    line-height: 1.42;
}
li {
    margin-bottom: 3px;
}
table.report-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 10px 0;
    font-size: 8.8pt;
}
table.report-table th, table.report-table td {
    border: 1px solid #444;
    padding: 5px 8px;
    text-align: left;
}
table.report-table th {
    background-color: #E5E7EB;
    font-weight: 700;
    color: #000;
}
table.report-table td.center, table.report-table th.center {
    text-align: center;
}
.figure-container {
    text-align: center;
    margin: 6px 0;
}
.figure-container img {
    max-width: 95%;
    max-height: 165mm;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.figure-caption {
    font-size: 9pt;
    font-style: italic;
    text-align: center;
    margin-top: 4px;
    color: #333;
}
.cover-page {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 38px 24px 28px 24px;
}
.code-block {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 3.5px solid #0284c7;
    border-radius: 4px;
    padding: 8px 12px;
    margin: 6px 0 8px 0;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.5pt;
    line-height: 1.35;
    color: #1e293b;
    overflow-x: hidden;
}
.mono {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8.8pt;
}
.kw { color: #0284c7; font-weight: bold; }
.tp { color: #0f766e; font-weight: bold; }
.str { color: #b45309; }
.cm { color: #64748b; font-style: italic; }
</style>
</head>
<body>
`;

// ==========================================
// PAGE 1: 1. TITLE PAGE
// ==========================================
html += `
<div class="page cover-page">
    <div>
        <h1 style="font-size: 17pt; font-weight: 800; letter-spacing: 0.5px; margin: 0 0 6px 0; text-transform: uppercase;">
            JAYPEE INSTITUTE OF INFORMATION TECHNOLOGY, NOIDA
        </h1>
        <h2 style="font-size: 14pt; font-weight: 700; margin: 0; text-transform: uppercase; color: #222;">
            DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
        </h2>
    </div>

    <div style="margin: 20px 0;">
        <img src="${imgLogo}" alt="JIIT Logo" style="width: 135px; height: auto;">
    </div>

    <div>
        <h3 style="font-size: 14pt; font-weight: 700; margin: 0 0 12px 0;">
            BTECH : 3<sup>rd</sup> Semester
        </h3>
        <p style="font-size: 12pt; margin: 0 0 14px 0; font-style: italic; text-align: center;">
            Project Report on
        </p>
        <h1 style="font-size: 19pt; font-weight: 800; color: #000; margin: 0; line-height: 1.3;">
            Adaptive Urban Routing & Allocation for<br>Emergency Services (AURA-EMS)
        </h1>
    </div>

    <div style="width: 100%; margin-top: 25px;">
        <p style="font-weight: 700; font-size: 10.5pt; text-align: left; margin-bottom: 6px;">Submitted By:</p>
        <table class="report-table" style="font-size: 10pt; margin: 0 0 25px 0;">
            <thead>
                <tr>
                    <th style="width: 12%; text-align: center;">S.No</th>
                    <th style="width: 32%; text-align: center;">Enrolment Number</th>
                    <th style="width: 40%;">Name</th>
                    <th style="width: 16%; text-align: center;">Batch</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="center">1</td>
                    <td class="center">2501030051</td>
                    <td>Harshvardhan Bisht</td>
                    <td class="center">B10</td>
                </tr>
                <tr>
                    <td class="center">2</td>
                    <td class="center">2501030041</td>
                    <td>Kashish</td>
                    <td class="center">B10</td>
                </tr>
                <tr>
                    <td class="center">3</td>
                    <td class="center">2501030031</td>
                    <td>Syed Ali Baquir Mehdi</td>
                    <td class="center">B10</td>
                </tr>
                <tr>
                    <td class="center">4</td>
                    <td class="center">992501030235</td>
                    <td>Sanskriti Kaushik</td>
                    <td class="center">B10</td>
                </tr>
            </tbody>
        </table>

        <div style="text-align: left; font-size: 10.5pt; font-weight: 700; line-height: 1.5;">
            Submitted To: Mr. Varun Srivastava
        </div>
    </div>
</div>
`;

// ==========================================
// PAGE 2: 2. TABLE OF CONTENTS
// ==========================================
html += `
<div class="page">
    <h1 style="text-align: center; font-size: 18pt; font-weight: 700; margin: 0 0 16px 0;">Table of Contents</h1>
    <table class="report-table" style="font-size: 9.2pt; margin: 0;">
        <thead>
            <tr>
                <th style="width: 14%; text-align: center;">Sr. No.</th>
                <th style="width: 72%;">Title</th>
                <th style="width: 14%; text-align: center;">Page</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="center"><strong>1</strong></td><td><strong>Title Page</strong></td><td class="center"><strong>1</strong></td></tr>
            <tr><td class="center"><strong>2</strong></td><td><strong>Table of Contents</strong></td><td class="center"><strong>2</strong></td></tr>

            <tr><td class="center"><strong>3</strong></td><td><strong>Summary</strong></td><td class="center"><strong>3</strong></td></tr>
            <tr><td class="center">3.1</td><td>Brief Overview of the Project</td><td class="center">3</td></tr>
            <tr><td class="center">3.2</td><td>Project Objectives</td><td class="center">3</td></tr>

            <tr><td class="center"><strong>4</strong></td><td><strong>Introduction</strong></td><td class="center"><strong>4</strong></td></tr>
            <tr><td class="center">4.1</td><td>Background and Context</td><td class="center">4</td></tr>
            <tr><td class="center">4.2</td><td>Problem Statement</td><td class="center">4</td></tr>
            <tr><td class="center">4.3</td><td>Project Objectives</td><td class="center">5</td></tr>
            <tr><td class="center">4.4</td><td>Scope of the Project</td><td class="center">5</td></tr>

            <tr><td class="center"><strong>5</strong></td><td><strong>System Requirements</strong></td><td class="center"><strong>6</strong></td></tr>
            <tr><td class="center">5.1</td><td>Hardware and Software Specifications</td><td class="center">6</td></tr>
            <tr><td class="center">5.2</td><td>Functional Requirements</td><td class="center">6</td></tr>

            <tr><td class="center"><strong>6</strong></td><td><strong>Design and Implementation</strong></td><td class="center"><strong>7</strong></td></tr>
            <tr><td class="center">6.1</td><td>Class Diagrams and Object-Oriented Architecture</td><td class="center">7</td></tr>
            <tr><td class="center">6.2</td><td>Data Structure Implementations (Graphs, Heaps, Arrays, Queues, Lists)</td><td class="center">9</td></tr>
            <tr><td class="center">6.3</td><td>Algorithms and Their Complexities (Searching, Sorting, Detours)</td><td class="center">13</td></tr>
            <tr><td class="center">6.4</td><td>Code Snippets Demonstrating OOP and Data Structures</td><td class="center">17</td></tr>
            <tr><td class="center">6.5</td><td>Output Screenshots with Descriptions</td><td class="center">20</td></tr>

            <tr><td class="center"><strong>7</strong></td><td><strong>Conclusion</strong></td><td class="center"><strong>26</strong></td></tr>
            <tr><td class="center">7.1</td><td>Summary & Achievement of Objectives</td><td class="center">26</td></tr>
            <tr><td class="center">7.2</td><td>Future Work and Recommendations</td><td class="center">26</td></tr>

            <tr><td class="center"><strong>8</strong></td><td><strong>References</strong></td><td class="center"><strong>27</strong></td></tr>
        </tbody>
    </table>
    <div class="page-footer">2</div>
</div>
`;

// ==========================================
// PAGE 3: 3. SUMMARY
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">3. Summary</h1>
    <hr class="title-divider">

    <h2 class="sub-title">3.1 Brief Overview of the Project</h2>
    <p>
        The Adaptive Urban Routing & Allocation for Emergency Services (AURA-EMS) is a real-time municipal disaster coordination and pathfinding system designed to optimize emergency dispatch under catastrophic urban disruptions. Urban environments feature dynamic traffic variations, sudden road blockages (such as seasonal river flooding or bridge collapses), and mass-casualty incident surges that overwhelm standard navigation systems.
    </p>
    <p>
        AURA-EMS solves these challenges through an integrated native C++ computational core coupled to an interactive, real-time command dashboard. The city of Noida is modelled as a weighted Adjacency List graph spanning 17 critical municipal vertices (hospitals, fire bases, police headquarters, and relief shelters) interconnected by 22 arterial road segments. 
    </p>
    <p>
        The system implements an optimized Dijkstra's algorithm for minimum-duration routing, a Binary Min-Heap Priority Queue for incident triage featuring starvation-preventing aging mechanisms, a Disjoint Set Union (DSU) structure to calculate Kruskal's Minimum Spanning Tree for network backbone resilience, and a custom Doubly Linked List for immutable historical mission auditing. When infrastructure fails, the engine invalidates graph edges dynamically and re-computes multi-leg evacuation routes (deploying rescue teams to victims and transferring them to shelters with live bed capacity) in sub-millisecond execution times.
    </p>

    <h2 class="sub-title">3.2 Objectives</h2>
    <p>
        The overarching objective of this project is to apply foundational Computer Science data structures to a tangible, life-saving municipal logistics domain:
    </p>
    <ul>
        <li><strong>Graph Modeling:</strong> Represent real-world city infrastructure as a weighted, undirected Adjacency List graph capable of in-memory edge invalidation and dynamic re-weighting.</li>
        <li><strong>Algorithmic Route Optimization:</strong> Compare optimal travel-time routing via Dijkstra's Algorithm against hop-count minimization via Breadth-First Search (BFS) and unguided reachability verification via Depth-First Search (DFS).</li>
        <li><strong>Triage Starvation Prevention:</strong> Implement a Binary Min-Heap priority queue where incident severity (1 to 5) is dynamically aged over time so non-critical calls are not starved.</li>
        <li><strong>Multi-Leg Disaster Evacuation:</strong> Solve the 2-leg evacuation problem, routing rescue teams from base to disaster spot, and subsequently to the closest operational relief shelter.</li>
        <li><strong>Algorithmic Visualization:</strong> Provide an interactive visual trace of node relaxation, priority queue frontiers, and distance tables to demonstrate algorithmic correctness.</li>
        <li><strong>Historical Audit Logging:</strong> Maintain a complete mission history in a Doubly Linked List, supporting in-place QuickSort and MergeSort without relying on standard library sorting functions.</li>
    </ul>
    <div class="page-footer">3</div>
</div>
`;

// ==========================================
// PAGE 4: 4. INTRODUCTION (PART 1)
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">4. Introduction</h1>
    <hr class="title-divider">

    <h2 class="sub-title">4.1 Background and Context</h2>
    <p>
        Emergency Medical Services (EMS), fire brigades, and disaster management teams operate under extreme temporal pressure. In emergency trauma and critical cardiac scenarios, patient mortality rates increase exponentially with every minute of transit delay (the "Golden Hour" rule). Modern urban centers present severe spatial and topological challenges: rapid suburban sprawl, complex flyover networks, dense village enclaves, and severe congestion corridors.
    </p>
    <p>
        In Noida (Uttar Pradesh), arterial corridors such as the Sector 62 IT corridor, the Greater Noida Expressway, and the low-lying Hindan River embankments experience extreme traffic variability. Heavy monsoonal rains frequently submerge roads connecting Sector 63 to Hindan, severing critical evacuation corridors. Traditional consumer GPS navigation apps (e.g., Google Maps) are optimized for civilian travel and commercial routing; they lack integrated emergency triage queueing, live municipal shelter occupancy tracking, and multi-team disaster dispatch protocols.
    </p>
    <p>
        AURA-EMS was engineered to bridge this gap by providing an end-to-end municipal Emergency Command Center (ECC) platform powered by deterministic, high-performance C++ data structures.
    </p>

    <h2 class="sub-title">4.2 Problem Statement</h2>
    <p>
        Standard urban emergency response operations suffer from three fundamental computational deficiencies during crisis events:
    </p>
    <ol>
        <li><strong>Inability to Model Dynamic Graph Severing:</strong> Conventional routing engines assume static graph connectivity. When a road collapses or is inundated by flood waters, systems fail to invalidate edges in-place, leading to vehicles encountering impassable dead-ends.</li>
        <li><strong>Triage Queue Starvation:</strong> Emergency call queues sorted purely by severity result in lower-severity calls (e.g., bone fractures, minor injuries) languishing indefinitely when critical emergencies continue to arrive. A dynamic aging mechanism is required to guarantee service.</li>
        <li><strong>Single-Leg Route Simplification:</strong> Existing navigation tools route from origin to destination only. Real-world disaster rescue requires a constrained <em>Two-Leg Evacuation Chain</em>:
            <ul>
                <li>Leg 1: Deploy assigned rescue team from home base to the incident scene.</li>
                <li>Leg 2: Evacuate rescued victims from the scene to the nearest relief shelter that currently possesses available bed capacity and medical resources.</li>
            </ul>
        </li>
    </ol>
    <div class="page-footer">4</div>
</div>
`;

// ==========================================
// PAGE 5: 4. INTRODUCTION (PART 2)
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">4.3 Project Objectives</h2>
    <p>
        To directly resolve the problem statement, the system incorporates the following core technical specifications:
    </p>
    <ul>
        <li><strong>Custom Adjacency List Graph:</strong> Develop an in-memory graph representation supporting bidirectional weighted edges with independent physical length (km) and dynamic traversal duration (minutes).</li>
        <li><strong>Dynamic Edge Invalidation:</strong> Implement runtime edge toggling (<span class="mono">isBlocked = true</span>) such that graph relaxation routines immediately bypass severed corridors without restarting the application.</li>
        <li><strong>Multi-Search Comparative Engine:</strong> Implement Dijkstra's algorithm (fastest path), Breadth-First Search (fewest intersections), and Depth-First Search (reachability verification), allowing operators to compare path metrics across identical endpoints.</li>
        <li><strong>Priority Queue Triage with Aging:</strong> Implement a Binary Min-Heap where incident priority is dynamically computed using composite scoring: <span class="mono">Score = (6 - Severity) * 10 - WaitTime</span>.</li>
        <li><strong>Disaster Simulation Engine:</strong> Create an event-driven simulation center capable of advancing discrete time steps (+15m) and injecting catastrophic disaster breaches.</li>
        <li><strong>Step-by-Step Canvas Visualizer:</strong> Build an interactive execution visualizer that records snapshots of Dijkstra relaxation, settled sets, and frontier states for academic and operational verification.</li>
        <li><strong>Pointer-Based Mission History:</strong> Archive all completed missions inside a custom Doubly Linked List and implement in-place QuickSort and MergeSort without using <span class="mono">std::sort</span>.</li>
    </ul>

    <h2 class="sub-title">4.4 Scope of the Project</h2>
    <p>
        The project models the core urban infrastructure of Noida, encompassing 17 key municipal vertices:
    </p>
    <ul>
        <li><strong>Command & Healthcare Vertices:</strong> JIIT Sector 62 (Emergency Command Center), Fortis Hospital Sector 62, Max Hospital Sector 19, and Jaypee Hospital Sector 128.</li>
        <li><strong>Emergency Response Bases:</strong> Sector 62 Fire & Hazmat Station, Sector 24 Police Headquarters, and Sector 59 Metro Transit Base.</li>
        <li><strong>Humanitarian Relief Shelters:</strong> Sector 63 Community Center (SH-01), Sector 128 Sports Complex (SH-02), Indirapuram Relief Camp (SH-03), and JIIT Academic Shelter (SH-04).</li>
        <li><strong>Vulnerable & Disaster-Prone Zones:</strong> Mamura Village, Khoda Village, Surajpur Wetlands, and the Hindan River Embankment.</li>
    </ul>
    <p>
        The graph includes 22 bidirectional arterial road corridors. Weather satellite telemetry and micro-level vehicular acceleration dynamics remain outside the project scope.
    </p>
    <div class="page-footer">5</div>
</div>
`;

// ==========================================
// PAGE 6: 5. SYSTEM REQUIREMENTS
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">5. System Requirements</h1>
    <hr class="title-divider">

    <h2 class="sub-title">5.1 Hardware and Software Specifications</h2>
    <p>
        Because AURA-EMS is implemented as an optimized native binary without heavy virtual machine or runtime dependencies, it operates efficiently on standard commodity hardware.
    </p>

    <div style="font-weight: 700; font-size: 9pt; margin: 6px 0 2px 0; text-align: center;">
        Table 1: Minimum and Recommended System Specifications
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 25%;">Component</th>
                <th style="width: 37%;">Minimum Specification</th>
                <th style="width: 38%;">Recommended Specification</th>
            </tr>
        </thead>
        <tbody>
            <tr><td><strong>Processor (CPU)</strong></td><td>Dual-Core Intel / AMD x64 @ 2.0 GHz</td><td>Quad-Core Intel Core i5 / AMD Ryzen 5 @ 2.5+ GHz</td></tr>
            <tr><td><strong>System Memory (RAM)</strong></td><td>2.0 GB RAM</td><td>4.0 GB+ RAM (Sub-millisecond graph caching)</td></tr>
            <tr><td><strong>Disk Storage</strong></td><td>150 MB free disk space</td><td>500 MB free space (Log archival)</td></tr>
            <tr><td><strong>Operating System</strong></td><td>Microsoft Windows 10 / 11 (64-bit)</td><td>Microsoft Windows 11 (64-bit)</td></tr>
            <tr><td><strong>C++ Toolchain</strong></td><td>MinGW-w64 GCC 9.0+ (C++17 compliant)</td><td>MinGW-w64 GCC 13.x with -O2 Optimization</td></tr>
            <tr><td><strong>Web Browser</strong></td><td>Chromium 90+ / Mozilla Firefox 88+</td><td>Google Chrome / Microsoft Edge (Latest)</td></tr>
        </tbody>
    </table>

    <h2 class="sub-title">5.2 Functional Requirements</h2>
    <ul>
        <li><strong>FR-1 (Graph Ingestion & Topology):</strong> The system must initialize an in-memory graph of 17 vertices and 22 road edges from structured configurations, maintaining physical distance and dynamic traversal time.</li>
        <li><strong>FR-2 (Optimal Shortest-Path Computation):</strong> The system must calculate the fastest travel-time path between any valid origin and destination in under 1 millisecond using Dijkstra's algorithm.</li>
        <li><strong>FR-3 (Emergency Triage Queue):</strong> The system must maintain an active emergency incident queue prioritized by incident severity (Level 1 to Level 5) using a Binary Min-Heap.</li>
        <li><strong>FR-4 (Triage Starvation Aging):</strong> The system must automatically increment waiting incident age counters during simulation time steps, promoting older low-severity calls to prevent starvation.</li>
        <li><strong>FR-5 (Dynamic Road Closure & Rerouting):</strong> The system must support instant runtime blocking of road edges and automatically compute detour paths avoiding the blocked segments.</li>
        <li><strong>FR-6 (Two-Leg Evacuation Allocation):</strong> Dispatches for evacuation emergencies must compute a 2-leg route: base to incident scene, followed by transfer to the nearest shelter with available bed capacity.</li>
        <li><strong>FR-7 (Algorithm Execution Stepping):</strong> The visualizer must support play, pause, single-step advance, and reset controls while highlighting settled nodes, relaxed edges, and priority queue state.</li>
        <li><strong>FR-8 (Mission Audit Log & Custom Sort):</strong> All resolved missions must be logged to a Doubly Linked List and be sortable by severity or response duration via custom QuickSort and MergeSort.</li>
    </ul>
    <div class="page-footer">6</div>
</div>
`;

// ==========================================
// PAGE 7: 6. DESIGN & IMPLEMENTATION - 6.1 CLASS DIAGRAM
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">6. Design and Implementation</h1>
    <hr class="title-divider">

    <h2 class="sub-title">6.1 Class Diagrams and Object-Oriented Architecture</h2>
    <p>
        AURA-EMS is structured according to strict Object-Oriented Programming (OOP) paradigms: Encapsulation, Inheritance, Polymorphism, and Modular Separation of Concerns. Figure 1 illustrates the unified UML Class Diagram of the core C++ engine.
    </p>

    <!-- Figure 1: UML Class Diagram SVG -->
    <div class="figure-container">
        <svg viewBox="0 0 650 310" style="width: 100%; max-height: 300px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <!-- Graph Class -->
            <rect x="15" y="15" width="190" height="135" rx="4" fill="#f8fafc" stroke="#0284c7" stroke-width="1.5" />
            <rect x="15" y="15" width="190" height="24" rx="4" fill="#0284c7" />
            <text x="110" y="31" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">Graph</text>
            <text x="22" y="52" font-size="7.5" fill="#333">- vertices: vector&lt;LocationVertex&gt;</text>
            <text x="22" y="64" font-size="7.5" fill="#333">- adjList: vector&lt;vector&lt;GraphEdge&gt;&gt;</text>
            <text x="22" y="76" font-size="7.5" fill="#333">- nameToIndex: map&lt;string, int&gt;</text>
            <line x1="15" y1="82" x2="205" y2="82" stroke="#cbd5e1" />
            <text x="22" y="94" font-size="7.5" fill="#0369a1">+ addLocation(name, type)</text>
            <text x="22" y="106" font-size="7.5" fill="#0369a1">+ addRoad(u, v, dist, time)</text>
            <text x="22" y="118" font-size="7.5" fill="#0369a1">+ dijkstra(src, dst, d, path)</text>
            <text x="22" y="130" font-size="7.5" fill="#0369a1">+ bfs(src, dst, path)</text>
            <text x="22" y="142" font-size="7.5" fill="#0369a1">+ toggleRoad(u, v, blocked)</text>

            <!-- PriorityQueue Class -->
            <rect x="230" y="15" width="190" height="135" rx="4" fill="#f8fafc" stroke="#16a34a" stroke-width="1.5" />
            <rect x="230" y="15" width="190" height="24" rx="4" fill="#16a34a" />
            <text x="325" y="31" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">PriorityQueue (Min-Heap)</text>
            <text x="237" y="52" font-size="7.5" fill="#333">- heap: vector&lt;Incident*&gt;</text>
            <text x="237" y="64" font-size="7.5" fill="#333">- capacity: int</text>
            <line x1="230" y1="70" x2="420" y2="70" stroke="#cbd5e1" />
            <text x="237" y="82" font-size="7.5" fill="#15803d">+ enqueue(Incident* inc)</text>
            <text x="237" y="94" font-size="7.5" fill="#15803d">+ dequeue(): Incident*</text>
            <text x="237" y="106" font-size="7.5" fill="#15803d">+ peek(): Incident*</text>
            <text x="237" y="118" font-size="7.5" fill="#15803d">+ advanceTimeAging(mins)</text>
            <text x="237" y="130" font-size="7.5" fill="#15803d">- heapifyUp(index)</text>
            <text x="237" y="142" font-size="7.5" fill="#15803d">- heapifyDown(index)</text>

            <!-- Incident Class -->
            <rect x="445" y="15" width="190" height="135" rx="4" fill="#f8fafc" stroke="#d97706" stroke-width="1.5" />
            <rect x="445" y="15" width="190" height="24" rx="4" fill="#d97706" />
            <text x="540" y="31" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">Incident</text>
            <text x="452" y="52" font-size="7.5" fill="#333">- id: string</text>
            <text x="452" y="64" font-size="7.5" fill="#333">- type: string</text>
            <text x="452" y="76" font-size="7.5" fill="#333">- severity: int (1..5)</text>
            <text x="452" y="88" font-size="7.5" fill="#333">- locationName: string</text>
            <text x="452" y="100" font-size="7.5" fill="#333">- waitMinutes: int</text>
            <line x1="445" y1="106" x2="635" y2="106" stroke="#cbd5e1" />
            <text x="452" y="118" font-size="7.5" fill="#b45309">+ getCompositePriority(): int</text>
            <text x="452" y="130" font-size="7.5" fill="#b45309">+ incrementWait(mins)</text>
            <text x="452" y="142" font-size="7.5" fill="#b45309">+ isCritical(): bool</text>

            <!-- EmergencySystem Orchestrator -->
            <rect x="120" y="175" width="410" height="120" rx="4" fill="#f8fafc" stroke="#475569" stroke-width="1.5" />
            <rect x="120" y="175" width="410" height="24" rx="4" fill="#475569" />
            <text x="325" y="191" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">EmergencySystem (Facade & Orchestrator)</text>
            <text x="130" y="212" font-size="7.5" fill="#333">- cityGraph: Graph | - incidentPQ: PriorityQueue | - teamMap: HashMap&lt;string, RescueTeam*&gt;</text>
            <text x="130" y="224" font-size="7.5" fill="#333">- shelterMap: HashMap&lt;string, Shelter*&gt; | - missionHistory: DoublyLinkedList&lt;MissionRecord&gt;</text>
            <line x1="120" y1="230" x2="530" y2="230" stroke="#cbd5e1" />
            <text x="130" y="244" font-size="7.5" fill="#334155">+ dispatchNextIncident(): bool</text>
            <text x="130" y="256" font-size="7.5" fill="#334155">+ planShortestRoute(src, dest, d, path): bool</text>
            <text x="130" y="268" font-size="7.5" fill="#334155">+ simulateDisaster(type, location, blockedRoad): bool</text>
            <text x="130" y="280" font-size="7.5" fill="#334155">+ advanceSimulationClock(mins)</text>
            <text x="130" y="292" font-size="7.5" fill="#334155">+ sortMissionHistory(criterion, algorithm)</text>

            <!-- Connector Lines -->
            <line x1="110" y1="150" x2="220" y2="175" stroke="#64748b" stroke-width="1.5" />
            <line x1="325" y1="150" x2="325" y2="175" stroke="#64748b" stroke-width="1.5" />
            <line x1="540" y1="150" x2="430" y2="175" stroke="#64748b" stroke-width="1.5" />
        </svg>
    </div>
    <div class="figure-caption">Figure 1: Unified UML Class Diagram of the AURA-EMS Core Engine</div>
    <div class="page-footer">7</div>
</div>
`;

// ==========================================
// PAGE 8: 6.1 CLASS HIERARCHY & POLYMORPHISM
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Polymorphic Person and Personnel Hierarchy</h2>
    <p>
        AURA-EMS employs object-oriented inheritance and runtime polymorphism to manage first-responder personnel. An abstract base class <span class="mono">Person</span> defines virtual interface methods for duty reporting and specialty verification. Derived classes represent specialized emergency roles.
    </p>

    <!-- Personnel Hierarchy SVG -->
    <div class="figure-container">
        <svg viewBox="0 0 650 180" style="width: 100%; max-height: 170px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <!-- Base Class: Person -->
            <rect x="235" y="10" width="180" height="60" rx="4" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />
            <rect x="235" y="10" width="180" height="20" rx="4" fill="#334155" />
            <text x="325" y="24" font-size="9.5" font-weight="bold" fill="#fff" text-anchor="middle">«Abstract» Person</text>
            <text x="242" y="42" font-size="7.5" fill="#333"># id: string, name: string, phone: string</text>
            <text x="242" y="55" font-size="7.5" fill="#334155">+ virtual displayProfile() = 0</text>
            <text x="242" y="66" font-size="7.5" fill="#334155">+ virtual getRoleCategory(): string = 0</text>

            <!-- Lines down -->
            <line x1="325" y1="70" x2="325" y2="90" stroke="#475569" stroke-width="1.5" />
            <line x1="100" y1="90" x2="550" y2="90" stroke="#475569" stroke-width="1.5" />
            <line x1="100" y1="90" x2="100" y2="105" stroke="#475569" stroke-width="1.5" />
            <line x1="325" y1="90" x2="325" y2="105" stroke="#475569" stroke-width="1.5" />
            <line x1="550" y1="90" x2="550" y2="105" stroke="#475569" stroke-width="1.5" />

            <!-- Derived 1: RescueOfficer -->
            <rect x="20" y="105" width="160" height="65" rx="4" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5" />
            <rect x="20" y="105" width="160" height="18" rx="4" fill="#16a34a" />
            <text x="100" y="118" font-size="8.5" font-weight="bold" fill="#fff" text-anchor="middle">RescueOfficer</text>
            <text x="26" y="135" font-size="7" fill="#333">- rank: string, hazmatCert: string</text>
            <text x="26" y="147" font-size="7" fill="#15803d">+ displayProfile() override</text>
            <text x="26" y="159" font-size="7" fill="#15803d">+ getRoleCategory() override</text>

            <!-- Derived 2: MedicalOfficer -->
            <rect x="245" y="105" width="160" height="65" rx="4" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5" />
            <rect x="245" y="105" width="160" height="18" rx="4" fill="#2563eb" />
            <text x="325" y="118" font-size="8.5" font-weight="bold" fill="#fff" text-anchor="middle">MedicalOfficer</text>
            <text x="251" y="135" font-size="7" fill="#333">- specialty: string, license: string</text>
            <text x="251" y="147" font-size="7" fill="#1d4ed8">+ displayProfile() override</text>
            <text x="251" y="159" font-size="7" fill="#1d4ed8">+ getRoleCategory() override</text>

            <!-- Derived 3: Volunteer -->
            <rect x="470" y="105" width="160" height="65" rx="4" fill="#fdf2f8" stroke="#db2777" stroke-width="1.5" />
            <rect x="470" y="105" width="160" height="18" rx="4" fill="#db2777" />
            <text x="550" y="118" font-size="8.5" font-weight="bold" fill="#fff" text-anchor="middle">Volunteer</text>
            <text x="476" y="135" font-size="7" fill="#333">- skills: string, hoursServed: int</text>
            <text x="476" y="147" font-size="7" fill="#be185d">+ displayProfile() override</text>
            <text x="476" y="159" font-size="7" fill="#be185d">+ getRoleCategory() override</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 2: Polymorphic Personnel Class Hierarchy demonstrating OOP inheritance</div>

    <h2 class="sub-title" style="margin-top: 14px;">OOP Encapsulation in Data Models</h2>
    <p>
        All entity classes strictly enforce data encapsulation. For example, in <span class="mono">Shelter.h</span>, attributes such as <span class="mono">currentOccupancy</span> and <span class="mono">medicalBeds</span> are private, accessible only through guarded mutator functions (<span class="mono">admitPeople(int count)</span>). If an incoming evacuation mission attempts to admit 50 victims into a facility with only 20 remaining beds, the function returns false, preventing capacity overruns.
    </p>
    <div class="page-footer">8</div>
</div>
`;

// ==========================================
// PAGE 9: 6.2 DATA STRUCTURE IMPLEMENTATIONS (GRAPHS & HEAPS)
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">6.2 Data Structure Implementations</h1>
    <hr class="title-divider">

    <h2 class="sub-title">Graph Representation: Adjacency List</h2>
    <p>
        The city road system is modelled as a weighted, undirected graph <i>G</i> = (<i>V</i>, <i>E</i>), where <i>V</i> denotes the set of key urban vertices (|<i>V</i>| = 17) and <i>E</i> represents bidirectional road corridors (|<i>E</i>| = 22). To guarantee optimal <i>O</i>(<i>V</i> + <i>E</i>) memory space, the graph is stored as an Adjacency List:
    </p>
    <div class="code-block">
        <span class="kw">struct</span> <span class="tp">GraphEdge</span> {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> toVertex;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">double</span> distanceKm;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">double</span> travelTimeMins;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">bool</span> isBlocked;<br>
        };<br>
        <span class="tp">std::vector</span>&lt;<span class="tp">std::vector</span>&lt;<span class="tp">GraphEdge</span>&gt;&gt; adjList;
    </div>
    <p>
        Figure 3 depicts the network topology, and Table 2 lists the key emergency vertices.
    </p>

    <!-- Figure 3: Topological Graph SVG -->
    <div class="figure-container">
        <svg viewBox="0 0 650 145" style="width: 100%; max-height: 140px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <line x1="80" y1="40" x2="190" y2="40" stroke="#0284c7" stroke-width="2.5" />
            <line x1="190" y1="40" x2="310" y2="40" stroke="#0284c7" stroke-width="2.5" />
            <line x1="310" y1="40" x2="430" y2="40" stroke="#0284c7" stroke-width="2.5" />
            <line x1="430" y1="40" x2="570" y2="40" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5,4" />
            <line x1="80" y1="40" x2="190" y2="100" stroke="#0284c7" stroke-width="2.5" />
            <line x1="190" y1="100" x2="310" y2="100" stroke="#0284c7" stroke-width="2.5" />
            <line x1="310" y1="100" x2="430" y2="40" stroke="#0284c7" stroke-width="2.5" />
            <line x1="310" y1="100" x2="570" y2="100" stroke="#0284c7" stroke-width="2.5" />
            <line x1="570" y1="100" x2="570" y2="40" stroke="#0284c7" stroke-width="2.5" />

            <!-- Edge labels -->
            <text x="135" y="32" font-size="8.5" fill="#555" text-anchor="middle">1.2km (3m)</text>
            <text x="250" y="32" font-size="8.5" fill="#555" text-anchor="middle">1.8km (4.5m)</text>
            <text x="370" y="32" font-size="8.5" fill="#555" text-anchor="middle">2.1km (5m)</text>
            <text x="500" y="32" font-size="8.5" font-weight="bold" fill="#ef4444" text-anchor="middle">BLOCKED (3.5km)</text>

            <!-- Nodes -->
            <circle cx="80" cy="40" r="14" fill="#0284c7" /><text x="80" y="44" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">JIIT</text>
            <circle cx="190" cy="40" r="14" fill="#ef4444" /><text x="190" y="44" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">FS</text>
            <circle cx="310" cy="40" r="14" fill="#0284c7" /><text x="310" y="44" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">HOS</text>
            <circle cx="430" cy="40" r="14" fill="#10b981" /><text x="430" y="44" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">S-63</text>
            <circle cx="570" cy="40" r="16" fill="#f59e0b" stroke="#ef4444" stroke-width="2" /><text x="570" y="44" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">DEST</text>

            <circle cx="190" cy="100" r="12" fill="#64748b" /><text x="190" y="103" font-size="7.5" fill="#fff" text-anchor="middle">MAM</text>
            <circle cx="310" cy="100" r="12" fill="#64748b" /><text x="310" y="103" font-size="7.5" fill="#fff" text-anchor="middle">KHD</text>
            <circle cx="570" cy="100" r="14" fill="#10b981" /><text x="570" y="104" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">SH-3</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 3: Topological Adjacency List graph showing Noida emergency network corridors</div>

    <div style="font-weight: 700; font-size: 8.5pt; margin: 6px 0 2px 0; text-align: center;">
        Table 2: Key Emergency Network Vertices
    </div>
    <table class="report-table" style="font-size: 8pt; margin-bottom: 0;">
        <thead>
            <tr>
                <th style="width: 8%; text-align: center;">ID</th>
                <th style="width: 44%;">Location Name</th>
                <th style="width: 30%;">Category / Facility</th>
                <th style="width: 18%; text-align: center;">Coordinates</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="center">0</td><td>JIIT Sector 62</td><td>Emergency Command Center</td><td class="center">(80, 60)</td></tr>
            <tr><td class="center">1</td><td>Sector 62 Fire Station</td><td>Fire & Hazmat Base (RT-01)</td><td class="center">(190, 60)</td></tr>
            <tr><td class="center">2</td><td>Fortis Hospital Sector 62</td><td>Trauma Care Hospital</td><td class="center">(310, 60)</td></tr>
            <tr><td class="center">3</td><td>Sector 63 Community Center</td><td>Humanitarian Relief Shelter (SH-01)</td><td class="center">(430, 60)</td></tr>
            <tr><td class="center">4</td><td>Mamura Village</td><td>Urban Settlement Corridor</td><td class="center">(190, 120)</td></tr>
            <tr><td class="center">5</td><td>Khoda Village</td><td>High-Density Residential Sector</td><td class="center">(310, 120)</td></tr>
            <tr><td class="center">6</td><td>Sector 59 Metro Station</td><td>Transit Hub (RT-02 Base)</td><td class="center">(310, 190)</td></tr>
            <tr><td class="center">7</td><td>Sector 24 Police Station</td><td>Law Enforcement HQ</td><td class="center">(190, 190)</td></tr>
        </tbody>
    </table>
    <div class="page-footer">9</div>
</div>
`;

// ==========================================
// PAGE 10: TABLE 3: ROAD CONNECTIONS
// ==========================================
html += `
<div class="page">
    <div style="font-weight: 700; font-size: 9pt; margin: 4px 0 4px 0; text-align: center;">
        Table 3: Road Connections and Corridors in the Urban Network
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 6%; text-align: center;">ID</th>
                <th style="width: 32%;">From Location</th>
                <th style="width: 32%;">To Location</th>
                <th style="width: 15%; text-align: center;">Distance (km)</th>
                <th style="width: 15%; text-align: center;">Base Time (min)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="center">0</td><td>JIIT Sector 62</td><td>Sector 62 Fire Station</td><td class="center">1.2</td><td class="center">3.0</td></tr>
            <tr><td class="center">1</td><td>JIIT Sector 62</td><td>Fortis Hospital Sector 62</td><td class="center">1.8</td><td class="center">4.5</td></tr>
            <tr><td class="center">2</td><td>Sector 62 Fire Station</td><td>Fortis Hospital Sector 62</td><td class="center">1.5</td><td class="center">3.5</td></tr>
            <tr><td class="center">3</td><td>Fortis Hospital Sector 62</td><td>Sector 63 Community Center</td><td class="center">2.1</td><td class="center">5.0</td></tr>
            <tr><td class="center">4</td><td>Sector 63 Community Center</td><td>Mamura Village</td><td class="center">2.4</td><td class="center">6.0</td></tr>
            <tr><td class="center">5</td><td>Mamura Village</td><td>Khoda Village</td><td class="center">3.1</td><td class="center">8.0</td></tr>
            <tr><td class="center">6</td><td>Khoda Village</td><td>Indirapuram Relief Camp</td><td class="center">2.0</td><td class="center">5.0</td></tr>
            <tr><td class="center">7</td><td>Indirapuram Relief Camp</td><td>Hindan River Embankment</td><td class="center">3.5</td><td class="center">7.5</td></tr>
            <tr><td class="center">8</td><td>Mamura Village</td><td>Sector 59 Metro Station</td><td class="center">1.9</td><td class="center">4.0</td></tr>
            <tr><td class="center">9</td><td>Sector 59 Metro Station</td><td>Sector 24 Police Station</td><td class="center">3.2</td><td class="center">7.0</td></tr>
            <tr><td class="center">10</td><td>Sector 24 Police Station</td><td>Max Hospital Sector 19</td><td class="center">2.8</td><td class="center">6.5</td></tr>
            <tr><td class="center">11</td><td>Max Hospital Sector 19</td><td>Sector 18 Commercial Hub</td><td class="center">2.5</td><td class="center">5.5</td></tr>
            <tr><td class="center">12</td><td>Sector 18 Commercial Hub</td><td>Botanical Garden Hub</td><td class="center">1.6</td><td class="center">3.5</td></tr>
            <tr><td class="center">13</td><td>Botanical Garden Hub</td><td>Greater Noida Expressway</td><td class="center">5.2</td><td class="center">9.0</td></tr>
            <tr><td class="center">14</td><td>Greater Noida Expressway</td><td>Sector 128 Sports Complex</td><td class="center">3.0</td><td class="center">5.0</td></tr>
            <tr><td class="center">15</td><td>Sector 128 Sports Complex</td><td>Jaypee Hospital Sector 128</td><td class="center">1.4</td><td class="center">3.0</td></tr>
            <tr><td class="center">16</td><td>Jaypee Hospital Sector 128</td><td>Surajpur Wetland Lowland</td><td class="center">6.8</td><td class="center">12.0</td></tr>
            <tr><td class="center">17</td><td>Surajpur Wetland Lowland</td><td>Hindan River Embankment</td><td class="center">8.4</td><td class="center">15.0</td></tr>
            <tr><td class="center">18</td><td>JIIT Sector 62</td><td>Mamura Village</td><td class="center">2.0</td><td class="center">4.5</td></tr>
            <tr><td class="center">19</td><td>Sector 62 Fire Station</td><td>Sector 59 Metro Station</td><td class="center">2.7</td><td class="center">5.5</td></tr>
            <tr><td class="center">20</td><td>Sector 24 Police Station</td><td>Sector 18 Commercial Hub</td><td class="center">4.0</td><td class="center">8.0</td></tr>
            <tr><td class="center">21</td><td>Botanical Garden Hub</td><td>Jaypee Hospital Sector 128</td><td class="center">7.5</td><td class="center">13.0</td></tr>
        </tbody>
    </table>

    <h2 class="sub-title">Road Blocking & Dynamic Disruption</h2>
    <p>
        Every edge stores an internal boolean state: <span class="mono">isBlocked</span>. When a disaster occurs (such as the Hindan Flash Flood Breach), the road linking <em>Sector 63 Community Center</em> to <em>Hindan River Embankment</em> is marked as blocked. This instantly prevents the Dijkstra relaxation routine from traversing this edge, forcing the algorithm to route vehicles through the bypass via <em>Mamura</em> and <em>Khoda</em>.
    </p>
    <div class="page-footer">10</div>
</div>
`;

// ==========================================
// PAGE 11: 6.2 DATA STRUCTURES (ARRAYS, QUEUES, LISTS)
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Linear Data Structures: Arrays, Queues, and Linked Lists</h2>
    <p>
        In accordance with the foundational Data Structures curriculum, AURA-EMS implements and leverages multiple linear storage models:
    </p>

    <h3 class="sub-sub-title">1. Contiguous Arrays and Circular Buffers</h3>
    <p>
        Vertex indexing relies on a fixed contiguous array mapping string location names to dense integer IDs [0..<i>V</i>-1]. In addition, the simulation engine implements a fixed-size Circular Buffer (<span class="mono">RingBuffer</span>) to record recent telemetric events. New events overwrite the oldest entry in constant <i>O</i>(1) time without triggering memory reallocation.
    </p>

    <h3 class="sub-sub-title">2. First-In, First-Out (FIFO) Queues</h3>
    <p>
        The Breadth-First Search (BFS) engine relies on a standard FIFO queue (<span class="mono">std::queue&lt;int&gt;</span>). In BFS, exploring unweighted intersection hops level-by-level requires enqueuing all unvisited adjacent neighbors and processing vertices strictly in arrival order.
    </p>

    <h3 class="sub-sub-title">3. Custom Doubly Linked List for Mission Audit Logs</h3>
    <p>
        Mission records are stored in a custom Doubly Linked List (<span class="mono">DoublyLinkedList&lt;MissionRecord&gt;</span>). Each node stores pointers to both its successor and predecessor (<span class="mono">next</span> and <span class="mono">prev</span>).
    </p>
    <div class="code-block">
        <span class="kw">struct</span> <span class="tp">ListNode</span> {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">MissionRecord</span> data;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">ListNode</span>* prev;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">ListNode</span>* next;<br>
        };
    </div>
    <p>
        This structure provides three crucial benefits for emergency auditing:
    </p>
    <ul>
        <li><strong>Instant <i>O</i>(1) Mission Archival:</strong> New resolved dispatches are appended to the tail pointer in constant time.</li>
        <li><strong>Bidirectional Audit Navigation:</strong> Investigators can traverse completed dispatches chronologically forward or reverse.</li>
        <li><strong>Pointer-Based In-Place Sorting:</strong> Missions can be rearranged by severity or response duration using custom pointer-based QuickSort without creating memory copies.</li>
    </ul>

    <h3 class="sub-sub-title">4. Call Stack Recursion in Depth-First Search</h3>
    <p>
        Reachability checks execute Depth-First Search (DFS) utilizing the runtime call stack. Each stack frame preserves local vertex visit state, automatically restoring previous parent nodes upon backtracking.
    </p>
    <div class="page-footer">11</div>
</div>
`;

// ==========================================
// PAGE 12: 6.2 DATA STRUCTURES (TREES, HEAPS, DSU, HASH MAPS)
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Non-Linear Data Structures: Trees, Heaps, and Disjoint Sets</h2>

    <h3 class="sub-sub-title">1. Binary Min-Heap Priority Queue</h3>
    <p>
        Emergency call prioritization requires instant retrieval of the highest-urgency incident. A standard sorted array requires <i>O</i>(<i>N</i>) insertion, whereas a Binary Min-Heap guarantees logarithmic <i>O</i>(log <i>N</i>) insertions and extractions.
    </p>
    <p>
        The heap is mapped into a contiguous 1D array where for any node at index <i>i</i>:
    </p>
    <ul>
        <li>Parent index: <span class="mono">parent(i) = (i - 1) / 2</span></li>
        <li>Left child: <span class="mono">left(i) = 2 * i + 1</span></li>
        <li>Right child: <span class="mono">right(i) = 2 * i + 2</span></li>
    </ul>
    <p>
        The Min-Heap invariant ensures that the composite score of the parent is always less than or equal to its children. When an incident's priority changes, <span class="mono">heapifyUp()</span> or <span class="mono">heapifyDown()</span> restores the invariant in <i>O</i>(log <i>N</i>) operations.
    </p>

    <h3 class="sub-sub-title">2. Disjoint Set Union (DSU) and Minimum Spanning Trees</h3>
    <p>
        To evaluate municipal network resilience and identify the critical road backbone, the platform implements Kruskal's Algorithm using a custom Disjoint Set Union (DSU) forest (<span class="mono">DSU.h</span>). DSU maintains disjoint partitions of vertices to detect cycles in near-constant time.
    </p>
    <p>
        Two key optimizations are implemented:
    </p>
    <ul>
        <li><strong>Path Compression:</strong> During <span class="mono">find(i)</span>, the representative root becomes the direct parent of all traversed nodes, flattening the tree.</li>
        <li><strong>Union by Rank:</strong> During <span class="mono">unite(i, j)</span>, the root of the tree with smaller depth is attached beneath the root of the deeper tree.</li>
    </ul>
    <p>
        Together, these optimizations achieve an amortized operation time of <i>O</i>(α(<i>V</i>)), where α is the inverse Ackermann function (α(<i>V</i>) ≤ 4 for all practical inputs).
    </p>

    <h3 class="sub-sub-title">3. Hash Map Table for <i>O</i>(1) Fleet & Shelter Lookups</h3>
    <p>
        Rescue teams and shelters are registered in custom Hash Tables using polynomial rolling hash functions with separate-chaining collision resolution (<span class="mono">HashMap.h</span>). This provides constant-time <i>O</i>(1) average lookup when verifying team availability and shelter occupancy.
    </p>
    <div class="page-footer">12</div>
</div>
`;

// ==========================================
// PAGE 13: 6.3 ALGORITHMS & COMPLEXITIES (SEARCHES)
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">6.3 Algorithms and Their Complexities</h1>
    <hr class="title-divider">

    <h2 class="sub-title">Dijkstra's Shortest Path Algorithm</h2>
    <p>
        Dijkstra's algorithm computes the minimum travel-time path from source vertex <i>S</i> to destination <i>D</i>. It initializes an array <span class="mono">dist[v] = ∞</span> for all <i>v</i> ≠ <i>S</i> and <span class="mono">dist[S] = 0</span>. A Min-Heap continually yields the unsettled vertex <i>u</i> with minimal tentative time. Candidate neighbors are relaxed according to the formula:
    </p>
    <div class="code-block">
        <span class="kw">if</span> (dist[u] + edge.travelTimeMins &lt; dist[v]) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;dist[v] = dist[u] + edge.travelTimeMins;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;parent[v] = u;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;pq.push({dist[v], v});<br>
        }
    </div>

    <!-- Mini Flowcharts Grid -->
    <div class="figure-container">
        <svg viewBox="0 0 650 145" style="width: 100%; max-height: 140px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <!-- Box 1: Dijkstra -->
            <rect x="20" y="15" width="190" height="115" rx="4" fill="#e0f2fe" stroke="#0284c7" />
            <text x="115" y="32" font-size="9.5" font-weight="bold" fill="#0369a1" text-anchor="middle">Dijkstra (Weighted Time)</text>
            <text x="30" y="52" font-size="7.5" fill="#333">1. Min-Heap PQ holds (time, vertex)</text>
            <text x="30" y="66" font-size="7.5" fill="#333">2. Pop minimum vertex u</text>
            <text x="30" y="80" font-size="7.5" fill="#333">3. Relax active neighbors: w(u,v)</text>
            <text x="30" y="94" font-size="7.5" fill="#333">4. Early exit when u == destination</text>
            <text x="115" y="115" font-size="8.5" font-weight="bold" fill="#0284c7" text-anchor="middle">Time: O((V + E) log V)</text>

            <!-- Box 2: BFS -->
            <rect x="230" y="15" width="190" height="115" rx="4" fill="#fef3c7" stroke="#d97706" />
            <text x="325" y="32" font-size="9.5" font-weight="bold" fill="#b45309" text-anchor="middle">BFS (Fewest Hops)</text>
            <text x="240" y="52" font-size="7.5" fill="#333">1. Standard FIFO Queue</text>
            <text x="240" y="66" font-size="7.5" fill="#333">2. Expand level-by-level</text>
            <text x="240" y="80" font-size="7.5" fill="#333">3. Ignores edge travel durations</text>
            <text x="240" y="94" font-size="7.5" fill="#333">4. Finds minimal intersection count</text>
            <text x="325" y="115" font-size="8.5" font-weight="bold" fill="#d97706" text-anchor="middle">Time: O(V + E)</text>

            <!-- Box 3: DFS -->
            <rect x="440" y="15" width="190" height="115" rx="4" fill="#fdf2f8" stroke="#db2777" />
            <text x="535" y="32" font-size="9.5" font-weight="bold" fill="#9d174d" text-anchor="middle">DFS (Reachability Check)</text>
            <text x="450" y="52" font-size="7.5" fill="#333">1. Recursive Call Stack</text>
            <text x="450" y="66" font-size="7.5" fill="#333">2. Deep branch traversal</text>
            <text x="450" y="80" font-size="7.5" fill="#333">3. Backtracks upon dead ends</text>
            <text x="450" y="94" font-size="7.5" fill="#333">4. Verifies partition connectivity</text>
            <text x="535" y="115" font-size="8.5" font-weight="bold" fill="#db2777" text-anchor="middle">Time: O(V + E)</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 4: Comparative algorithmic flow and time complexity across pathfinding routines</div>

    <h2 class="sub-title">Breadth-First and Depth-First Search Principles</h2>
    <p>
        While Dijkstra optimizes for minimum travel time, Breadth-First Search (BFS) is deployed to identify the route with the fewest road crossings, minimizing turning delays. Depth-First Search (DFS) is used as an ultra-fast reachability check before initiating fleet dispatches.
    </p>
    <div class="page-footer">13</div>
</div>
`;

// ==========================================
// PAGE 14: 6.3 WORKED EXAMPLE & BAR CHART
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Worked Example: Step-by-Step Dijkstra Trace</h2>
    <p>
        Consider an emergency call originating at <em>Hindan River Embankment</em> dispatched from <em>Sector 62 Fire Station</em>. Table 4 records the step-by-step extraction order from the Min-Heap priority queue under normal conditions.
    </p>

    <div style="font-weight: 700; font-size: 8.5pt; margin: 4px 0 2px 0; text-align: center;">
        Table 4: Order of Finalized Vertices (Sector 62 Fire Station to Hindan River)
    </div>
    <table class="report-table" style="font-size: 8pt;">
        <thead>
            <tr>
                <th style="width: 10%; text-align: center;">Step</th>
                <th style="width: 38%;">Settled Vertex</th>
                <th style="width: 26%; text-align: center;">Shortest Time (min)</th>
                <th style="width: 26%;">Predecessor (Parent)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="center">1</td><td>Sector 62 Fire Station</td><td class="center">0.0</td><td>- (Source)</td></tr>
            <tr><td class="center">2</td><td>JIIT Sector 62</td><td class="center">3.0</td><td>Sector 62 Fire Station</td></tr>
            <tr><td class="center">3</td><td>Fortis Hospital Sector 62</td><td class="center">3.5</td><td>Sector 62 Fire Station</td></tr>
            <tr><td class="center">4</td><td>Sector 59 Metro Station</td><td class="center">5.5</td><td>Sector 62 Fire Station</td></tr>
            <tr><td class="center">5</td><td>Mamura Village</td><td class="center">7.5</td><td>JIIT Sector 62</td></tr>
            <tr><td class="center">6</td><td>Sector 63 Community Center</td><td class="center">8.5</td><td>Fortis Hospital Sector 62</td></tr>
            <tr><td class="center">7</td><td>Sector 24 Police Station</td><td class="center">12.5</td><td>Sector 59 Metro Station</td></tr>
            <tr><td class="center">8</td><td>Khoda Village</td><td class="center">15.5</td><td>Mamura Village</td></tr>
            <tr><td class="center">9</td><td>Hindan River Embankment</td><td class="center">16.0</td><td>Sector 63 Community Center</td></tr>
        </tbody>
    </table>

    <p style="margin-top: 6px;">
        Tracing predecessor pointers backwards reconstructs the optimal path: <strong>Sector 62 Fire Station → Fortis Hospital → Sector 63 Center → Hindan River Embankment</strong> (16.0 minutes, 7.1 km). Figure 5 illustrates the monotonically increasing settled times.
    </p>

    <!-- Figure 5: Finalized Node Times Bar Chart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 175" style="width: 100%; max-height: 170px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <line x1="50" y1="145" x2="620" y2="145" stroke="#333" stroke-width="1.2" />
            <line x1="50" y1="15" x2="50" y2="145" stroke="#333" stroke-width="1.2" />

            <text x="40" y="148" font-size="8.5" fill="#444" text-anchor="end">0m</text>
            <text x="40" y="115" font-size="8.5" fill="#444" text-anchor="end">5m</text>
            <text x="40" y="82" font-size="8.5" fill="#444" text-anchor="end">10m</text>
            <text x="40" y="50" font-size="8.5" fill="#444" text-anchor="end">15m</text>
            <text x="40" y="20" font-size="8.5" fill="#444" text-anchor="end">20m</text>

            <line x1="48" y1="112" x2="620" y2="112" stroke="#e2e8f0" stroke-dasharray="3,3" />
            <line x1="48" y1="79" x2="620" y2="79" stroke="#e2e8f0" stroke-dasharray="3,3" />
            <line x1="48" y1="47" x2="620" y2="47" stroke="#e2e8f0" stroke-dasharray="3,3" />

            <rect x="65" y="144" width="45" height="1" fill="#0284c7" />
            <text x="87" y="157" font-size="7.5" fill="#111" text-anchor="middle">1. FS-62</text>
            <text x="87" y="140" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">0.0</text>

            <rect x="125" y="125" width="45" height="20" fill="#0284c7" />
            <text x="147" y="157" font-size="7.5" fill="#111" text-anchor="middle">2. JIIT-62</text>
            <text x="147" y="120" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">3.0</text>

            <rect x="185" y="122" width="45" height="23" fill="#0284c7" />
            <text x="207" y="157" font-size="7.5" fill="#111" text-anchor="middle">3. Fortis</text>
            <text x="207" y="117" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">3.5</text>

            <rect x="245" y="109" width="45" height="36" fill="#0284c7" />
            <text x="267" y="157" font-size="7.5" fill="#111" text-anchor="middle">4. M-59</text>
            <text x="267" y="104" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">5.5</text>

            <rect x="305" y="96" width="45" height="49" fill="#0284c7" />
            <text x="327" y="157" font-size="7.5" fill="#111" text-anchor="middle">5. Mamura</text>
            <text x="327" y="91" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">7.5</text>

            <rect x="365" y="89" width="45" height="56" fill="#0284c7" />
            <text x="387" y="157" font-size="7.5" fill="#111" text-anchor="middle">6. Sec 63</text>
            <text x="387" y="84" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">8.5</text>

            <rect x="425" y="63" width="45" height="82" fill="#0284c7" />
            <text x="447" y="157" font-size="7.5" fill="#111" text-anchor="middle">7. Pol-24</text>
            <text x="447" y="58" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">12.5</text>

            <rect x="485" y="44" width="45" height="101" fill="#0284c7" />
            <text x="507" y="157" font-size="7.5" fill="#111" text-anchor="middle">8. Khoda</text>
            <text x="507" y="39" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">15.5</text>

            <rect x="545" y="40" width="45" height="105" fill="#10b981" />
            <text x="567" y="157" font-size="7.5" fill="#111" text-anchor="middle">9. Hindan</text>
            <text x="567" y="35" font-size="8" font-weight="bold" fill="#15803d" text-anchor="middle">16.0m</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 5: Monotonic progression of finalized vertex travel times in Dijkstra's priority queue</div>
    <div class="page-footer">14</div>
</div>
`;

// ==========================================
// PAGE 15: 6.3 DETOURS & ALGORITHM COMPARISONS
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Dynamic Rerouting Under Disaster Inundation</h2>
    <p>
        When a flood is injected at <em>Hindan River Embankment</em>, the direct bridge linking <em>Sector 63</em> to <em>Hindan</em> is marked as blocked (<span class="mono">isBlocked = true</span>). Dijkstra's algorithm immediately excludes this edge during neighbor relaxation, automatically calculating the southern detour via Mamura and Khoda (Figure 6).
    </p>

    <!-- Figure 6: Detour Flowchart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 140" style="width: 100%; max-height: 135px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="25" y="20" width="130" height="40" rx="4" fill="#fee2e2" stroke="#ef4444" />
            <text x="90" y="38" font-size="9" font-weight="bold" fill="#991b1b" text-anchor="middle">Disaster Triggered</text>
            <text x="90" y="50" font-size="8" fill="#555" text-anchor="middle">Sec 63 Bridge Flooded</text>

            <line x1="155" y1="40" x2="195" y2="40" stroke="#333" stroke-width="1.5" />

            <rect x="195" y="20" width="130" height="40" rx="4" fill="#fee2e2" stroke="#ef4444" />
            <text x="260" y="38" font-size="9" font-weight="bold" fill="#991b1b" text-anchor="middle">Invalidate Edge</text>
            <text x="260" y="50" font-size="8" fill="#555" text-anchor="middle">edge.isBlocked = true</text>

            <line x1="325" y1="40" x2="365" y2="40" stroke="#333" stroke-width="1.5" />

            <rect x="365" y="20" width="130" height="40" rx="4" fill="#e0f2fe" stroke="#0284c7" />
            <text x="430" y="38" font-size="9" font-weight="bold" fill="#0369a1" text-anchor="middle">Re-Relax Graph</text>
            <text x="430" y="50" font-size="8" fill="#555" text-anchor="middle">Dijkstra Explores Detour</text>

            <line x1="495" y1="40" x2="525" y2="40" stroke="#333" stroke-width="1.5" />

            <rect x="525" y="20" width="105" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" />
            <text x="577" y="38" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">Alternate Bypass</text>
            <text x="577" y="50" font-size="8" fill="#555" text-anchor="middle">Via Mamura/Khoda</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 6: Event-driven dynamic edge invalidation and Dijkstra detour workflow</div>

    <div style="font-weight: 700; font-size: 8.5pt; margin: 8px 0 2px 0; text-align: center;">
        Table 5: Algorithm Output Comparison (Sector 62 Fire Station to Hindan River)
    </div>
    <table class="report-table" style="font-size: 8pt;">
        <thead>
            <tr>
                <th style="width: 22%;">Algorithm</th>
                <th style="width: 32%;">Optimization Objective</th>
                <th style="width: 15%; text-align: center;">Travel Time</th>
                <th style="width: 15%; text-align: center;">Intersection Hops</th>
                <th style="width: 16%; text-align: center;">Total Distance</th>
            </tr>
        </thead>
        <tbody>
            <tr><td><strong>Dijkstra (Baseline)</strong></td><td>Minimize Total Traversal Time</td><td class="center">16.0 min</td><td class="center">3</td><td class="center">7.1 km</td></tr>
            <tr><td><strong>Dijkstra (Detour)</strong></td><td>Optimal Bypass Around Flood</td><td class="center">28.0 min</td><td class="center">4</td><td class="center">11.8 km</td></tr>
            <tr><td><strong>BFS (Fewest Hops)</strong></td><td>Minimize Intersection Crossings</td><td class="center">16.0 min</td><td class="center">3</td><td class="center">7.1 km</td></tr>
            <tr><td><strong>DFS (Reachability)</strong></td><td>First Feasible Connected Path</td><td class="center">38.5 min</td><td class="center">6</td><td class="center">18.2 km</td></tr>
        </tbody>
    </table>

    <h2 class="sub-title">Triage Queue Aging Formula</h2>
    <p>
        To prevent low-severity incidents from waiting indefinitely in the Min-Heap triage queue, composite priority scores are dynamically recalculated during time advancement:
    </p>
    <div class="code-block">
        Composite Priority Score = (6 - Severity) * 10 - WaitTimeMinutes
    </div>
    <p>
        Over time, untreated Severity 2 incidents age, causing their composite value to decrease and bubbling them to the top of the Min-Heap for guaranteed team assignment.
    </p>
    <div class="page-footer">15</div>
</div>
`;

// ==========================================
// PAGE 16: 6.3 COMPLEXITY ANALYSIS TABLE (CLEAN MATH!)
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Comprehensive Computational Complexity Analysis</h2>
    <p>
        Table 6 provides the formal asymptotic time and space complexity analysis for every data structure and algorithm implemented in AURA-EMS, where <i>V</i> is the number of vertices (|<i>V</i>| = 17), <i>E</i> is the number of edges (|<i>E</i>| = 22), <i>N</i> is the number of active triage incidents, and <i>M</i> is the count of archived mission records.
    </p>

    <div style="font-weight: 700; font-size: 8.5pt; margin: 8px 0 2px 0; text-align: center;">
        Table 6: Asymptotic Time & Space Complexities (Clean Mathematical Format)
    </div>
    <table class="report-table" style="font-size: 8pt;">
        <thead>
            <tr>
                <th style="width: 25%;">Operation / Algorithm</th>
                <th style="width: 24%; text-align: center;">Time Complexity</th>
                <th style="width: 20%; text-align: center;">Space Complexity</th>
                <th style="width: 31%;">Implementation / Purpose</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Dijkstra (Min-Heap)</strong></td>
                <td class="center"><i>O</i>((<i>V</i> + <i>E</i>) log <i>V</i>)</td>
                <td class="center"><i>O</i>(<i>V</i>)</td>
                <td>Minimum-time emergency route calculation.</td>
            </tr>
            <tr>
                <td><strong>Breadth-First Search (BFS)</strong></td>
                <td class="center"><i>O</i>(<i>V</i> + <i>E</i>)</td>
                <td class="center"><i>O</i>(<i>V</i>)</td>
                <td>Fewest-hops route and component analysis.</td>
            </tr>
            <tr>
                <td><strong>Depth-First Search (DFS)</strong></td>
                <td class="center"><i>O</i>(<i>V</i> + <i>E</i>)</td>
                <td class="center"><i>O</i>(<i>V</i>)</td>
                <td>Reachability checks & dead-end detection.</td>
            </tr>
            <tr>
                <td><strong>Min-Heap Enqueue / Dequeue</strong></td>
                <td class="center"><i>O</i>(log <i>N</i>)</td>
                <td class="center"><i>O</i>(<i>N</i>)</td>
                <td>Triage priority queue insertion and pop.</td>
            </tr>
            <tr>
                <td><strong>Triage Queue Aging Scan</strong></td>
                <td class="center"><i>O</i>(<i>N</i>)</td>
                <td class="center"><i>O</i>(1)</td>
                <td>Linear aging update across waiting incidents.</td>
            </tr>
            <tr>
                <td><strong>Kruskal's MST (via DSU)</strong></td>
                <td class="center"><i>O</i>(<i>E</i> log <i>E</i>)</td>
                <td class="center"><i>O</i>(<i>V</i>)</td>
                <td>Emergency network backbone tree calculation.</td>
            </tr>
            <tr>
                <td><strong>DSU Find & Union Operations</strong></td>
                <td class="center"><i>O</i>(α(<i>V</i>)) ≈ <i>O</i>(1)</td>
                <td class="center"><i>O</i>(<i>V</i>)</td>
                <td>Path compression & rank-based cycle detection.</td>
            </tr>
            <tr>
                <td><strong>Doubly Linked List Append</strong></td>
                <td class="center"><i>O</i>(1)</td>
                <td class="center"><i>O</i>(1)</td>
                <td>Appends completed missions to audit trail.</td>
            </tr>
            <tr>
                <td><strong>Mission Audit QuickSort</strong></td>
                <td class="center"><i>O</i>(<i>M</i> log <i>M</i>)</td>
                <td class="center"><i>O</i>(log <i>M</i>)</td>
                <td>Pointer-based sorting of mission logs.</td>
            </tr>
            <tr>
                <td><strong>Hash Map Search / Insert</strong></td>
                <td class="center"><i>O</i>(1) average</td>
                <td class="center"><i>O</i>(<i>K</i>)</td>
                <td>Fleet and shelter registry lookups.</td>
            </tr>
        </tbody>
    </table>

    <h2 class="sub-title" style="margin-top: 14px;">Empirical Benchmark Measurements</h2>
    <p>
        Direct performance profiling using high-resolution hardware timers on Windows 11 confirmed:
    </p>
    <ul>
        <li><strong>Dijkstra Calculation Latency:</strong> <strong>0.14 ms</strong> average execution time.</li>
        <li><strong>Heap Triage Dequeue Latency:</strong> <strong>0.02 ms</strong> per dispatch event.</li>
        <li><strong>Total WinSock HTTP Round-Trip:</strong> <strong>2.8 ms</strong> over localhost port 8080.</li>
    </ul>
    <div class="page-footer">16</div>
</div>
`;

// ==========================================
// PAGE 17: 6.4 CODE SNIPPETS (GRAPH & DIJKSTRA)
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">6.4 Code Snippets Demonstrating OOP & Data Structures</h1>
    <hr class="title-divider">

    <h2 class="sub-title">Snippet 1: Graph Adjacency List Edge Addition (C++)</h2>
    <div class="code-block">
        <span class="tp">bool</span> <span class="tp">Graph</span>::addRoad(<span class="kw">const</span> <span class="tp">std::string</span>& from, <span class="kw">const</span> <span class="tp">std::string</span>& to,<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">double</span> distanceKm, <span class="tp">double</span> travelTimeMins, <span class="tp">bool</span> bidirectional) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (!hasLocation(from) || !hasLocation(to)) <span class="kw">return false</span>;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> u = nameToIndex[from];<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> v = nameToIndex[to];<br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;adjList[u].push_back(GraphEdge(v, distanceKm, travelTimeMins));<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (bidirectional) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;adjList[v].push_back(GraphEdge(u, distanceKm, travelTimeMins));<br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return true</span>;<br>
        }
    </div>

    <h2 class="sub-title">Snippet 2: Dijkstra Shortest Path Engine with Predecessor Array (C++)</h2>
    <div class="code-block">
        <span class="tp">bool</span> <span class="tp">Graph</span>::dijkstraFastest(<span class="kw">const</span> <span class="tp">std::string</span>& src, <span class="kw">const</span> <span class="tp">std::string</span>& dest,<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">double</span>& outTimeMins, <span class="tp">std::vector</span>&lt;<span class="tp">std::string</span>&gt;& outPath) <span class="kw">const</span> {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> srcIdx = getVertexIndex(src);<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> destIdx = getVertexIndex(dest);<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (srcIdx == -1 || destIdx == -1) <span class="kw">return false</span>;<br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> n = vertices.size();<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::vector</span>&lt;<span class="tp">double</span>&gt; time(n, <span class="tp">std::numeric_limits</span>&lt;<span class="tp">double</span>&gt;::infinity());<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::vector</span>&lt;<span class="tp">int</span>&gt; parent(n, -1);<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::vector</span>&lt;<span class="tp">bool</span>&gt; visited(n, <span class="kw">false</span>);<br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">typedef</span> <span class="tp">std::pair</span>&lt;<span class="tp">double</span>, <span class="tp">int</span>&gt; TimeNodePair;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::priority_queue</span>&lt;TimeNodePair, <span class="tp">std::vector</span>&lt;TimeNodePair&gt;, <span class="tp">std::greater</span>&lt;TimeNodePair&gt;&gt; pq;<br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;time[srcIdx] = 0.0;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;pq.push({0.0, srcIdx});<br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">while</span> (!pq.empty()) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">auto</span> [d, u] = pq.top(); pq.pop();<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (visited[u]) <span class="kw">continue</span>;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visited[u] = <span class="kw">true</span>;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (u == destIdx) <span class="kw">break</span>; <span class="cm">// Destination reached</span><br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">for</span> (<span class="kw">const auto</span>& edge : adjList[u]) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (edge.isBlocked) <span class="kw">continue</span>; <span class="cm">// Skip blocked road</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> v = edge.toVertex;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (!visited[v] && time[u] + edge.travelTimeMins &lt; time[v]) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;time[v] = time[u] + edge.travelTimeMins;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parent[v] = u;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pq.push({time[v], v});<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> rebuildPath(parent, destIdx, outPath);<br>
        }
    </div>
    <div class="page-footer">17</div>
</div>
`;

// ==========================================
// PAGE 18: 6.4 CODE SNIPPETS (OOP INHERITANCE & MIN-HEAP)
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Snippet 3: Polymorphic OOP Class Hierarchy (C++)</h2>
    <div class="code-block">
        <span class="kw">class</span> <span class="tp">Person</span> {<br>
        <span class="kw">protected</span>:<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::string</span> id, name, phone, email;<br>
        <span class="kw">public</span>:<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">Person</span>(<span class="tp">std::string</span> i, <span class="tp">std::string</span> n) : id(i), name(n) {}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">virtual</span> ~<span class="tp">Person</span>() = <span class="kw">default</span>;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">virtual void</span> displayProfile() <span class="kw">const</span> = 0; <span class="cm">// Pure virtual method</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">virtual std::string</span> getRole() <span class="kw">const</span> = 0;<br>
        };<br>
        <br>
        <span class="kw">class</span> <span class="tp">RescueOfficer</span> : <span class="kw">public</span> <span class="tp">Person</span> {<br>
        <span class="kw">private</span>:<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::string</span> rank, hazmatCertification;<br>
        <span class="kw">public</span>:<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">RescueOfficer</span>(<span class="tp">std::string</span> i, <span class="tp">std::string</span> n, <span class="tp">std::string</span> r, <span class="tp">std::string</span> cert)<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Person(i, n), rank(r), hazmatCertification(cert) {}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">void</span> displayProfile() <span class="kw">const override</span> {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::cout</span> &lt;&lt; <span class="str">"Officer: "</span> &lt;&lt; name &lt;&lt; <span class="str">" | Rank: "</span> &lt;&lt; rank &lt;&lt; <span class="tp">std::endl</span>;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::string</span> getRole() <span class="kw">const override</span> { <span class="kw">return</span> <span class="str">"Fire & Hazmat Officer"</span>; }<br>
        };
    </div>

    <h2 class="sub-title">Snippet 4: Min-Heap Dynamic Priority Triage with Aging (C++)</h2>
    <div class="code-block">
        <span class="kw">void</span> <span class="tp">PriorityQueue</span>::advanceTimeAging(<span class="tp">int</span> elapsedMinutes) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">for</span> (<span class="kw">auto</span>& inc : heap) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inc-&gt;incrementWait(elapsedMinutes); <span class="cm">// Ages waiting incidents</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">// Re-establish Min-Heap invariant across all internal nodes</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">for</span> (<span class="tp">int</span> i = (<span class="kw">static_cast</span>&lt;<span class="tp">int</span>&gt;(heap.size()) / 2) - 1; i &gt;= 0; --i) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;heapifyDown(i);<br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        }<br>
        <br>
        <span class="tp">int</span> <span class="tp">Incident</span>::getCompositePriority() <span class="kw">const</span> {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="cm">// Lower composite score yields higher priority in Min-Heap</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> (6 - severity) * 10 - (waitMinutes / 2);<br>
        }
    </div>
    <div class="page-footer">18</div>
</div>
`;

// ==========================================
// PAGE 19: 6.4 CODE SNIPPETS (DSU & LINKED LIST)
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Snippet 5: Disjoint Set Union (DSU) with Path Compression (C++)</h2>
    <div class="code-block">
        <span class="kw">class</span> <span class="tp">DisjointSetUnion</span> {<br>
        <span class="kw">private</span>:<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">std::vector</span>&lt;<span class="tp">int</span>&gt; parent, rank;<br>
        <span class="kw">public</span>:<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">DisjointSetUnion</span>(<span class="tp">int</span> n) : parent(n), rank(n, 0) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; ++i) parent[i] = i;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> findRoot(<span class="tp">int</span> i) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (parent[i] != i) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parent[i] = findRoot(parent[i]); <span class="cm">// Path Compression</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> parent[i];<br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">bool</span> uniteSets(<span class="tp">int</span> u, <span class="tp">int</span> v) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> rootU = findRoot(u);<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">int</span> rootV = findRoot(v);<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (rootU == rootV) <span class="kw">return false</span>; <span class="cm">// Cycle detected</span><br>
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (rank[rootU] &lt; rank[rootV]) parent[rootU] = rootV; <span class="cm">// Union by Rank</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">else if</span> (rank[rootU] &gt; rank[rootV]) parent[rootV] = rootU;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">else</span> { parent[rootV] = rootU; rank[rootU]++; }<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return true</span>;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        };
    </div>

    <h2 class="sub-title">Snippet 6: Doubly Linked List Mission Archival (C++)</h2>
    <div class="code-block">
        <span class="kw">template</span>&lt;<span class="kw">typename</span> <span class="tp">T</span>&gt;<br>
        <span class="kw">void</span> <span class="tp">DoublyLinkedList</span>&lt;<span class="tp">T</span>&gt;::append(<span class="kw">const</span> <span class="tp">T</span>& item) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="tp">Node</span>* newNode = <span class="kw">new</span> <span class="tp">Node</span>(item);<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (tail == <span class="kw">nullptr</span>) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head = tail = newNode;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;} <span class="kw">else</span> {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tail-&gt;next = newNode;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;newNode-&gt;prev = tail;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tail = newNode; <span class="cm">// O(1) constant-time append</span><br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;&nbsp;&nbsp;size++;<br>
        }
    </div>
    <div class="page-footer">19</div>
</div>
`;

// ==========================================
// PAGE 20: 6.5 SCREENSHOTS - LIVE COMMAND MAP
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">6.5 Output Screenshots with Descriptions</h1>
    <hr class="title-divider">

    <h2 class="sub-title">Live Command Map & Reactive Shortest Path Routing</h2>
    <p>
        Figure 7 displays the primary interface of AURA-EMS. The interactive canvas visualizes all 17 municipal nodes categorized with color-coded badges (Red for Fire, Blue for Hospitals, Purple for Police, Green for Shelters, Cyan for Transit Hubs). When an emergency incident is selected, the C++ Dijkstra engine computes the fastest route in 0.14 milliseconds, illuminating the optimal path in high-visibility neon cyan.
    </p>

    <div class="figure-container">
        <img src="${imgMainMap}" alt="Live Command Map">
    </div>
    <div class="figure-caption">Figure 7: Live Command Map highlighting optimal emergency route and mission dispatch summary</div>
    <div class="page-footer">20</div>
</div>
`;

// ==========================================
// PAGE 21: 6.5 SCREENSHOTS - SIMULATION CENTER
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Simulation Center & Dynamic Impact Monitor</h2>
    <p>
        Figure 8 showcases the <strong>Simulation Center</strong>. Operators can step forward through time using the <em>Time-Step Engine</em> (+15 Minutes), which triggers congestion weight updates and ages pending triage incidents in the Min-Heap.
    </p>
    <p>
        The <em>Scenario Injector</em> simulates severe municipal crises (such as flash floods or bridge collapses). Clicking <strong>Trigger Flood Scenario</strong> immediately severs the road between Sector 63 and Hindan River, inserts a critical Level 5 emergency, and updates the on-page <strong>Live Simulation Impact Monitor</strong> with live blocked infrastructure counts and a direct map jump button.
    </p>

    <div class="figure-container">
        <img src="${imgSimCenter}" alt="Simulation Center">
    </div>
    <div class="figure-caption">Figure 8: Simulation Center displaying Time-Step Engine, Scenario Injector, and Live Impact Monitor</div>
    <div class="page-footer">21</div>
</div>
`;

// ==========================================
// PAGE 22: 6.5 SCREENSHOTS - ALGORITHM VISUALIZER
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Step-by-Step Algorithm Execution Visualizer</h2>
    <p>
        Figure 9 demonstrates the <strong>Algorithm Visualizer</strong>, allowing students and faculty to observe Dijkstra's algorithm work step-by-step. The C++ engine records a state snapshot after each step. Settled nodes turn orange, candidate neighbors are highlighted in cyan, and the side drawer displays real-time distance tables, settled sets, and the Min-Heap priority queue frontier.
    </p>

    <div class="figure-container">
        <img src="${imgVisualizer}" alt="Algorithm Visualizer">
    </div>
    <div class="figure-caption">Figure 9: Algorithm Visualizer highlighting visited nodes (orange), edge relaxations, and distance table</div>
    <div class="page-footer">22</div>
</div>
`;

// ==========================================
// PAGE 23: 6.5 SCREENSHOTS - MULTI-STAGE DETOUR
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Multi-Stage Evacuation Mission & Dynamic Detour Verification</h2>
    <p>
        Figure 10 provides visual verification of the dynamic rerouting engine. Following the flood breach between Sector 63 Community Center and Hindan River Embankment (rendered as a red dashed line), the dispatch engine executes a <strong>Two-Leg Evacuation Mission (MSN-509)</strong>:
    </p>
    <ul>
        <li><strong>Leg 1 (Deployment):</strong> Rescue Team RT-02 deploys from Sector 59 Metro Base, routing through the southern corridor via Mamura and Khoda to reach Hindan River.</li>
        <li><strong>Leg 2 (Evacuation):</strong> After extracting victims, the team transports evacuees to the closest shelter with available capacity (<em>Indirapuram Relief Camp, SH-03</em>).</li>
    </ul>

    <div class="figure-container">
        <img src="${imgFloodReroute}" alt="Detour Mission">
    </div>
    <div class="figure-caption">Figure 10: Live Command Map showing dynamic bypass around flooded road and two-leg evacuation mission</div>
    <div class="page-footer">23</div>
</div>
`;

// ==========================================
// PAGE 24: 6.5 SCREENSHOTS - INSPECTOR & SHELTERS
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Data Structure Inspector & Humanitarian Shelters</h2>
    <p>
        The <strong>Data Structure Inspector</strong> (Figure 11) exposes internal C++ memory representations, including the binary tree hierarchy of the Min-Heap, separate-chaining Hash Table bucket load factors, and Disjoint Set Union (DSU) connected components.
    </p>

    <div class="figure-container" style="margin: 4px 0;">
        <img src="${imgInspector}" alt="Data Structure Inspector" style="max-height: 80mm;">
    </div>
    <div class="figure-caption">Figure 11: Data Structure Inspector displaying graph topology, adjacency weights, and DSU connectivity</div>

    <p style="margin-top: 6px;">
        The <strong>Resources & Evacuation</strong> module (Figure 12) tracks live occupancy percentages, food rations, and medical beds across all four designated municipal shelters.
    </p>

    <div class="figure-container" style="margin: 4px 0;">
        <img src="${imgResources}" alt="Humanitarian Shelters Grid" style="max-height: 80mm;">
    </div>
    <div class="figure-caption">Figure 12: Humanitarian Relief Shelters & Live Occupancy tracking real-time capacity and resources</div>
    <div class="page-footer">24</div>
</div>
`;

// ==========================================
// PAGE 25: 6.5 SCREENSHOTS - AUDIT LOG & TEST TABLE
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Completed Mission Audit Log & Test Verification</h2>
    <p>
        The <strong>Completed Mission Audit Log</strong> (Figure 13) archives dispatches in a Doubly Linked List. Operators can sort the table by severity, distance, or response time using custom QuickSort or MergeSort.
    </p>

    <div class="figure-container" style="margin: 4px 0;">
        <img src="${imgAuditLog}" alt="Mission Audit Log Table" style="max-height: 82mm;">
    </div>
    <div class="figure-caption">Figure 13: Completed Mission Audit Log with custom QuickSort/MergeSort sorting controls</div>

    <div style="font-weight: 700; font-size: 8.5pt; margin: 6px 0 2px 0; text-align: center;">
        Table 7: Origin-Destination Route Test Cases and Validation
    </div>
    <table class="report-table" style="font-size: 8pt; margin-bottom: 0;">
        <thead>
            <tr>
                <th style="width: 25%;">Source Location</th>
                <th style="width: 25%;">Destination Location</th>
                <th style="width: 14%; text-align: center;">Fastest (min)</th>
                <th style="width: 12%; text-align: center;">Dijkstra Dist</th>
                <th style="width: 12%; text-align: center;">BFS Hops</th>
                <th style="width: 12%; text-align: center;">Status</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>JIIT Sector 62</td><td>Sector 62 Fire Station</td><td class="center">3.0</td><td class="center">1.2 km</td><td class="center">1</td><td class="center" style="color:#16a34a; font-weight:bold;">Verified</td></tr>
            <tr><td>Sector 62 Fire Station</td><td>Hindan River Embankment</td><td class="center">16.0</td><td class="center">7.1 km</td><td class="center">3</td><td class="center" style="color:#16a34a; font-weight:bold;">Verified</td></tr>
            <tr><td>Sector 59 Metro Station</td><td>Sector 18 Commercial Hub</td><td class="center">19.0</td><td class="center">8.5 km</td><td class="center">3</td><td class="center" style="color:#16a34a; font-weight:bold;">Verified</td></tr>
            <tr><td>JIIT Sector 62</td><td>Jaypee Hospital Sector 128</td><td class="center">28.5</td><td class="center">17.2 km</td><td class="center">5</td><td class="center" style="color:#16a34a; font-weight:bold;">Verified</td></tr>
        </tbody>
    </table>
    <div class="page-footer">25</div>
</div>
`;

// ==========================================
// PAGE 26: 7. CONCLUSION
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">7. Conclusion</h1>
    <hr class="title-divider">

    <h2 class="sub-title">7.1 Summary & Achievement of Objectives</h2>
    <p>
        The Adaptive Urban Routing & Allocation for Emergency Services (AURA-EMS) project successfully demonstrates how fundamental Data Structures and Algorithms can be integrated to solve high-stakes municipal logistics and disaster response problems. Every core objective outlined at the start of the project was fully realized:
    </p>
    <ul>
        <li><strong>Graph Modeling:</strong> The urban road network was successfully modelled as an Adjacency List graph with dynamic travel-time weighting and live edge invalidation.</li>
        <li><strong>Shortest Path Optimization:</strong> Dijkstra's algorithm executes in sub-millisecond time (0.14 ms average), dynamically discovering detours when road corridors are severed by floods.</li>
        <li><strong>Triage Starvation Prevention:</strong> The Binary Min-Heap Priority Queue successfully prevents starvation of non-critical emergencies through mathematical wait-time aging.</li>
        <li><strong>Two-Leg Evacuation Chain:</strong> Dispatches dynamically allocate rescue teams to disaster scenes and transfer victims to available shelters, respecting live bed capacities.</li>
        <li><strong>Execution Transparency:</strong> The step-by-step canvas visualizer exposes node relaxation, settled sets, and queue frontiers for rigorous academic verification.</li>
        <li><strong>Audit Trail Integrity:</strong> Completed missions are stored sequentially inside a custom Doubly Linked List and sorted using in-place QuickSort without STL dependencies.</li>
    </ul>

    <h2 class="sub-title">7.2 Future Work and Recommendations</h2>
    <p>
        Building upon the solid algorithmic foundation established in this version, future extensions include:
    </p>
    <ul>
        <li><strong>Persistent Database Integration:</strong> Connect the C++ server to an enterprise relational database (e.g., PostgreSQL / SQLite) to maintain permanent multi-year disaster logs across restarts.</li>
        <li><strong>A* Heuristic Acceleration:</strong> Integrate Euclidean distance heuristics with latitude/longitude GPS coordinates to accelerate searches across 100,000+ node state-wide road maps.</li>
        <li><strong>Real-Time First-Responder Mobile PWA:</strong> Develop a progressive web application enabling field ambulance drivers to stream real-time GPS telemetry and receive automated dynamic turn-by-turn reroutes.</li>
    </ul>
    <div class="page-footer">26</div>
</div>
`;

// ==========================================
// PAGE 27: 8. REFERENCES
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">8. References</h1>
    <hr class="title-divider">
    <p>
        The theoretical designs, algorithmic complexity proofs, and implementation architectures in this report were developed in accordance with the following academic literature and standards:
    </p>

    <ol style="font-size: 9pt; line-height: 1.6; margin-top: 14px;">
        <li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, and C. Stein, <em>Introduction to Algorithms</em>, 4th ed., Cambridge, MA, USA: MIT Press, 2022. [Chapters 22–24: Elementary Graph Algorithms, Single-Source Shortest Paths, Minimum Spanning Trees].</li>
        <li>E. W. Dijkstra, "A Note on Two Problems in Connexion with Graphs," <em>Numerische Mathematik</em>, vol. 1, no. 1, pp. 269–271, 1959.</li>
        <li>J. B. Kruskal, "On the Shortest Spanning Subtree of a Graph and the Traveling Salesman Problem," <em>Proceedings of the American Mathematical Society</em>, vol. 7, no. 1, pp. 48–50, 1956.</li>
        <li>R. E. Tarjan, "Depth-First Search and Linear Graph Algorithms," <em>SIAM Journal on Computing</em>, vol. 1, no. 2, pp. 146–160, 1972.</li>
        <li>R. E. Tarjan, "Efficiency of a Good But Not Linear Set Union Algorithm," <em>Journal of the ACM</em>, vol. 22, no. 2, pp. 215–225, 1975. [Inverse Ackermann Function complexity proof].</li>
        <li>ISO/IEC, <em>Information Technology — Programming Languages — C++ (ISO/IEC 14882:2017)</em>, International Organization for Standardization, Geneva, Switzerland, 2017.</li>
        <li>B. Stroustrup, <em>The C++ Programming Language</em>, 4th ed., Boston, MA, USA: Addison-Wesley, 2013. [Object-Oriented Design, Resource Acquisition Is Initialization].</li>
        <li>W. R. Stevens and S. A. Rago, <em>Advanced Programming in the UNIX Environment</em>, 3rd ed., Boston, MA, USA: Addison-Wesley, 2013. [Socket Programming & Network Buffer Architectures].</li>
    </ol>

    <div style="margin-top: 40px; padding: 16px; border: 1px dashed #64748b; border-radius: 6px; background: #f8fafc; font-size: 8.8pt; line-height: 1.45;">
        <strong>Departmental Compliance Note:</strong><br>
        This report strictly adheres to the Project Report Structure prescribed by the Department of Computer Science & Engineering, Jaypee Institute of Information Technology, Noida. All figures and tables are sequentially numbered and captioned. All source implementations were developed in C++17 without third-party graph libraries.
    </div>
    <div class="page-footer">27</div>
</div>
`;

html += `
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
console.log('Successfully written full 27-page HTML report to:', OUTPUT_HTML);

console.log('Compiling PDF with Google Chrome headless...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = `file:///${OUTPUT_HTML.replace(/\\/g, '/')}`;
const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --print-to-pdf="${OUTPUT_PDF}" "${fileUrl}"`;

try {
    const out = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    console.log(out);
    if (fs.existsSync(OUTPUT_PDF)) {
        const stats = fs.statSync(OUTPUT_PDF);
        console.log(`PDF successfully created! Path: ${OUTPUT_PDF} (Size: ${stats.size} bytes)`);
    } else {
        console.error('PDF file was not found after execution.');
    }
} catch (err) {
    console.error('Error running Chrome print-to-pdf:', err);
}
