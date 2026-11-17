#include <iostream>
#include <cassert>
#include <vector>
#include <string>
#include "../core/include/Graph.h"
#include "../core/include/CustomHashTable.h"
#include "../core/include/IndexedMaxHeap.h"
#include "../core/include/MinHeap.h"
#include "../core/include/DoublyLinkedList.h"
#include "../core/include/Stack.h"
#include "../core/include/Trie.h"
#include "../core/include/LRUCache.h"
#include "../core/include/UnionFind.h"
#include "../core/include/Tarjan.h"
#include "../core/include/MST.h"
#include "../core/include/MaxFlow.h"
#include "../core/include/Knapsack.h"
#include "../core/include/TSP2Opt.h"
#include "../core/include/TopologicalSort.h"
#include "../core/include/FenwickTree.h"
#include "../core/include/Incident.h"
#include "../core/include/CityNetwork.h"

void testEmptyHeapUnderflow() {
    IndexedMaxHeap heap;
    assert(heap.empty());
    bool caught = false;
    try {
        heap.popMax();
    } catch (const std::underflow_error&) {
        caught = true;
    }
    assert(caught);
    std::cout << "[PASS] testEmptyHeapUnderflow" << std::endl;
}

void testEqualSeverityAgingPriority() {
    IndexedMaxHeap heap;
    heap.push("INC-1", 400.0, 4, 0);
    heap.push("INC-2", 400.0, 4, 10);
    assert(heap.size() == 2);
    heap.ageAll(2.0, 5);
    HeapNode top = heap.popMax();
    assert(top.id == "INC-2");
    std::cout << "[PASS] testEqualSeverityAgingPriority" << std::endl;
}

void testHashCollisionsAndRehashing() {
    CustomHashTable<int> table(5, 0.75);
    for (int i = 0; i < 50; ++i) {
        table.insert("KEY_" + std::to_string(i), i * 10);
    }
    assert(table.size() == 50);
    assert(table.getCapacity() > 5);
    for (int i = 0; i < 50; ++i) {
        int val = 0;
        assert(table.get("KEY_" + std::to_string(i), val));
        assert(val == i * 10);
    }
    auto diag = table.getDiagnostics();
    assert(diag.loadFactor <= 0.75);
    std::cout << "[PASS] testHashCollisionsAndRehashing (Rehashed to " << diag.capacity << " buckets)" << std::endl;
}

void testDisconnectedGraphAndAllRoadsBlocked() {
    Graph g;
    g.addNode("A", "Village", 0, 0);
    g.addNode("B", "Hospital", 10, 0);
    g.addNode("C", "Island", 50, 50);

    g.addRoad("A", "B", 5.0, 10.0);

    RouteResult r1 = g.runDijkstra("A", "B");
    assert(r1.found && r1.path.size() == 2);

    RouteResult rIsland = g.runDijkstra("A", "C");
    assert(!rIsland.found);

    g.setRoadBlocked("A", "B", true);
    RouteResult rBlocked = g.runDijkstra("A", "B");
    assert(!rBlocked.found);

    std::cout << "[PASS] testDisconnectedGraphAndAllRoadsBlocked" << std::endl;
}

void testZeroCapacityShelterHandling() {
    CityNetwork net;
    Incident* inc = new Fire("TEST-ZERO", "Mamura Village", 5, 100, 40, 0, "Test Fire", "Class A", false);
    net.registerIncident(inc);

    for (Shelter* s : net.getAllShelters()) {
        s->admitPeople(s->getAvailableCapacity());
        assert(s->getAvailableCapacity() == 0);
    }

    MissionRecord rec;
    bool dispatched = net.dispatchNext(rec);
    assert(dispatched);
    assert(rec.getShelterId() == "None");
    assert(rec.getPeopleRescued() == 0);

    std::cout << "[PASS] testZeroCapacityShelterHandling" << std::endl;
}

void testTarjanBridgesAndCutVertices() {
    int n = 5;
    std::vector<std::vector<int>> adj(n);
    adj[0] = {1};
    adj[1] = {0, 2};
    adj[2] = {1, 3, 4};
    adj[3] = {2, 4};
    adj[4] = {2, 3};

    TarjanBridgeFinder finder;
    TarjanResult res = finder.findCriticalInfrastructures(n, adj);

    assert(!res.bridges.empty());
    assert(!res.articulationPoints.empty());
    std::cout << "[PASS] testTarjanBridgesAndCutVertices (Found " << res.bridges.size() << " bridges)" << std::endl;
}

void testEdmondsKarpMaxFlow() {
    int n = 4;
    std::vector<std::vector<int>> cap(n, std::vector<int>(n, 0));
    cap[0][1] = 100;
    cap[0][2] = 50;
    cap[1][2] = 40;
    cap[1][3] = 80;
    cap[2][3] = 70;

    std::vector<std::string> names = {"Source", "Junction1", "Junction2", "Sink"};
    MaxFlowResult res = EdmondsKarpMaxFlow::compute(n, 0, 3, cap, names);
    assert(res.maxFlow == 150);
    std::cout << "[PASS] testEdmondsKarpMaxFlow (Computed flow: " << res.maxFlow << ")" << std::endl;
}

void testFractionalKnapsack() {
    std::vector<SupplyItem> items = {
        {"Water Purification Pack", 20, 100},
        {"Emergency Burn Trauma Kit", 10, 80},
        {"Inflatable Life Raft", 50, 150},
        {"High-Energy Protein Rations", 30, 90}
    };
    KnapsackResult res = FractionalKnapsack::loadTruck(50, items);
    assert(res.totalWeightLoadedKg == 50.0);
    assert(!res.packedItems.empty());
    std::cout << "[PASS] testFractionalKnapsack (Loaded " << res.totalWeightLoadedKg << " kg, Urgency: " << res.totalUrgencyAchieved << ")" << std::endl;
}

void testTopologicalSortCycleDetection() {
    std::vector<TaskNode> tasks = {
        {0, "Task A", "Lead", 10},
        {1, "Task B", "Lead", 20},
        {2, "Task C", "Lead", 30}
    };
    std::vector<TaskEdge> depsAcyclic = {{0, 1}, {1, 2}};
    TopoSortResult r1 = TaskScheduler::schedule(tasks, depsAcyclic);
    assert(!r1.hasCycle);
    assert(r1.executionOrder.size() == 3);

    std::vector<TaskEdge> depsCycle = {{0, 1}, {1, 2}, {2, 0}};
    TopoSortResult r2 = TaskScheduler::schedule(tasks, depsCycle);
    assert(r2.hasCycle);
    std::cout << "[PASS] testTopologicalSortCycleDetection (Correctly flagged cycle)" << std::endl;
}

void testTrieAndLRUCache() {
    Trie trie;
    trie.insert("Sector 62 Fire Station", "Fire Station");
    trie.insert("Sector 63 Community Center", "Shelter");
    trie.insert("Sector 59 Metro Station", "Transit Hub");

    auto res = trie.autocomplete("Sector 6");
    assert(res.size() == 2);

    LRUCache lru(2);
    lru.put("Sec", res);
    std::vector<std::pair<std::string, std::string>> cached;
    assert(lru.get("Sec", cached));
    assert(lru.getHits() == 1);
    assert(lru.getMisses() == 0);

    lru.put("A", {});
    lru.put("B", {});
    assert(!lru.get("Sec", cached));
    assert(lru.getMisses() == 1);
    std::cout << "[PASS] testTrieAndLRUCache" << std::endl;
}

void testFenwickTreeRangeQuery() {
    FenwickTree bit(30);
    bit.add(1, 10);
    bit.add(2, 25);
    bit.add(3, 40);
    bit.add(4, 15);

    assert(bit.queryPrefix(3) == 75);
    assert(bit.queryRange(2, 4) == 80);
    std::cout << "[PASS] testFenwickTreeRangeQuery" << std::endl;
}

void testDoublyLinkedListAndStackUndo() {
    CityNetwork net;
    size_t initialHistory = net.getHistory().size();
    MissionRecord m;
    assert(net.dispatchNext(m));
    assert(net.getHistory().size() == initialHistory + 1);

    bool undone = net.undoLastAction();
    assert(undone);
    assert(net.getHistory().size() == initialHistory);
    std::cout << "[PASS] testDoublyLinkedListAndStackUndo" << std::endl;
}

int main() {
    std::cout << "==========================================================" << std::endl;
    std::cout << "  RUNNING COMPREHENSIVE DATA STRUCTURES & ALGORITHMS TESTS" << std::endl;
    std::cout << "==========================================================" << std::endl;
    testEmptyHeapUnderflow();
    testEqualSeverityAgingPriority();
    testHashCollisionsAndRehashing();
    testDisconnectedGraphAndAllRoadsBlocked();
    testZeroCapacityShelterHandling();
    testTarjanBridgesAndCutVertices();
    testEdmondsKarpMaxFlow();
    testFractionalKnapsack();
    testTopologicalSortCycleDetection();
    testTrieAndLRUCache();
    testFenwickTreeRangeQuery();
    testDoublyLinkedListAndStackUndo();
    std::cout << "==========================================================" << std::endl;
    std::cout << "  ALL 12 RIGOROUS UNIT TESTS PASSED WITH ZERO FAILURES!   " << std::endl;
    std::cout << "==========================================================" << std::endl;
    return 0;
}
