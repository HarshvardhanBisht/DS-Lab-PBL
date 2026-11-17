#include "../include/CityNetwork.h"
#include <ctime>
#include <sstream>
#include <iomanip>

CityNetwork::CityNetwork()
    : incidentCounter(100), missionCounter(500), simulationClockMinutes(0), rescueTracker(365) {
    seedRealisticScenario();
}

CityNetwork::~CityNetwork() {
    std::vector<Incident*> incs = incidentMap.getAllValues();
    for (Incident* inc : incs) delete inc;
    incidentMap.clear();

    std::vector<RescueTeam*> teams = teamMap.getAllValues();
    for (RescueTeam* t : teams) delete t;
    teamMap.clear();

    std::vector<Shelter*> shelters = shelterMap.getAllValues();
    for (Shelter* s : shelters) delete s;
    shelterMap.clear();
}

void CityNetwork::seedRealisticScenario() {
    cityGraph.addNode("JIIT Sector 62", "Institution", 480, 240);
    cityGraph.addNode("Sector 62 Fire Station", "Fire Station", 420, 210);
    cityGraph.addNode("Fortis Hospital Sector 62", "Hospital", 540, 200);
    cityGraph.addNode("Sector 63 Community Center", "Shelter", 620, 220);
    cityGraph.addNode("Mamura Village", "Village", 500, 310);
    cityGraph.addNode("Khoda Village", "Village", 370, 310);
    cityGraph.addNode("Sector 59 Metro Station", "Transit Hub", 580, 330);
    cityGraph.addNode("Sector 24 Police Station", "Police Station", 330, 260);
    cityGraph.addNode("Max Hospital Sector 19", "Hospital", 260, 340);
    cityGraph.addNode("Sector 18 Commercial Hub", "Commercial", 220, 420);
    cityGraph.addNode("Botanical Garden Hub", "Transit Hub", 310, 470);
    cityGraph.addNode("Sector 128 Sports Complex", "Shelter", 620, 520);
    cityGraph.addNode("Jaypee Hospital Sector 128", "Hospital", 560, 560);
    cityGraph.addNode("Greater Noida Expressway Junc", "Transit Hub", 450, 520);
    cityGraph.addNode("Indirapuram Relief Camp", "Shelter", 390, 140);
    cityGraph.addNode("Hindan River Embankment", "Disaster Spot", 680, 140);
    cityGraph.addNode("Surajpur Wetland Lowland", "Disaster Spot", 760, 480);
    cityGraph.addNode("Sector 71 Square", "Transit Hub", 660, 380);
    cityGraph.addNode("Sector 50 Central Park", "Shelter", 440, 400);
    cityGraph.addNode("Noida Stadium Sector 21", "Shelter", 290, 190);
    cityGraph.addNode("Sector 126 Tech Zone", "Commercial", 480, 590);
    cityGraph.addNode("Kailash Hospital Sector 27", "Hospital", 250, 260);
    cityGraph.addNode("Gautam Buddha University", "Institution", 840, 580);
    cityGraph.addNode("Pari Chowk Greater Noida", "Transit Hub", 750, 570);
    cityGraph.addNode("Knowledge Park III", "Institution", 820, 500);

    cityGraph.addRoad("JIIT Sector 62", "Sector 62 Fire Station", 1.2, 3.0, 600);
    cityGraph.addRoad("JIIT Sector 62", "Fortis Hospital Sector 62", 1.8, 4.5, 800);
    cityGraph.addRoad("Sector 62 Fire Station", "Fortis Hospital Sector 62", 1.5, 3.5, 700);
    cityGraph.addRoad("Fortis Hospital Sector 62", "Sector 63 Community Center", 2.1, 5.0, 500);
    cityGraph.addRoad("Sector 63 Community Center", "Mamura Village", 2.4, 6.0, 400);
    cityGraph.addRoad("Mamura Village", "Khoda Village", 3.1, 8.0, 350);
    cityGraph.addRoad("Khoda Village", "Indirapuram Relief Camp", 2.0, 5.0, 500);
    cityGraph.addRoad("Indirapuram Relief Camp", "Hindan River Embankment", 3.5, 7.5, 450);
    cityGraph.addRoad("Sector 63 Community Center", "Hindan River Embankment", 3.0, 6.5, 400);
    cityGraph.addRoad("Mamura Village", "Sector 59 Metro Station", 1.9, 4.0, 900);
    cityGraph.addRoad("Sector 59 Metro Station", "Sector 71 Square", 2.6, 5.0, 1100);
    cityGraph.addRoad("Sector 71 Square", "Sector 50 Central Park", 3.1, 6.5, 750);
    cityGraph.addRoad("Sector 59 Metro Station", "Sector 24 Police Station", 3.2, 7.0, 800);
    cityGraph.addRoad("Sector 24 Police Station", "Noida Stadium Sector 21", 2.0, 4.5, 600);
    cityGraph.addRoad("Noida Stadium Sector 21", "Indirapuram Relief Camp", 4.2, 9.0, 500);
    cityGraph.addRoad("Sector 24 Police Station", "Kailash Hospital Sector 27", 1.8, 4.0, 850);
    cityGraph.addRoad("Kailash Hospital Sector 27", "Max Hospital Sector 19", 1.6, 3.5, 700);
    cityGraph.addRoad("Max Hospital Sector 19", "Sector 18 Commercial Hub", 2.5, 5.5, 1200);
    cityGraph.addRoad("Sector 18 Commercial Hub", "Botanical Garden Hub", 1.6, 3.5, 1400);
    cityGraph.addRoad("Botanical Garden Hub", "Sector 50 Central Park", 3.5, 7.0, 800);
    cityGraph.addRoad("Sector 50 Central Park", "Greater Noida Expressway Junc", 4.2, 8.0, 1500);
    cityGraph.addRoad("Botanical Garden Hub", "Greater Noida Expressway Junc", 5.2, 9.0, 1600);
    cityGraph.addRoad("Greater Noida Expressway Junc", "Sector 126 Tech Zone", 2.2, 4.0, 1000);
    cityGraph.addRoad("Sector 126 Tech Zone", "Jaypee Hospital Sector 128", 2.0, 4.0, 900);
    cityGraph.addRoad("Sector 128 Sports Complex", "Jaypee Hospital Sector 128", 1.4, 3.0, 800);
    cityGraph.addRoad("Greater Noida Expressway Junc", "Sector 128 Sports Complex", 3.0, 5.0, 1200);
    cityGraph.addRoad("Sector 128 Sports Complex", "Surajpur Wetland Lowland", 6.2, 11.0, 500);
    cityGraph.addRoad("Surajpur Wetland Lowland", "Hindan River Embankment", 8.4, 15.0, 400);
    cityGraph.addRoad("JIIT Sector 62", "Mamura Village", 2.0, 4.5, 700);
    cityGraph.addRoad("Sector 62 Fire Station", "Sector 59 Metro Station", 2.7, 5.5, 800);
    cityGraph.addRoad("Sector 71 Square", "Surajpur Wetland Lowland", 7.0, 13.0, 600);
    cityGraph.addRoad("Surajpur Wetland Lowland", "Knowledge Park III", 3.5, 6.0, 750);
    cityGraph.addRoad("Knowledge Park III", "Pari Chowk Greater Noida", 2.8, 5.0, 1300);
    cityGraph.addRoad("Pari Chowk Greater Noida", "Gautam Buddha University", 3.4, 6.5, 900);
    cityGraph.addRoad("Jaypee Hospital Sector 128", "Pari Chowk Greater Noida", 9.8, 14.0, 1600);

    const auto& allNodes = cityGraph.getAllNodes();
    for (const auto& node : allNodes) {
        locationTrie.insert(node.name, node.type);
    }

    connectivity.reset(cityGraph.getNodeCount());
    updateConnectivity();

    Shelter* s1 = new Shelter("SH-01", "Sector 63 Community Center", "Sector 63 Community Center", 500, 60, 2500, 6000, 30, "+91-120-240101");
    Shelter* s2 = new Shelter("SH-02", "Sector 128 Sports Complex Shelter", "Sector 128 Sports Complex", 1200, 150, 6000, 15000, 80, "+91-120-240102");
    Shelter* s3 = new Shelter("SH-03", "Indirapuram Relief Camp", "Indirapuram Relief Camp", 750, 90, 3500, 8000, 50, "+91-120-240103");
    Shelter* s4 = new Shelter("SH-04", "JIIT Academic Shelter Wing", "JIIT Sector 62", 350, 20, 1800, 4500, 25, "+91-120-240104");
    Shelter* s5 = new Shelter("SH-05", "Sector 50 Central Park Camp", "Sector 50 Central Park", 800, 100, 4000, 9000, 40, "+91-120-240105");
    Shelter* s6 = new Shelter("SH-06", "Noida Stadium Shelter", "Noida Stadium Sector 21", 1000, 120, 5000, 12000, 60, "+91-120-240106");

    addShelter(s1);
    addShelter(s2);
    addShelter(s3);
    addShelter(s4);
    addShelter(s5);
    addShelter(s6);

    RescueTeam* t1 = new RescueTeam("RT-01", "Sector 62 Fire & Hazmat", "Fire & Hazmat", "Sector 62 Fire Station");
    t1->addEquipment("Fire Trucks", 4);
    t1->addEquipment("Water Tankers", 8);
    t1->addEquipment("Hazmat Foam Units", 3);
    t1->addEquipment("Burn Trauma Kits", 25);
    t1->addEquipment("Ambulances", 2);
    t1->addMember(new RescueOfficer("RO-01", "Capt. Vikram Rathore", "+91-9811001122", "rathore@fire.org", "Chief Inspector", "Level 4 Hazmat", 18));
    t1->addMember(new MedicalOfficer("MO-01", "Dr. Shalini Gupta", "+91-9811001123", "gupta@fortis.org", "Emergency Trauma", "DMC-84721", 9));
    t1->addMember(new Volunteer("VO-01", "Aman Sharma", "+91-9811001124", "aman@jiit.ac.in", "First Aid, Logistics", 120));

    RescueTeam* t2 = new RescueTeam("RT-02", "Hindan Flood Rapid Response", "Flood & Water Rescue", "Sector 59 Metro Station");
    t2->addEquipment("Motor Rescue Boats", 6);
    t2->addEquipment("Life Jackets", 200);
    t2->addEquipment("Diver Teams", 4);
    t2->addEquipment("High-Capacity Pumps", 8);
    t2->addEquipment("Ambulances", 2);
    t2->addMember(new RescueOfficer("RO-02", "Lt. Sandeep Deshmukh", "+91-9822002233", "deshmukh@ndrf.org", "Commander", "Deep Diving & Swift Water", 24));
    t2->addMember(new MedicalOfficer("MO-02", "Dr. Rajesh Kothari", "+91-9822002234", "kothari@metro.org", "Critical Care", "UPMC-19842", 12));
    t2->addMember(new Volunteer("VO-02", "Pooja Verma", "+91-9822002235", "pooja@jiit.ac.in", "Crowd Control, Supply Relay", 85));

    RescueTeam* t3 = new RescueTeam("RT-03", "Expressway Heavy Extraction", "Search & Heavy Extraction", "Greater Noida Expressway Junc");
    t3->addEquipment("Hydraulic Excavators", 4);
    t3->addEquipment("Acoustic Life Detectors", 5);
    t3->addEquipment("Earth Movers", 3);
    t3->addEquipment("Trauma Surgical Kits", 30);
    t3->addEquipment("Ambulances", 3);
    t3->addMember(new RescueOfficer("RO-03", "Insp. Kuldeep Rawat", "+91-9833003344", "rawat@ndrf.org", "Senior Inspector", "Structural Collapse Specialist", 15));
    t3->addMember(new MedicalOfficer("MO-03", "Dr. Meenakshi Sundaram", "+91-9833003345", "sundaram@jaypee.org", "Orthopedic Trauma", "DMC-66291", 7));
    t3->addMember(new Volunteer("VO-03", "Rohan Malik", "+91-9833003346", "rohan@jiit.ac.in", "HAM Radio Operator", 140));

    RescueTeam* t4 = new RescueTeam("RT-04", "JIIT Campus Relief Squad", "Multi-Hazard & First Aid", "JIIT Sector 62");
    t4->addEquipment("First Aid Packs", 50);
    t4->addEquipment("Emergency Tents", 20);
    t4->addEquipment("Life Jackets", 40);
    t4->addEquipment("Ambulances", 1);
    t4->addMember(new RescueOfficer("RO-04", "Officer Nidhi Saxena", "+91-9844004455", "nidhi@jiit.ac.in", "Faculty Coordinator", "Civil Defense Master", 6));
    t4->addMember(new MedicalOfficer("MO-04", "Dr. Arvind Joshi", "+91-9844004456", "joshi@campusclinic.org", "General Medicine", "UPMC-55110", 14));
    t4->addMember(new Volunteer("VO-04", "Tanvi Agarwal", "+91-9844004457", "tanvi@jiit.ac.in", "Triage Assistance", 95));

    RescueTeam* t5 = new RescueTeam("RT-05", "Greater Noida Disaster Brigade", "Multi-Hazard & Search", "Pari Chowk Greater Noida");
    t5->addEquipment("Hydraulic Cutters", 6);
    t5->addEquipment("Earth Movers", 2);
    t5->addEquipment("Ambulances", 2);
    t5->addMember(new RescueOfficer("RO-05", "Major Aniruddh Sen", "+91-9855005566", "sen@gbu.org", "Battalion Chief", "Urban Search & Rescue", 21));
    t5->addMember(new MedicalOfficer("MO-05", "Dr. Farida Khan", "+91-9855005567", "khan@kailash.org", "Surgical Emergency", "DMC-44012", 11));
    t5->addMember(new Volunteer("VO-05", "Deepak Rawat", "+91-9855005568", "deepak@gbu.ac.in", "Drone Operator", 110));

    addRescueTeam(t1);
    addRescueTeam(t2);
    addRescueTeam(t3);
    addRescueTeam(t4);
    addRescueTeam(t5);

    Incident* inc1 = new Fire("INC-101", "Mamura Village", 4, 1000, 35, 2, "Major electrical and residential structure fire near market area", "Class A - Structural", false);
    Incident* inc2 = new Flood("INC-102", "Hindan River Embankment", 5, 1005, 75, 4, "Flash flood overflow breaching embankment, 40 homes submerged", 3.8, "High Torrential");
    Incident* inc3 = new Earthquake("INC-103", "Sector 18 Commercial Hub", 4, 1010, 50, 6, "Medium seismic event causing underground parking collapse and structural cracks", 5.6, 3);
    Incident* inc4 = new Landslide("INC-104", "Greater Noida Expressway Junc", 3, 1015, 20, 1, "Mudslide blocking outbound expressway lanes after continuous torrential downpour", 450.0, true);
    Incident* inc5 = new Fire("INC-105", "Sector 63 Community Center", 2, 1020, 12, 0, "Basement chemical solvent ignition contained in industrial park", "Class B - Chemical", true);

    registerIncident(inc1);
    registerIncident(inc2);
    registerIncident(inc3);
    registerIncident(inc4);
    registerIncident(inc5);
}

void CityNetwork::updateConnectivity() {
    int n = cityGraph.getNodeCount();
    connectivity.reset(n);
    const auto& adj = cityGraph.getAdjList();
    for (size_t u = 0; u < adj.size(); ++u) {
        for (const auto& road : adj[u]) {
            if (!road.isBlocked) {
                connectivity.unite(static_cast<int>(u), road.to);
            }
        }
    }
}

void CityNetwork::syncTeamHeap() {
    teamHeap.clear();
    std::vector<RescueTeam*> teams = teamMap.getAllValues();
    for (RescueTeam* t : teams) {
        teamHeap.push(t->getId(), t->getActiveMissionsCount());
    }
}

bool CityNetwork::registerIncident(Incident* inc) {
    if (!inc) return false;
    if (incidentMap.contains(inc->getId())) return false;

    incidentMap.insert(inc->getId(), inc);
    incidentPQ.push(inc->getId(), inc->getEffectivePriority(), inc->getSeverity(), inc->getWaitMinutes());

    UndoAction undo;
    undo.type = "REGISTER_INCIDENT";
    undo.targetId = inc->getId();
    undoStack.push(undo);
    return true;
}

Incident* CityNetwork::getIncident(const std::string& id) {
    Incident* inc = nullptr;
    if (incidentMap.get(id, inc)) return inc;
    return nullptr;
}

std::vector<Incident*> CityNetwork::getAllIncidents() const {
    return incidentMap.getAllValues();
}

bool CityNetwork::updateIncidentSeverity(const std::string& id, int newSeverity) {
    Incident* inc = getIncident(id);
    if (!inc) return false;
    inc->setSeverity(newSeverity);
    incidentPQ.updatePriority(id, inc->getEffectivePriority());
    return true;
}

bool CityNetwork::closeIncident(const std::string& id) {
    Incident* inc = getIncident(id);
    if (!inc) return false;
    inc->setStatus("Closed");
    return true;
}

bool CityNetwork::addRescueTeam(RescueTeam* team) {
    if (!team || teamMap.contains(team->getId())) return false;
    teamMap.insert(team->getId(), team);
    syncTeamHeap();
    return true;
}

RescueTeam* CityNetwork::getRescueTeam(const std::string& id) {
    RescueTeam* t = nullptr;
    if (teamMap.get(id, t)) return t;
    return nullptr;
}

std::vector<RescueTeam*> CityNetwork::getAllTeams() const {
    return teamMap.getAllValues();
}

bool CityNetwork::addShelter(Shelter* shelter) {
    if (!shelter || shelterMap.contains(shelter->getId())) return false;
    shelterMap.insert(shelter->getId(), shelter);
    return true;
}

Shelter* CityNetwork::getShelter(const std::string& id) {
    Shelter* s = nullptr;
    if (shelterMap.get(id, s)) return s;
    return nullptr;
}

std::vector<Shelter*> CityNetwork::getAllShelters() const {
    return shelterMap.getAllValues();
}

bool CityNetwork::dispatchNext(MissionRecord& outMission) {
    if (incidentPQ.empty()) return false;

    HeapNode topNode = incidentPQ.popMax();
    Incident* inc = getIncident(topNode.id);
    if (!inc || inc->getStatus() == "Resolved" || inc->getStatus() == "Closed") {
        return false;
    }

    std::string incLoc = inc->getLocationName();
    int evacuees = inc->getAffectedPeople();

    std::vector<RescueTeam*> teams = teamMap.getAllValues();
    RescueTeam* bestTeam = nullptr;
    double bestTeamScore = 1e9;
    RouteResult bestRouteToIncident;

    for (RescueTeam* t : teams) {
        RouteResult rr = cityGraph.runDijkstra(t->getBaseLocation(), incLoc);
        if (rr.found) {
            double score = rr.totalDistanceKm + (t->getActiveMissionsCount() * 3.5);
            if (score < bestTeamScore) {
                bestTeamScore = score;
                bestTeam = t;
                bestRouteToIncident = rr;
            }
        }
    }

    if (!bestTeam) {
        incidentPQ.push(inc->getId(), inc->getEffectivePriority(), inc->getSeverity(), inc->getWaitMinutes());
        return false;
    }

    Shelter* bestShelter = nullptr;
    double bestShelterDist = 1e9;
    RouteResult bestRouteToShelter;

    if (evacuees > 0) {
        std::vector<Shelter*> shelters = shelterMap.getAllValues();
        for (Shelter* s : shelters) {
            if (s->getAvailableCapacity() > 0) {
                RouteResult rr = cityGraph.runDijkstra(incLoc, s->getLocationName());
                if (rr.found && rr.totalDistanceKm < bestShelterDist) {
                    bestShelterDist = rr.totalDistanceKm;
                    bestShelter = s;
                    bestRouteToShelter = rr;
                }
            }
        }
    }

    bestTeam->deploy();
    inc->setStatus("In-Progress");
    inc->setAssignedTeamId(bestTeam->getId());

    int admitted = 0;
    if (bestShelter && evacuees > 0) {
        int avail = bestShelter->getAvailableCapacity();
        admitted = (evacuees <= avail) ? evacuees : avail;
        bestShelter->admitPeople(admitted);
        bestShelter->consumeSupplies(admitted * 2, admitted * 4);
    }

    std::vector<std::string> fullPath = bestRouteToIncident.path;
    if (!bestRouteToShelter.path.empty()) {
        for (size_t i = 1; i < bestRouteToShelter.path.size(); ++i) {
            fullPath.push_back(bestRouteToShelter.path[i]);
        }
    }

    double totalDist = bestRouteToIncident.totalDistanceKm + (bestShelter ? bestRouteToShelter.totalDistanceKm : 0.0);

    std::stringstream resStream;
    const auto& resList = inc->getRequiredResources();
    for (size_t i = 0; i < resList.size(); ++i) {
        resStream << resList[i].first << " (" << resList[i].second << ")";
        if (i + 1 < resList.size()) resStream << ", ";
    }

    missionCounter++;
    std::string mId = "MSN-" + std::to_string(missionCounter);

    std::time_t now = std::time(nullptr);
    char timeBuf[64];
    std::strftime(timeBuf, sizeof(timeBuf), "%Y-%m-%d %H:%M:%S", std::localtime(&now));

    outMission = MissionRecord(mId, inc->getId(), inc->getType(), inc->getSeverity(),
                               incLoc, bestTeam->getId(),
                               (bestShelter ? bestShelter->getId() : "None"),
                               admitted, inc->getCasualties(), fullPath,
                               totalDist, resStream.str(), std::string(timeBuf), "Completed");

    missionHistory.insertTail(outMission);
    inc->setStatus("Resolved");
    bestTeam->completeMission();
    syncTeamHeap();

    int currentDay = static_cast<int>(simulationClockMinutes / (24 * 60)) + 1;
    rescueTracker.add(currentDay, admitted);

    UndoAction undo;
    undo.type = "DISPATCH_MISSION";
    undo.targetId = mId;
    undo.payload = inc->getId() + "|" + bestTeam->getId() + "|" +
                   (bestShelter ? bestShelter->getId() : "None") + "|" +
                   std::to_string(admitted);
    undoStack.push(undo);

    return true;
}

std::vector<MissionRecord> CityNetwork::dispatchAll() {
    std::vector<MissionRecord> records;
    while (!incidentPQ.empty()) {
        MissionRecord m;
        if (dispatchNext(m)) {
            records.push_back(m);
        } else {
            break;
        }
    }
    return records;
}

bool CityNetwork::undoLastAction() {
    if (undoStack.empty()) return false;
    UndoAction act = undoStack.pop();

    if (act.type == "DISPATCH_MISSION") {
        MissionRecord lastRecord;
        if (missionHistory.removeTail(lastRecord)) {
            std::stringstream ss(act.payload);
            std::string incId, teamId, shelterId, admittedStr;
            std::getline(ss, incId, '|');
            std::getline(ss, teamId, '|');
            std::getline(ss, shelterId, '|');
            std::getline(ss, admittedStr, '|');

            int admitted = std::stoi(admittedStr);
            Incident* inc = getIncident(incId);
            if (inc) {
                inc->setStatus("Reported");
                inc->setAssignedTeamId("None");
                incidentPQ.push(inc->getId(), inc->getEffectivePriority(), inc->getSeverity(), inc->getWaitMinutes());
            }

            if (shelterId != "None") {
                Shelter* s = getShelter(shelterId);
                if (s) {
                    s->releasePeople(admitted);
                    s->addSupplies(admitted * 2, admitted * 4);
                }
            }

            RescueTeam* t = getRescueTeam(teamId);
            if (t) syncTeamHeap();

            int currentDay = static_cast<int>(simulationClockMinutes / (24 * 60)) + 1;
            rescueTracker.add(currentDay, -admitted);
            return true;
        }
    } else if (act.type == "TOGGLE_ROAD") {
        std::stringstream ss(act.payload);
        std::string u, v, wasBlockedStr;
        std::getline(ss, u, '|');
        std::getline(ss, v, '|');
        std::getline(ss, wasBlockedStr, '|');
        bool wasBlocked = (wasBlockedStr == "1");
        cityGraph.setRoadBlocked(u, v, wasBlocked);
        updateConnectivity();
        return true;
    }
    return false;
}

bool CityNetwork::toggleRoadBlock(const std::string& u, const std::string& v, bool blocked) {
    bool currentBlocked = cityGraph.isRoadBlocked(u, v);
    bool changed = cityGraph.setRoadBlocked(u, v, blocked);
    if (changed) {
        updateConnectivity();
        UndoAction undo;
        undo.type = "TOGGLE_ROAD";
        undo.targetId = u + "<->" + v;
        undo.payload = u + "|" + v + "|" + (currentBlocked ? "1" : "0");
        undoStack.push(undo);
    }
    return changed;
}

std::vector<std::pair<std::string, std::string>> CityNetwork::searchLocations(const std::string& prefix) {
    std::vector<std::pair<std::string, std::string>> cached;
    if (searchCache.get(prefix, cached)) {
        return cached;
    }
    std::vector<std::pair<std::string, std::string>> fresh = locationTrie.autocomplete(prefix, 8);
    searchCache.put(prefix, fresh);
    return fresh;
}

TarjanResult CityNetwork::runTarjanAnalysis() {
    int n = cityGraph.getNodeCount();
    std::vector<std::vector<int>> unweighted = cityGraph.getUnweightedAdjList();
    TarjanBridgeFinder finder;
    return finder.findCriticalInfrastructures(n, unweighted);
}

MSTResult CityNetwork::runKruskal() {
    int n = cityGraph.getNodeCount();
    std::vector<CityRoad> uniqueRoads = cityGraph.getAllUniqueRoads();
    std::vector<MSTEdge> edges;
    for (const auto& r : uniqueRoads) {
        if (!r.isBlocked) {
            MSTEdge me;
            me.u = r.from;
            me.v = r.to;
            me.weight = r.distanceKm;
            me.uName = cityGraph.getNodeName(r.from);
            me.vName = cityGraph.getNodeName(r.to);
            edges.push_back(me);
        }
    }
    return KruskalMST::compute(n, edges);
}

MSTResult CityNetwork::runPrim() {
    int n = cityGraph.getNodeCount();
    auto weightedAdj = cityGraph.getWeightedAdjList();
    std::vector<std::string> names;
    for (int i = 0; i < n; ++i) names.push_back(cityGraph.getNodeName(i));
    return PrimMST::compute(n, weightedAdj, names);
}

MaxFlowResult CityNetwork::runMaxFlowEvacuation(const std::string& sourceName, const std::string& sinkName) {
    int n = cityGraph.getNodeCount();
    int s = cityGraph.getNodeIndex(sourceName);
    int t = cityGraph.getNodeIndex(sinkName);
    std::vector<std::string> names;
    for (int i = 0; i < n; ++i) names.push_back(cityGraph.getNodeName(i));

    if (s == -1 || t == -1) {
        MaxFlowResult emptyRes;
        emptyRes.maxFlow = 0;
        return emptyRes;
    }
    auto capMatrix = cityGraph.getCapacityMatrix();
    return EdmondsKarpMaxFlow::compute(n, s, t, capMatrix, names);
}

KnapsackResult CityNetwork::runReliefTruckKnapsack(double capacityKg, const std::vector<SupplyItem>& items) {
    return FractionalKnapsack::loadTruck(capacityKg, items);
}

RouteOptimizationResult CityNetwork::runMultiStopSupplyRoute(const std::vector<std::string>& shelterNames) {
    std::vector<int> targetIndices;
    for (const auto& name : shelterNames) {
        int idx = cityGraph.getNodeIndex(name);
        if (idx != -1) targetIndices.push_back(idx);
    }
    auto distMatrix = cityGraph.getDistanceMatrix();
    std::vector<std::string> names;
    int n = cityGraph.getNodeCount();
    for (int i = 0; i < n; ++i) names.push_back(cityGraph.getNodeName(i));

    return MultiStopRoutePlanner::optimize(targetIndices, distMatrix, names);
}

TopoSortResult CityNetwork::runTaskDependencyScheduling() {
    std::vector<TaskNode> tasks = {
        {0, "Aerial Drone Survey & Recon", "Recon Squad", 15},
        {1, "Hazardous Material & Gas Line Shutoff", "Hazmat Unit", 25},
        {2, "Structural Collapse Stability Inspection", "Engineers", 30},
        {3, "Primary Civilian Evacuation Corridor Setup", "Police & Defense", 40},
        {4, "Heavy Hydraulic Debris Clearance", "Heavy Squad", 60},
        {5, "Mobile Field Hospital Triage Deployment", "Medical Unit", 45},
        {6, "Emergency Potable Water & Rations Distribution", "Logistics", 35},
        {7, "Relief Camp Long-term Shelter Relocation", "Admin Volunteers", 50}
    };

    std::vector<TaskEdge> deps = {
        {0, 1},
        {0, 2},
        {1, 3},
        {2, 3},
        {2, 4},
        {3, 5},
        {4, 6},
        {5, 7},
        {6, 7}
    };

    return TaskScheduler::schedule(tasks, deps);
}

void CityNetwork::advanceSimulationTime(int minutes) {
    simulationClockMinutes += minutes;
    incidentPQ.ageAll(1.5, minutes);
}
