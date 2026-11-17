#define _WIN32_WINNT 0x0A00
#include "httplib.h"
#include "json.hpp"
#include "../core/include/CityNetwork.h"
#include "../core/include/Sorting.h"
#include <iostream>
#include <memory>
#include <chrono>
#include <random>

using json = nlohmann::json;

void setCors(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

int main(int argc, char* argv[]) {
    int port = 8080;
    if (argc > 1) {
        port = std::stoi(argv[1]);
    }

    std::cout << "==========================================================" << std::endl;
    std::cout << "  DISASTER RESPONSE SYSTEM - C++ REST API SERVER          " << std::endl;
    std::cout << "==========================================================" << std::endl;

    auto network = std::make_shared<CityNetwork>();
    httplib::Server svr;

    svr.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        setCors(res);
    });

    svr.Get("/api/health", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json j;
        j["status"] = "online";
        j["version"] = "2.0";
        j["systemTimeMinutes"] = network->getSimulationTime();
        j["activeIncidents"] = network->getAllIncidents().size();
        j["pendingQueue"] = network->getIncidentPQ().size();
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/city", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        const Graph& g = network->getGraph();
        json j;
        json nodesJson = json::array();
        for (const auto& node : g.getAllNodes()) {
            json n;
            n["id"] = node.id;
            n["name"] = node.name;
            n["type"] = node.type;
            n["x"] = node.x;
            n["y"] = node.y;
            nodesJson.push_back(n);
        }
        j["nodes"] = nodesJson;

        json roadsJson = json::array();
        for (const auto& r : g.getAllUniqueRoads()) {
            json rd;
            rd["from"] = r.from;
            rd["to"] = r.to;
            rd["fromName"] = g.getNodeName(r.from);
            rd["toName"] = g.getNodeName(r.to);
            rd["distanceKm"] = r.distanceKm;
            rd["travelTimeMins"] = r.travelTimeMins;
            rd["capacity"] = r.capacity;
            rd["isBlocked"] = r.isBlocked;
            rd["condition"] = r.condition;
            roadsJson.push_back(rd);
        }
        j["roads"] = roadsJson;
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/roads/toggle", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        try {
            auto body = json::parse(req.body);
            std::string from = body["from"];
            std::string to = body["to"];
            bool blocked = body["blocked"];
            bool success = network->toggleRoadBlock(from, to, blocked);

            json j;
            j["success"] = success;
            j["from"] = from;
            j["to"] = to;
            j["isBlocked"] = blocked;
            j["numComponents"] = network->getConnectivity().getNumComponents();
            res.set_content(j.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(std::string("{\"error\":\"") + e.what() + "\"}", "application/json");
        }
    });

    svr.Get("/api/incidents", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json arr = json::array();
        for (Incident* inc : network->getAllIncidents()) {
            json item;
            item["id"] = inc->getId();
            item["type"] = inc->getType();
            item["location"] = inc->getLocationName();
            item["severity"] = inc->getSeverity();
            item["status"] = inc->getStatus();
            item["affectedPeople"] = inc->getAffectedPeople();
            item["casualties"] = inc->getCasualties();
            item["assignedTeamId"] = inc->getAssignedTeamId();
            item["description"] = inc->getDescription();
            item["waitMinutes"] = inc->getWaitMinutes();
            item["effectivePriority"] = inc->getEffectivePriority();

            json resArr = json::array();
            for (const auto& r : inc->getRequiredResources()) {
                json rj;
                rj["item"] = r.first;
                rj["qty"] = r.second;
                resArr.push_back(rj);
            }
            item["requiredResources"] = resArr;
            arr.push_back(item);
        }
        res.set_content(arr.dump(), "application/json");
    });

    svr.Post("/api/incidents", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        try {
            auto b = json::parse(req.body);
            std::string id = b.value("id", "INC-" + std::to_string(std::rand() % 900 + 100));
            std::string type = b.value("type", "Fire");
            std::string loc = b.value("location", "Mamura Village");
            int sev = b.value("severity", 3);
            int aff = b.value("affectedPeople", 20);
            int cas = b.value("casualties", 0);
            std::string desc = b.value("description", "Disaster reported via ECC hotline");

            Incident* inc = nullptr;
            if (type == "Fire") {
                inc = new Fire(id, loc, sev, 0, aff, cas, desc, b.value("intensity", "Class A"), b.value("hazmat", false));
            } else if (type == "Flood") {
                inc = new Flood(id, loc, sev, 0, aff, cas, desc, b.value("waterLevel", 2.0), b.value("flow", "Moderate"));
            } else if (type == "Earthquake") {
                inc = new Earthquake(id, loc, sev, 0, aff, cas, desc, b.value("magnitude", 5.0), b.value("collapsedStructures", 2));
            } else {
                inc = new Landslide(id, loc, sev, 0, aff, cas, desc, b.value("debrisVolume", 200.0), b.value("roadBlocked", true));
            }

            bool ok = network->registerIncident(inc);
            json j;
            j["success"] = ok;
            j["incidentId"] = id;
            if (!ok) delete inc;
            res.set_content(j.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(std::string("{\"error\":\"") + e.what() + "\"}", "application/json");
        }
    });

    svr.Get("/api/teams", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json arr = json::array();
        for (RescueTeam* t : network->getAllTeams()) {
            json item;
            item["id"] = t->getId();
            item["name"] = t->getName();
            item["specialty"] = t->getSpecialty();
            item["baseLocation"] = t->getBaseLocation();
            item["status"] = t->getStatus();
            item["activeMissions"] = t->getActiveMissionsCount();
            item["completedMissions"] = t->getTotalMissionsCompleted();

            json mArr = json::array();
            for (Person* p : t->getMembers()) {
                json pj;
                pj["id"] = p->getId();
                pj["name"] = p->getName();
                pj["role"] = p->getRole();
                pj["phone"] = p->getPhone();
                pj["email"] = p->getEmail();
                pj["details"] = p->getDetails();
                mArr.push_back(pj);
            }
            item["members"] = mArr;

            json eqArr = json::array();
            for (const auto& eq : t->getEquipment()) {
                json eqj;
                eqj["item"] = eq.first;
                eqj["qty"] = eq.second;
                eqArr.push_back(eqj);
            }
            item["equipment"] = eqArr;
            arr.push_back(item);
        }
        res.set_content(arr.dump(), "application/json");
    });

    svr.Get("/api/shelters", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json arr = json::array();
        for (Shelter* s : network->getAllShelters()) {
            json item;
            item["id"] = s->getId();
            item["name"] = s->getName();
            item["location"] = s->getLocationName();
            item["totalCapacity"] = s->getTotalCapacity();
            item["currentOccupancy"] = s->getCurrentOccupancy();
            item["availableCapacity"] = s->getAvailableCapacity();
            item["occupancyPercent"] = (s->getTotalCapacity() > 0)
                ? (static_cast<double>(s->getCurrentOccupancy()) / s->getTotalCapacity() * 100.0)
                : 0.0;
            item["foodPackets"] = s->getFoodPackets();
            item["waterLiters"] = s->getWaterLiters();
            item["medicalBeds"] = s->getMedicalBeds();
            item["contactNumber"] = s->getContactNumber();
            arr.push_back(item);
        }
        res.set_content(arr.dump(), "application/json");
    });

    svr.Post("/api/dispatch/next", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        MissionRecord m;
        bool ok = network->dispatchNext(m);
        json j;
        j["success"] = ok;
        if (ok) {
            j["missionId"] = m.getMissionId();
            j["incidentId"] = m.getIncidentId();
            j["incidentType"] = m.getIncidentType();
            j["severity"] = m.getSeverity();
            j["location"] = m.getLocationName();
            j["teamId"] = m.getTeamId();
            j["shelterId"] = m.getShelterId();
            j["peopleRescued"] = m.getPeopleRescued();
            j["casualties"] = m.getCasualties();
            j["route"] = m.getRoute();
            j["distanceKm"] = m.getDistanceKm();
            j["resourcesDeployed"] = m.getResourcesDeployed();
            j["timestamp"] = m.getTimestamp();
            j["status"] = m.getStatus();
        } else {
            j["message"] = "No pending incidents in queue or no reachable rescue teams.";
        }
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/dispatch/all", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        auto records = network->dispatchAll();
        json arr = json::array();
        for (const auto& m : records) {
            json mj;
            mj["missionId"] = m.getMissionId();
            mj["incidentId"] = m.getIncidentId();
            mj["incidentType"] = m.getIncidentType();
            mj["severity"] = m.getSeverity();
            mj["location"] = m.getLocationName();
            mj["teamId"] = m.getTeamId();
            mj["shelterId"] = m.getShelterId();
            mj["peopleRescued"] = m.getPeopleRescued();
            mj["route"] = m.getRoute();
            mj["distanceKm"] = m.getDistanceKm();
            arr.push_back(mj);
        }
        json resObj;
        resObj["dispatchedCount"] = records.size();
        resObj["missions"] = arr;
        res.set_content(resObj.dump(), "application/json");
    });

    svr.Post("/api/undo", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        bool ok = network->undoLastAction();
        json j;
        j["success"] = ok;
        j["message"] = ok ? "Last action successfully reverted via Stack." : "Undo stack is empty.";
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/history", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json arr = json::array();
        for (const auto& m : network->getHistoryVector()) {
            json mj;
            mj["missionId"] = m.getMissionId();
            mj["incidentId"] = m.getIncidentId();
            mj["incidentType"] = m.getIncidentType();
            mj["severity"] = m.getSeverity();
            mj["location"] = m.getLocationName();
            mj["teamId"] = m.getTeamId();
            mj["shelterId"] = m.getShelterId();
            mj["peopleRescued"] = m.getPeopleRescued();
            mj["casualties"] = m.getCasualties();
            mj["route"] = m.getRoute();
            mj["distanceKm"] = m.getDistanceKm();
            mj["resourcesDeployed"] = m.getResourcesDeployed();
            mj["timestamp"] = m.getTimestamp();
            mj["status"] = m.getStatus();
            arr.push_back(mj);
        }
        res.set_content(arr.dump(), "application/json");
    });

    svr.Get("/api/search", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string query = req.get_param_value("q");
        auto results = network->searchLocations(query);
        json j;
        j["query"] = query;
        j["cacheHits"] = network->getSearchCache().getHits();
        j["cacheMisses"] = network->getSearchCache().getMisses();
        j["hitRate"] = network->getSearchCache().getHitRate();

        json arr = json::array();
        for (const auto& p : results) {
            json rj;
            rj["name"] = p.first;
            rj["type"] = p.second;
            arr.push_back(rj);
        }
        j["results"] = arr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/trace/dijkstra", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string s = req.get_param_value("start");
        std::string d = req.get_param_value("end");
        if (s.empty()) s = "JIIT Sector 62";
        if (d.empty()) d = "Surajpur Wetland Lowland";

        RouteResult rr = network->getGraph().runDijkstra(s, d);
        json j;
        j["algorithm"] = rr.algorithmName;
        j["found"] = rr.found;
        j["path"] = rr.path;
        j["totalDistanceKm"] = rr.totalDistanceKm;
        j["totalTimeMins"] = rr.totalTimeMins;
        j["nodesExplored"] = rr.nodesExplored;
        j["executionMicroseconds"] = rr.executionTimeMicroseconds;

        json sArr = json::array();
        for (const auto& st : rr.steps) {
            json sj;
            sj["stepNumber"] = st.stepNumber;
            sj["currentNode"] = st.currentNodeName;
            sj["visited"] = st.visitedNodes;
            json fArr = json::array();
            for (const auto& f : st.frontier) {
                fArr.push_back({{"node", f.first}, {"dist", f.second}});
            }
            sj["frontier"] = fArr;
            sj["tentativeDistances"] = st.tentativeDistances;
            sj["relaxedEdge"] = st.relaxedEdge;
            sj["explanation"] = st.explanation;
            sArr.push_back(sj);
        }
        j["steps"] = sArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/trace/astar", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string s = req.get_param_value("start");
        std::string d = req.get_param_value("end");
        if (s.empty()) s = "JIIT Sector 62";
        if (d.empty()) d = "Surajpur Wetland Lowland";

        auto comp = network->getGraph().compareDijkstraAndAStar(s, d);
        json j;
        j["dijkstra"] = {
            {"distanceKm", comp.dijkstraResult.totalDistanceKm},
            {"nodesExplored", comp.dijkstraResult.nodesExplored},
            {"timeMicroseconds", comp.dijkstraResult.executionTimeMicroseconds},
            {"path", comp.dijkstraResult.path}
        };
        j["astar"] = {
            {"distanceKm", comp.astarResult.totalDistanceKm},
            {"nodesExplored", comp.astarResult.nodesExplored},
            {"timeMicroseconds", comp.astarResult.executionTimeMicroseconds},
            {"path", comp.astarResult.path}
        };
        j["reductionPercent"] = comp.explorationReductionPercent;
        j["summary"] = comp.summary;

        json sArr = json::array();
        for (const auto& st : comp.astarResult.steps) {
            json sj;
            sj["stepNumber"] = st.stepNumber;
            sj["currentNode"] = st.currentNodeName;
            sj["visited"] = st.visitedNodes;
            json fArr = json::array();
            for (const auto& f : st.frontier) {
                fArr.push_back({{"node", f.first}, {"fScore", f.second}});
            }
            sj["frontier"] = fArr;
            sj["tentativeDistances"] = st.tentativeDistances;
            sj["relaxedEdge"] = st.relaxedEdge;
            sj["explanation"] = st.explanation;
            sArr.push_back(sj);
        }
        j["astarSteps"] = sArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/trace/bfs", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string s = req.get_param_value("start");
        if (s.empty()) s = "JIIT Sector 62";
        RouteResult rr = network->getGraph().runBFS(s);
        json j;
        j["algorithm"] = "Breadth-First Search (BFS)";
        j["found"] = rr.found;
        j["path"] = rr.path;
        j["nodesExplored"] = rr.nodesExplored;
        json sArr = json::array();
        for (const auto& st : rr.steps) {
            json sj;
            sj["stepNumber"] = st.stepNumber;
            sj["currentNode"] = st.currentNodeName;
            sj["visited"] = st.visitedNodes;
            json fArr = json::array();
            for (const auto& f : st.frontier) {
                fArr.push_back({{"node", f.first}, {"dist", f.second}});
            }
            sj["frontier"] = fArr;
            sj["explanation"] = st.explanation;
            sArr.push_back(sj);
        }
        j["steps"] = sArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/trace/dfs", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string s = req.get_param_value("start");
        if (s.empty()) s = "JIIT Sector 62";
        RouteResult rr = network->getGraph().runDFS(s);
        json j;
        j["algorithm"] = "Depth-First Search (DFS)";
        j["found"] = rr.found;
        j["path"] = rr.path;
        j["nodesExplored"] = rr.nodesExplored;
        json sArr = json::array();
        for (const auto& st : rr.steps) {
            json sj;
            sj["stepNumber"] = st.stepNumber;
            sj["currentNode"] = st.currentNodeName;
            sj["visited"] = st.visitedNodes;
            json fArr = json::array();
            for (const auto& f : st.frontier) {
                fArr.push_back({{"node", f.first}, {"dist", f.second}});
            }
            sj["frontier"] = fArr;
            sj["explanation"] = st.explanation;
            sArr.push_back(sj);
        }
        j["steps"] = sArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/trace/compare", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string s = req.get_param_value("start");
        std::string d = req.get_param_value("end");
        if (s.empty()) s = "JIIT Sector 62";
        if (d.empty()) d = "Surajpur Wetland Lowland";
        auto comp = network->getGraph().compareDijkstraAndAStar(s, d);
        json j;
        j["algorithm"] = "Dijkstra vs A*";
        j["dijkstra"] = {
            {"distanceKm", comp.dijkstraResult.totalDistanceKm},
            {"nodesExplored", comp.dijkstraResult.nodesExplored},
            {"timeMicroseconds", comp.dijkstraResult.executionTimeMicroseconds},
            {"path", comp.dijkstraResult.path}
        };
        j["astar"] = {
            {"distanceKm", comp.astarResult.totalDistanceKm},
            {"nodesExplored", comp.astarResult.nodesExplored},
            {"timeMicroseconds", comp.astarResult.executionTimeMicroseconds},
            {"path", comp.astarResult.path}
        };
        j["reductionPercent"] = comp.explorationReductionPercent;
        j["summary"] = comp.summary;

        json sArr = json::array();
        for (const auto& st : comp.astarResult.steps) {
            json sj;
            sj["stepNumber"] = st.stepNumber;
            sj["currentNode"] = st.currentNodeName;
            sj["visited"] = st.visitedNodes;
            json fArr = json::array();
            for (const auto& f : st.frontier) {
                fArr.push_back({{"node", f.first}, {"fScore", f.second}});
            }
            sj["frontier"] = fArr;
            sj["tentativeDistances"] = st.tentativeDistances;
            sj["relaxedEdge"] = st.relaxedEdge;
            sj["explanation"] = st.explanation;
            sArr.push_back(sj);
        }
        j["steps"] = sArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/trace/tarjan", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        TarjanResult tr = network->runTarjanAnalysis();
        const Graph& g = network->getGraph();
        json j;
        json apArr = json::array();
        for (int idx : tr.articulationPoints) {
            apArr.push_back({{"id", idx}, {"name", g.getNodeName(idx)}});
        }
        j["articulationPoints"] = apArr;

        json bArr = json::array();
        for (const auto& b : tr.bridges) {
            bArr.push_back({
                {"u", b.first}, {"v", b.second},
                {"uName", g.getNodeName(b.first)},
                {"vName", g.getNodeName(b.second)}
            });
        }
        j["bridges"] = bArr;
        j["stepTrace"] = tr.stepTrace;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/trace/mst", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string algo = req.get_param_value("algo");
        MSTResult mr = (algo == "prim") ? network->runPrim() : network->runKruskal();
        json j;
        j["algorithm"] = (algo == "prim") ? "Prim's MST" : "Kruskal's MST";
        j["totalWeight"] = mr.totalWeight;

        json eArr = json::array();
        for (const auto& e : mr.mstEdges) {
            eArr.push_back({
                {"u", e.u}, {"v", e.v},
                {"uName", e.uName}, {"vName", e.vName},
                {"weight", e.weight}
            });
        }
        j["mstEdges"] = eArr;

        json sArr = json::array();
        for (const auto& st : mr.steps) {
            sArr.push_back({
                {"stepNumber", st.stepNumber},
                {"u", st.u}, {"v", st.v},
                {"weight", st.weight},
                {"accepted", st.accepted},
                {"currentTotalWeight", st.currentTotalWeight},
                {"description", st.description}
            });
        }
        j["steps"] = sArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/trace/maxflow", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string s = req.get_param_value("source");
        std::string t = req.get_param_value("sink");
        if (s.empty()) s = "Mamura Village";
        if (t.empty()) t = "Sector 128 Sports Complex";

        MaxFlowResult mfr = network->runMaxFlowEvacuation(s, t);
        json j;
        j["source"] = s;
        j["sink"] = t;
        j["maxFlowEvacueesPerHour"] = mfr.maxFlow;

        json eArr = json::array();
        for (const auto& e : mfr.edgeFlows) {
            eArr.push_back({
                {"from", e.uName}, {"to", e.vName},
                {"flow", e.flow}, {"capacity", e.capacity}
            });
        }
        j["edgeFlows"] = eArr;

        json sArr = json::array();
        for (const auto& st : mfr.steps) {
            sArr.push_back({
                {"stepNumber", st.stepNumber},
                {"path", st.pathNodes},
                {"bottleneck", st.bottleneckCapacity},
                {"cumulativeFlow", st.cumulativeFlow},
                {"explanation", st.explanation}
            });
        }
        j["steps"] = sArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/resources/knapsack", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        double cap = 500.0;
        std::vector<SupplyItem> items;
        try {
            if (!req.body.empty()) {
                auto b = json::parse(req.body);
                cap = b.value("capacityKg", 500.0);
                if (b.contains("items")) {
                    for (const auto& it : b["items"]) {
                        items.emplace_back(it["name"], it["weightKg"], it["urgencyValue"]);
                    }
                }
            }
        } catch (...) {}

        if (items.empty()) {
            items = {
                {"Trauma Burn Medical Packs", 40.0, 180.0},
                {"Inflatable Motor Life Rafts", 120.0, 320.0},
                {"Clean Potable Water Jugs (10L)", 150.0, 250.0},
                {"High-Capacity Water Dewatering Pumps", 200.0, 300.0},
                {"Emergency Protein & Food Rations", 80.0, 160.0},
                {"Acoustic Concrete Detectors", 30.0, 210.0},
                {"Emergency Shelter Tents", 90.0, 190.0}
            };
        }

        KnapsackResult kr = network->runReliefTruckKnapsack(cap, items);
        json j;
        j["capacityKg"] = kr.totalCapacityKg;
        j["loadedWeightKg"] = kr.totalWeightLoadedKg;
        j["achievedUrgency"] = kr.totalUrgencyAchieved;

        json pArr = json::array();
        for (const auto& pi : kr.packedItems) {
            pArr.push_back({
                {"name", pi.name},
                {"weightLoadedKg", pi.weightLoadedKg},
                {"fractionTaken", pi.fractionTaken},
                {"valueContributed", pi.valueContributed},
                {"ratio", pi.ratio}
            });
        }
        j["packedItems"] = pArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/resources/route2opt", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::vector<std::string> shelters;
        try {
            if (!req.body.empty()) {
                auto b = json::parse(req.body);
                if (b.contains("shelters")) {
                    for (const auto& sh : b["shelters"]) shelters.push_back(sh);
                }
            }
        } catch (...) {}

        if (shelters.empty()) {
            shelters = {
                "Sector 62 Fire Station",
                "Sector 63 Community Center",
                "Indirapuram Relief Camp",
                "Sector 50 Central Park",
                "Sector 128 Sports Complex",
                "Noida Stadium Sector 21"
            };
        }

        RouteOptimizationResult ror = network->runMultiStopSupplyRoute(shelters);
        json j;
        j["initialTour"] = ror.initialTour;
        j["initialDistanceKm"] = ror.initialDistance;
        j["optimizedTour"] = ror.optimizedTour;
        j["optimizedDistanceKm"] = ror.optimizedDistance;
        j["improvementPercent"] = ror.improvementPercent;

        json sArr = json::array();
        for (const auto& st : ror.steps) {
            sArr.push_back({
                {"iteration", st.iteration},
                {"currentDistance", st.currentDistance},
                {"swapDescription", st.swapDescription}
            });
        }
        j["steps"] = sArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/resources/tasks", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        TopoSortResult tsr = network->runTaskDependencyScheduling();
        json j;
        j["hasCycle"] = tsr.hasCycle;
        j["message"] = tsr.message;
        json arr = json::array();
        for (const auto& tn : tsr.executionOrder) {
            arr.push_back({
                {"id", tn.id},
                {"name", tn.name},
                {"role", tn.role},
                {"estimatedMinutes", tn.estimatedMinutes}
            });
        }
        j["tasks"] = arr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/ds/priority-queue", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        const auto& rawHeap = network->getIncidentPQ().getRawHeap();
        json j;
        j["size"] = rawHeap.size();
        json arr = json::array();
        for (size_t i = 0; i < rawHeap.size(); ++i) {
            json item;
            int iSigned = static_cast<int>(i);
            int nSigned = static_cast<int>(rawHeap.size());
            item["index"] = iSigned;
            item["id"] = rawHeap[i].id;
            item["priority"] = rawHeap[i].priority;
            item["originalSeverity"] = rawHeap[i].originalSeverity;
            item["waitMinutes"] = rawHeap[i].waitMinutes;
            item["leftIndex"] = (2 * iSigned + 1 < nSigned) ? (2 * iSigned + 1) : -1;
            item["rightIndex"] = (2 * iSigned + 2 < nSigned) ? (2 * iSigned + 2) : -1;
            item["parentIndex"] = (iSigned > 0) ? ((iSigned - 1) / 2) : -1;
            arr.push_back(item);
        }
        j["nodes"] = arr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/ds/hash-table", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        auto diag = network->getIncidentMap().getDiagnostics();
        json j;
        j["capacity"] = diag.capacity;
        j["size"] = diag.size;
        j["loadFactor"] = diag.loadFactor;
        j["collisions"] = diag.collisions;
        j["maxChainLength"] = diag.maxChainLength;
        j["chainLengths"] = diag.chainLengths;
        j["bucketChains"] = network->getIncidentMap().getBucketChains();
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/ds/hash-table/rehash", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        network->getIncidentMap().rehashManual();
        auto diag = network->getIncidentMap().getDiagnostics();
        json j;
        j["success"] = true;
        j["capacity"] = diag.capacity;
        j["size"] = diag.size;
        j["loadFactor"] = diag.loadFactor;
        j["bucketChains"] = network->getIncidentMap().getBucketChains();
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/ds/priority-queue/extract-max", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json j;
        if (network->getIncidentPQ().empty()) {
            j["success"] = false;
            j["message"] = "Heap is already empty.";
        } else {
            HeapNode top = network->getIncidentPQ().popMax();
            j["success"] = true;
            j["extractedId"] = top.id;
            j["priority"] = top.priority;
            j["originalSeverity"] = top.originalSeverity;
            j["waitMinutes"] = top.waitMinutes;
            j["remainingSize"] = network->getIncidentPQ().size();
        }
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/simulation/advance", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        int mins = 15;
        try {
            if (!req.body.empty()) {
                auto b = json::parse(req.body);
                mins = b.value("minutes", 15);
            }
        } catch (...) {}
        network->advanceSimulationTime(mins);
        json j;
        j["success"] = true;
        j["advancedMinutes"] = mins;
        j["totalSimulationTime"] = network->getSimulationTime();
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/ds/history-list", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json arr = json::array();
        for (const auto& m : network->getHistoryVector()) {
            json item;
            item["missionId"] = m.getMissionId();
            item["incidentId"] = m.getIncidentId();
            item["incidentType"] = m.getIncidentType();
            item["locationName"] = m.getLocationName();
            item["severity"] = m.getSeverity();
            item["teamId"] = m.getTeamId();
            item["shelterId"] = m.getShelterId();
            item["distanceKm"] = m.getDistanceKm();
            item["peopleRescued"] = m.getPeopleRescued();
            item["timestamp"] = m.getTimestamp();
            arr.push_back(item);
        }
        res.set_content(arr.dump(), "application/json");
    });

    svr.Get("/api/ds/union-find", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        int n = network->getGraph().getNodeCount();
        auto comps = network->getConnectivity().getComponents(n);
        json j;
        j["numComponents"] = network->getConnectivity().getNumComponents();
        json cArr = json::array();
        for (const auto& pair : comps) {
            json cj;
            cj["rootId"] = pair.first;
            cj["rootName"] = network->getGraph().getNodeName(pair.first);
            json mArr = json::array();
            for (int idx : pair.second) {
                mArr.push_back(network->getGraph().getNodeName(idx));
            }
            cj["members"] = mArr;
            cArr.push_back(cj);
        }
        j["components"] = cArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/ds/lru-cache", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        auto& cache = network->getSearchCache();
        json j;
        j["capacity"] = cache.getCapacity();
        j["size"] = cache.size();
        j["hits"] = cache.getHits();
        j["misses"] = cache.getMisses();
        j["hitRate"] = cache.getHitRate();
        j["cachedKeys"] = cache.getCachedKeys();
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/ds/team-heap", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        const auto& rawItems = network->getTeamHeap().getItems();
        json arr = json::array();
        for (const auto& item : rawItems) {
            arr.push_back({
                {"teamId", item.teamId},
                {"activeMissions", item.activeMissions}
            });
        }
        res.set_content(arr.dump(), "application/json");
    });

    svr.Get("/api/reports", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string sortKey = req.get_param_value("sort");
        std::string algo = req.get_param_value("algo");
        if (sortKey.empty()) sortKey = "severity";
        if (algo.empty()) algo = "quick";

        auto records = network->getHistoryVector();

        auto compSevDesc = [](const MissionRecord& a, const MissionRecord& b) {
            return a.getSeverity() > b.getSeverity();
        };
        auto compRescuedDesc = [](const MissionRecord& a, const MissionRecord& b) {
            return a.getPeopleRescued() > b.getPeopleRescued();
        };
        auto compDistAsc = [](const MissionRecord& a, const MissionRecord& b) {
            return a.getDistanceKm() < b.getDistanceKm();
        };
        auto compTimeAsc = [](const MissionRecord& a, const MissionRecord& b) {
            return a.getTimestamp() < b.getTimestamp();
        };

        if (algo == "merge") {
            if (sortKey == "severity") customMergeSort(records, compSevDesc);
            else if (sortKey == "rescued") customMergeSort(records, compRescuedDesc);
            else if (sortKey == "distance") customMergeSort(records, compDistAsc);
            else customMergeSort(records, compTimeAsc);
        } else {
            if (sortKey == "severity") customQuickSort(records, compSevDesc);
            else if (sortKey == "rescued") customQuickSort(records, compRescuedDesc);
            else if (sortKey == "distance") customQuickSort(records, compDistAsc);
            else customQuickSort(records, compTimeAsc);
        }

        json j;
        j["sortKey"] = sortKey;
        j["algorithm"] = (algo == "merge") ? "Merge Sort" : "Quick Sort";
        json arr = json::array();
        for (const auto& m : records) {
            arr.push_back({
                {"missionId", m.getMissionId()},
                {"incidentId", m.getIncidentId()},
                {"incidentType", m.getIncidentType()},
                {"severity", m.getSeverity()},
                {"location", m.getLocationName()},
                {"teamId", m.getTeamId()},
                {"shelterId", m.getShelterId()},
                {"peopleRescued", m.getPeopleRescued()},
                {"casualties", m.getCasualties()},
                {"distanceKm", m.getDistanceKm()},
                {"timestamp", m.getTimestamp()}
            });
        }
        j["missions"] = arr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/reports/fenwick", [network](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        int startDay = 1;
        int endDay = 14;
        try {
            if (req.has_param("startDay")) startDay = std::stoi(req.get_param_value("startDay"));
            if (req.has_param("endDay")) endDay = std::stoi(req.get_param_value("endDay"));
        } catch (...) {}

        long long totalRescuedInRange = network->getRescueTracker().queryRange(startDay, endDay);
        json j;
        j["startDay"] = startDay;
        j["endDay"] = endDay;
        j["rescuedPeopleInRange"] = totalRescuedInRange;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/benchmarks", [network](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json j;
        std::vector<int> sizes = {100, 1000, 10000, 100000};
        json hashVsLinearArr = json::array();
        json quickVsMergeArr = json::array();

        std::mt19937 rng(42);

        for (int n : sizes) {
            std::vector<int> qData(n), mData(n);
            for (int i = 0; i < n; ++i) {
                int r = rng() % 1000000;
                qData[i] = mData[i] = r;
            }

            auto startQ = std::chrono::high_resolution_clock::now();
            customQuickSort(qData, [](int a, int b) { return a < b; });
            auto endQ = std::chrono::high_resolution_clock::now();
            long long qUs = std::chrono::duration_cast<std::chrono::microseconds>(endQ - startQ).count();

            auto startM = std::chrono::high_resolution_clock::now();
            customMergeSort(mData, [](int a, int b) { return a < b; });
            auto endM = std::chrono::high_resolution_clock::now();
            long long mUs = std::chrono::duration_cast<std::chrono::microseconds>(endM - startM).count();

            quickVsMergeArr.push_back({
                {"n", n},
                {"quickSortUs", qUs},
                {"mergeSortUs", mUs}
            });

            if (n <= 10000) {
                CustomHashTable<int> testTable(n / 2, 0.75);
                std::vector<std::pair<std::string, int>> linVec;
                for (int i = 0; i < n; ++i) {
                    std::string key = "KEY_" + std::to_string(i);
                    testTable.insert(key, i);
                    linVec.push_back({key, i});
                }

                auto startHash = std::chrono::high_resolution_clock::now();
                for (int i = 0; i < n; ++i) {
                    int val = 0;
                    testTable.get("KEY_" + std::to_string(i), val);
                }
                auto endHash = std::chrono::high_resolution_clock::now();
                long long hashUs = std::chrono::duration_cast<std::chrono::microseconds>(endHash - startHash).count();

                int queryCount = std::min(n, 200);
                auto startLin = std::chrono::high_resolution_clock::now();
                for (int i = 0; i < queryCount; ++i) {
                    std::string target = "KEY_" + std::to_string(i * (n / queryCount));
                    for (const auto& item : linVec) {
                        if (item.first == target) break;
                    }
                }
                auto endLin = std::chrono::high_resolution_clock::now();
                long long linUs = std::chrono::duration_cast<std::chrono::microseconds>(endLin - startLin).count();

                hashVsLinearArr.push_back({
                    {"n", n},
                    {"hashTableUs", hashUs},
                    {"linearScanSampleUs", linUs}
                });
            }
        }

        j["sortingBenchmarks"] = quickVsMergeArr;
        j["lookupBenchmarks"] = hashVsLinearArr;
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/complexity", [](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        json j = {
            {"structures", {
                {{"name", "Weighted City Graph"}, {"module", "Road Network"}, {"time", "O(V + E)"}, {"space", "O(V + E)"}, {"reason", "Adjacency list modeling real-world road distances and dynamic flood/landslide blocks"}},
                {{"name", "Dijkstra's Algorithm"}, {"module", "Route Planner"}, {"time", "O((V + E) log V)"}, {"space", "O(V + E)"}, {"reason", "Finds the shortest distance route to nearest available rescue team and shelter"}},
                {{"name", "A* Heuristic Search"}, {"module", "Fast Navigation"}, {"time", "O(E) best, O((V + E) log V)"}, {"space", "O(V + E)"}, {"reason", "Directs search using Euclidean distance heuristic, reducing explored node count"}},
                {{"name", "Indexed Max-Heap"}, {"module", "Incident Priority Queue"}, {"time", "O(log N)"}, {"space", "O(N)"}, {"reason", "Serves severity 5 emergencies first, aging lower-severity items to prevent starvation"}},
                {{"name", "Custom Hash Table"}, {"module", "ID Direct Access"}, {"time", "O(1) average"}, {"space", "O(N + B)"}, {"reason", "Provides instantaneous record lookup by alphanumeric ID using polynomial rolling hash"}},
                {{"name", "Min-Heap"}, {"module", "Team Workload Balancing"}, {"time", "O(log K)"}, {"space", "O(K)"}, {"reason", "Greedily selects the least-loaded rescue squad for dispatch"}},
                {{"name", "Doubly Linked List"}, {"module", "Mission Audit Trail"}, {"time", "O(1) insertion"}, {"space", "O(M)"}, {"reason", "Dynamic append of completed missions without pre-allocating memory"}},
                {{"name", "Stack"}, {"module", "Undo Controller"}, {"time", "O(1)"}, {"space", "O(U)"}, {"reason", "Supports LIFO rollback of emergency actions and route closures"}},
                {{"name", "Trie + LRU Cache"}, {"module", "Location Autocomplete"}, {"time", "O(M) Trie, O(1) Cache"}, {"space", "O(Alphabet * M * N)"}, {"reason", "Real-time keystroke suggestions for emergency call-takers"}},
                {{"name", "Union-Find (DSU)"}, {"module", "Connectivity Check"}, {"time", "O(alpha(V))"}, {"space", "O(V)"}, {"reason", "Monitors isolated sectors as bridges collapse or roads flood"}},
                {{"name", "Tarjan's Algorithm"}, {"module", "Bottleneck Analysis"}, {"time", "O(V + E)"}, {"space", "O(V + E)"}, {"reason", "Identifies critical cut bridges and articulation junctions in single DFS pass"}},
                {{"name", "Edmonds-Karp Max-Flow"}, {"module", "Evacuation Planning"}, {"time", "O(V * E^2)"}, {"space", "O(V^2)"}, {"reason", "Calculates bottleneck evacuee throughput along road capacities"}},
                {{"name", "Fractional Knapsack"}, {"module", "Relief Truck Packing"}, {"time", "O(N log N)"}, {"space", "O(N)"}, {"reason", "Greedy urgency-to-weight ratio maximization for relief cargo"}},
                {{"name", "Nearest-Neighbour + 2-Opt"}, {"module", "Multi-Stop Delivery"}, {"time", "O(I * K^2)"}, {"space", "O(K)"}, {"reason", "Optimizes supply delivery loop across multiple distribution shelters"}},
                {{"name", "Topological Sort"}, {"module", "Task Board Scheduling"}, {"time", "O(V + E)"}, {"space", "O(V + E)"}, {"reason", "Resolves emergency response protocol precedence with cycle deadlock detection"}},
                {{"name", "Fenwick Tree"}, {"module", "Range Rescue Analytics"}, {"time", "O(log D)"}, {"space", "O(D)"}, {"reason", "Prefix and range queries over daily disaster rescue counts"}}
            }}
        };
        res.set_content(j.dump(), "application/json");
    });

    svr.set_mount_point("/", "./web");

    std::cout << "Starting HTTP Server on http://localhost:" << port << std::endl;
    std::cout << "Serving REST API at http://localhost:" << port << "/api/..." << std::endl;
    std::cout << "Serving Web UI from ./web directory" << std::endl;

    svr.listen("0.0.0.0", port);
    return 0;
}
