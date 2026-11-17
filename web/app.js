const API_BASE = '/api';

const state = {
    nodes: [],
    roads: [],
    incidents: [],
    teams: [],
    shelters: [],
    activeMission: null,
    vehicleAnimation: null,
    tarjanData: null,
    highlightTarjan: false,
    highlightedRoute: null,
    camera: { x: 0, y: 0, zoom: 1.0, isDragging: false, startX: 0, startY: 0 },
    draggedNode: null,
    selectedNode: null,
    algoTrace: null,
    algoStep: 0,
    algoPlaying: false,
    algoInterval: null
};

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCanvas();
    initSearch();
    initModals();
    initVisualizer();
    initResourcesAndReports();
    initCheatSheet();

    fetchAllData();
    setInterval(fetchLiveStatus, 3000);
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const target = item.getAttribute('data-target');
            document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');

            if (target === 'view-map') requestAnimationFrame(renderMap);
            else if (target === 'view-visualizer') {
                if (!state.algoTrace) loadAlgorithmTrace();
                else renderAlgoStep();
            }
            else if (target === 'view-inspector') refreshInspectorView();
            else if (target === 'view-simulation') refreshSimulationView();
            else if (target === 'view-resources') refreshResourcesView();
            else if (target === 'view-reports') refreshReportsView();
        });
    });
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') toast.style.borderLeftColor = 'var(--accent-crimson)';
    else if (type === 'success') toast.style.borderLeftColor = 'var(--accent-emerald)';
    toast.innerHTML = `<i class="fa-solid fa-bell" style="margin-right: 8px;"></i>${msg}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

async function fetchAllData() {
    try {
        const [cityRes, incRes, teamRes, shRes] = await Promise.all([
            fetch(`${API_BASE}/city`).then(r => r.json()),
            fetch(`${API_BASE}/incidents`).then(r => r.json()),
            fetch(`${API_BASE}/teams`).then(r => r.json()),
            fetch(`${API_BASE}/shelters`).then(r => r.json())
        ]);

        state.nodes = cityRes.nodes || [];
        state.roads = cityRes.roads || [];
        state.incidents = incRes || [];
        state.teams = teamRes || [];
        state.shelters = shRes || [];

        populateNodeSelects();
        updateKpiBadges();
        requestAnimationFrame(renderMap);
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

async function fetchLiveStatus() {
    try {
        const health = await fetch(`${API_BASE}/health`).then(r => r.json());
        const incRes = await fetch(`${API_BASE}/incidents`).then(r => r.json());
        state.incidents = incRes;
        updateKpiBadges(health);
        requestAnimationFrame(renderMap);
    } catch (e) {}
}

function updateClock(mins = 0) {
    const h = String(Math.floor(mins / 60)).padStart(2, '0');
    const m = String(mins % 60).padStart(2, '0');
    const clk = document.getElementById('sim-clock');
    if (clk) clk.textContent = `TIME: ${h}:${m}:00`;
}

function updateKpiBadges(health = {}) {
    if (health.systemTimeMinutes !== undefined) {
        updateClock(health.systemTimeMinutes);
    }
    const qCount = health.pendingQueue !== undefined ? health.pendingQueue : state.incidents.filter(i => i.status === 'Reported').length;
    document.getElementById('kpi-queue-count').textContent = qCount;
    document.getElementById('kpi-active-teams').textContent = state.teams.filter(t => t.status === 'Deployed').length;

    const freeBeds = state.shelters.reduce((acc, s) => acc + s.availableCapacity, 0);
    document.getElementById('kpi-free-beds').textContent = freeBeds;
}

function populateNodeSelects() {
    const startSel = document.getElementById('algo-start-node');
    const endSel = document.getElementById('algo-end-node');
    const modalLocSel = document.getElementById('inp-inc-loc');
    const mapStart = document.getElementById('map-start-node');
    const mapEnd = document.getElementById('map-end-node');

    if (startSel && endSel) {
        startSel.innerHTML = '';
        endSel.innerHTML = '';
        state.nodes.forEach(n => {
            startSel.innerHTML += `<option value="${n.name}">${n.name}</option>`;
            endSel.innerHTML += `<option value="${n.name}">${n.name}</option>`;
        });
        if (state.nodes.length > 5) {
            startSel.value = "JIIT Sector 62";
            endSel.value = "Jaypee Hospital Sector 128";
        }
    }

    if (mapStart && mapEnd) {
        mapStart.innerHTML = '';
        mapEnd.innerHTML = '';
        state.nodes.forEach(n => {
            mapStart.innerHTML += `<option value="${n.name}">${n.name}</option>`;
            mapEnd.innerHTML += `<option value="${n.name}">${n.name}</option>`;
        });
        if (state.nodes.length > 0) mapStart.value = "JIIT Sector 62";
        if (state.nodes.length > 17) mapEnd.value = "Jaypee Hospital Sector 128";
    }

    if (modalLocSel) {
        modalLocSel.innerHTML = '';
        state.nodes.forEach(n => {
            modalLocSel.innerHTML += `<option value="${n.name}">${n.name} (${n.type})</option>`;
        });
    }
}

let canvas, ctx;
function initCanvas() {
    canvas = document.getElementById('map-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        requestAnimationFrame(renderMap);
    }
    window.addEventListener('resize', resize);
    resize();

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        state.camera.zoom = Math.max(0.4, Math.min(3.0, state.camera.zoom * zoomFactor));
        requestAnimationFrame(renderMap);
    });

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left - canvas.width / 2) / state.camera.zoom - state.camera.x;
        const my = (e.clientY - rect.top - canvas.height / 2) / state.camera.zoom - state.camera.y;

        for (let i = state.nodes.length - 1; i >= 0; --i) {
            const n = state.nodes[i];
            const dist = Math.hypot(n.x - mx, n.y - my);
            if (dist < 18) {
                state.draggedNode = n;
                return;
            }
        }

        for (const road of state.roads) {
            const n1 = state.nodes[road.from];
            const n2 = state.nodes[road.to];
            if (!n1 || !n2) continue;
            const d = distToSegment({ x: mx, y: my }, n1, n2);
            if (d < 10) {
                toggleRoad(road);
                return;
            }
        }

        state.camera.isDragging = true;
        state.camera.startX = e.clientX;
        state.camera.startY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (state.draggedNode) {
            const rect = canvas.getBoundingClientRect();
            state.draggedNode.x = (e.clientX - rect.left - canvas.width / 2) / state.camera.zoom - state.camera.x;
            state.draggedNode.y = (e.clientY - rect.top - canvas.height / 2) / state.camera.zoom - state.camera.y;
            requestAnimationFrame(renderMap);
            return;
        }

        if (state.camera.isDragging) {
            state.camera.x += (e.clientX - state.camera.startX) / state.camera.zoom;
            state.camera.y += (e.clientY - state.camera.startY) / state.camera.zoom;
            state.camera.startX = e.clientX;
            state.camera.startY = e.clientY;
            requestAnimationFrame(renderMap);
        }
    });

    window.addEventListener('mouseup', () => {
        state.camera.isDragging = false;
        state.draggedNode = null;
    });

    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
        state.camera.zoom = Math.min(3.0, state.camera.zoom * 1.2);
        requestAnimationFrame(renderMap);
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
        state.camera.zoom = Math.max(0.4, state.camera.zoom / 1.2);
        requestAnimationFrame(renderMap);
    });
    document.getElementById('btn-reset-map')?.addEventListener('click', () => {
        state.camera = { x: -480, y: -340, zoom: 1.0, isDragging: false };
        requestAnimationFrame(renderMap);
    });

    document.getElementById('chk-tarjan-bottlenecks')?.addEventListener('change', async (e) => {
        state.highlightTarjan = e.target.checked;
        if (state.highlightTarjan && !state.tarjanData) {
            state.tarjanData = await fetch(`${API_BASE}/trace/tarjan`).then(r => r.json());
            showToast(`Tarjan Analysis: ${state.tarjanData.bridges.length} Bridges & ${state.tarjanData.articulationPoints.length} Articulation Junctions found!`);
        }
        requestAnimationFrame(renderMap);
    });

    document.getElementById('btn-calc-fastest-route')?.addEventListener('click', computeMapFastestRoute);
    document.getElementById('btn-clear-map-route')?.addEventListener('click', () => {
        state.highlightedRoute = null;
        const stats = document.getElementById('map-route-stats');
        const txt = document.getElementById('map-route-path-text');
        if (stats) stats.textContent = '';
        if (txt) txt.textContent = 'Select start and destination to compute and highlight the fastest route in real-time.';
        requestAnimationFrame(renderMap);
    });

    state.camera.x = -480;
    state.camera.y = -340;
}

async function computeMapFastestRoute() {
    const start = document.getElementById('map-start-node')?.value || 'JIIT Sector 62';
    const end = document.getElementById('map-end-node')?.value || 'Jaypee Hospital Sector 128';

    if (start === end) {
        showToast('Please select two distinct locations', 'info');
        return;
    }

    try {
        const data = await fetch(`${API_BASE}/trace/astar?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`).then(r => r.json());
        if (data.astar && data.astar.path && data.astar.path.length > 0) {
            state.highlightedRoute = {
                path: data.astar.path,
                distanceKm: data.astar.distanceKm,
                timeMicroseconds: data.astar.timeMicroseconds,
                start,
                end
            };
            const eta = Math.ceil(data.astar.distanceKm * 1.2);
            const stats = document.getElementById('map-route-stats');
            const txt = document.getElementById('map-route-path-text');
            if (stats) stats.textContent = `${data.astar.distanceKm.toFixed(1)} km (~${eta}m)`;
            if (txt) txt.innerHTML = `<strong>Fastest Route (${data.astar.path.length} sectors):</strong><br><span style="color:var(--accent-cyan); font-weight:700;">${data.astar.path.join(' ➔ ')}</span>`;
            showToast(`Fastest Route Computed: ${data.astar.distanceKm.toFixed(1)} km via A* Heuristic!`, 'success');
            requestAnimationFrame(renderMap);
        } else {
            showToast('No path found! All connecting roads may be blocked.', 'error');
            state.highlightedRoute = null;
            const stats = document.getElementById('map-route-stats');
            const txt = document.getElementById('map-route-path-text');
            if (stats) stats.textContent = 'BLOCKED';
            if (txt) txt.textContent = 'Destination unreachable due to active roadblocks!';
            requestAnimationFrame(renderMap);
        }
    } catch (e) {
        showToast('Error calculating route', 'error');
    }
}

function distToSegment(p, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

async function toggleRoad(road) {
    const willBlock = !road.isBlocked;
    try {
        const res = await fetch(`${API_BASE}/roads/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: road.fromName, to: road.toName, blocked: willBlock })
        }).then(r => r.json());

        road.isBlocked = willBlock;
        road.condition = willBlock ? 'Blocked' : 'Normal';
        showToast(`Road (${road.fromName} <-> ${road.toName}) is now ${willBlock ? 'BLOCKED' : 'OPEN'}!`, willBlock ? 'error' : 'success');

        // Automatically re-compute and re-route the fastest path in real-time!
        if (state.highlightedRoute) {
            computeMapFastestRoute();
        } else {
            requestAnimationFrame(renderMap);
        }
    } catch (err) {
        showToast('Failed to toggle road block', 'error');
    }
}

function renderMap() {
    if (!ctx || !canvas) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(state.camera.zoom, state.camera.zoom);
    ctx.translate(state.camera.x, state.camera.y);

    const showLabels = document.getElementById('chk-show-labels')?.checked ?? true;
    const showDistances = document.getElementById('chk-show-distances')?.checked ?? true;

    state.roads.forEach(road => {
        const n1 = state.nodes[road.from];
        const n2 = state.nodes[road.to];
        if (!n1 || !n2) return;

        let isBridge = false;
        if (state.highlightTarjan && state.tarjanData) {
            isBridge = state.tarjanData.bridges.some(b => 
                (b.u === road.from && b.v === road.to) || (b.u === road.to && b.v === road.from)
            );
        }

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);

        if (road.isBlocked) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
        } else if (isBridge) {
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 4;
            ctx.setLineDash([]);
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 12;
        } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;

        if (showDistances) {
            const mx = (n1.x + n2.x) / 2;
            const my = (n1.y + n2.y) / 2;
            ctx.font = '10px JetBrains Mono';
            ctx.fillStyle = road.isBlocked ? '#f87171' : '#94a3b8';
            ctx.fillText(`${road.distanceKm}km`, mx, my - 4);
        }
    });

    if (state.activeMission && state.activeMission.route) {
        const r = state.activeMission.route;
        ctx.beginPath();
        for (let i = 0; i < r.length; ++i) {
            const node = state.nodes.find(n => n.name === r[i]);
            if (node) {
                if (i === 0) ctx.moveTo(node.x, node.y);
                else ctx.lineTo(node.x, node.y);
            }
        }
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // ==========================================
    // 🌟 HIGH-VISIBILITY FASTEST ROUTE LASER BEAM
    // ==========================================
    if (state.highlightedRoute && state.highlightedRoute.path && state.highlightedRoute.path.length > 1) {
        const path = state.highlightedRoute.path;
        const coords = [];
        for (const name of path) {
            const nd = state.nodes.find(n => n.name === name);
            if (nd) coords.push({ x: nd.x, y: nd.y, name });
        }

        if (coords.length > 1) {
            ctx.save();

            // Layer 1: Wide pulsing cyan glow aura
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i].x, coords[i].y);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
            ctx.lineWidth = 18;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Layer 2: Vivid Cyan Neon Laser Highway
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i].x, coords[i].y);
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 8;
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 24;
            ctx.stroke();

            // Layer 3: Brilliant White Core Beam
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i].x, coords[i].y);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 0;
            ctx.stroke();

            // Layer 4: Directional animated traveling pulses
            const dashOffset = (Date.now() / 25) % 40;
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i].x, coords[i].y);
            ctx.strokeStyle = '#fde047'; // bright yellow energy packets
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 30]);
            ctx.lineDashOffset = -dashOffset;
            ctx.stroke();
            ctx.setLineDash([]);

            // Layer 5: Start & End Node Radar Halos
            const pPulse = 22 + Math.sin(Date.now() / 180) * 5;
            // Start node halo (Emerald)
            const pStart = coords[0];
            ctx.beginPath();
            ctx.arc(pStart.x, pStart.y, pPulse, 0, Math.PI * 2);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 16;
            ctx.stroke();

            // End node halo (Ruby)
            const pEnd = coords[coords.length - 1];
            ctx.beginPath();
            ctx.arc(pEnd.x, pEnd.y, pPulse, 0, Math.PI * 2);
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 16;
            ctx.stroke();

            ctx.restore();
        }
    }

    state.nodes.forEach(node => {
        let isArtPoint = false;
        if (state.highlightTarjan && state.tarjanData) {
            isArtPoint = state.tarjanData.articulationPoints.some(ap => ap.id === node.id);
        }

        let baseColor = '#0284c7';
        if (node.type === 'Fire Station') baseColor = '#ef4444';
        else if (node.type === 'Hospital') baseColor = '#3b82f6';
        else if (node.type === 'Shelter') baseColor = '#10b981';
        else if (node.type === 'Police Station') baseColor = '#8b5cf6';
        else if (node.type === 'Village') baseColor = '#eab308';
        else if (node.type === 'Disaster Spot') baseColor = '#f97316';

        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.fill();

        if (isArtPoint) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#f59e0b';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 14;
            ctx.stroke();
            ctx.shadowBlur = 0;
        } else {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
        }

        ctx.font = 'bold 11px Inter';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let initial = node.type.charAt(0);
        ctx.fillText(initial, node.x, node.y);

        const inc = state.incidents.find(i => i.location === node.name && (i.status === 'Reported' || i.status === 'In-Progress'));
        if (inc) {
            const time = Date.now() / 300;
            const pulse = 18 + Math.sin(time) * 6;
            ctx.beginPath();
            ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
            ctx.strokeStyle = inc.severity >= 4 ? '#ef4444' : '#f59e0b';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.font = 'bold 14px FontAwesome, sans-serif';
            ctx.fillStyle = '#f43f5e';
            ctx.fillText('⚠', node.x + 14, node.y - 12);
        }

        if (showLabels) {
            ctx.font = '11px Inter';
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.fillText(node.name, node.x, node.y + 24);
        }
    });

    if (state.vehicleAnimation) {
        const v = state.vehicleAnimation;
        ctx.beginPath();
        ctx.arc(v.currX, v.currY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    ctx.restore();

    // Screen-space floating HUD for active route
    if (state.highlightedRoute && state.highlightedRoute.path) {
        ctx.save();
        const bannerW = Math.min(540, canvas.width - 32);
        const bannerH = 46;
        const bx = (canvas.width - bannerW) / 2;
        const by = 16;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, bannerW, bannerH, 10);
        else ctx.rect(bx, by, bannerW, bannerH);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#00f2fe';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('⚡ FASTEST ROUTE ACTIVE', bx + 16, by + 19);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '11px Inter';
        const eta = Math.ceil(state.highlightedRoute.distanceKm * 1.2);
        ctx.fillText(`${state.highlightedRoute.distanceKm.toFixed(1)} km  |  ${state.highlightedRoute.path.length} Sectors  |  ETA ~${eta} min`, bx + 16, by + 36);

        ctx.fillStyle = '#a5f3fc';
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'right';
        ctx.fillText('💡 Click any road to re-route', bx + bannerW - 16, by + 28);
        ctx.restore();
    }

    // Keep pulse animation loop active while route or vehicle is active
    if (state.highlightedRoute || (state.activeMission && state.activeMission.inProgress)) {
        const mapTab = document.getElementById('view-map');
        if (mapTab && mapTab.classList.contains('active')) {
            requestAnimationFrame(renderMap);
        }
    }
}

function initSearch() {
    const input = document.getElementById('trie-search-input');
    const box = document.getElementById('trie-autocomplete-box');

    input.addEventListener('input', async () => {
        const q = input.value.trim();
        if (!q) {
            box.style.display = 'none';
            return;
        }

        try {
            const data = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`).then(r => r.json());
            if (data.results && data.results.length > 0) {
                box.innerHTML = '';
                data.results.forEach(item => {
                    const el = document.createElement('div');
                    el.style.padding = '8px 12px';
                    el.style.borderBottom = '1px solid var(--border-color)';
                    el.style.cursor = 'pointer';
                    el.innerHTML = `<strong>${item.name}</strong> <span style="font-size:11px; color:var(--accent-cyan);">(${item.type})</span>`;
                    el.addEventListener('click', () => {
                        input.value = item.name;
                        box.style.display = 'none';
                        const n = state.nodes.find(node => node.name === item.name);
                        if (n) {
                            state.camera.x = -n.x;
                            state.camera.y = -n.y;
                            state.camera.zoom = 1.6;
                            requestAnimationFrame(renderMap);
                        }
                    });
                    box.appendChild(el);
                });
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        } catch (e) {}
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !box.contains(e.target)) {
            box.style.display = 'none';
        }
    });
}

function initModals() {
    const btnReport = document.getElementById('btn-report-incident');
    const modalReport = document.getElementById('modal-report');
    const closeBtn = document.getElementById('modal-report-close');
    const submitBtn = document.getElementById('btn-submit-incident');

    btnReport.addEventListener('click', () => {
        modalReport.classList.add('open');
    });
    closeBtn.addEventListener('click', () => {
        modalReport.classList.remove('open');
    });

    submitBtn.addEventListener('click', async () => {
        const type = document.getElementById('inp-inc-type').value;
        const loc = document.getElementById('inp-inc-loc').value;
        const sev = parseInt(document.getElementById('inp-inc-sev').value);
        const aff = parseInt(document.getElementById('inp-inc-aff').value);
        const cas = parseInt(document.getElementById('inp-inc-cas').value);
        const desc = document.getElementById('inp-inc-desc').value || 'Reported via dispatch control';

        try {
            const res = await fetch(`${API_BASE}/incidents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, location: loc, severity: sev, affectedPeople: aff, casualties: cas, description: desc })
            }).then(r => r.json());

            if (res.success) {
                showToast(`New ${type} incident (${res.incidentId}) queued with Priority ${sev * 100}!`, 'success');
                modalReport.classList.remove('open');
                fetchAllData();
            }
        } catch (e) {
            showToast('Failed to register incident', 'error');
        }
    });

    document.getElementById('btn-dispatch-next').addEventListener('click', async () => {
        try {
            const res = await fetch(`${API_BASE}/dispatch/next`, { method: 'POST' }).then(r => r.json());
            if (res.success) {
                state.activeMission = res;
                showToast(`Dispatched Team ${res.teamId} to ${res.location} (Rescued ${res.peopleRescued})!`, 'success');

                const banner = document.getElementById('dispatch-banner');
                if (banner) {
                    banner.style.display = 'block';
                    document.getElementById('m-id').textContent = res.missionId;
                    document.getElementById('m-title').textContent = `${res.incidentType} (Sev ${res.severity}) at ${res.location}`;
                    document.getElementById('m-details').textContent = `Distance: ${res.distanceKm.toFixed(1)} km | Team: ${res.teamId} | Shelter: ${res.shelterId}`;
                    document.getElementById('m-path').textContent = `Route: ${res.route.join(' ➔ ')}`;
                }

                animateVehicle(res.route);
                fetchAllData();
            } else {
                showToast(res.message || 'No pending incidents', 'info');
            }
        } catch (e) {
            showToast('Dispatch failed', 'error');
        }
    });

    document.getElementById('btn-undo-action').addEventListener('click', async () => {
        try {
            const res = await fetch(`${API_BASE}/undo`, { method: 'POST' }).then(r => r.json());
            showToast(res.message, res.success ? 'success' : 'info');
            state.activeMission = null;
            document.getElementById('dispatch-banner').style.display = 'none';
            fetchAllData();
        } catch (e) {
            showToast('Undo failed', 'error');
        }
    });
}

function animateVehicle(routeNames) {
    if (!routeNames || routeNames.length < 2) return;
    const pathNodes = routeNames.map(name => state.nodes.find(n => n.name === name)).filter(Boolean);
    if (pathNodes.length < 2) return;

    let segment = 0;
    let progress = 0.0;
    const speed = 0.025;

    state.vehicleAnimation = {
        currX: pathNodes[0].x,
        currY: pathNodes[0].y
    };

    function stepAnim() {
        if (segment >= pathNodes.length - 1) {
            state.vehicleAnimation = null;
            requestAnimationFrame(renderMap);
            return;
        }

        const p1 = pathNodes[segment];
        const p2 = pathNodes[segment + 1];
        progress += speed;

        if (progress >= 1.0) {
            progress = 0.0;
            segment++;
            if (segment >= pathNodes.length - 1) {
                state.vehicleAnimation = null;
                requestAnimationFrame(renderMap);
                return;
            }
        }

        state.vehicleAnimation.currX = p1.x + (p2.x - p1.x) * progress;
        state.vehicleAnimation.currY = p1.y + (p2.y - p1.y) * progress;

        renderMap();
        requestAnimationFrame(stepAnim);
    }
    requestAnimationFrame(stepAnim);
}

const ALGO_PSEUDOCODE = {
    dijkstra: [
        "1: dist[start] = 0; pq.push({start, 0})",
        "2: while pq is not empty:",
        "3:     u = pq.extractMin()",
        "4:     if visited[u] continue; visited[u] = true",
        "5:     for each neighbor v of u with weight w:",
        "6:         if dist[u] + w < dist[v]:",
        "7:             dist[v] = dist[u] + w; parent[v] = u",
        "8:             pq.push({v, dist[v]})"
    ],
    astar: [
        "1: g[start] = 0; f[start] = h(start, dest)",
        "2: openSet.push({start, f[start]})",
        "3: while openSet is not empty:",
        "4:     u = openSet.extractMin()",
        "5:     if u == dest: return reconstructPath(parent, dest)",
        "6:     for each neighbor v of u:",
        "7:         tentative_g = g[u] + weight(u, v)",
        "8:         if tentative_g < g[v]: parent[v] = u; g[v] = tentative_g",
        "9:             f[v] = g[v] + h(v, dest); openSet.push({v, f[v]})"
    ],
    compare: [
        "1: Run Dijkstra: Uniform-cost frontier expansion",
        "2: Run A*: Guided heuristic f(n) = g(n) + h(n)",
        "3: Evaluate search space reduction: (Dij - A*) / Dij %",
        "4: Compare explored nodes and microsecond runtime"
    ],
    bfs: [
        "1: queue.push(start); visited[start] = true",
        "2: while queue is not empty:",
        "3:     u = queue.pop()",
        "4:     for each unvisited neighbor v of u:",
        "5:         visited[v] = true; parent[v] = u",
        "6:         queue.push(v)"
    ],
    dfs: [
        "1: stack.push(start)",
        "2: while stack is not empty:",
        "3:     u = stack.pop()",
        "4:     if not visited[u]: visited[u] = true",
        "5:     for each neighbor v of u in reverse:",
        "6:         if not visited[v]: stack.push(v)"
    ],
    kruskal: [
        "1: sort all edges E in non-decreasing order of weight",
        "2: initialize Union-Find disjoint sets for all V",
        "3: for each edge (u, v, w) in sorted order:",
        "4:     if find(u) != find(v):",
        "5:         mst.add(u, v); union(u, v)",
        "6:         if mst.size == |V| - 1: break"
    ],
    prim: [
        "1: visited = {start}; pq = all edges incident to start",
        "2: while pq is not empty and |mst| < |V| - 1:",
        "3:     (u, v, w) = pq.extractMin()",
        "4:     if v in visited continue",
        "5:     visited.add(v); mst.add(u, v, w)",
        "6:     for each edge (v, z, w2): pq.push({v, z, w2})"
    ],
    tarjan: [
        "1: tin[u] = low[u] = ++timer; visited[u] = true",
        "2: for each neighbor v of u:",
        "3:     if v == parent continue",
        "4:     if visited[v]: low[u] = min(low[u], tin[v])",
        "5:     else: dfs(v, u); low[u] = min(low[u], low[v])",
        "6:         if low[v] > tin[u]: bridge(u, v)",
        "7:         if low[v] >= tin[u] and p != -1: cutVertex(u)"
    ],
    maxflow: [
        "1: maxFlow = 0; initialize residual graph R = G",
        "2: while bfsFindAugmentingPath(s, t, parent):",
        "3:     bottleneck = min residual capacity along path",
        "4:     for each edge (u, v) in path:",
        "5:         R[u][v] -= bottleneck; R[v][u] += bottleneck",
        "6:     maxFlow += bottleneck",
        "7: return maxFlow"
    ]
};

function initVisualizer() {
    const playBtn = document.getElementById('btn-play-pause');
    const prevBtn = document.getElementById('btn-step-prev');
    const nextBtn = document.getElementById('btn-step-next');
    const resetBtn = document.getElementById('btn-algo-reset');
    const algoSel = document.getElementById('algo-select');
    const speedInput = document.getElementById('algo-speed');
    const speedLabel = document.getElementById('speed-label');

    speedInput?.addEventListener('input', () => {
        if (speedLabel) speedLabel.textContent = `${speedInput.value}ms`;
        if (state.algoPlaying) {
            clearInterval(state.algoInterval);
            startAlgoPlayback();
        }
    });

    algoSel.addEventListener('change', loadAlgorithmTrace);
    document.getElementById('algo-start-node')?.addEventListener('change', loadAlgorithmTrace);
    document.getElementById('algo-end-node')?.addEventListener('change', loadAlgorithmTrace);

    nextBtn.addEventListener('click', () => {
        if (!state.algoTrace || !state.algoTrace.steps) return;
        if (state.algoStep < state.algoTrace.steps.length - 1) {
            state.algoStep++;
            renderAlgoStep();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (state.algoStep > 0) {
            state.algoStep--;
            renderAlgoStep();
        }
    });

    playBtn.addEventListener('click', () => {
        if (state.algoPlaying) {
            clearInterval(state.algoInterval);
            state.algoPlaying = false;
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
        } else {
            if (!state.algoTrace) {
                loadAlgorithmTrace().then(() => startAlgoPlayback());
            } else {
                startAlgoPlayback();
            }
        }
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(state.algoInterval);
        state.algoPlaying = false;
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
        state.algoStep = 0;
        renderAlgoStep();
    });
}

function startAlgoPlayback() {
    const playBtn = document.getElementById('btn-play-pause');
    const speed = parseInt(document.getElementById('algo-speed')?.value || '600');
    state.algoPlaying = true;
    if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';

    state.algoInterval = setInterval(() => {
        if (state.algoTrace && state.algoStep < state.algoTrace.steps.length - 1) {
            state.algoStep++;
            renderAlgoStep();
        } else {
            clearInterval(state.algoInterval);
            state.algoPlaying = false;
            if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
        }
    }, speed);
}

async function loadAlgorithmTrace() {
    const algo = document.getElementById('algo-select').value;
    const start = document.getElementById('algo-start-node').value || 'JIIT Sector 62';
    const end = document.getElementById('algo-end-node').value || 'Jaypee Hospital Sector 128';

    const compareCard = document.getElementById('algo-compare-card');
    if (algo === 'compare') {
        if (compareCard) compareCard.style.display = 'block';
    } else {
        if (compareCard) compareCard.style.display = 'none';
    }

    let url = `${API_BASE}/trace/${algo}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
    if (algo === 'kruskal' || algo === 'prim') url = `${API_BASE}/trace/mst?algo=${algo}`;
    else if (algo === 'maxflow') url = `${API_BASE}/trace/maxflow?source=${encodeURIComponent(start)}&sink=${encodeURIComponent(end)}`;
    else if (algo === 'compare') url = `${API_BASE}/trace/compare?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

    try {
        const data = await fetch(url).then(r => r.json());
        if (!data.steps && data.astarSteps) {
            data.steps = data.astarSteps;
        }
        if (!data.path && data.astar && data.astar.path) {
            data.path = data.astar.path;
        }
        state.algoTrace = data;
        state.algoStep = 0;

        if (algo === 'compare' && data.dijkstra && data.astar) {
            document.getElementById('cmp-dij-nodes').textContent = data.dijkstra.nodesExplored;
            document.getElementById('cmp-dij-dist').textContent = `${data.dijkstra.distanceKm.toFixed(1)} km`;
            document.getElementById('cmp-dij-time').textContent = `${data.dijkstra.timeMicroseconds} μs`;

            document.getElementById('cmp-ast-nodes').textContent = data.astar.nodesExplored;
            document.getElementById('cmp-ast-dist').textContent = `${data.astar.distanceKm.toFixed(1)} km`;
            document.getElementById('cmp-ast-time').textContent = `${data.astar.timeMicroseconds} μs`;

            document.getElementById('cmp-summary-badge').textContent = `-${data.reductionPercent}% Search Space`;
            document.getElementById('cmp-summary').textContent = data.summary;
        }

        renderAlgoStep();
    } catch (e) {
        showToast('Failed to load algorithm trace', 'error');
    }
}

function renderAlgoStep() {
    if (!state.algoTrace || !state.algoTrace.steps) return;
    const steps = state.algoTrace.steps;
    const step = steps[state.algoStep] || {};
    const algo = document.getElementById('algo-select').value;

    document.getElementById('algo-step-counter').textContent = `Step ${state.algoStep + 1} / ${steps.length}`;
    document.getElementById('algo-step-explanation').textContent = step.explanation || step.description || 'Executing algorithm step...';

    // Pseudocode display and line highlight
    const pseudoBox = document.getElementById('algo-pseudocode');
    if (pseudoBox) {
        const lines = ALGO_PSEUDOCODE[algo] || ALGO_PSEUDOCODE.dijkstra;
        let activeLine = 3;
        if (state.algoStep === 0) activeLine = 0;
        else if (step.relaxedEdge && step.relaxedEdge !== 'None') activeLine = lines.length > 6 ? 6 : 4;
        else if (state.algoStep >= steps.length - 1) activeLine = lines.length - 1;

        pseudoBox.innerHTML = lines.map((l, idx) => 
            `<div class="code-line ${idx === activeLine ? 'active' : ''}">${l}</div>`
        ).join('');
    }

    // Frontier / Priority Queue
    const fList = document.getElementById('algo-frontier-list');
    fList.innerHTML = '';
    if (step.frontier && step.frontier.length > 0) {
        step.frontier.forEach(item => {
            fList.innerHTML += `<div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px;">
                <span>${item.node || item.name}</span>
                <span class="mono" style="color:var(--accent-cyan); font-weight:700;">${item.dist !== undefined ? item.dist.toFixed(1) + ' km' : (item.fScore !== undefined ? 'f=' + item.fScore.toFixed(1) : '')}</span>
            </div>`;
        });
    } else {
        fList.innerHTML = '<span style="color:var(--text-muted); font-size:11px;">Queue empty / Finalizing</span>';
    }

    // Settled / Visited Nodes
    const vSet = document.getElementById('algo-visited-set');
    if (vSet) {
        vSet.innerHTML = '';
        if (step.visited && step.visited.length > 0) {
            step.visited.forEach(vNode => {
                vSet.innerHTML += `<span style="background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.3); color:var(--accent-emerald); padding:2px 8px; border-radius:12px;">${vNode}</span>`;
            });
        } else {
            vSet.innerHTML = '<span style="color:var(--text-muted); font-size:11px;">None settled yet</span>';
        }
    }

    // Tentative Distances Table
    const dTable = document.getElementById('algo-dist-table');
    dTable.innerHTML = '';
    if (step.tentativeDistances) {
        for (const [k, v] of Object.entries(step.tentativeDistances)) {
            dTable.innerHTML += `<div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding:3px 0;">
                <span>${k}</span>
                <span style="color:var(--accent-emerald); font-weight:700;">${v.toFixed(1)} km</span>
            </div>`;
        }
    }

    renderVisualizerCanvas(step);
}

function renderVisualizerCanvas(step) {
    const vCanvas = document.getElementById('visualizer-canvas');
    if (!vCanvas) return;
    const vCtx = vCanvas.getContext('2d');
    vCanvas.width = vCanvas.parentElement.clientWidth;
    vCanvas.height = vCanvas.parentElement.clientHeight;

    vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);
    const scaleX = vCanvas.width / 950;
    const scaleY = vCanvas.height / 650;

    const algo = document.getElementById('algo-select')?.value || 'dijkstra';
    const startNode = document.getElementById('algo-start-node')?.value;
    const endNode = document.getElementById('algo-end-node')?.value;

    // Detect optimal path and completion status
    const optimalPath = state.algoTrace?.path || 
                        (state.algoTrace?.astar && state.algoTrace.astar.path) || 
                        (state.algoTrace?.dijkstra && state.algoTrace.dijkstra.path) || [];
    const totalSteps = state.algoTrace?.steps?.length || 1;
    const isLastStep = state.algoStep >= (totalSteps - 1);
    const targetReached = (step && step.currentNode === endNode) || 
                          (step && step.explanation && step.explanation.toLowerCase().includes('target reached')) || 
                          isLastStep;

    // Parse relaxed edge
    let relaxedU = null, relaxedV = null;
    if (step && step.relaxedEdge && step.relaxedEdge !== 'None' && step.relaxedEdge.includes('->')) {
        const parts = step.relaxedEdge.split('->');
        relaxedU = parts[0].trim();
        relaxedV = parts[1].split('(')[0].trim();
    }

    // Helper to check if edge is part of optimal route
    function isOptimalEdge(name1, name2) {
        if (!targetReached || !optimalPath || optimalPath.length < 2) return false;
        for (let i = 0; i < optimalPath.length - 1; i++) {
            if ((optimalPath[i] === name1 && optimalPath[i + 1] === name2) ||
                (optimalPath[i] === name2 && optimalPath[i + 1] === name1)) {
                return true;
            }
        }
        return false;
    }

    // Draw graph roads
    state.roads.forEach(r => {
        const n1 = state.nodes[r.from];
        const n2 = state.nodes[r.to];
        if (!n1 || !n2) return;

        let isMstEdge = false;
        if ((algo === 'kruskal' || algo === 'prim') && state.algoTrace?.mstEdges) {
            isMstEdge = state.algoTrace.mstEdges.slice(0, state.algoStep + 1).some(e =>
                (e.u === r.from && e.v === r.to) || (e.u === r.to && e.v === r.from)
            );
        }

        const isRelaxingEdge = (relaxedU && relaxedV && (
            (n1.name === relaxedU && n2.name === relaxedV) || 
            (n2.name === relaxedU && n1.name === relaxedV)
        ));

        const isOpt = isOptimalEdge(n1.name, n2.name);

        vCtx.beginPath();
        vCtx.moveTo(n1.x * scaleX, n1.y * scaleY);
        vCtx.lineTo(n2.x * scaleX, n2.y * scaleY);

        if (isOpt) {
            // OPTIMAL FASTEST ROUTE: Radiant Emerald Glow
            vCtx.strokeStyle = '#10b981';
            vCtx.lineWidth = 7;
            vCtx.shadowColor = '#10b981';
            vCtx.shadowBlur = 24;
            vCtx.stroke();

            // Inner white beam
            vCtx.strokeStyle = '#ffffff';
            vCtx.lineWidth = 2.5;
            vCtx.shadowBlur = 0;
            vCtx.stroke();
        } else if (isRelaxingEdge) {
            // RELAXING EDGE: High-Voltage Amber Laser
            vCtx.strokeStyle = '#f59e0b';
            vCtx.lineWidth = 6;
            vCtx.shadowColor = '#f59e0b';
            vCtx.shadowBlur = 20;
            vCtx.stroke();
            vCtx.shadowBlur = 0;
        } else if (isMstEdge) {
            vCtx.strokeStyle = '#06b6d4';
            vCtx.lineWidth = 4;
            vCtx.stroke();
        } else {
            vCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            vCtx.lineWidth = 1.5;
            vCtx.stroke();
        }
        vCtx.shadowBlur = 0;

        // Edge labels for Max-Flow
        if (algo === 'maxflow' && state.algoTrace?.edgeFlows) {
            const ef = state.algoTrace.edgeFlows.find(e => (e.from === n1.name && e.to === n2.name) || (e.from === n2.name && e.to === n1.name));
            if (ef) {
                const mx = (n1.x + n2.x) / 2 * scaleX;
                const my = (n1.y + n2.y) / 2 * scaleY;
                vCtx.font = '10px JetBrains Mono';
                vCtx.fillStyle = ef.flow > 0 ? '#10b981' : '#64748b';
                vCtx.fillText(`${ef.flow}/${ef.capacity}`, mx, my - 4);
            }
        }
    });

    // Draw graph nodes
    state.nodes.forEach(n => {
        const isCurrent = (step && step.currentNode === n.name);
        const isVisited = (step && step.visited && step.visited.includes(n.name));
        const isStart = (n.name === startNode);
        const isEnd = (n.name === endNode);
        const isOptimalNode = targetReached && optimalPath.includes(n.name);
        const isFrontier = (step && step.frontier && step.frontier.some(f => (f.node || f.name) === n.name));

        vCtx.beginPath();
        const radius = isCurrent ? 14 : (isOptimalNode ? 12 : (isStart || isEnd ? 11 : 8));
        vCtx.arc(n.x * scaleX, n.y * scaleY, radius, 0, Math.PI * 2);

        if (isCurrent) {
            vCtx.fillStyle = '#f59e0b';
            vCtx.shadowColor = '#f59e0b';
            vCtx.shadowBlur = 22;
        } else if (isOptimalNode) {
            vCtx.fillStyle = '#10b981';
            vCtx.shadowColor = '#10b981';
            vCtx.shadowBlur = 18;
        } else if (isStart) {
            vCtx.fillStyle = '#0284c7';
            vCtx.shadowColor = '#0284c7';
            vCtx.shadowBlur = 12;
        } else if (isEnd) {
            vCtx.fillStyle = '#e11d48';
            vCtx.shadowColor = '#e11d48';
            vCtx.shadowBlur = 12;
        } else if (isVisited) {
            vCtx.fillStyle = '#059669';
            vCtx.shadowBlur = 0;
        } else if (isFrontier) {
            vCtx.fillStyle = '#0f766e';
            vCtx.shadowColor = '#06b6d4';
            vCtx.shadowBlur = 10;
        } else {
            vCtx.fillStyle = '#334155';
            vCtx.shadowBlur = 0;
        }
        vCtx.fill();

        // Node border ring
        vCtx.strokeStyle = isFrontier ? '#06b6d4' : '#ffffff';
        vCtx.lineWidth = isCurrent || isOptimalNode ? 2.5 : 1.5;
        vCtx.stroke();
        vCtx.shadowBlur = 0;

        // Label
        vCtx.font = (isCurrent || isOptimalNode) ? 'bold 11px Inter' : '10px Inter';
        vCtx.fillStyle = isCurrent ? '#fbbf24' : (isOptimalNode ? '#a7f3d0' : (isVisited ? '#6ee7b7' : '#94a3b8'));
        vCtx.textAlign = 'center';
        vCtx.fillText(n.name, n.x * scaleX, n.y * scaleY + 20);
    });

    // Top Canvas Visualizer HUD Banner
    vCtx.save();
    const vBannerW = Math.min(580, vCanvas.width - 24);
    const vBannerH = 48;
    const vbx = (vCanvas.width - vBannerW) / 2;
    const vby = 12;

    vCtx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    vCtx.strokeStyle = targetReached ? '#10b981' : '#f59e0b';
    vCtx.lineWidth = 1.5;
    vCtx.shadowColor = targetReached ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)';
    vCtx.shadowBlur = 16;
    vCtx.beginPath();
    if (vCtx.roundRect) vCtx.roundRect(vbx, vby, vBannerW, vBannerH, 8);
    else vCtx.rect(vbx, vby, vBannerW, vBannerH);
    vCtx.fill();
    vCtx.stroke();
    vCtx.shadowBlur = 0;

    if (targetReached && optimalPath.length > 0) {
        const dist = state.algoTrace?.totalDistanceKm || state.algoTrace?.astar?.distanceKm || state.algoTrace?.dijkstra?.distanceKm || '';
        const distStr = dist ? `${parseFloat(dist).toFixed(1)} km` : '';
        vCtx.fillStyle = '#34d399';
        vCtx.font = 'bold 12px Inter';
        vCtx.textAlign = 'left';
        vCtx.fillText(`✓ TARGET REACHED: OPTIMAL FASTEST ROUTE LOCKED (${distStr})`, vbx + 14, vby + 19);

        vCtx.fillStyle = '#e2e8f0';
        vCtx.font = '10px JetBrains Mono';
        const pathPreview = optimalPath.length > 5 ? `${optimalPath.slice(0, 3).join(' ➔ ')} ... ➔ ${optimalPath[optimalPath.length - 1]}` : optimalPath.join(' ➔ ');
        vCtx.fillText(pathPreview, vbx + 14, vby + 36);
    } else {
        vCtx.fillStyle = '#fbbf24';
        vCtx.font = 'bold 12px Inter';
        vCtx.textAlign = 'left';
        vCtx.fillText(`⚡ STEP ${state.algoStep + 1}/${totalSteps}: Exploring ${step?.currentNode || 'Graph'}`, vbx + 14, vby + 19);

        vCtx.fillStyle = '#cbd5e1';
        vCtx.font = '10px Inter';
        vCtx.fillText(relaxedV ? `Evaluating Edge relaxation ➔ ${relaxedV}` : (step?.explanation || 'Processing Priority Queue...'), vbx + 14, vby + 36);
    }
    vCtx.restore();
}

async function refreshInspectorView() {
    try {
        const [pqData, hashData, lruData, ufData, squadData, historyData] = await Promise.all([
            fetch(`${API_BASE}/ds/priority-queue`).then(r => r.json()),
            fetch(`${API_BASE}/ds/hash-table`).then(r => r.json()),
            fetch(`${API_BASE}/ds/lru-cache`).then(r => r.json()),
            fetch(`${API_BASE}/ds/union-find`).then(r => r.json()),
            fetch(`${API_BASE}/ds/team-heap`).then(r => r.json()),
            fetch(`${API_BASE}/ds/history-list`).then(r => r.json())
        ]);

        // 1. Indexed Max-Heap Tree & Array View
        document.getElementById('heap-size-badge').textContent = `N=${pqData.size || 0}`;
        renderHeapBinaryTree(pqData.nodes || []);
        renderHeapArrayCells(pqData.nodes || []);

        // 2. Custom Hash Table Buckets
        document.getElementById('hash-load-badge').textContent = `Load: ${(hashData.loadFactor || 0).toFixed(2)} (${hashData.size}/${hashData.capacity})`;
        const hashBucketsCont = document.getElementById('hash-table-buckets');
        hashBucketsCont.innerHTML = '';
        if (hashData.chainLengths) {
            hashData.chainLengths.forEach((len, idx) => {
                const color = len > 0 ? (len > 1 ? '#f59e0b' : '#10b981') : '#334155';
                const el = document.createElement('div');
                el.style = `background:rgba(255,255,255,0.04); border-top:3px solid ${color}; padding:6px; border-radius:4px; text-align:center; cursor:pointer;`;
                el.innerHTML = `<div class="mono" style="font-size:10px; color:var(--text-muted);">B[${idx}]</div><div style="font-size:13px; font-weight:700; color:white;">${len}</div>`;
                el.addEventListener('click', () => {
                    const chains = hashData.bucketChains ? hashData.bucketChains[idx] : [];
                    const chainStr = chains && chains.length > 0 ? chains.join(' ➔ ') + ' ➔ NULL' : 'Empty Bucket (NULL)';
                    document.getElementById('hash-chain-inspector').innerHTML = `<strong>Bucket [${idx}]:</strong> <span class="mono" style="color:var(--accent-cyan);">${chainStr}</span>`;
                });
                hashBucketsCont.appendChild(el);
            });
        }

        // 3. Union-Find Component Forest
        document.getElementById('uf-component-count').textContent = `${ufData.numComponents || 1} Connected Components`;
        const ufCont = document.getElementById('union-find-components');
        ufCont.innerHTML = '';
        if (ufData.components) {
            ufData.components.forEach(c => {
                ufCont.innerHTML += `<div style="background:rgba(255,255,255,0.04); border-left:3px solid var(--accent-purple); padding:8px 12px; border-radius:6px; font-size:12px;">
                    <strong style="color:var(--accent-purple); font-size:13px;">Root: ${c.rootName}</strong>
                    <div style="color:var(--text-secondary); margin-top:3px; font-size:11px;">Members: ${c.members.join(', ')}</div>
                </div>`;
            });
        }

        // 4. Mission History DLL & Undo
        const dllCont = document.getElementById('history-dll-cards');
        dllCont.innerHTML = '';
        if (historyData && historyData.length > 0) {
            historyData.forEach((m, idx) => {
                dllCont.innerHTML += `
                    <div class="dll-card">
                        <div>
                            <div style="font-weight:700; font-size:12px; color:var(--accent-amber);">${m.missionId}</div>
                            <div style="font-size:11px; color:white;">${m.incidentType} (${m.locationName})</div>
                            <div style="font-size:10px; color:var(--text-muted);">${m.distanceKm.toFixed(1)} km | Team ${m.teamId}</div>
                        </div>
                    </div>
                    ${idx < historyData.length - 1 ? '<span class="dll-link">⮀</span>' : ''}
                `;
            });
        } else {
            dllCont.innerHTML = '<span style="color:var(--text-muted); font-size:12px;">No completed missions yet. Dispatch incidents from the map.</span>';
        }

        // 5. LRU Cache Stats
        document.getElementById('lru-hits').textContent = lruData.hits || 0;
        document.getElementById('lru-misses').textContent = lruData.misses || 0;
        document.getElementById('lru-rate').textContent = `${(lruData.hitRate || 0).toFixed(1)}%`;
        const lruSlots = document.getElementById('lru-slots');
        lruSlots.innerHTML = '';
        if (lruData.cachedKeys) {
            lruData.cachedKeys.forEach(k => {
                lruSlots.innerHTML += `<span style="background:rgba(2,132,199,0.15); border:1px solid rgba(2,132,199,0.3); color:var(--accent-cyan); padding:4px 10px; border-radius:14px; font-size:12px;">${k}</span>`;
            });
        }

        // 6. Rescue Squad Min-Heap
        const squadCont = document.getElementById('squad-workload-heap');
        squadCont.innerHTML = '';
        if (squadData && squadData.length > 0) {
            squadData.forEach((sq, idx) => {
                squadCont.innerHTML += `
                    <div style="background:rgba(255,255,255,0.04); border-top:3px solid ${idx === 0 ? 'var(--accent-cyan)' : 'var(--border-color)'}; padding:10px; border-radius:6px; font-size:12px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong style="color:white;">${sq.teamId}</strong>
                            ${idx === 0 ? '<span style="background:rgba(6,182,212,0.2); color:var(--accent-cyan); font-size:10px; font-weight:700; padding:1px 6px; border-radius:4px;">NEXT</span>' : ''}
                        </div>
                        <div style="color:var(--text-secondary); margin-top:4px;">Active: <strong style="color:var(--accent-emerald);">${sq.activeMissions}</strong> missions</div>
                    </div>
                `;
            });
        }
    } catch (e) {
        console.error('refreshInspectorView error:', e);
    }
}

function renderHeapBinaryTree(nodes) {
    const canvas = document.getElementById('heap-tree-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 160;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (nodes.length === 0) {
        ctx.font = '12px Inter';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText('Heap is currently empty', canvas.width / 2, 80);
        return;
    }

    const n = Math.min(nodes.length, 7); // Display up to 3 levels
    const positions = [];

    // Level 0
    positions.push({ x: canvas.width / 2, y: 30 });
    // Level 1
    positions.push({ x: canvas.width / 4, y: 80 });
    positions.push({ x: 3 * canvas.width / 4, y: 80 });
    // Level 2
    positions.push({ x: canvas.width / 8, y: 130 });
    positions.push({ x: 3 * canvas.width / 8, y: 130 });
    positions.push({ x: 5 * canvas.width / 8, y: 130 });
    positions.push({ x: 7 * canvas.width / 8, y: 130 });

    // Draw connecting edges
    for (let i = 0; i < n; i++) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n) {
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[left].x, positions[left].y);
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        if (right < n) {
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[right].x, positions[right].y);
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    // Draw nodes
    for (let i = 0; i < n; i++) {
        const p = positions[i];
        const node = nodes[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = (i === 0) ? '#ef4444' : '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(node.id, p.x, p.y + 4);

        ctx.font = '9px Inter';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`P:${node.priority.toFixed(0)}`, p.x, p.y + 26);
    }
}

function renderHeapArrayCells(nodes) {
    const cont = document.getElementById('heap-array-cells');
    if (!cont) return;
    cont.innerHTML = '';
    if (nodes.length === 0) {
        cont.innerHTML = '<span style="color:var(--text-muted); font-size:12px;">Heap array is empty</span>';
        return;
    }
    nodes.forEach((n, idx) => {
        cont.innerHTML += `
            <div class="heap-cell ${idx === 0 ? 'root' : ''}">
                <div class="mono" style="font-size:10px; color:var(--text-muted);">[${idx}]</div>
                <div style="font-weight:700; font-size:13px; color:white; margin:2px 0;">${n.id}</div>
                <div style="font-size:10px; color:var(--accent-cyan); font-weight:700;">${n.priority.toFixed(1)}</div>
                <div style="font-size:9px; color:var(--text-muted);">Sev ${n.originalSeverity}</div>
            </div>
        `;
    });
}

// Inspector interactive buttons
document.getElementById('btn-heap-age')?.addEventListener('click', async () => {
    await fetch(`${API_BASE}/simulation/advance`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ minutes: 15 }) });
    showToast('Simulation advanced +15 min: Dynamic priority aging reordered the Max-Heap!', 'info');
    refreshInspectorView();
});

document.getElementById('btn-heap-extract')?.addEventListener('click', async () => {
    const res = await fetch(`${API_BASE}/ds/priority-queue/extract-max`, { method: 'POST' }).then(r => r.json());
    if (res.success) {
        showToast(`Extracted Root: ${res.extractedId} (Priority: ${res.priority}) - Sifted down in O(log N)!`, 'error');
        refreshInspectorView();
    } else {
        showToast(res.message, 'info');
    }
});

document.getElementById('btn-hash-rehash')?.addEventListener('click', async () => {
    const res = await fetch(`${API_BASE}/ds/hash-table/rehash`, { method: 'POST' }).then(r => r.json());
    if (res.success) {
        showToast(`Dynamic Rehash triggered! Capacity doubled to ${res.capacity} buckets (New Load: ${res.loadFactor.toFixed(2)})!`, 'success');
        refreshInspectorView();
    }
});

document.getElementById('btn-inspector-undo')?.addEventListener('click', async () => {
    const res = await fetch(`${API_BASE}/undo`, { method: 'POST' }).then(r => r.json());
    showToast(res.message, res.success ? 'success' : 'info');
    refreshInspectorView();
    fetchAllData();
});

// Live Trie character walk search box
document.getElementById('inspector-trie-input')?.addEventListener('input', (e) => {
    const val = e.target.value;
    const walkCont = document.getElementById('inspector-trie-walk');
    if (!walkCont) return;

    if (!val) {
        walkCont.innerHTML = `<span class="trie-bubble">Root</span><span class="trie-arrow">➔</span><span style="font-size:11px; color:var(--text-muted);">Type above to visualize Trie character transitions</span>`;
        return;
    }

    let html = `<span class="trie-bubble">Root</span>`;
    for (let i = 0; i < val.length; i++) {
        html += `<span class="trie-arrow">➔</span><span class="trie-bubble">${val[i]}</span>`;
    }

    fetch(`${API_BASE}/search?q=${encodeURIComponent(val)}`)
        .then(r => r.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const matchNames = data.results.map(r => r.name).slice(0, 3).join(', ');
                html += `<span class="trie-arrow">➔</span><span style="color:var(--accent-emerald); font-weight:700; font-size:11px;">[Matches: ${matchNames}]</span>`;
            } else {
                html += `<span class="trie-arrow">➔</span><span style="color:var(--accent-crimson); font-size:11px;">[No prefix match]</span>`;
            }
            walkCont.innerHTML = html;
            // update LRU stats
            fetch(`${API_BASE}/ds/lru-cache`).then(r => r.json()).then(lruData => {
                document.getElementById('lru-hits').textContent = lruData.hits || 0;
                document.getElementById('lru-misses').textContent = lruData.misses || 0;
                document.getElementById('lru-rate').textContent = `${(lruData.hitRate || 0).toFixed(1)}%`;
            });
        });
});

function switchToMap() {
    const mapNavItem = document.querySelector('.nav-item[data-target="view-map"]');
    if (mapNavItem) mapNavItem.click();
}

async function refreshSimulationView() {
    const cont = document.getElementById('sim-impact-content');
    if (!cont) return;

    try {
        const [health, cityData, incData] = await Promise.all([
            fetch(`${API_BASE}/health`).then(r => r.json()),
            fetch(`${API_BASE}/city`).then(r => r.json()),
            fetch(`${API_BASE}/incidents`).then(r => r.json())
        ]);

        if (health.systemTimeMinutes !== undefined) {
            updateClock(health.systemTimeMinutes);
        }

        const blockedRoads = (cityData.roads || []).filter(r => r.isBlocked);
        const activeIncidents = incData || [];
        const highestSeverity = activeIncidents.reduce((max, i) => Math.max(max, i.severity), 0);
        const waitingCount = activeIncidents.filter(i => i.status === 'Reported').length;

        cont.innerHTML = `
            <div style="background: rgba(255,255,255,0.04); padding: 14px; border-radius: 8px; border-top: 3px solid var(--accent-cyan);">
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Simulation Time</div>
                <div style="font-size: 20px; font-weight: 700; color: white; margin: 4px 0;">+${health.systemTimeMinutes || 0}m Elapsed</div>
                <div style="font-size: 11px; color: var(--text-secondary);">Incident priorities escalated via Aging Formula.</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); padding: 14px; border-radius: 8px; border-top: 3px solid ${highestSeverity >= 5 ? '#ef4444' : '#f59e0b'};">
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Active Emergency Incidents</div>
                <div style="font-size: 20px; font-weight: 700; color: white; margin: 4px 0;">${activeIncidents.length} Active (${waitingCount} in Queue)</div>
                <div style="font-size: 11px; color: var(--text-secondary);">Highest Active Severity: <strong>Level ${highestSeverity}</strong></div>
            </div>
            <div style="background: rgba(255,255,255,0.04); padding: 14px; border-radius: 8px; border-top: 3px solid ${blockedRoads.length > 0 ? '#ef4444' : '#10b981'};">
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Infrastructure Status</div>
                <div style="font-size: 20px; font-weight: 700; color: white; margin: 4px 0;">${blockedRoads.length} Blocked Roads</div>
                <div style="font-size: 11px; color: var(--text-secondary);">${blockedRoads.length > 0 ? blockedRoads.map(b => `${b.fromName} ➔ ${b.toName}`).slice(0, 2).join(' | ') : 'All major corridors open'}</div>
            </div>
        `;
    } catch (e) {
        console.error('Error refreshing simulation view:', e);
    }
}

async function triggerScenario(type) {
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    try {
        if (type === 'flood') {
            await fetch(`${API_BASE}/roads/toggle`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ from: 'Sector 63 Community Center', to: 'Hindan River Embankment', blocked: true }) 
            });
            await fetch(`${API_BASE}/incidents`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id: `SCN-FLD-${randSuffix}`, type: 'Flood', location: 'Hindan River Embankment', severity: 5, affectedPeople: 120, casualties: 4, description: 'Catastrophic river surge submerging residential areas' }) 
            });
            showToast('🌊 SCENARIO TRIGGERED: Flash Flood Breach! 1 Road Blocked & Severity 5 Flood Spawned.', 'error');
        } else if (type === 'fire') {
            await fetch(`${API_BASE}/incidents`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id: `SCN-FIR-${randSuffix}`, type: 'Fire', location: 'Sector 63 Community Center', severity: 4, affectedPeople: 45, casualties: 2, description: 'Industrial chemical solvent ignition in basement' }) 
            });
            showToast('🔥 SCENARIO TRIGGERED: Industrial Solvent Fire at Sector 63!', 'error');
        } else if (type === 'earthquake') {
            await fetch(`${API_BASE}/roads/toggle`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ from: 'Botanical Garden Hub', to: 'Greater Noida Expressway Junc', blocked: true }) 
            });
            await fetch(`${API_BASE}/incidents`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id: `SCN-EQK-${randSuffix}`, type: 'Earthquake', location: 'Sector 18 Commercial Hub', severity: 5, affectedPeople: 90, casualties: 7, description: '6.1 Richter seismic shock causing structural collapse' }) 
            });
            showToast('⚠️ SCENARIO TRIGGERED: 6.1M Earthquake! Expressway bridge closed & Sector 18 damaged.', 'error');
        }
        await fetchAllData();
        refreshSimulationView();
    } catch (err) {
        showToast('Failed to trigger scenario: ' + err.message, 'error');
    }
}

async function advanceTime(mins) {
    try {
        const res = await fetch(`${API_BASE}/simulation/advance`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ minutes: mins }) 
        }).then(r => r.json());
        
        showToast(`⏱️ Simulation Clock advanced by +${mins} minutes (Total: ${res.totalSimulationTime}m). Incidents aged!`, 'success');
        await fetchLiveStatus();
        refreshSimulationView();
    } catch (e) {
        showToast('Failed to advance time: ' + e.message, 'error');
    }
}

window.triggerScenario = triggerScenario;
window.advanceTime = advanceTime;
window.switchToMap = switchToMap;
window.refreshSimulationView = refreshSimulationView;

function initResourcesAndReports() {
    document.getElementById('btn-run-knapsack')?.addEventListener('click', async () => {
        try {
            const data = await fetch(`${API_BASE}/resources/knapsack`, { method: 'POST' }).then(r => r.json());
            const cont = document.getElementById('knapsack-results-table');
            let html = `<div style="margin-top:12px; font-size:13px;">
                <div style="margin-bottom:8px; color:var(--accent-emerald); font-weight:700;">
                    Truck Loaded: ${data.loadedWeightKg} kg / ${data.capacityKg} kg | Urgency Points Achieved: ${data.achievedUrgency.toFixed(1)}
                </div>
                <table style="width:100%; border-collapse:collapse; font-size:12px;">
                    <thead><tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); text-align:left;">
                        <th style="padding:6px;">Item</th><th>Weight Loaded</th><th>Fraction Taken</th><th>Urgency Contributed</th><th>Ratio</th>
                    </tr></thead><tbody>`;
            data.packedItems.forEach(it => {
                html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td style="padding:6px; font-weight:600;">${it.name}</td>
                    <td>${it.weightLoadedKg.toFixed(1)} kg</td>
                    <td style="color:var(--accent-cyan);">${(it.fractionTaken * 100).toFixed(0)}%</td>
                    <td style="color:var(--accent-emerald);">${it.valueContributed.toFixed(1)}</td>
                    <td class="mono">${it.ratio.toFixed(2)}</td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
            cont.innerHTML = html;
        } catch (e) {}
    });

    document.getElementById('btn-run-2opt')?.addEventListener('click', async () => {
        try {
            const data = await fetch(`${API_BASE}/resources/route2opt`, { method: 'POST' }).then(r => r.json());
            const cont = document.getElementById('tsp-results-container');
            cont.innerHTML = `<div style="margin-top:12px; font-size:13px;">
                <div style="display:flex; gap:20px; margin-bottom:8px;">
                    <div>Initial (Nearest-Neighbour): <strong style="color:#ef4444;">${data.initialDistanceKm.toFixed(1)} km</strong></div>
                    <div>Optimized (2-Opt Inversions): <strong style="color:#10b981;">${data.optimizedDistanceKm.toFixed(1)} km</strong></div>
                    <div>Distance Saved: <strong style="color:var(--accent-cyan);">${data.improvementPercent.toFixed(1)}%</strong></div>
                </div>
                <div style="font-size:12px; color:var(--text-secondary);">Optimal Delivery Sequence: ${data.optimizedTour.join(' ➔ ')}</div>
            </div>`;
        } catch (e) {}
    });

    document.getElementById('btn-refresh-reports')?.addEventListener('click', refreshReportsView);

    document.getElementById('btn-query-fenwick')?.addEventListener('click', async () => {
        const start = document.getElementById('fenwick-start').value;
        const end = document.getElementById('fenwick-end').value;
        try {
            const data = await fetch(`${API_BASE}/reports/fenwick?startDay=${start}&endDay=${end}`).then(r => r.json());
            document.getElementById('fenwick-result-badge').textContent = `Total Rescued: ${data.rescuedPeopleInRange} citizens`;
        } catch (e) {}
    });

    document.getElementById('btn-run-benchmarks')?.addEventListener('click', async () => {
        showToast('Running benchmark suite across N=100..100,000...');
        try {
            const data = await fetch(`${API_BASE}/benchmarks`).then(r => r.json());
            const cont = document.getElementById('benchmark-tables-container');
            let html = `<div class="glass-panel" style="padding:12px; border-radius:8px;">
                <h4 style="font-size:13px; font-weight:700; color:var(--accent-cyan); margin-bottom:8px;">QuickSort vs MergeSort</h4>
                <table style="width:100%; font-size:12px; text-align:left;">
                    <tr style="color:var(--text-muted);"><th style="padding:4px;">N</th><th>QuickSort</th><th>MergeSort</th></tr>`;
            data.sortingBenchmarks.forEach(b => {
                html += `<tr><td style="padding:4px; font-weight:600;">${b.n.toLocaleString()}</td><td style="color:var(--accent-emerald);">${b.quickSortUs} µs</td><td style="color:var(--accent-cyan);">${b.mergeSortUs} µs</td></tr>`;
            });
            html += `</table></div>
            <div class="glass-panel" style="padding:12px; border-radius:8px;">
                <h4 style="font-size:13px; font-weight:700; color:var(--accent-emerald); margin-bottom:8px;">Custom Hash Table vs Linear Scan</h4>
                <table style="width:100%; font-size:12px; text-align:left;">
                    <tr style="color:var(--text-muted);"><th style="padding:4px;">N</th><th>Hash Table O(1)</th><th>Linear Scan O(N)</th></tr>`;
            data.lookupBenchmarks.forEach(b => {
                html += `<tr><td style="padding:4px; font-weight:600;">${b.n.toLocaleString()}</td><td style="color:var(--accent-emerald);">${b.hashTableUs} µs</td><td style="color:#ef4444;">${b.linearScanSampleUs} µs</td></tr>`;
            });
            html += `</table></div>`;
            cont.innerHTML = html;
        } catch (e) {}
    });
}

async function refreshResourcesView() {
    const sGrid = document.getElementById('shelters-grid');
    if (!sGrid) return;
    sGrid.innerHTML = '';
    state.shelters.forEach(s => {
        const pct = s.occupancyPercent.toFixed(1);
        sGrid.innerHTML += `<div class="glass-panel" style="padding:16px; border-radius:10px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <strong style="font-size:14px;">${s.name}</strong>
                <span class="mono" style="font-size:12px; color:var(--accent-cyan);">${s.id}</span>
            </div>
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">Capacity: ${s.currentOccupancy} / ${s.totalCapacity} (${pct}%)</div>
            <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden; margin-bottom:8px;">
                <div style="width:${pct}%; height:100%; background:${pct > 80 ? '#ef4444' : '#10b981'};"></div>
            </div>
            <div style="font-size:11px; color:var(--text-muted);">Supplies: ${s.foodPackets} food | ${s.waterLiters}L water | ${s.medicalBeds} beds</div>
        </div>`;
    });

    try {
        const tasksData = await fetch(`${API_BASE}/resources/tasks`).then(r => r.json());
        const tBoard = document.getElementById('task-board-container');
        if (tBoard) {
            tBoard.innerHTML = '';
            if (tasksData.tasks) {
                tasksData.tasks.forEach((t, i) => {
                    tBoard.innerHTML += `<div class="glass-panel" style="min-width:180px; padding:12px; border-radius:8px; border-top:3px solid var(--accent-cyan);">
                        <div class="mono" style="font-size:10px; color:var(--text-muted);">Step ${i + 1}</div>
                        <div style="font-size:13px; font-weight:700; margin:4px 0;">${t.name}</div>
                        <div style="font-size:11px; color:var(--text-secondary);">${t.role} (${t.estimatedMinutes}m)</div>
                    </div>`;
                });
            }
        }
    } catch (e) {}
}

async function refreshReportsView() {
    const key = document.getElementById('report-sort-key')?.value || 'severity';
    const algo = document.getElementById('report-sort-algo')?.value || 'quick';
    try {
        const data = await fetch(`${API_BASE}/reports?sort=${key}&algo=${algo}`).then(r => r.json());
        const tbody = document.getElementById('reports-table-body');
        tbody.innerHTML = '';
        if (data.missions) {
            data.missions.forEach(m => {
                tbody.innerHTML += `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td class="mono" style="padding:8px; color:var(--accent-cyan);">${m.missionId}</td>
                    <td>${m.incidentType}</td>
                    <td><span style="background:rgba(239,68,68,0.2); color:#ef4444; padding:2px 6px; border-radius:4px; font-weight:700;">Sev ${m.severity}</span></td>
                    <td>${m.location}</td>
                    <td style="color:var(--accent-emerald); font-weight:700;">${m.peopleRescued}</td>
                    <td>${m.teamId}</td>
                    <td>${m.distanceKm.toFixed(1)} km</td>
                    <td style="color:var(--text-muted); font-size:11px;">${m.timestamp}</td>
                </tr>`;
            });
        }
    } catch (e) {}
}

async function initCheatSheet() {
    const drawer = document.getElementById('cheat-sheet-drawer');
    const toggleBtn = document.getElementById('btn-toggle-cheat-sheet');
    const closeBtn = document.getElementById('btn-close-drawer');
    const content = document.getElementById('cheat-sheet-content');

    toggleBtn?.addEventListener('click', async () => {
        drawer.style.right = '0';
        if (!content.innerHTML) {
            try {
                const data = await fetch(`${API_BASE}/complexity`).then(r => r.json());
                content.innerHTML = '';
                data.structures.forEach(item => {
                    content.innerHTML += `<div style="background:rgba(255,255,255,0.04); padding:10px; border-radius:6px;">
                        <div style="font-weight:700; color:white; font-size:13px; margin-bottom:2px;">${item.name}</div>
                        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
                            <span class="mono" style="color:var(--accent-cyan);">Time: ${item.time}</span>
                            <span class="mono" style="color:var(--accent-emerald);">Space: ${item.space}</span>
                        </div>
                        <div style="font-size:11px; color:var(--text-secondary); line-height:1.4;">${item.reason}</div>
                    </div>`;
                });
            } catch (e) {}
        }
    });

    closeBtn?.addEventListener('click', () => {
        drawer.style.right = '-420px';
    });
}
