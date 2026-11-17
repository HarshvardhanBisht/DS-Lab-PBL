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

console.log('Images loaded into memory successfully.');

// We will construct the 27 pages HTML string
let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>AURA-EMS Project Report</title>
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
    font-size: 16pt;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: #000;
}
hr.title-divider {
    border: none;
    border-top: 1.5px solid #000;
    margin: 0 0 14px 0;
}
h2.sub-title {
    font-size: 12.5pt;
    font-weight: 700;
    margin: 12px 0 6px 0;
    color: #111;
}
h3.sub-sub-title {
    font-size: 11pt;
    font-weight: 700;
    margin: 10px 0 4px 0;
    color: #222;
}
p {
    font-size: 10pt;
    line-height: 1.45;
    margin: 0 0 8px 0;
    text-align: justify;
}
ul, ol {
    margin: 4px 0 8px 20px;
    padding: 0;
    font-size: 10pt;
    line-height: 1.45;
}
li {
    margin-bottom: 4px;
}
table.report-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 12px 0;
    font-size: 9pt;
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
    margin: 8px 0;
}
.figure-container img {
    max-width: 95%;
    max-height: 175mm;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.figure-caption {
    font-size: 9.5pt;
    font-style: italic;
    text-align: center;
    margin-top: 5px;
    color: #333;
}
.cover-page {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 40px 24px 30px 24px;
}
.mono {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9pt;
}
</style>
</head>
<body>
`;

// ==========================================
// PAGE 1: COVER PAGE
// ==========================================
html += `
<div class="page cover-page">
    <div>
        <h1 style="font-size: 17pt; font-weight: 800; letter-spacing: 0.5px; margin: 0 0 6px 0; text-transform: uppercase;">
            JAYPEE INSTITUTE OF INFORMATION TECHNOLOGY, NOIDA
        </h1>
        <h2 style="font-size: 15pt; font-weight: 700; margin: 0; text-transform: uppercase; color: #222;">
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
                    <td class="center">2501030058</td>
                    <td>Harshvardhan Bisht</td>
                    <td class="center">B10</td>
                </tr>
                <tr>
                    <td class="center">2</td>
                    <td class="center">2501030054</td>
                    <td>Kashish</td>
                    <td class="center">B10</td>
                </tr>
                <tr>
                    <td class="center">3</td>
                    <td class="center">2501030050</td>
                    <td>Syed Ali Baquir Mehdi</td>
                    <td class="center">B10</td>
                </tr>
                <tr>
                    <td class="center">4</td>
                    <td class="center">2501030046</td>
                    <td>Sanskriti Kaushik</td>
                    <td class="center">B10</td>
                </tr>
            </tbody>
        </table>

        <div style="text-align: left; font-size: 10.5pt; font-weight: 700; line-height: 1.5;">
            Submitted To: Dr. Varun Shrivastav & Dr. Monica
        </div>
    </div>
</div>
`;

// ==========================================
// PAGE 2: INDEX
// ==========================================
html += `
<div class="page">
    <h1 style="text-align: center; font-size: 18pt; font-weight: 700; margin: 0 0 16px 0;">Index</h1>
    <table class="report-table" style="font-size: 9.5pt; margin: 0;">
        <thead>
            <tr>
                <th style="width: 14%; text-align: center;">Sr. No.</th>
                <th style="width: 72%;">Title</th>
                <th style="width: 14%; text-align: center;">Page</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="center"><strong>1</strong></td><td><strong>Introduction</strong></td><td class="center"><strong>3</strong></td></tr>
            <tr><td class="center">1.1</td><td>Overview</td><td class="center">3</td></tr>
            <tr><td class="center">1.2</td><td>Problem Statement</td><td class="center">3</td></tr>
            <tr><td class="center">1.3</td><td>Objectives</td><td class="center">3</td></tr>
            <tr><td class="center">1.4</td><td>Scope</td><td class="center">3</td></tr>

            <tr><td class="center"><strong>2</strong></td><td><strong>Tools and Technologies</strong></td><td class="center"><strong>4</strong></td></tr>

            <tr><td class="center"><strong>3</strong></td><td><strong>System Design</strong></td><td class="center"><strong>5</strong></td></tr>
            <tr><td class="center">3.1</td><td>Graph Model</td><td class="center">5</td></tr>
            <tr><td class="center">3.2</td><td>Data Structures</td><td class="center">7</td></tr>
            <tr><td class="center">3.3</td><td>Architecture</td><td class="center">7</td></tr>
            <tr><td class="center">3.4</td><td>Data Schema</td><td class="center">8</td></tr>

            <tr><td class="center"><strong>4</strong></td><td><strong>Algorithms</strong></td><td class="center"><strong>9</strong></td></tr>
            <tr><td class="center">4.1</td><td>Route Request Flow</td><td class="center">9</td></tr>
            <tr><td class="center">4.2</td><td>Dijkstra's Algorithm (Fastest Route)</td><td class="center">9</td></tr>
            <tr><td class="center">4.3</td><td>Breadth-First Search (Fewest Hops)</td><td class="center">12</td></tr>
            <tr><td class="center">4.4</td><td>Depth-First Search (Reachability Check)</td><td class="center">13</td></tr>
            <tr><td class="center">4.5</td><td>Comparing the Three Searches</td><td class="center">14</td></tr>
            <tr><td class="center">4.6</td><td>Rebuilding the Final Multi-Leg Route</td><td class="center">15</td></tr>
            <tr><td class="center">4.7</td><td>Emergency Resilience: Components and DSU Minimum Spanning Tree</td><td class="center">15</td></tr>
            <tr><td class="center">4.8</td><td>Priority Queue Triage & Aging Mechanics</td><td class="center">16</td></tr>
            <tr><td class="center">4.9</td><td>Complexity</td><td class="center">17</td></tr>

            <tr><td class="center"><strong>5</strong></td><td><strong>Working of the System</strong></td><td class="center"><strong>18</strong></td></tr>
            <tr><td class="center">5.1</td><td>Main Window and Live Command Map</td><td class="center">18</td></tr>
            <tr><td class="center">5.2</td><td>Dynamic Disaster Simulation & Road Blocking</td><td class="center">19</td></tr>
            <tr><td class="center">5.3</td><td>Algorithm Visualizer</td><td class="center">20</td></tr>
            <tr><td class="center">5.4</td><td>Multi-Stage Evacuation Mission & Detour Verification</td><td class="center">21</td></tr>
            <tr><td class="center">5.5</td><td>Data Structure Inspector & Network Topology</td><td class="center">22</td></tr>
            <tr><td class="center">5.6</td><td>Humanitarian Shelters & Live Occupancy</td><td class="center">23</td></tr>
            <tr><td class="center">5.7</td><td>Completed Mission Audit Log (Doubly Linked List)</td><td class="center">23</td></tr>

            <tr><td class="center"><strong>6</strong></td><td><strong>Testing and Results</strong></td><td class="center"><strong>24</strong></td></tr>
            <tr><td class="center">6.1</td><td>Route Tests</td><td class="center">24</td></tr>
            <tr><td class="center">6.2</td><td>Failure Tests</td><td class="center">25</td></tr>
            <tr><td class="center">6.3</td><td>Input Handling</td><td class="center">26</td></tr>

            <tr><td class="center"><strong>7</strong></td><td><strong>Limitations and Future Scope</strong></td><td class="center"><strong>27</strong></td></tr>
            <tr><td class="center">7.1</td><td>Limitations</td><td class="center">27</td></tr>
            <tr><td class="center">7.2</td><td>Future Scope</td><td class="center">27</td></tr>

            <tr><td class="center"><strong>8</strong></td><td><strong>Conclusion</strong></td><td class="center"><strong>27</strong></td></tr>
            <tr><td class="center"></td><td><strong>References</strong></td><td class="center"><strong>27</strong></td></tr>
        </tbody>
    </table>
    <div class="page-footer">2</div>
</div>
`;

// ==========================================
// PAGE 3: 1. INTRODUCTION
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">1. Introduction</h1>
    <hr class="title-divider">

    <h2 class="sub-title">1.1 Overview</h2>
    <p>
        The Adaptive Urban Routing & Allocation for Emergency Services (AURA-EMS) is a high-performance simulation and decision-support platform designed to coordinate urban emergency responses. Behind the screen, the urban road network is modelled as a dynamic weighted graph, where critical infrastructure points (hospitals, fire stations, disaster relief shelters, police posts, and transit hubs) act as vertices, and urban road segments act as bidirectional edges carrying both physical distance and real-time travel durations. We implemented the foundational algorithmic engine in native C++17 and coupled it via standard HTTP REST endpoints to an interactive, real-time command dashboard.
    </p>
    <p>
        Finding an emergency route is only one part of the problem. During major municipal disasters—such as flash floods, chemical hazardous material leaks, or structural collapses—roads become blocked, priority queues experience massive incoming surges, and hospitals reach full bed capacity. AURA-EMS allows emergency coordinators to inspect each algorithm execution step-by-step, simulate live infrastructure failures, evaluate network partition resilience, and monitor automated multi-stage victim evacuations. We developed this project to demonstrate the practical application of fundamental data structures in a real-world scenario.
    </p>

    <h2 class="sub-title">1.2 Problem Statement</h2>
    <p>
        During catastrophic events in dense urban sectors like Noida, standard shortest-distance routing algorithms fail because physical proximity does not imply rapid travel. A corridor measuring 2 km may become completely impassable due to waterlogging or traffic congestion, whereas a 6 km bypass along an expressway remains free-flowing. Furthermore, dispatching teams requires solving two interdependent optimization constraints:
    </p>
    <ol>
        <li><strong>Dynamic Graph Mutations:</strong> Unforeseen disasters suddenly sever edges in the graph, requiring instant topological updates without system reboots or stale cache reads.</li>
        <li><strong>Two-Leg Evacuation Logic:</strong> Emergency vehicles cannot simply drive to a disaster spot; they must deploy from their home station to the incident, extract victims, and safely navigate to the closest available shelter that possesses sufficient bed capacity.</li>
    </ol>
    <p>
        Without an integrated data-structure pipeline, emergency managers struggle to identify network bottlenecks, prevent triage starvation, or compute alternate paths under severe edge constraints.
    </p>

    <h2 class="sub-title">1.3 Objectives</h2>
    <ul>
        <li>Represent the urban road network as an Adjacency List graph with dynamic travel-time weighting and edge-state toggling.</li>
        <li>Find the <strong>fastest route</strong> using an optimized Dijkstra's algorithm powered by a Min-Heap, and the <strong>fewest-hops route</strong> using Breadth-First Search (BFS).</li>
        <li>Implement a Min-Heap Priority Queue for incident triage that uses an aging formula to prevent starvation of low-severity calls.</li>
        <li>Build an interactive Algorithm Visualizer that exposes node relaxation, queue frontier updates, and predecessor tracking step-by-step.</li>
        <li>Simulate disaster events (such as flash floods) that dynamically remove edges and trigger alternate path recalculations.</li>
        <li>Maintain a permanent mission audit log in a Doubly Linked List, supporting custom sorting via QuickSort and MergeSort without relying on standard library sorting routines.</li>
    </ul>

    <h2 class="sub-title">1.4 Scope</h2>
    <p>
        The system models an authentic urban network of 17 key locations and 22 road corridors across Noida (Sectors 62, 63, 59, 24, 18, 128, and river boundaries). Each road segment carries physical distance in kilometres and dynamic travel time in minutes. Macro-scale traffic signal timings and weather forecasts are outside the scope of this project.
    </p>
    <div class="page-footer">3</div>
</div>
`;

// ==========================================
// PAGE 4: 2. TOOLS AND TECHNOLOGIES
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">2. Tools and Technologies</h1>
    <hr class="title-divider">
    <p>
        To ensure complete algorithmic transparency and maximize execution speed, the core computational engine was developed from scratch in C++17 with zero reliance on third-party graph or routing packages. A lightweight HTTP daemon serves JSON payloads directly to an in-browser graphical interface.
    </p>

    <div style="font-weight: 700; font-size: 10.5pt; margin: 16px 0 6px 0; text-align: center;">
        Table 1: Tools and technologies used
    </div>
    <table class="report-table">
        <thead>
            <tr>
                <th style="width: 28%;">Tool / Technology</th>
                <th style="width: 72%;">Purpose in Project</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>C++17 Native Core</strong></td>
                <td>Core language used to implement the Adjacency List graph, Dijkstra's algorithm, Min-Heap priority queue, Disjoint Set Union (DSU), and Doubly Linked List.</td>
            </tr>
            <tr>
                <td><strong>Standard Template Library (STL)</strong></td>
                <td>Used strictly for basic utilities (<span class="mono">std::vector</span>, <span class="mono">std::string</span>, <span class="mono">std::pair</span>). All high-level data structures (Graph, Min-Heap, DSU, Linked List) were implemented by hand.</td>
            </tr>
            <tr>
                <td><strong>WinSock2 Networking Layer</strong></td>
                <td>Native Windows socket layer powering a custom multi-threaded HTTP server that listens on port 8080 and handles RESTful GET/POST requests.</td>
            </tr>
            <tr>
                <td><strong>nlohmann/json</strong></td>
                <td>Single-header C++ library used to serialize and deserialize structured JSON payloads between the C++ backend and the frontend client.</td>
            </tr>
            <tr>
                <td><strong>HTML5 Canvas & JavaScript</strong></td>
                <td>Renders the dynamic interactive command map, algorithm step-by-step visualizer, disaster pulse animations, and real-time telemetry cards.</td>
            </tr>
            <tr>
                <td><strong>MinGW-w64 GCC 13.x</strong></td>
                <td>High-performance compiler toolchain used to compile the native server into a single standalone executable (<span class="mono">server.exe</span>).</td>
            </tr>
            <tr>
                <td><strong>Visual Studio Code</strong></td>
                <td>Primary integrated development environment (IDE) used for writing, profiling, and debugging both the C++ source and frontend assets.</td>
            </tr>
        </tbody>
    </table>

    <h2 class="sub-title" style="margin-top: 24px;">Architectural Highlights</h2>
    <ul>
        <li><strong>Zero External Framework Overhead:</strong> No heavyweight application frameworks (such as Electron, Node.js runtime, or Python interpreters) are required during runtime; the C++ executable acts as a self-contained server.</li>
        <li><strong>Microsecond Execution:</strong> Graph queries and path calculations execute in under 0.20 milliseconds, allowing seamless real-time recalculations upon every user click or simulated disaster event.</li>
        <li><strong>Clean Separation of Concerns:</strong> The C++ algorithmic core exposes pure REST endpoints (<span class="mono">/api/route/fastest</span>, <span class="mono">/api/dispatch/next</span>, <span class="mono">/api/simulation/advance</span>), keeping presentation logic completely decoupled from graph algorithms.</li>
    </ul>

    <div class="page-footer">4</div>
</div>
`;

// ==========================================
// PAGE 5: 3. SYSTEM DESIGN
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">3. System Design</h1>
    <hr class="title-divider">

    <h2 class="sub-title">3.1 Graph Model</h2>
    <p>
        The city road system is modelled as a weighted, undirected graph $G = (V, E)$, where $V$ denotes the set of key urban vertices and $E$ represents the bidirectional road segments. Each vertex $v \\in V$ stores an internal identifier, its location name, physical 2D cartesian coordinates $(x, y)$, and its functional emergency category (Hospital, Fire Station, Shelter, Transit Hub, or Disaster Spot).
    </p>
    <p>
        Each edge $e = (u, v) \\in E$ stores references to the two terminal locations, its physical length in kilometres, its dynamic traversal time in minutes, and an operational status flag indicating whether the road is active or blocked. When an edge is marked as blocked, it is omitted during adjacency traversal. Figure 1 illustrates the emergency topology, while Table 2 enumerates the vertices.
    </p>

    <!-- SVG Figure 1: Network Topology Diagram -->
    <div class="figure-container">
        <svg viewBox="0 0 650 250" style="width: 100%; max-height: 230px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <!-- Road Edges -->
            <line x1="80" y1="60" x2="190" y2="60" stroke="#0284c7" stroke-width="3" />
            <line x1="80" y1="60" x2="190" y2="120" stroke="#0284c7" stroke-width="3" />
            <line x1="190" y1="60" x2="310" y2="60" stroke="#0284c7" stroke-width="3" />
            <line x1="310" y1="60" x2="430" y2="60" stroke="#0284c7" stroke-width="3" />
            <line x1="430" y1="60" x2="570" y2="60" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,4" />
            <line x1="430" y1="60" x2="310" y2="120" stroke="#0284c7" stroke-width="3" />
            <line x1="190" y1="120" x2="310" y2="120" stroke="#0284c7" stroke-width="3" />
            <line x1="310" y1="120" x2="310" y2="190" stroke="#0284c7" stroke-width="3" />
            <line x1="310" y1="190" x2="440" y2="190" stroke="#0284c7" stroke-width="3" />
            <line x1="440" y1="190" x2="570" y2="130" stroke="#0284c7" stroke-width="3" />
            <line x1="570" y1="130" x2="570" y2="60" stroke="#0284c7" stroke-width="3" />
            <line x1="190" y1="60" x2="80" y2="190" stroke="#0284c7" stroke-width="3" />
            <line x1="80" y1="190" x2="190" y2="190" stroke="#0284c7" stroke-width="3" />
            <line x1="190" y1="190" x2="310" y2="190" stroke="#0284c7" stroke-width="3" />

            <!-- Edge Labels (Times) -->
            <text x="135" y="52" font-size="10" fill="#555" text-anchor="middle">1.2km (3m)</text>
            <text x="250" y="52" font-size="10" fill="#555" text-anchor="middle">1.8km (4.5m)</text>
            <text x="370" y="52" font-size="10" fill="#555" text-anchor="middle">2.1km (5m)</text>
            <text x="500" y="50" font-size="10" fill="#ef4444" font-weight="bold" text-anchor="middle">BLOCKED 3.5km</text>
            <text x="250" y="112" font-size="10" fill="#555" text-anchor="middle">3.1km (8m)</text>
            <text x="520" y="170" font-size="10" fill="#555" text-anchor="middle">2.0km (5m)</text>

            <!-- Vertices -->
            <circle cx="80" cy="60" r="16" fill="#0284c7" />
            <text x="80" y="64" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">JIIT</text>
            <text x="80" y="90" font-size="9" fill="#111" text-anchor="middle">JIIT Sec 62</text>

            <circle cx="190" cy="60" r="16" fill="#ef4444" />
            <text x="190" y="64" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">FS</text>
            <text x="190" y="40" font-size="9" fill="#111" text-anchor="middle">Sec 62 Fire</text>

            <circle cx="310" cy="60" r="16" fill="#0284c7" />
            <text x="310" y="64" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">H</text>
            <text x="310" y="40" font-size="9" fill="#111" text-anchor="middle">Fortis Sec 62</text>

            <circle cx="430" cy="60" r="16" fill="#10b981" />
            <text x="430" y="64" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">S</text>
            <text x="430" y="40" font-size="9" fill="#111" text-anchor="middle">Sec 63 Center</text>

            <circle cx="570" cy="60" r="18" fill="#f59e0b" stroke="#ef4444" stroke-width="2" />
            <text x="570" y="64" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">DEST</text>
            <text x="570" y="90" font-size="9" fill="#b91c1c" font-weight="bold" text-anchor="middle">Hindan River (Flood)</text>

            <circle cx="190" cy="120" r="14" fill="#64748b" />
            <text x="190" y="124" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">MAM</text>
            <text x="190" y="145" font-size="9" fill="#111" text-anchor="middle">Mamura</text>

            <circle cx="310" cy="120" r="14" fill="#64748b" />
            <text x="310" y="124" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">KHD</text>
            <text x="310" y="145" font-size="9" fill="#111" text-anchor="middle">Khoda</text>

            <circle cx="570" cy="130" r="16" fill="#10b981" />
            <text x="570" y="134" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">SH-3</text>
            <text x="570" y="155" font-size="9" fill="#111" text-anchor="middle">Indirapuram Shelter</text>

            <circle cx="310" cy="190" r="16" fill="#8b5cf6" />
            <text x="310" y="194" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">M-59</text>
            <text x="310" y="215" font-size="9" fill="#111" text-anchor="middle">Sec 59 Metro (Team Base)</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 1: Topological graph model showing emergency vertices, weights, and flooded road blockage</div>

    <div style="font-weight: 700; font-size: 9pt; margin: 8px 0 4px 0; text-align: center;">
        Table 2: Key Emergency Vertices in the Network
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 8%; text-align: center;">ID</th>
                <th style="width: 44%;">Location Name</th>
                <th style="width: 28%;">Category</th>
                <th style="width: 20%; text-align: center;">Coordinates</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="center">0</td><td>JIIT Sector 62</td><td>Emergency Command Center</td><td class="center">(80, 60)</td></tr>
            <tr><td class="center">1</td><td>Sector 62 Fire Station</td><td>Fire & Hazmat Base</td><td class="center">(190, 60)</td></tr>
            <tr><td class="center">2</td><td>Fortis Hospital Sector 62</td><td>Trauma Hospital</td><td class="center">(310, 60)</td></tr>
            <tr><td class="center">3</td><td>Sector 63 Community Center</td><td>Relief Shelter (SH-01)</td><td class="center">(430, 60)</td></tr>
            <tr><td class="center">4</td><td>Mamura Village</td><td>Urban Settlement</td><td class="center">(190, 120)</td></tr>
            <tr><td class="center">5</td><td>Khoda Village</td><td>High-Density Residential</td><td class="center">(310, 120)</td></tr>
            <tr><td class="center">6</td><td>Sector 59 Metro Station</td><td>Transit Hub (RT-02 Base)</td><td class="center">(310, 190)</td></tr>
            <tr><td class="center">7</td><td>Sector 24 Police Station</td><td>Law Enforcement HQ</td><td class="center">(190, 190)</td></tr>
        </tbody>
    </table>
    <div class="page-footer">5</div>
</div>
`;

// ==========================================
// PAGE 6: 3.1 GRAPH MODEL (ROAD EDGES TABLE)
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
    <div class="page-footer">6</div>
</div>
`;

// ==========================================
// PAGE 7: 3.2 DATA STRUCTURES & 3.3 ARCHITECTURE
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">3.2 Data Structures</h1>
    <p>
        The urban road network is sparse: with 17 vertices and 22 edges, the average vertex degree is less than 3. An Adjacency Matrix would require $17 \\times 17 = 289$ memory entries, mostly filled with zero or infinity. An Adjacency List was chosen to ensure optimal $\\mathcal{O}(V + E)$ space complexity and instant iteration over immediate neighbors. Table 4 summarizes all primary data structures used.
    </p>

    <div style="font-weight: 700; font-size: 9.5pt; margin: 8px 0 4px 0; text-align: center;">
        Table 4: Core Data Structures and Application Mapping
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 22%;">Data Structure</th>
                <th style="width: 38%;">Where It Is Implemented</th>
                <th style="width: 40%;">Reason for Choice / Algorithmic Advantage</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Adjacency List</strong></td>
                <td><span class="mono">Graph.h</span> / <span class="mono">Graph.cpp</span></td>
                <td>Consumes $\\mathcal{O}(V + E)$ space. Allows iterating over directly connected road corridors without scanning unlinked vertices.</td>
            </tr>
            <tr>
                <td><strong>Binary Min-Heap</strong></td>
                <td><span class="mono">PriorityQueue.h</span> (Triage Queue)</td>
                <td>Retrieves the highest-priority emergency incident or minimum-distance vertex in $\\mathcal{O}(\\log N)$ time.</td>
            </tr>
            <tr>
                <td><strong>Hash Map</strong></td>
                <td><span class="mono">EmergencySystem.cpp</span> (Shelter/Team Maps)</td>
                <td>Enables $\\mathcal{O}(1)$ average lookup time for vehicle status, personnel availability, and shelter bed occupancy.</td>
            </tr>
            <tr>
                <td><strong>Disjoint Set Union (DSU)</strong></td>
                <td><span class="mono">DSU.h</span> / Kruskal's MST Routine</td>
                <td>Detects cycles in $\\mathcal{O}(\\alpha(V))$ near-constant time using Path Compression and Union-by-Rank.</td>
            </tr>
            <tr>
                <td><strong>Doubly Linked List</strong></td>
                <td><span class="mono">MissionRecord.h</span> (Mission Audit Log)</td>
                <td>Enables constant-time $\\mathcal{O}(1)$ insertion of completed missions, bidirectional audit traversal, and pointer-based sorting.</td>
            </tr>
        </tbody>
    </table>

    <h1 class="section-title" style="margin-top: 14px;">3.3 Architecture</h1>
    <p>
        The system adheres to a strict 3-tier decoupled architecture (Figure 2). The presentation layer renders graphics and captures operator inputs, the logic layer executes graph and triage algorithms, and the data layer maintains state in memory.
    </p>

    <!-- SVG Figure 2: Architecture Diagram -->
    <div class="figure-container">
        <svg viewBox="0 0 650 180" style="width: 100%; max-height: 170px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="25" y="15" width="600" height="40" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <text x="325" y="32" font-size="11" font-weight="bold" fill="#0369a1" text-anchor="middle">Presentation Layer (HTML5 Canvas, CSS3 Cyberpunk Grid, JavaScript App)</text>
            <text x="325" y="47" font-size="9" fill="#555" text-anchor="middle">Live Command Map • Step-by-Step Visualizer • Simulation Center • Mission Audit Table</text>

            <line x1="325" y1="55" x2="325" y2="70" stroke="#475569" stroke-width="2" />

            <rect x="25" y="70" width="600" height="40" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
            <text x="325" y="87" font-size="11" font-weight="bold" fill="#b45309" text-anchor="middle">Logic & Algorithmic Layer (C++17 Engine)</text>
            <text x="325" y="102" font-size="9" fill="#555" text-anchor="middle">Dijkstra Shortest Path • Min-Heap Triage Engine • Dynamic Rerouter • DSU Kruskal MST</text>

            <line x1="325" y1="110" x2="325" y2="125" stroke="#475569" stroke-width="2" />

            <rect x="25" y="125" width="600" height="40" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5" />
            <text x="325" y="142" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">Data Layer (In-Memory Custom Structures & WinSock Server)</text>
            <text x="325" y="157" font-size="9" fill="#555" text-anchor="middle">Adjacency List Graph • Binary Min-Heap Priority Queue • Doubly Linked List History</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 2: Three-tier decoupled software architecture of AURA-EMS</div>

    <div class="page-footer">7</div>
</div>
`;

// ==========================================
// PAGE 8: TABLE 5 & 3.4 DATA SCHEMA
// ==========================================
html += `
<div class="page">
    <div style="font-weight: 700; font-size: 9.5pt; margin: 4px 0 4px 0; text-align: center;">
        Table 5: Primary C++ Classes and Their Responsibilities
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 25%;">Class Name</th>
                <th style="width: 75%;">Core Algorithmic Responsibility</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Graph</strong></td>
                <td>Maintains city vertices and road adjacency lists. Handles addition of edges, runtime toggling of blocked states, and BFS/DFS graph traversals.</td>
            </tr>
            <tr>
                <td><strong>DijkstraEngine</strong></td>
                <td>Implements Dijkstra's algorithm using a custom Min-Heap. Computes optimal travel time paths and predecessor arrays (<span class="mono">parent[]</span>).</td>
            </tr>
            <tr>
                <td><strong>PriorityQueue</strong></td>
                <td>Implements a complete Binary Min-Heap supporting <span class="mono">insert()</span>, <span class="mono">extractMin()</span>, and an aging algorithm to increment waiting incident priority.</td>
            </tr>
            <tr>
                <td><strong>DisjointSetUnion</strong></td>
                <td>Implements Union-by-Rank and Path Compression to compute Kruskal's Minimum Spanning Tree and detect cycles during infrastructure checks.</td>
            </tr>
            <tr>
                <td><strong>DoublyLinkedList</strong></td>
                <td>Stores dispatched and resolved emergency records. Implements pointer-based QuickSort and MergeSort without STL sorting.</td>
            </tr>
            <tr>
                <td><strong>EmergencySystem</strong></td>
                <td>Orchestrator class tying together fleet assignment, multi-leg shelter routing, incident triage, and simulation clock progression.</td>
            </tr>
            <tr>
                <td><strong>HttpServer</strong></td>
                <td>Multi-threaded WinSock socket server listening on port 8080. Parses HTTP headers, extracts JSON bodies, and dispatches API routes.</td>
            </tr>
        </tbody>
    </table>

    <h1 class="section-title" style="margin-top: 14px;">3.4 Telemetry and In-Memory Data Schema</h1>
    <p>
        The platform maintains consistent in-memory schemas representing real-time municipal state. Because urban emergency responses demand sub-millisecond latencies, all state is held in fast memory tables rather than disk-bound databases during live operations.
    </p>

    <div style="font-weight: 700; font-size: 9.5pt; margin: 8px 0 4px 0; text-align: center;">
        Table 6: Telemetry and Entity Data Schemas
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 20%;">Entity</th>
                <th style="width: 40%;">Attributes & Data Types</th>
                <th style="width: 40%;">Functional Constraints & Keys</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Incident</strong></td>
                <td><span class="mono">id (str), type (str), severity (1..5), loc (str), affected (int), casualties (int), age (int)</span></td>
                <td>Primary key: <span class="mono">id</span>. Sorted inside Min-Heap by composite priority: <span class="mono">Priority = (6 - severity) * 10 - age</span>.</td>
            </tr>
            <tr>
                <td><strong>Road Edge</strong></td>
                <td><span class="mono">u (str), v (str), distKm (float), timeMin (float), isBlocked (bool)</span></td>
                <td>Bidirectional edge. When <span class="mono">isBlocked == true</span>, edge weight evaluates to infinity during relaxation.</td>
            </tr>
            <tr>
                <td><strong>Relief Shelter</strong></td>
                <td><span class="mono">id (str), name (str), capacity (int), occupancy (int), beds (int), food (int)</span></td>
                <td>Primary key: <span class="mono">id</span>. Admissions restricted when <span class="mono">occupancy == capacity</span>.</td>
            </tr>
            <tr>
                <td><strong>Mission Record</strong></td>
                <td><span class="mono">missionId (str), teamId (str), route (vector), totalDist (float), timestamp (str)</span></td>
                <td>Stored sequentially inside Doubly Linked List for post-disaster audit log and sort evaluation.</td>
            </tr>
        </tbody>
    </table>
    <div class="page-footer">8</div>
</div>
`;

// ==========================================
// PAGE 9: 4. ALGORITHMS - 4.1 ROUTE FLOW & 4.2 DIJKSTRA
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">4. Algorithms</h1>
    <hr class="title-divider">

    <h2 class="sub-title">4.1 Route Request Flow</h2>
    <p>
        Every routing query follows a deterministic validation and execution pipeline (Figure 3). Before running any pathfinding search, the system validates that both source and destination vertices exist in the graph. The active adjacency list is then constructed, excluding any road marked as blocked. If a path exists, the predecessor links are traversed in reverse to build the final itinerary; if no path exists, the user is notified with an explicit "Blocked / Unreachable" state.
    </p>

    <!-- SVG Figure 3: Route Request Flowchart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 210" style="width: 100%; max-height: 200px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="250" y="8" width="150" height="26" rx="13" fill="#1e293b" />
            <text x="325" y="25" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">Start Route Request</text>

            <line x1="325" y1="34" x2="325" y2="48" stroke="#333" stroke-width="1.5" />

            <polygon points="230,48 420,48 400,74 210,74" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
            <text x="315" y="65" font-size="9.5" fill="#111" text-anchor="middle">Operator Selects Source & Destination</text>

            <line x1="315" y1="74" x2="315" y2="88" stroke="#333" stroke-width="1.5" />

            <polygon points="315,88 395,110 315,132 235,110" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
            <text x="315" y="113" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">Both Nodes Exist?</text>

            <line x1="395" y1="110" x2="480" y2="110" stroke="#333" stroke-width="1.5" />
            <text x="430" y="104" font-size="9" fill="#ef4444" font-weight="bold">No</text>
            <rect x="480" y="98" width="130" height="24" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="1" />
            <text x="545" y="114" font-size="8.5" fill="#991b1b" text-anchor="middle">Return Input Error</text>

            <line x1="315" y1="132" x2="315" y2="146" stroke="#333" stroke-width="1.5" />
            <text x="325" y="142" font-size="9" fill="#16a34a" font-weight="bold">Yes</text>

            <rect x="200" y="146" width="230" height="26" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <text x="315" y="162" font-size="9" fill="#0369a1" text-anchor="middle">Filter Adjacency List (Skip Blocked Roads)</text>

            <line x1="315" y1="172" x2="315" y2="184" stroke="#333" stroke-width="1.5" />

            <rect x="180" y="184" width="270" height="24" rx="12" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5" />
            <text x="315" y="200" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">Execute Dijkstra / BFS & Rebuild Predecessor Chain</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 3: Flowchart of an emergency routing and dispatch request</div>

    <h2 class="sub-title">4.2 Dijkstra's Algorithm (Fastest Route)</h2>
    <p>
        Dijkstra's algorithm finds the shortest travel-time path from source vertex $S$ to all other vertices in the graph. It maintains an array of tentative distances $\\text{dist}[v]$, initialized to $0$ for $S$ and $\\infty$ for all other vertices. A Min-Heap Priority Queue continually yields the unvisited vertex $u$ with the minimum tentative travel time. For each neighboring vertex $v$ connected via edge $(u, v)$ with weight $w(u, v)$, the algorithm performs the classical <em>relaxation step</em>:
    </p>
    <div style="background: #f8fafc; border-left: 3px solid #0284c7; padding: 6px 12px; margin: 6px 0; font-family: 'Consolas', monospace; font-size: 9.5pt;">
        if (dist[u] + w(u, v) &lt; dist[v]) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;dist[v] = dist[u] + w(u, v);<br>
        &nbsp;&nbsp;&nbsp;&nbsp;parent[v] = u;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;priorityQueue.push({dist[v], v});<br>
        }
    </div>
    <p>
        Because all travel times are strictly positive ($w(u, v) &gt; 0$), once vertex $u$ is dequeued from the Min-Heap, its travel time is mathematically guaranteed to be minimal. The search terminates the instant destination vertex $D$ is popped.
    </p>
    <div class="page-footer">9</div>
</div>
`;

// ==========================================
// PAGE 10: FIGURE 4: DIJKSTRA FLOWCHART
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Dijkstra's Algorithm Execution Architecture</h2>
    <p>
        The exact procedural flow of Dijkstra's algorithm implemented in <span class="mono">Graph.cpp</span> is illustrated in Figure 4. The priority queue stores pairs of <span class="mono">(distance, vertex)</span>, always prioritizing nodes with the lowest travel time.
    </p>

    <!-- SVG Figure 4: Dijkstra Flowchart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 460" style="width: 100%; max-height: 440px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="230" y="10" width="190" height="28" rx="14" fill="#1e293b" />
            <text x="325" y="28" font-size="10.5" font-weight="bold" fill="#fff" text-anchor="middle">Start: Source S, Destination D</text>

            <line x1="325" y1="38" x2="325" y2="55" stroke="#333" stroke-width="1.5" />

            <rect x="185" y="55" width="280" height="32" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
            <text x="325" y="69" font-size="9" fill="#111" text-anchor="middle">dist[S] = 0, dist[v] = ∞ (for all v ≠ S)</text>
            <text x="325" y="82" font-size="9" fill="#111" text-anchor="middle">Push (0, S) into Min-Heap Priority Queue</text>

            <line x1="325" y1="87" x2="325" y2="105" stroke="#333" stroke-width="1.5" />

            <polygon points="325,105 410,128 325,151 240,128" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
            <text x="325" y="131" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">Queue Empty?</text>

            <line x1="240" y1="128" x2="130" y2="128" stroke="#333" stroke-width="1.5" />
            <text x="180" y="122" font-size="9" fill="#ef4444" font-weight="bold">Yes</text>
            <rect x="60" y="115" width="120" height="26" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" />
            <text x="120" y="132" font-size="9" font-weight="bold" fill="#991b1b" text-anchor="middle">Return No Route</text>

            <line x1="325" y1="151" x2="325" y2="170" stroke="#333" stroke-width="1.5" />
            <text x="335" y="163" font-size="9" fill="#16a34a" font-weight="bold">No</text>

            <rect x="200" y="170" width="250" height="28" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <text x="325" y="187" font-size="9.5" fill="#0369a1" text-anchor="middle">Pop (d, u) with minimum travel time</text>

            <line x1="325" y1="198" x2="325" y2="218" stroke="#333" stroke-width="1.5" />

            <polygon points="325,218 410,240 325,262 240,240" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
            <text x="325" y="243" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">u already visited?</text>

            <line x1="410" y1="240" x2="490" y2="240" stroke="#333" stroke-width="1.5" />
            <line x1="490" y1="240" x2="490" y2="128" stroke="#333" stroke-width="1.5" />
            <line x1="490" y1="128" x2="410" y2="128" stroke="#333" stroke-width="1.5" />
            <text x="440" y="234" font-size="9" fill="#d97706" font-weight="bold">Yes</text>

            <line x1="325" y1="262" x2="325" y2="280" stroke="#333" stroke-width="1.5" />
            <text x="335" y="274" font-size="9" fill="#16a34a" font-weight="bold">No</text>

            <rect x="235" y="280" width="180" height="24" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1" />
            <text x="325" y="296" font-size="9" fill="#111" text-anchor="middle">Mark u as visited</text>

            <line x1="325" y1="304" x2="325" y2="320" stroke="#333" stroke-width="1.5" />

            <polygon points="325,320 400,340 325,360 250,340" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
            <text x="325" y="343" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">u == Destination D?</text>

            <line x1="250" y1="340" x2="160" y2="340" stroke="#333" stroke-width="1.5" />
            <text x="200" y="334" font-size="9" fill="#16a34a" font-weight="bold">Yes</text>
            <rect x="50" y="326" width="140" height="28" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5" />
            <text x="120" y="344" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">Rebuild Path & Return</text>

            <line x1="325" y1="360" x2="325" y2="380" stroke="#333" stroke-width="1.5" />
            <text x="335" y="372" font-size="9" fill="#d97706" font-weight="bold">No</text>

            <rect x="160" y="380" width="330" height="40" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <text x="325" y="396" font-size="9" fill="#0369a1" text-anchor="middle">For each unvisited active neighbor v of u:</text>
            <text x="325" y="410" font-size="8.5" fill="#0369a1" text-anchor="middle">if (dist[u] + w(u,v) &lt; dist[v]) update dist[v], parent[v], push (dist[v], v)</text>

            <line x1="490" y1="400" x2="550" y2="400" stroke="#333" stroke-width="1.5" />
            <line x1="550" y1="400" x2="550" y2="128" stroke="#333" stroke-width="1.5" />
            <line x1="550" y1="128" x2="410" y2="128" stroke="#333" stroke-width="1.5" />
        </svg>
    </div>
    <div class="figure-caption">Figure 4: Complete procedural flowchart of Dijkstra's shortest-path algorithm</div>
    <div class="page-footer">10</div>
</div>
`;

// ==========================================
// PAGE 11: WORKED EXAMPLE & BAR CHART
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Worked Example: Dispatch to Hindan River Embankment</h2>
    <p>
        Consider an emergency call originating at <em>Hindan River Embankment</em> requiring dispatch from <em>Sector 62 Fire Station</em>. Under normal conditions with all edges operational, Table 7 documents the sequence in which Dijkstra's algorithm finalizes tentative travel times.
    </p>

    <div style="font-weight: 700; font-size: 9pt; margin: 4px 0 2px 0; text-align: center;">
        Table 7: Order of Finalized Vertices (Sector 62 Fire Station to Hindan River)
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 10%; text-align: center;">Order</th>
                <th style="width: 40%;">Finalized Vertex</th>
                <th style="width: 25%; text-align: center;">Shortest Time (min)</th>
                <th style="width: 25%;">Reached From (Parent)</th>
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
        Tracing the predecessor pointers backwards from <em>Hindan River Embankment</em> yields the optimal unblocked route: <strong>Sector 62 Fire Station $\\rightarrow$ Fortis Hospital $\\rightarrow$ Sector 63 Community Center $\\rightarrow$ Hindan River Embankment</strong> (16.0 minutes, 7.1 km). Figure 5 illustrates the monotonic increase in finalized travel times.
    </p>

    <!-- SVG Figure 5: Bar Chart of Finalized Node Times -->
    <div class="figure-container">
        <svg viewBox="0 0 650 210" style="width: 100%; max-height: 195px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <line x1="50" y1="170" x2="620" y2="170" stroke="#333" stroke-width="1.5" />
            <line x1="50" y1="20" x2="50" y2="170" stroke="#333" stroke-width="1.5" />

            <text x="40" y="174" font-size="9" fill="#444" text-anchor="end">0m</text>
            <text x="40" y="135" font-size="9" fill="#444" text-anchor="end">5m</text>
            <text x="40" y="98" font-size="9" fill="#444" text-anchor="end">10m</text>
            <text x="40" y="60" font-size="9" fill="#444" text-anchor="end">15m</text>
            <text x="40" y="25" font-size="9" fill="#444" text-anchor="end">20m</text>

            <line x1="48" y1="132" x2="620" y2="132" stroke="#e2e8f0" stroke-dasharray="3,3" />
            <line x1="48" y1="95" x2="620" y2="95" stroke="#e2e8f0" stroke-dasharray="3,3" />
            <line x1="48" y1="58" x2="620" y2="58" stroke="#e2e8f0" stroke-dasharray="3,3" />

            <rect x="65" y="169" width="45" height="1" fill="#0284c7" />
            <text x="87" y="184" font-size="7.5" fill="#111" text-anchor="middle">1. FS-62</text>
            <text x="87" y="165" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">0.0</text>

            <rect x="125" y="147" width="45" height="23" fill="#0284c7" />
            <text x="147" y="184" font-size="7.5" fill="#111" text-anchor="middle">2. JIIT-62</text>
            <text x="147" y="142" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">3.0</text>

            <rect x="185" y="144" width="45" height="26" fill="#0284c7" />
            <text x="207" y="184" font-size="7.5" fill="#111" text-anchor="middle">3. Fortis</text>
            <text x="207" y="139" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">3.5</text>

            <rect x="245" y="129" width="45" height="41" fill="#0284c7" />
            <text x="267" y="184" font-size="7.5" fill="#111" text-anchor="middle">4. M-59</text>
            <text x="267" y="124" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">5.5</text>

            <rect x="305" y="114" width="45" height="56" fill="#0284c7" />
            <text x="327" y="184" font-size="7.5" fill="#111" text-anchor="middle">5. Mamura</text>
            <text x="327" y="109" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">7.5</text>

            <rect x="365" y="106" width="45" height="64" fill="#0284c7" />
            <text x="387" y="184" font-size="7.5" fill="#111" text-anchor="middle">6. Sec 63</text>
            <text x="387" y="101" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">8.5</text>

            <rect x="425" y="76" width="45" height="94" fill="#0284c7" />
            <text x="447" y="184" font-size="7.5" fill="#111" text-anchor="middle">7. Pol-24</text>
            <text x="447" y="71" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">12.5</text>

            <rect x="485" y="54" width="45" height="116" fill="#0284c7" />
            <text x="507" y="184" font-size="7.5" fill="#111" text-anchor="middle">8. Khoda</text>
            <text x="507" y="49" font-size="8" font-weight="bold" fill="#0284c7" text-anchor="middle">15.5</text>

            <rect x="545" y="50" width="45" height="120" fill="#10b981" />
            <text x="567" y="184" font-size="7.5" fill="#111" text-anchor="middle">9. Hindan</text>
            <text x="567" y="45" font-size="8" font-weight="bold" fill="#15803d" text-anchor="middle">16.0m</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 5: Monotonic progression of finalized vertex travel times in Dijkstra's priority queue</div>
    <div class="page-footer">11</div>
</div>
`;

// ==========================================
// PAGE 12: 4.3 BREADTH-FIRST SEARCH (FEWEST HOPS)
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">4.3 Breadth-First Search (Fewest Hops)</h1>
    <hr class="title-divider">
    <p>
        Breadth-First Search (BFS) operates on unweighted graphs to discover the path containing the absolute minimum number of intersection hops, regardless of road distance or congestion times. The algorithm employs a First-In, First-Out (FIFO) queue and a boolean visited array to expand outward level-by-level (Figure 6).
    </p>

    <!-- SVG Figure 6: BFS Flowchart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 200" style="width: 100%; max-height: 190px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="230" y="8" width="190" height="26" rx="13" fill="#1e293b" />
            <text x="325" y="25" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">Start: Source S, Destination D</text>

            <line x1="325" y1="34" x2="325" y2="48" stroke="#333" stroke-width="1.5" />

            <rect x="180" y="48" width="290" height="26" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
            <text x="325" y="65" font-size="9" fill="#111" text-anchor="middle">Create Empty FIFO Queue Q; Mark S Visited; Q.push(S)</text>

            <line x1="325" y1="74" x2="325" y2="88" stroke="#333" stroke-width="1.5" />

            <polygon points="325,88 395,110 325,132 255,110" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
            <text x="325" y="113" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">Q.empty()?</text>

            <line x1="395" y1="110" x2="480" y2="110" stroke="#333" stroke-width="1.5" />
            <text x="430" y="104" font-size="9" fill="#ef4444" font-weight="bold">Yes</text>
            <rect x="480" y="98" width="120" height="24" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="1" />
            <text x="540" y="114" font-size="8.5" fill="#991b1b" text-anchor="middle">Return No Route</text>

            <line x1="325" y1="132" x2="325" y2="146" stroke="#333" stroke-width="1.5" />
            <text x="335" y="142" font-size="9" fill="#16a34a" font-weight="bold">No</text>

            <rect x="180" y="146" width="290" height="24" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <text x="325" y="162" font-size="9" fill="#0369a1" text-anchor="middle">Pop Front u; For unvisited v: mark visited, parent[v]=u, Q.push(v)</text>

            <line x1="325" y1="170" x2="325" y2="182" stroke="#333" stroke-width="1.5" />

            <rect x="200" y="182" width="250" height="22" rx="11" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5" />
            <text x="325" y="197" font-size="8.5" font-weight="bold" fill="#15803d" text-anchor="middle">Stop when u == D; Reconstruct Fewest-Hops Route</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 6: Flowchart of Breadth-First Search (Fewest Hops)</div>

    <p style="margin-top: 10px;">
        Figure 7 displays the hop distance (frontier levels) when running BFS from <em>JIIT Sector 62</em>. Vertices at Level 1 are direct road neighbors (Fire Station, Fortis Hospital, Mamura). Vertices at Level 2 include Sector 63, Khoda, and Sector 59 Metro.
    </p>

    <!-- SVG Figure 7: BFS Hop Levels Diagram -->
    <div class="figure-container">
        <svg viewBox="0 0 650 160" style="width: 100%; max-height: 150px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="30" y="20" width="110" height="120" rx="6" fill="#f1f5f9" stroke="#94a3b8" />
            <text x="85" y="40" font-size="10" font-weight="bold" fill="#334155" text-anchor="middle">Level 0 (Source)</text>
            <circle cx="85" cy="85" r="16" fill="#0284c7" />
            <text x="85" y="89" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">JIIT</text>

            <line x1="140" y1="80" x2="180" y2="80" stroke="#64748b" stroke-width="2" />

            <rect x="180" y="20" width="130" height="120" rx="6" fill="#e0f2fe" stroke="#38bdf8" />
            <text x="245" y="40" font-size="10" font-weight="bold" fill="#0369a1" text-anchor="middle">Level 1 (1 Hop)</text>
            <circle cx="215" cy="70" r="12" fill="#ef4444" /><text x="215" y="73" font-size="8" fill="#fff" text-anchor="middle">FS</text>
            <circle cx="275" cy="70" r="12" fill="#0284c7" /><text x="275" y="73" font-size="8" fill="#fff" text-anchor="middle">HOS</text>
            <circle cx="245" cy="110" r="12" fill="#64748b" /><text x="245" y="113" font-size="8" fill="#fff" text-anchor="middle">MAM</text>

            <line x1="310" y1="80" x2="350" y2="80" stroke="#64748b" stroke-width="2" />

            <rect x="350" y="20" width="130" height="120" rx="6" fill="#fef3c7" stroke="#fbbf24" />
            <text x="415" y="40" font-size="10" font-weight="bold" fill="#b45309" text-anchor="middle">Level 2 (2 Hops)</text>
            <circle cx="385" cy="70" r="12" fill="#10b981" /><text x="385" y="73" font-size="8" fill="#fff" text-anchor="middle">S-63</text>
            <circle cx="445" cy="70" r="12" fill="#64748b" /><text x="445" y="73" font-size="8" fill="#fff" text-anchor="middle">KHD</text>
            <circle cx="415" cy="110" r="12" fill="#8b5cf6" /><text x="415" y="113" font-size="8" fill="#fff" text-anchor="middle">M-59</text>

            <line x1="480" y1="80" x2="520" y2="80" stroke="#64748b" stroke-width="2" />

            <rect x="520" y="20" width="105" height="120" rx="6" fill="#dcfce7" stroke="#4ade80" />
            <text x="572" y="40" font-size="10" font-weight="bold" fill="#15803d" text-anchor="middle">Level 3 (3 Hops)</text>
            <circle cx="572" cy="75" r="15" fill="#f59e0b" stroke="#ef4444" stroke-width="2" />
            <text x="572" y="79" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">HINDAN</text>
            <text x="572" y="115" font-size="8" fill="#15803d" text-anchor="middle">Indirapuram</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 7: Radial hop levels during a Breadth-First Search expanding from JIIT Sector 62</div>
    <div class="page-footer">12</div>
</div>
`;

// ==========================================
// PAGE 13: 4.4 DEPTH-FIRST SEARCH
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">4.4 Depth-First Search (Reachability & Topological Exploration)</h1>
    <hr class="title-divider">
    <p>
        Depth-First Search (DFS) dives deeply down a single path branch until it reaches the destination or a dead-end, before backtracking along the recursion call stack (Figure 8). Unlike Dijkstra (which optimizes time) or BFS (which optimizes hops), DFS guarantees only that a valid connected route exists; it makes no claims regarding path quality.
    </p>

    <!-- SVG Figure 8: DFS Flowchart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 260" style="width: 100%; max-height: 250px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="230" y="10" width="190" height="26" rx="13" fill="#1e293b" />
            <text x="325" y="27" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">Start: Source S, Destination D</text>

            <line x1="325" y1="36" x2="325" y2="52" stroke="#333" stroke-width="1.5" />

            <rect x="200" y="52" width="250" height="26" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
            <text x="325" y="69" font-size="9.5" fill="#111" text-anchor="middle">Initialize Visited Set; Call DFS(S, D)</text>

            <line x1="325" y1="78" x2="325" y2="94" stroke="#333" stroke-width="1.5" />

            <rect x="235" y="94" width="180" height="24" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <text x="325" y="110" font-size="9" fill="#0369a1" text-anchor="middle">Mark Current Vertex u as Visited</text>

            <line x1="325" y1="118" x2="325" y2="134" stroke="#333" stroke-width="1.5" />

            <polygon points="325,134 400,154 325,174 250,154" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
            <text x="325" y="157" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">u == Destination D?</text>

            <line x1="400" y1="154" x2="490" y2="154" stroke="#333" stroke-width="1.5" />
            <text x="440" y="148" font-size="9" fill="#16a34a" font-weight="bold">Yes</text>
            <rect x="490" y="142" width="120" height="24" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5" />
            <text x="550" y="158" font-size="8.5" font-weight="bold" fill="#15803d" text-anchor="middle">Return True (Found)</text>

            <line x1="325" y1="174" x2="325" y2="190" stroke="#333" stroke-width="1.5" />
            <text x="335" y="184" font-size="9" fill="#ef4444" font-weight="bold">No</text>

            <rect x="160" y="190" width="330" height="32" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
            <text x="325" y="204" font-size="9" fill="#111" text-anchor="middle">For each unvisited active neighbor v of u:</text>
            <text x="325" y="216" font-size="8.5" fill="#555" text-anchor="middle">parent[v] = u; if (DFS(v, D) == true) return true;</text>

            <line x1="325" y1="222" x2="325" y2="236" stroke="#333" stroke-width="1.5" />

            <rect x="200" y="236" width="250" height="20" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="1" />
            <text x="325" y="250" font-size="8.5" fill="#991b1b" text-anchor="middle">Backtrack: Return False to Parent Call</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 8: Recursive flowchart of Depth-First Search for reachability verification</div>

    <p style="margin-top: 10px;">
        In AURA-EMS, DFS serves a crucial diagnostic function: it is invoked to verify connected components and reachability before allocating expensive rescue assets. If DFS returns false, the system halts dispatch immediately, preventing vehicles from being trapped in disconnected sub-networks.
    </p>
    <div class="page-footer">13</div>
</div>
`;

// ==========================================
// PAGE 14: 4.5 COMPARING THE THREE SEARCHES
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">4.5 Comparing the Three Searches</h1>
    <hr class="title-divider">
    <p>
        Figure 9 contrasts the distinct routes discovered by Dijkstra, BFS, and DFS for a journey from <em>Sector 62 Fire Station</em> to <em>Hindan River Embankment</em>. Figure 10 visualizes their comparative travel times, hop counts, and path efficiency.
    </p>

    <!-- SVG Figure 9: Route Visual Comparisons -->
    <div class="figure-container">
        <svg viewBox="0 0 650 160" style="width: 100%; max-height: 155px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="20" y="15" width="190" height="130" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5" />
            <text x="115" y="35" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">Dijkstra (Fastest Route)</text>
            <text x="115" y="55" font-size="10" font-weight="bold" fill="#0369a1" text-anchor="middle">16.0 min | 3 Hops | 7.1 km</text>
            <text x="115" y="80" font-size="8.5" fill="#333" text-anchor="middle">Sec 62 Fire Station</text>
            <text x="115" y="94" font-size="8.5" fill="#333" text-anchor="middle">↓ Fortis Hospital</text>
            <text x="115" y="108" font-size="8.5" fill="#333" text-anchor="middle">↓ Sector 63 Community Center</text>
            <text x="115" y="122" font-size="8.5" font-weight="bold" fill="#15803d" text-anchor="middle">↓ Hindan River Embankment</text>

            <rect x="230" y="15" width="190" height="130" rx="6" fill="#f8fafc" stroke="#0284c7" stroke-width="1.5" />
            <text x="325" y="35" font-size="11" font-weight="bold" fill="#0369a1" text-anchor="middle">BFS (Fewest Hops)</text>
            <text x="325" y="55" font-size="10" font-weight="bold" fill="#0369a1" text-anchor="middle">16.0 min | 3 Hops | 7.1 km</text>
            <text x="325" y="80" font-size="8.5" fill="#333" text-anchor="middle">Sec 62 Fire Station</text>
            <text x="325" y="94" font-size="8.5" fill="#333" text-anchor="middle">↓ Fortis Hospital</text>
            <text x="325" y="108" font-size="8.5" fill="#333" text-anchor="middle">↓ Sector 63 Community Center</text>
            <text x="325" y="122" font-size="8.5" font-weight="bold" fill="#0369a1" text-anchor="middle">↓ Hindan River Embankment</text>

            <rect x="440" y="15" width="190" height="130" rx="6" fill="#fdf2f8" stroke="#db2777" stroke-width="1.5" />
            <text x="535" y="35" font-size="11" font-weight="bold" fill="#9d174d" text-anchor="middle">DFS (Deep Exploration)</text>
            <text x="535" y="55" font-size="10" font-weight="bold" fill="#9d174d" text-anchor="middle">38.5 min | 6 Hops | 18.2 km</text>
            <text x="535" y="78" font-size="8" fill="#333" text-anchor="middle">Sec 62 FS → Metro 59 →</text>
            <text x="535" y="92" font-size="8" fill="#333" text-anchor="middle">Police 24 → Sec 18 Hub →</text>
            <text x="535" y="106" font-size="8" fill="#333" text-anchor="middle">Jaypee Hospital → Surajpur →</text>
            <text x="535" y="120" font-size="8" font-weight="bold" fill="#9d174d" text-anchor="middle">↓ Hindan River Embankment</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 9: Concrete routes selected by Dijkstra, BFS, and DFS across the road network</div>

    <!-- SVG Figure 10: Comparison Bar Charts -->
    <div class="figure-container" style="margin-top: 12px;">
        <svg viewBox="0 0 650 170" style="width: 100%; max-height: 165px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <text x="160" y="20" font-size="10.5" font-weight="bold" fill="#111" text-anchor="middle">Total Travel Time (Minutes)</text>
            <line x1="50" y1="130" x2="270" y2="130" stroke="#444" stroke-width="1.2" />

            <rect x="70" y="75" width="45" height="55" fill="#16a34a" />
            <text x="92" y="70" font-size="8.5" font-weight="bold" fill="#16a34a" text-anchor="middle">16.0m</text>
            <text x="92" y="144" font-size="8.5" fill="#333" text-anchor="middle">Dijkstra</text>

            <rect x="135" y="75" width="45" height="55" fill="#0284c7" />
            <text x="157" y="70" font-size="8.5" font-weight="bold" fill="#0284c7" text-anchor="middle">16.0m</text>
            <text x="157" y="144" font-size="8.5" fill="#333" text-anchor="middle">BFS</text>

            <rect x="200" y="25" width="45" height="105" fill="#db2777" />
            <text x="222" y="20" font-size="8.5" font-weight="bold" fill="#db2777" text-anchor="middle">38.5m</text>
            <text x="222" y="144" font-size="8.5" fill="#333" text-anchor="middle">DFS</text>

            <line x1="320" y1="15" x2="320" y2="155" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,4" />

            <text x="480" y="20" font-size="10.5" font-weight="bold" fill="#111" text-anchor="middle">Intersection Hops</text>
            <line x1="370" y1="130" x2="590" y2="130" stroke="#444" stroke-width="1.2" />

            <rect x="390" y="80" width="45" height="50" fill="#16a34a" />
            <text x="412" y="75" font-size="8.5" font-weight="bold" fill="#16a34a" text-anchor="middle">3</text>
            <text x="412" y="144" font-size="8.5" fill="#333" text-anchor="middle">Dijkstra</text>

            <rect x="455" y="80" width="45" height="50" fill="#0284c7" />
            <text x="477" y="75" font-size="8.5" font-weight="bold" fill="#0284c7" text-anchor="middle">3</text>
            <text x="477" y="144" font-size="8.5" fill="#333" text-anchor="middle">BFS</text>

            <rect x="520" y="40" width="45" height="90" fill="#db2777" />
            <text x="542" y="35" font-size="8.5" font-weight="bold" fill="#db2777" text-anchor="middle">6</text>
            <text x="542" y="144" font-size="8.5" fill="#333" text-anchor="middle">DFS</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 10: Comparative metrics: total travel time and hop count for the three algorithms</div>
    <div class="page-footer">14</div>
</div>
`;

// ==========================================
// PAGE 15: TABLE 8 & MULTI-LEG REBUILD & RESILIENCE
// ==========================================
html += `
<div class="page">
    <div style="font-weight: 700; font-size: 9pt; margin: 4px 0 2px 0; text-align: center;">
        Table 8: Summary of Algorithm Outputs (Sector 62 Fire Station to Hindan River)
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 20%;">Algorithm</th>
                <th style="width: 30%;">Optimization Goal</th>
                <th style="width: 15%; text-align: center;">Time (min)</th>
                <th style="width: 15%; text-align: center;">Hops</th>
                <th style="width: 20%; text-align: center;">Distance (km)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td><strong>Dijkstra</strong></td><td>Minimize Total Traversal Time</td><td class="center">16.0</td><td class="center">3</td><td class="center">7.1</td></tr>
            <tr><td><strong>BFS</strong></td><td>Minimize Intersection Hops</td><td class="center">16.0</td><td class="center">3</td><td class="center">7.1</td></tr>
            <tr><td><strong>DFS</strong></td><td>First Feasible Connected Path</td><td class="center">38.5</td><td class="center">6</td><td class="center">18.2</td></tr>
        </tbody>
    </table>

    <h1 class="section-title" style="margin-top: 14px;">4.6 Rebuilding the Final Multi-Leg Route</h1>
    <p>
        Shortest-path algorithms do not store complete itineraries inside their queues; rather, each vertex records the predecessor (<span class="mono">parent[v]</span>) from which it was relaxed. To display the human-readable route, helper routine <span class="mono">rebuildPath()</span> walks backwards from destination $D$ to source $S$ and inverts the list.
    </p>
    <p>
        In disaster scenarios, the mission requires a <strong>Two-Leg Evacuation Chain</strong>:
    </p>
    <ul>
        <li><strong>Leg 1 (Response Deployment):</strong> Best rescue team base $\\rightarrow$ Incident disaster spot.</li>
        <li><strong>Leg 2 (Shelter Transfer):</strong> Incident disaster spot $\\rightarrow$ Nearest relief shelter with available capacity.</li>
    </ul>
    <p>
        The complete mission route is constructed by stitching Leg 1 and Leg 2 together, ensuring that emergency vehicles can both arrive at the disaster and deliver victims to safety.
    </p>

    <h1 class="section-title" style="margin-top: 14px;">4.7 Network Resilience: Components & DSU Minimum Spanning Tree</h1>
    <p>
        During major emergencies, urban planners must identify the minimal set of critical roads required to keep all 17 municipal sectors connected. We implemented Kruskal's Algorithm using a custom Disjoint Set Union (DSU) structure to compute the <strong>Emergency Minimum Spanning Tree (MST)</strong>.
    </p>
    <p>
        DSU uses two optimizations to maintain near-constant operations:
    </p>
    <ol>
        <li><strong>Path Compression:</strong> During <span class="mono">find(i)</span>, each traversed node points directly to the set root.</li>
        <li><strong>Union by Rank:</strong> During <span class="mono">unite(i, j)</span>, the shallower tree is attached beneath the deeper tree's root.</li>
    </ol>
    <p>
        This guarantees an amortized time complexity of $\\mathcal{O}(\\alpha(V))$ per operation, where $\\alpha$ is the inverse Ackermann function ($\alpha(V) \le 4$ for all practical inputs).
    </p>
    <div class="page-footer">15</div>
</div>
`;

// ==========================================
// PAGE 16: DYNAMIC DETOUR FLOWCHART & TRIAGE AGING
// ==========================================
html += `
<div class="page">
    <h2 class="sub-title" style="margin-top: 0;">Dynamic Rerouting Under Road Failure</h2>
    <p>
        When a flood or collapse invalidates an active road segment, the C++ engine mutates the graph topology in-place and triggers an automatic detour re-computation (Figure 11).
    </p>

    <!-- SVG Figure 11: Dynamic Detour Flowchart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 210" style="width: 100%; max-height: 200px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="230" y="8" width="190" height="26" rx="13" fill="#1e293b" />
            <text x="325" y="25" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">Disaster Scenario Injected</text>

            <line x1="325" y1="34" x2="325" y2="48" stroke="#333" stroke-width="1.5" />

            <rect x="180" y="48" width="290" height="26" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" />
            <text x="325" y="65" font-size="9" fill="#991b1b" text-anchor="middle">Mark Road Edge (u, v) as BLOCKED (isBlocked = true)</text>

            <line x1="325" y1="74" x2="325" y2="88" stroke="#333" stroke-width="1.5" />

            <polygon points="325,88 410,110 325,132 240,110" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
            <text x="325" y="113" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">Active Mission on Road?</text>

            <line x1="410" y1="110" x2="480" y2="110" stroke="#333" stroke-width="1.5" />
            <text x="440" y="104" font-size="9" fill="#ef4444" font-weight="bold">Yes</text>
            <rect x="480" y="98" width="130" height="24" rx="4" fill="#fef3c7" stroke="#d97706" stroke-width="1" />
            <text x="545" y="114" font-size="8.5" fill="#b45309" text-anchor="middle">Trigger In-Transit Alert</text>

            <line x1="325" y1="132" x2="325" y2="148" stroke="#333" stroke-width="1.5" />
            <text x="335" y="142" font-size="9" fill="#16a34a" font-weight="bold">No</text>

            <rect x="180" y="148" width="290" height="24" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5" />
            <text x="325" y="164" font-size="9" fill="#0369a1" text-anchor="middle">Re-run Dijkstra with Edge Excluded from Adjacency List</text>

            <line x1="325" y1="172" x2="325" y2="184" stroke="#333" stroke-width="1.5" />

            <rect x="200" y="184" width="250" height="22" rx="11" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5" />
            <text x="325" y="199" font-size="8.5" font-weight="bold" fill="#15803d" text-anchor="middle">Highlight Detour Route on Live Map & Mission Card</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 11: Event-driven dynamic edge invalidation and Dijkstra detour workflow</div>

    <h1 class="section-title" style="margin-top: 14px;">4.8 Priority Queue Triage & Aging Mechanics</h1>
    <p>
        In mass-casualty emergencies, calls flood the dispatch center. To prioritize critical lives while preventing starvation of minor calls, incidents are managed inside a Binary Min-Heap sorted by composite score:
    </p>
    <div style="background: #f8fafc; border-left: 3px solid #10b981; padding: 6px 12px; margin: 6px 0; font-family: 'Consolas', monospace; font-size: 9.5pt;">
        Composite Priority Score = (6 - Severity) * 10 - AgeCounter
    </div>
    <p>
        Severity ranges from 1 (minor sprain) to 5 (cardiac arrest / structural entrapment). Each time the simulation clock advances by 15 minutes, the <span class="mono">advanceTime()</span> routine increments the <span class="mono">AgeCounter</span> of every pending incident. Over time, an untreated Severity 2 incident's composite score decreases until it bubbles to the top of the Min-Heap, guaranteeing service.
    </p>
    <div class="page-footer">16</div>
</div>
`;

// ==========================================
// PAGE 17: 4.9 COMPLEXITY ANALYSIS
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">4.9 Complexity Analysis</h1>
    <hr class="title-divider">
    <p>
        In this analysis, $V$ denotes the number of urban vertices ($|V| = 17$), $E$ denotes road corridors ($|E| = 22$), and $N$ represents active emergency incidents held in triage. Because memory operations execute in native C++, all operations complete within fractions of a millisecond.
    </p>

    <div style="font-weight: 700; font-size: 9.5pt; margin: 12px 0 6px 0; text-align: center;">
        Table 9: Theoretical and Empirical Time & Space Complexity
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 25%;">Algorithm / Operation</th>
                <th style="width: 22%; text-align: center;">Time Complexity</th>
                <th style="width: 20%; text-align: center;">Space Complexity</th>
                <th style="width: 33%;">Operational Role</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Dijkstra (Min-Heap)</strong></td>
                <td class="center">$\\mathcal{O}((V + E) \\log V)$</td>
                <td class="center">$\\mathcal{O}(V)$</td>
                <td>Computes minimum travel-time paths across the road network.</td>
            </tr>
            <tr>
                <td><strong>Breadth-First Search (BFS)</strong></td>
                <td class="center">$\\mathcal{O}(V + E)$</td>
                <td class="center">$\\mathcal{O}(V)$</td>
                <td>Calculates fewest intersection hops and verifies connected components.</td>
            </tr>
            <tr>
                <td><strong>Depth-First Search (DFS)</strong></td>
                <td class="center">$\\mathcal{O}(V + E)$</td>
                <td class="center">$\\mathcal{O}(V)$</td>
                <td>Verifies destination reachability and network partition boundaries.</td>
            </tr>
            <tr>
                <td><strong>Min-Heap Insertion / Pop</strong></td>
                <td class="center">$\\mathcal{O}(\\log N)$</td>
                <td class="center">$\\mathcal{O}(N)$</td>
                <td>Triage priority queue insertion and dispatch dequeuing.</td>
            </tr>
            <tr>
                <td><strong>Triage Queue Aging</strong></td>
                <td class="center">$\\mathcal{O}(N)$</td>
                <td class="center">$\\mathcal{O}(1)$</td>
                <td>Linearly updates incident wait counters and restores heap invariant.</td>
            </tr>
            <tr>
                <td><strong>Kruskal's MST (via DSU)</strong></td>
                <td class="center">$\\mathcal{O}(E \\log E)$</td>
                <td class="center">$\\mathcal{O}(V)$</td>
                <td>Computes critical backbone spanning tree to ensure resilient connectivity.</td>
            </tr>
            <tr>
                <td><strong>DSU Find & Union</strong></td>
                <td class="center">$\\mathcal{O}(\\alpha(V)) \\approx \\mathcal{O}(1)$</td>
                <td class="center">$\\mathcal{O}(V)$</td>
                <td>Near-constant cycle detection during minimum spanning tree construction.</td>
            </tr>
            <tr>
                <td><strong>Doubly Linked List Append</strong></td>
                <td class="center">$\\mathcal{O}(1)$</td>
                <td class="center">$\\mathcal{O}(1)$</td>
                <td>Appends completed mission records to the historical audit chain.</td>
            </tr>
            <tr>
                <td><strong>Audit Log QuickSort</strong></td>
                <td class="center">$\\mathcal{O}(M \\log M)$</td>
                <td class="center">$\\mathcal{O}(\\log M)$</td>
                <td>Sorts mission records by severity or response duration without STL sort.</td>
            </tr>
            <tr>
                <td><strong>Adjacency List Build</strong></td>
                <td class="center">$\\mathcal{O}(V + E)$</td>
                <td class="center">$\\mathcal{O}(V + E)$</td>
                <td>Instantiates active graph topology skipping blocked disaster corridors.</td>
            </tr>
        </tbody>
    </table>

    <h2 class="sub-title" style="margin-top: 18px;">Empirical Performance Benchmarks</h2>
    <p>
        On an ordinary workstation (Intel Core i5 / Windows 11), empirical execution profiling yielded the following benchmarks:
    </p>
    <ul>
        <li><strong>Dijkstra Query Latency:</strong> Averaged <strong>0.14 milliseconds</strong> ($140 \\mu\\text{s}$) across 1,000 random source-destination queries.</li>
        <li><strong>Heap Dequeue Latency:</strong> Averaged <strong>0.02 milliseconds</strong> ($20 \\mu\\text{s}$) for queues holding up to 50 active emergencies.</li>
        <li><strong>REST Round-Trip Overhead:</strong> WinSock network serialization and JSON delivery across localhost completed in under <strong>2.8 milliseconds</strong>.</li>
    </ul>
    <div class="page-footer">17</div>
</div>
`;

// ==========================================
// PAGE 18: 5. WORKING - 5.1 MAIN WINDOW & MAP
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">5. Working of the System</h1>
    <hr class="title-divider">

    <h2 class="sub-title">5.1 Main Window and Live Command Map</h2>
    <p>
        The operator interface is divided into three functional zones: a global navigation sidebar on the left, an interactive 2D command map in the center, and a telemetry inspection drawer on the right. When the operator selects an active incident or clicks two nodes on the canvas, the system executes the click-handling flow shown in Figure 12 and renders the optimal route (Figure 13).
    </p>

    <!-- Flowchart Figure 12: Click handling -->
    <div class="figure-container">
        <svg viewBox="0 0 650 90" style="width: 100%; max-height: 85px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="20" y="25" width="130" height="40" rx="4" fill="#e0f2fe" stroke="#0284c7" />
            <text x="85" y="44" font-size="9" font-weight="bold" fill="#0369a1" text-anchor="middle">Operator Clicks</text>
            <text x="85" y="56" font-size="8.5" fill="#555" text-anchor="middle">Incident on Map</text>

            <line x1="150" y1="45" x2="190" y2="45" stroke="#333" stroke-width="1.5" />

            <rect x="190" y="25" width="130" height="40" rx="4" fill="#fef3c7" stroke="#d97706" />
            <text x="255" y="44" font-size="9" font-weight="bold" fill="#b45309" text-anchor="middle">Query C++ API</text>
            <text x="255" y="56" font-size="8.5" fill="#555" text-anchor="middle">/api/route/fastest</text>

            <line x1="320" y1="45" x2="360" y2="45" stroke="#333" stroke-width="1.5" />

            <rect x="360" y="25" width="130" height="40" rx="4" fill="#f1f5f9" stroke="#64748b" />
            <text x="425" y="44" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">Dijkstra Engine</text>
            <text x="425" y="56" font-size="8.5" fill="#555" text-anchor="middle">Computes Predecessors</text>

            <line x1="490" y1="45" x2="520" y2="45" stroke="#333" stroke-width="1.5" />

            <rect x="520" y="25" width="110" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" />
            <text x="575" y="44" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">Render Neon Path</text>
            <text x="575" y="56" font-size="8.5" fill="#555" text-anchor="middle">Display Mission Card</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 12: Click handling and reactive route rendering workflow</div>

    <div class="figure-container" style="margin-top: 10px;">
        <img src="${imgMainMap}" alt="Main Command Map">
    </div>
    <div class="figure-caption">Figure 13: Live Command Map highlighting optimal emergency route and mission dispatch summary</div>
    <div class="page-footer">18</div>
</div>
`;

// ==========================================
// PAGE 19: 5.2 SIMULATION CENTER & ROAD BLOCKING
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">5.2 Dynamic Disaster Simulation & Road Blocking</h1>
    <hr class="title-divider">
    <p>
        The <strong>Simulation Center</strong> functions as an event-driven disaster simulator. Operators can advance simulation time in discrete 15-minute intervals (triggering traffic congestion updates and triage aging) or inject catastrophic scenario breaches.
    </p>

    <!-- Figure 14: Failure injection flowchart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 90" style="width: 100%; max-height: 85px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="15" y="25" width="135" height="40" rx="4" fill="#fee2e2" stroke="#ef4444" />
            <text x="82" y="44" font-size="9" font-weight="bold" fill="#991b1b" text-anchor="middle">Trigger Flood Scenario</text>
            <text x="82" y="56" font-size="8.5" fill="#555" text-anchor="middle">POST /api/simulation</text>

            <line x1="150" y1="45" x2="185" y2="45" stroke="#333" stroke-width="1.5" />

            <rect x="185" y="25" width="135" height="40" rx="4" fill="#fee2e2" stroke="#ef4444" />
            <text x="252" y="44" font-size="9" font-weight="bold" fill="#991b1b" text-anchor="middle">Sever Road Edge</text>
            <text x="252" y="56" font-size="8.5" fill="#555" text-anchor="middle">Sec 63 ➔ Hindan BLOCKED</text>

            <line x1="320" y1="45" x2="355" y2="45" stroke="#333" stroke-width="1.5" />

            <rect x="355" y="25" width="135" height="40" rx="4" fill="#e0f2fe" stroke="#0284c7" />
            <text x="422" y="44" font-size="9" font-weight="bold" fill="#0369a1" text-anchor="middle">Enqueue Severity 5 Event</text>
            <text x="422" y="56" font-size="8.5" fill="#555" text-anchor="middle">Heap Insertion (N=6)</text>

            <line x1="490" y1="45" x2="520" y2="45" stroke="#333" stroke-width="1.5" />

            <rect x="520" y="25" width="115" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" />
            <text x="577" y="44" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">Update Impact Cards</text>
            <text x="577" y="56" font-size="8.5" fill="#555" text-anchor="middle">Enable Map Jump</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 14: Disaster injection and simulation impact event pipeline</div>

    <div class="figure-container" style="margin-top: 10px;">
        <img src="${imgSimCenter}" alt="Simulation Center">
    </div>
    <div class="figure-caption">Figure 15: Simulation Center displaying Time-Step Engine, Scenario Injector, and Live Impact Monitor</div>
    <div class="page-footer">19</div>
</div>
`;

// ==========================================
// PAGE 20: 5.3 ALGORITHM VISUALIZER
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">5.3 Algorithm Visualizer</h1>
    <hr class="title-divider">
    <p>
        The <strong>Algorithm Visualizer</strong> allows students and faculty to observe how Dijkstra's algorithm reaches its shortest-path decision step-by-step. During execution, the C++ engine records an array of execution snapshots. Each snapshot captures: the currently settled vertex, relaxed candidate edges, updated distance tables, and the Min-Heap frontier queue.
    </p>

    <!-- Figure 16: Snapshot visualizer flowchart -->
    <div class="figure-container">
        <svg viewBox="0 0 650 80" style="width: 100%; max-height: 75px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <rect x="20" y="20" width="130" height="38" rx="4" fill="#f1f5f9" stroke="#64748b" />
            <text x="85" y="38" font-size="9" font-weight="bold" fill="#111" text-anchor="middle">Run Dijkstra Engine</text>
            <text x="85" y="50" font-size="8" fill="#555" text-anchor="middle">Step-by-Step Mode</text>

            <line x1="150" y1="39" x2="185" y2="39" stroke="#333" stroke-width="1.5" />

            <rect x="185" y="20" width="130" height="38" rx="4" fill="#e0f2fe" stroke="#0284c7" />
            <text x="250" y="38" font-size="9" font-weight="bold" fill="#0369a1" text-anchor="middle">Record Snapshot</text>
            <text x="250" y="50" font-size="8" fill="#555" text-anchor="middle">{u, relaxed, dist, PQ}</text>

            <line x1="315" y1="39" x2="350" y2="39" stroke="#333" stroke-width="1.5" />

            <rect x="350" y="20" width="130" height="38" rx="4" fill="#fef3c7" stroke="#d97706" />
            <text x="415" y="38" font-size="9" font-weight="bold" fill="#b45309" text-anchor="middle">Store Snapshot Array</text>
            <text x="415" y="50" font-size="8" fill="#555" text-anchor="middle">std::vector&lt;Snapshot&gt;</text>

            <line x1="480" y1="39" x2="515" y2="39" stroke="#333" stroke-width="1.5" />

            <rect x="515" y="20" width="115" height="38" rx="4" fill="#dcfce7" stroke="#16a34a" />
            <text x="572" y="38" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">UI Step Replay</text>
            <text x="572" y="50" font-size="8" fill="#555" text-anchor="middle">Play, Step, End Controls</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 16: Snapshot recording and client replay engine architecture</div>

    <div class="figure-container" style="margin-top: 10px;">
        <img src="${imgVisualizer}" alt="Algorithm Visualizer">
    </div>
    <div class="figure-caption">Figure 17: Algorithm Visualizer highlighting visited nodes (orange), edge relaxations, and distance table</div>
    <div class="page-footer">20</div>
</div>
`;

// ==========================================
// PAGE 21: 5.4 MULTI-STAGE EVACUATION & DETOUR VERIFICATION
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">5.4 Multi-Stage Evacuation Mission & Detour Verification</h1>
    <hr class="title-divider">
    <p>
        Figure 18 presents empirical proof of the dynamic rerouting engine operating under live disaster conditions. In this test, a catastrophic flash flood was triggered at <em>Hindan River Embankment</em>, blocking the arterial road from <em>Sector 63 Community Center</em> (indicated by the red dashed line).
    </p>

    <div class="figure-container" style="margin-top: 8px;">
        <img src="${imgFloodReroute}" alt="Detour Mission Dispatched">
    </div>
    <div class="figure-caption">Figure 18: Live Command Map showing dynamic bypass around flooded road and two-leg evacuation mission</div>

    <h2 class="sub-title" style="margin-top: 14px;">Algorithmic Route Breakdown</h2>
    <p>
        As shown in the mission dispatch banner:
    </p>
    <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px 12px; margin: 6px 0; font-size: 8.5pt;">
        <strong>Mission MSN-509:</strong> Flood (Sev 5) at Hindan River Embankment | Team: RT-02 | Shelter: SH-03<br>
        <strong>Itinerary:</strong> Sector 59 Metro $\\rightarrow$ Mamura $\\rightarrow$ Khoda $\\rightarrow$ Indirapuram Relief Camp $\\rightarrow$ Hindan River Embankment $\\rightarrow$ Indirapuram Relief Camp
    </div>
    <p>
        This test confirms three simultaneous algorithmic mechanisms:
    </p>
    <ol>
        <li><strong>Dynamic Edge Exclusion:</strong> The flooded direct bridge was omitted from graph relaxation.</li>
        <li><strong>Optimal Detour:</strong> Team RT-02 took the southern corridor via Mamura and Khoda to reach the victims.</li>
        <li><strong>Two-Leg Shelter Allocation:</strong> After rescuing victims at Hindan, the vehicle transported evacuees to the closest available shelter with capacity (<em>Indirapuram Relief Camp, SH-03</em>).</li>
    </ol>
    <div class="page-footer">21</div>
</div>
`;

// ==========================================
// PAGE 22: 5.5 DATA STRUCTURE INSPECTOR
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">5.5 Data Structure Inspector & Network Topology</h1>
    <hr class="title-divider">
    <p>
        The <strong>Data Structure Inspector</strong> tab (Figure 19) provides complete runtime transparency into the internal C++ data structures. Faculty examiners can directly inspect:
    </p>
    <ul>
        <li><strong>Adjacency Matrix & List View:</strong> Real-time edge traversal weights and boolean active flags.</li>
        <li><strong>Kruskal's Minimum Spanning Tree:</strong> The optimal emergency backbone calculated using Disjoint Set Union (DSU) with Path Compression.</li>
        <li><strong>Connected Components Counter:</strong> BFS-driven sub-network connectivity and partition detection.</li>
    </ul>

    <div class="figure-container" style="margin-top: 12px;">
        <img src="${imgInspector}" alt="Data Structure Inspector">
    </div>
    <div class="figure-caption">Figure 19: Data Structure Inspector displaying graph topology, adjacency weights, and DSU connectivity</div>
    <div class="page-footer">22</div>
</div>
`;

// ==========================================
// PAGE 23: 5.6 SHELTERS & 5.7 MISSION AUDIT LOG
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">5.6 Humanitarian Shelters & Live Occupancy</h1>
    <p>
        The <strong>Resources & Evacuation</strong> module (Figure 20) monitors shelter bed capacity, food rations, and medical supply levels across all four designated municipal shelters. When victims are admitted during a dispatch, occupancy bars dynamically update, preventing over-allocation.
    </p>

    <div class="figure-container" style="margin: 6px 0;">
        <img src="${imgResources}" alt="Humanitarian Shelters Grid" style="max-height: 80mm;">
    </div>
    <div class="figure-caption">Figure 20: Humanitarian Relief Shelters & Live Occupancy tracking real-time capacity and resources</div>

    <h1 class="section-title" style="margin-top: 14px;">5.7 Completed Mission Audit Log (Doubly Linked List)</h1>
    <p>
        The <strong>Completed Mission Audit Log</strong> (Figure 21) archives resolved missions in a custom Doubly Linked List. Operators can sort the mission history by severity, response duration, or distance using pointer-based QuickSort or MergeSort routines without relying on standard library sorting.
    </p>

    <div class="figure-container" style="margin: 6px 0;">
        <img src="${imgAuditLog}" alt="Mission Audit Log Table" style="max-height: 80mm;">
    </div>
    <div class="figure-caption">Figure 21: Completed Mission Audit Log with custom QuickSort/MergeSort sorting controls</div>
    <div class="page-footer">23</div>
</div>
`;

// ==========================================
// PAGE 24: 6. TESTING - 6.1 ROUTE TESTS
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">6. Testing and Results</h1>
    <hr class="title-divider">

    <h2 class="sub-title">6.1 Route Tests</h2>
    <p>
        We tested a comprehensive set of origin-destination location pairs under normal operational conditions and compared the automated software outputs against ground-truth values calculated manually from the road distance matrix. Table 10 summarizes the results.
    </p>

    <div style="font-weight: 700; font-size: 9.5pt; margin: 12px 0 6px 0; text-align: center;">
        Table 10: Origin-Destination Route Test Cases and Validation
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 25%;">Source Location</th>
                <th style="width: 25%;">Destination Location</th>
                <th style="width: 14%; text-align: center;">Fastest (min)</th>
                <th style="width: 12%; text-align: center;">Dijkstra Dist</th>
                <th style="width: 12%; text-align: center;">BFS Hops</th>
                <th style="width: 12%; text-align: center;">Match Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>JIIT Sector 62</td>
                <td>Sector 62 Fire Station</td>
                <td class="center">3.0</td>
                <td class="center">1.2 km</td>
                <td class="center">1</td>
                <td class="center" style="color: #16a34a; font-weight: bold;">Verified</td>
            </tr>
            <tr>
                <td>Sector 62 Fire Station</td>
                <td>Hindan River Embankment</td>
                <td class="center">16.0</td>
                <td class="center">7.1 km</td>
                <td class="center">3</td>
                <td class="center" style="color: #16a34a; font-weight: bold;">Verified</td>
            </tr>
            <tr>
                <td>Sector 59 Metro Station</td>
                <td>Sector 18 Commercial Hub</td>
                <td class="center">19.0</td>
                <td class="center">8.5 km</td>
                <td class="center">3</td>
                <td class="center" style="color: #16a34a; font-weight: bold;">Verified</td>
            </tr>
            <tr>
                <td>JIIT Sector 62</td>
                <td>Jaypee Hospital Sector 128</td>
                <td class="center">28.5</td>
                <td class="center">17.2 km</td>
                <td class="center">5</td>
                <td class="center" style="color: #16a34a; font-weight: bold;">Verified</td>
            </tr>
            <tr>
                <td>Khoda Village</td>
                <td>Sector 24 Police Station</td>
                <td class="center">19.0</td>
                <td class="center">8.2 km</td>
                <td class="center">3</td>
                <td class="center" style="color: #16a34a; font-weight: bold;">Verified</td>
            </tr>
            <tr>
                <td>Botanical Garden Hub</td>
                <td>Hindan River Embankment</td>
                <td class="center">42.0</td>
                <td class="center">23.4 km</td>
                <td class="center">4</td>
                <td class="center" style="color: #16a34a; font-weight: bold;">Verified</td>
            </tr>
        </tbody>
    </table>

    <h2 class="sub-title" style="margin-top: 18px;">Analysis of Route Outputs</h2>
    <p>
        In every test case, the Dijkstra engine successfully identified the minimum-time path. For example, between <em>Sector 59 Metro Station</em> and <em>Sector 18 Commercial Hub</em>, the algorithm correctly avoided the congested residential lanes of Khoda and routed vehicles along the arterial transit corridor via Sector 24 Police Station, saving 5 minutes of traversal time.
    </p>
    <div class="page-footer">24</div>
</div>
`;

// ==========================================
// PAGE 25: 6.2 FAILURE TESTS & BAR CHART
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">6.2 Failure Tests & Network Resilience</h1>
    <hr class="title-divider">
    <p>
        Table 11 documents the topological behavior of the network under progressive simulated infrastructure failures. Figure 22 illustrates the resulting changes in active vertices, cut-off sub-networks, and travel times.
    </p>

    <div style="font-weight: 700; font-size: 9pt; margin: 4px 0 2px 0; text-align: center;">
        Table 11: Network Failure Test Cases (Route: Sector 62 Fire Station to Hindan River)
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 32%;">Failure Scenario Injected</th>
                <th style="width: 14%; text-align: center;">Active Vertices</th>
                <th style="width: 14%; text-align: center;">Sub-Networks</th>
                <th style="width: 14%; text-align: center;">Cut-Off Nodes</th>
                <th style="width: 26%; text-align: center;">Dijkstra Fastest Route</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Baseline (No Failures)</strong></td>
                <td class="center">17</td>
                <td class="center">1</td>
                <td class="center">0</td>
                <td class="center" style="color: #16a34a; font-weight: bold;">16.0 min (7.1 km)</td>
            </tr>
            <tr>
                <td><strong>Sector 63 Bridge Blocked</strong></td>
                <td class="center">17</td>
                <td class="center">1</td>
                <td class="center">0</td>
                <td class="center" style="color: #d97706; font-weight: bold;">28.0 min (11.8 km Detour)</td>
            </tr>
            <tr>
                <td><strong>Mamura & Khoda Blocked</strong></td>
                <td class="center">17</td>
                <td class="center">1</td>
                <td class="center">0</td>
                <td class="center" style="color: #d97706; font-weight: bold;">38.5 min (Expressway Bypass)</td>
            </tr>
            <tr>
                <td><strong>Hindan Inundation (All Bridges)</strong></td>
                <td class="center">16</td>
                <td class="center">2</td>
                <td class="center">1</td>
                <td class="center" style="color: #ef4444; font-weight: bold;">No Route (Blocked)</td>
            </tr>
        </tbody>
    </table>

    <!-- SVG Figure 22: Failure Test Bar Chart -->
    <div class="figure-container" style="margin-top: 10px;">
        <svg viewBox="0 0 650 190" style="width: 100%; max-height: 180px; background: #fafafa; border: 1px solid #ddd; border-radius: 6px;">
            <line x1="60" y1="150" x2="610" y2="150" stroke="#333" stroke-width="1.2" />
            <line x1="60" y1="20" x2="60" y2="150" stroke="#333" stroke-width="1.2" />

            <text x="50" y="154" font-size="9" fill="#444" text-anchor="end">0m</text>
            <text x="50" y="118" font-size="9" fill="#444" text-anchor="end">10m</text>
            <text x="50" y="85" font-size="9" fill="#444" text-anchor="end">20m</text>
            <text x="50" y="52" font-size="9" fill="#444" text-anchor="end">30m</text>
            <text x="50" y="25" font-size="9" fill="#444" text-anchor="end">40m</text>

            <line x1="58" y1="115" x2="610" y2="115" stroke="#e2e8f0" stroke-dasharray="3,3" />
            <line x1="58" y1="82" x2="610" y2="82" stroke="#e2e8f0" stroke-dasharray="3,3" />
            <line x1="58" y1="49" x2="610" y2="49" stroke="#e2e8f0" stroke-dasharray="3,3" />

            <rect x="90" y="97" width="80" height="53" fill="#16a34a" />
            <text x="130" y="90" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">16.0 min</text>
            <text x="130" y="165" font-size="8.5" fill="#333" text-anchor="middle">1. Normal</text>

            <rect x="220" y="58" width="80" height="92" fill="#d97706" />
            <text x="260" y="52" font-size="9" font-weight="bold" fill="#b45309" text-anchor="middle">28.0 min</text>
            <text x="260" y="165" font-size="8.5" fill="#333" text-anchor="middle">2. Sec 63 Blocked</text>

            <rect x="350" y="23" width="80" height="127" fill="#dc2626" />
            <text x="390" y="17" font-size="9" font-weight="bold" fill="#991b1b" text-anchor="middle">38.5 min</text>
            <text x="390" y="165" font-size="8.5" fill="#333" text-anchor="middle">3. Bypass Route</text>

            <rect x="480" y="148" width="80" height="2" fill="#64748b" />
            <text x="520" y="140" font-size="9" font-weight="bold" fill="#ef4444" text-anchor="middle">NO ROUTE (∞)</text>
            <text x="520" y="165" font-size="8.5" fill="#333" text-anchor="middle">4. All Severed</text>
        </svg>
    </div>
    <div class="figure-caption">Figure 22: Travel time impact under progressive infrastructure road closures and flood breaches</div>
    <div class="page-footer">25</div>
</div>
`;

// ==========================================
// PAGE 26: 6.3 INPUT HANDLING & EDGE CASES
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">6.3 Input Handling & Edge Cases</h1>
    <hr class="title-divider">
    <p>
        A robust emergency application must gracefully handle corrupted operator inputs, duplicate reports, and edge cases without throwing unhandled exceptions or crashing the daemon. Table 12 demonstrates the platform's response to unusual conditions.
    </p>

    <div style="font-weight: 700; font-size: 9.5pt; margin: 12px 0 6px 0; text-align: center;">
        Table 12: System Behavior Under Edge Cases and Boundary Conditions
    </div>
    <table class="report-table" style="font-size: 8.5pt;">
        <thead>
            <tr>
                <th style="width: 35%;">Unusual / Faulty Input Condition</th>
                <th style="width: 65%;">Software Response & Recovery Action</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Source equals Destination ($S = D$)</strong></td>
                <td>Returns a zero-length route (<span class="mono">0.0 min, 0 hops</span>) and notifies the user that origin and target are identical.</td>
            </tr>
            <tr>
                <td><strong>Target completely cut off by flooding</strong></td>
                <td>Dijkstra terminates when queue empties with <span class="mono">dist[D] == ∞</span>. UI displays a red badge: <em>"No Route Available: Corridor Inundated"</em>.</td>
            </tr>
            <tr>
                <td><strong>Relief shelter at 100% capacity</strong></td>
                <td>The shelter allocation heuristic skips the full facility and automatically assigns the next closest shelter with beds.</td>
            </tr>
            <tr>
                <td><strong>Duplicate disaster incident injection</strong></td>
                <td>The server generates timestamped unique hashes (<span class="mono">SCN-FLD-xxxx</span>) preventing key collisions in the hash map.</td>
            </tr>
            <tr>
                <td><strong>All rescue teams currently deployed</strong></td>
                <td>The incident remains stored inside the Min-Heap priority queue until a team completes its mission and reports available.</td>
            </tr>
            <tr>
                <td><strong>Corrupted non-numeric JSON payload</strong></td>
                <td>WinSock HTTP server catches parse errors with <span class="mono">nlohmann::json::parse_error</span>, returning HTTP 400 Bad Request safely.</td>
            </tr>
        </tbody>
    </table>

    <h2 class="sub-title" style="margin-top: 24px;">Verification Conclusion</h2>
    <p>
        The testing suite demonstrated that AURA-EMS maintains strict algorithmic correctness and operational stability under both peak load conditions and catastrophic edge failures.
    </p>
    <div class="page-footer">26</div>
</div>
`;

// ==========================================
// PAGE 27: 7. LIMITATIONS, 8. CONCLUSION & REFS
// ==========================================
html += `
<div class="page">
    <h1 class="section-title">7. Limitations and Future Scope</h1>
    <hr class="title-divider">

    <h2 class="sub-title">7.1 Limitations</h2>
    <ul>
        <li><strong>In-Memory Volatility:</strong> Newly created roads and dynamically reported incidents reside in RAM; server restart resets network to pre-seeded state.</li>
        <li><strong>Static Traffic Profiles:</strong> Edge weights are modified via discrete simulation time steps rather than continuous real-time GPS feeds.</li>
        <li><strong>Single Disaster Type Edge Impact:</strong> Flood scenarios currently toggle road edge availability in a binary fashion rather than computing speed degradation curves.</li>
    </ul>

    <h2 class="sub-title">7.2 Future Scope</h2>
    <ul>
        <li><strong>Persistent Database Integration:</strong> Connect the C++ server to SQLite/PostgreSQL to persist historical mission audits permanently.</li>
        <li><strong>A* Search with Euclidean Heuristics:</strong> Implement A* with geometric latitude/longitude coordinates to accelerate pathfinding on 10,000+ node road graphs.</li>
        <li><strong>Mobile First-Responder PWA:</strong> Develop a progressive web app enabling field ambulances to transmit live GPS coordinates and receive turn-by-turn detours.</li>
    </ul>

    <h1 class="section-title" style="margin-top: 14px;">8. Conclusion</h1>
    <p>
        The Adaptive Urban Routing & Allocation for Emergency Services (AURA-EMS) successfully demonstrates how core Data Structures and Algorithms solve critical municipal logistics problems. By integrating an Adjacency List graph, Dijkstra's shortest path algorithm, a Binary Min-Heap triage queue with starvation-preventing aging, and a Doubly Linked List audit trail, the platform provides actionable emergency dispatch capabilities. Live disaster testing verified that dynamic road blockages automatically trigger detours, proving the practical value of computer science principles in public safety.
    </p>

    <h1 class="section-title" style="margin-top: 14px;">References</h1>
    <ol style="font-size: 8.5pt; margin-bottom: 0;">
        <li>T. H. Cormen, C. E. Leiserson, R. L. Rivest, and C. Stein, <em>Introduction to Algorithms (CLRS)</em>, 4th ed., MIT Press, 2022.</li>
        <li>E. W. Dijkstra, "A Note on Two Problems in Connexion with Graphs," <em>Numerische Mathematik</em>, vol. 1, pp. 269–271, 1959.</li>
        <li>J. B. Kruskal, "On the Shortest Spanning Subtree of a Graph and the Traveling Salesman Problem," <em>Proc. Amer. Math. Soc.</em>, vol. 7, pp. 48–50, 1956.</li>
        <li>R. E. Tarjan, "Depth-First Search and Linear Graph Algorithms," <em>SIAM Journal on Computing</em>, vol. 1, no. 2, pp. 146–160, 1972.</li>
        <li>ISO/IEC, <em>Programming Languages — C++ (ISO/IEC 14882:2017)</em>, International Organization for Standardization, 2017.</li>
    </ol>
    <div class="page-footer">27</div>
</div>
`;

html += `
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
console.log('Successfully written full 27-page HTML report to:', OUTPUT_HTML);

// Now trigger Chrome to print to PDF
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
