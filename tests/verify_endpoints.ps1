$tests = @(
    @{ name = 'Health Check'; url = 'http://127.0.0.1:8080/api/health' },
    @{ name = 'City Network Graph'; url = 'http://127.0.0.1:8080/api/city' },
    @{ name = 'Incidents List'; url = 'http://127.0.0.1:8080/api/incidents' },
    @{ name = 'Rescue Teams Roster'; url = 'http://127.0.0.1:8080/api/teams' },
    @{ name = 'Shelters List'; url = 'http://127.0.0.1:8080/api/shelters' },
    @{ name = 'Dijkstra Trace'; url = 'http://127.0.0.1:8080/api/trace/dijkstra?start=JIIT+Sector+62&end=Mamura+Village' },
    @{ name = 'A* Heuristic Trace'; url = 'http://127.0.0.1:8080/api/trace/astar?start=JIIT+Sector+62&end=Mamura+Village' },
    @{ name = 'Dijkstra vs A* Compare'; url = 'http://127.0.0.1:8080/api/trace/compare?start=JIIT+Sector+62&end=Jaypee+Hospital+Sector+128' },
    @{ name = 'BFS Trace'; url = 'http://127.0.0.1:8080/api/trace/bfs?start=JIIT+Sector+62' },
    @{ name = 'DFS Trace'; url = 'http://127.0.0.1:8080/api/trace/dfs?start=JIIT+Sector+62' },
    @{ name = 'Tarjan Bottlenecks'; url = 'http://127.0.0.1:8080/api/trace/tarjan' },
    @{ name = 'Kruskal MST'; url = 'http://127.0.0.1:8080/api/trace/mst?algo=kruskal' },
    @{ name = 'Prim MST'; url = 'http://127.0.0.1:8080/api/trace/mst?algo=prim' },
    @{ name = 'Edmonds-Karp Max-Flow'; url = 'http://127.0.0.1:8080/api/trace/maxflow?source=Mamura+Village&sink=Sector+128+Sports+Complex' },
    @{ name = 'Indexed Max-Heap DS'; url = 'http://127.0.0.1:8080/api/ds/priority-queue' },
    @{ name = 'Custom Hash Table DS'; url = 'http://127.0.0.1:8080/api/ds/hash-table' },
    @{ name = 'Union-Find DS'; url = 'http://127.0.0.1:8080/api/ds/union-find' },
    @{ name = 'LRU Cache DS'; url = 'http://127.0.0.1:8080/api/ds/lru-cache' },
    @{ name = 'Team Workload Min-Heap'; url = 'http://127.0.0.1:8080/api/ds/team-heap' },
    @{ name = 'Mission History List'; url = 'http://127.0.0.1:8080/api/ds/history-list' },
    @{ name = 'Trie Prefix Search'; url = 'http://127.0.0.1:8080/api/search?q=JIIT' },
    @{ name = 'Topological Tasks'; url = 'http://127.0.0.1:8080/api/resources/tasks' },
    @{ name = 'Fenwick Range Query'; url = 'http://127.0.0.1:8080/api/reports/fenwick?startDay=1&endDay=10' },
    @{ name = 'Benchmark Suite'; url = 'http://127.0.0.1:8080/api/benchmarks' },
    @{ name = 'Complexity Cheat-Sheet'; url = 'http://127.0.0.1:8080/api/complexity' }
)

$passed = 0
foreach ($t in $tests) {
    $code = curl.exe -s -o /dev/null -w "%{http_code}" $t.url
    if ($code -eq "200") {
        Write-Host ("[PASS] " + $t.name) -ForegroundColor Green
        $passed++
    } else {
        Write-Host ("[FAIL] " + $t.name + " (HTTP " + $code + ")") -ForegroundColor Red
    }
}
Write-Host "========================================="
Write-Host ("Total Endpoints Verified: " + $passed + " / " + $tests.Count)
