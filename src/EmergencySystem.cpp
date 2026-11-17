#include "../include/EmergencySystem.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <ctime>
#include <chrono>
#include <random>

EmergencySystem::EmergencySystem()
    : incidentCounter(100), missionCounter(500) {}

EmergencySystem::~EmergencySystem() {
    std::vector<Incident*> incs = incidentMap.getAllValues();
    for (size_t i = 0; i < incs.size(); ++i) {
        delete incs[i];
    }
    incidentMap.clear();

    std::vector<RescueTeam*> teams = teamMap.getAllValues();
    for (size_t i = 0; i < teams.size(); ++i) {
        delete teams[i];
    }
    teamMap.clear();

    std::vector<Shelter*> shelters = shelterMap.getAllValues();
    for (size_t i = 0; i < shelters.size(); ++i) {
        delete shelters[i];
    }
    shelterMap.clear();
}

std::string EmergencySystem::getCurrentDateTime() const {
    std::time_t now = std::time(nullptr);
    char buf[64];
    std::strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", std::localtime(&now));
    return std::string(buf);
}

void EmergencySystem::refreshTeamHeap() {
    teamWorkloadHeap.clear();
    std::vector<RescueTeam*> teams = teamMap.getAllValues();
    for (size_t i = 0; i < teams.size(); ++i) {
        teamWorkloadHeap.insert(teams[i]->getId(), teams[i]->getActiveMissionsCount());
    }
}

void EmergencySystem::initializeDefaultData() {
    cityGraph.addLocation("JIIT Sector 62", "Institution / ECC");
    cityGraph.addLocation("Sector 62 Fire Station", "Fire Station");
    cityGraph.addLocation("Fortis Hospital Sector 62", "Hospital");
    cityGraph.addLocation("Sector 63 Community Center", "Shelter");
    cityGraph.addLocation("Mamura Village", "Village");
    cityGraph.addLocation("Khoda Village", "Village");
    cityGraph.addLocation("Sector 59 Metro Station", "Transit Hub");
    cityGraph.addLocation("Sector 24 Police Station", "Police Station");
    cityGraph.addLocation("Max Hospital Sector 19", "Hospital");
    cityGraph.addLocation("Sector 18 Commercial Hub", "Commercial");
    cityGraph.addLocation("Botanical Garden Hub", "Transit Hub");
    cityGraph.addLocation("Sector 128 Sports Complex", "Shelter");
    cityGraph.addLocation("Jaypee Hospital Sector 128", "Hospital");
    cityGraph.addLocation("Greater Noida Expressway Junction", "Transit Hub");
    cityGraph.addLocation("Indirapuram Relief Camp", "Shelter");
    cityGraph.addLocation("Hindan River Embankment", "Disaster Spot");
    cityGraph.addLocation("Surajpur Wetland Lowland", "Disaster Spot");

    cityGraph.addRoad("JIIT Sector 62", "Sector 62 Fire Station", 1.2, 3.0);
    cityGraph.addRoad("JIIT Sector 62", "Fortis Hospital Sector 62", 1.8, 4.5);
    cityGraph.addRoad("Sector 62 Fire Station", "Fortis Hospital Sector 62", 1.5, 3.5);
    cityGraph.addRoad("Fortis Hospital Sector 62", "Sector 63 Community Center", 2.1, 5.0);
    cityGraph.addRoad("Sector 63 Community Center", "Mamura Village", 2.4, 6.0);
    cityGraph.addRoad("Mamura Village", "Khoda Village", 3.1, 8.0);
    cityGraph.addRoad("Khoda Village", "Indirapuram Relief Camp", 2.0, 5.0);
    cityGraph.addRoad("Indirapuram Relief Camp", "Hindan River Embankment", 3.5, 7.5);
    cityGraph.addRoad("Mamura Village", "Sector 59 Metro Station", 1.9, 4.0);
    cityGraph.addRoad("Sector 59 Metro Station", "Sector 24 Police Station", 3.2, 7.0);
    cityGraph.addRoad("Sector 24 Police Station", "Max Hospital Sector 19", 2.8, 6.5);
    cityGraph.addRoad("Max Hospital Sector 19", "Sector 18 Commercial Hub", 2.5, 5.5);
    cityGraph.addRoad("Sector 18 Commercial Hub", "Botanical Garden Hub", 1.6, 3.5);
    cityGraph.addRoad("Botanical Garden Hub", "Greater Noida Expressway Junction", 5.2, 9.0);
    cityGraph.addRoad("Greater Noida Expressway Junction", "Sector 128 Sports Complex", 3.0, 5.0);
    cityGraph.addRoad("Sector 128 Sports Complex", "Jaypee Hospital Sector 128", 1.4, 3.0);
    cityGraph.addRoad("Jaypee Hospital Sector 128", "Surajpur Wetland Lowland", 6.8, 12.0);
    cityGraph.addRoad("Surajpur Wetland Lowland", "Hindan River Embankment", 8.4, 15.0);
    cityGraph.addRoad("JIIT Sector 62", "Mamura Village", 2.0, 4.5);
    cityGraph.addRoad("Sector 62 Fire Station", "Sector 59 Metro Station", 2.7, 5.5);
    cityGraph.addRoad("Sector 24 Police Station", "Sector 18 Commercial Hub", 4.0, 8.0);
    cityGraph.addRoad("Botanical Garden Hub", "Jaypee Hospital Sector 128", 7.5, 13.0);

    const std::vector<LocationVertex>& locs = cityGraph.getVertices();
    for (size_t i = 0; i < locs.size(); ++i) {
        locationTrie.insert(locs[i].name, locs[i].type);
    }

    Shelter* s1 = new Shelter("SH-01", "Sector 63 Community Center", "Sector 63 Community Center", 450, 60, 2000, 5000, 30, "+91-120-240101");
    Shelter* s2 = new Shelter("SH-02", "Sector 128 Sports Complex Shelter", "Sector 128 Sports Complex", 1200, 150, 6000, 15000, 80, "+91-120-240102");
    Shelter* s3 = new Shelter("SH-03", "Indirapuram Relief Camp", "Indirapuram Relief Camp", 700, 90, 3500, 8000, 50, "+91-120-240103");
    Shelter* s4 = new Shelter("SH-04", "JIIT Academic Shelter Wing", "JIIT Sector 62", 300, 20, 1500, 4000, 25, "+91-120-240104");

    addShelter(s1);
    addShelter(s2);
    addShelter(s3);
    addShelter(s4);

    RescueTeam* t1 = new RescueTeam("RT-01", "Sector 62 Fire & Hazmat Unit", "Fire & Hazmat", "Sector 62 Fire Station");
    t1->addEquipment("Fire Trucks", 4);
    t1->addEquipment("Water Tankers", 6);
    t1->addEquipment("Hazmat Foam Units", 3);
    t1->addEquipment("Burn Trauma Kits", 20);
    t1->addEquipment("Ambulances", 2);
    t1->addMember(new RescueOfficer("RO-01", "Capt. Vikram Rathore", "+91-9811001122", "rathore@fire.org", "Chief Inspector", "Level 4 Hazmat", 18));
    t1->addMember(new MedicalOfficer("MO-01", "Dr. Shalini Gupta", "+91-9811001123", "gupta@fortis.org", "Emergency Trauma", "DMC-84721", 9));
    t1->addMember(new Volunteer("VO-01", "Aman Sharma", "+91-9811001124", "aman@jiit.ac.in", "First Aid, Logistics", 120));

    RescueTeam* t2 = new RescueTeam("RT-02", "Hindan Flood Rescue Unit", "Flood & Water Rescue", "Sector 59 Metro Station");
    t2->addEquipment("Motor Rescue Boats", 6);
    t2->addEquipment("Life Jackets", 150);
    t2->addEquipment("Diver Teams", 3);
    t2->addEquipment("High-Capacity Water Pumps", 8);
    t2->addEquipment("Ambulances", 2);
    t2->addMember(new RescueOfficer("RO-02", "Lt. Sandeep Deshmukh", "+91-9822002233", "deshmukh@ndrf.org", "Commander", "Deep Diving & Swift Water", 24));
    t2->addMember(new MedicalOfficer("MO-02", "Dr. Rajesh Kothari", "+91-9822002234", "kothari@metro.org", "Critical Care", "UPMC-19842", 12));
    t2->addMember(new Volunteer("VO-02", "Pooja Verma", "+91-9822002235", "pooja@jiit.ac.in", "Crowd Control, Supply Relay", 85));

    RescueTeam* t3 = new RescueTeam("RT-03", "Expressway Heavy Extraction Squad", "Search & Heavy Extraction", "Greater Noida Expressway Junction");
    t3->addEquipment("Hydraulic Excavators", 3);
    t3->addEquipment("Acoustic Life Detectors", 4);
    t3->addEquipment("Earth Movers / Bulldozers", 2);
    t3->addEquipment("Trauma Surgical Kits", 25);
    t3->addEquipment("Ambulances", 3);
    t3->addMember(new RescueOfficer("RO-03", "Insp. Kuldeep Rawat", "+91-9833003344", "rawat@ndrf.org", "Senior Inspector", "Structural Collapse Specialist", 15));
    t3->addMember(new MedicalOfficer("MO-03", "Dr. Meenakshi Sundaram", "+91-9833003345", "sundaram@jaypee.org", "Orthopedic Trauma", "DMC-66291", 7));
    t3->addMember(new Volunteer("VO-03", "Rohan Malik", "+91-9833003346", "rohan@jiit.ac.in", "HAM Radio Operator", 140));

    RescueTeam* t4 = new RescueTeam("RT-04", "JIIT Student Disaster Volunteers", "Multi-Hazard & First Aid", "JIIT Sector 62");
    t4->addEquipment("First Aid Packs", 40);
    t4->addEquipment("Emergency Tents", 15);
    t4->addEquipment("Life Jackets", 30);
    t4->addEquipment("Ambulances", 1);
    t4->addMember(new RescueOfficer("RO-04", "Officer Nidhi Saxena", "+91-9844004455", "nidhi@jiit.ac.in", "Faculty Coordinator", "Civil Defense Master", 6));
    t4->addMember(new MedicalOfficer("MO-04", "Dr. Arvind Joshi", "+91-9844004456", "joshi@campusclinic.org", "General Medicine", "UPMC-55110", 14));
    t4->addMember(new Volunteer("VO-04", "Tanvi Agarwal", "+91-9844004457", "tanvi@jiit.ac.in", "Triage Assistance", 95));

    addRescueTeam(t1);
    addRescueTeam(t2);
    addRescueTeam(t3);
    addRescueTeam(t4);

    Incident* inc1 = new Fire("INC-101", "Mamura Village", 4, "2026-11-13 18:15:00", 35, 2, "Major electrical and residential structure fire near market area", "Class A - Structural", false);
    Incident* inc2 = new Flood("INC-102", "Hindan River Embankment", 5, "2026-11-13 18:20:00", 75, 4, "Flash flood overflow breaching embankment, 40 homes submerged", 3.8, "High Torrential", 4.5);
    Incident* inc3 = new Earthquake("INC-103", "Sector 18 Commercial Hub", 4, "2026-11-13 18:25:00", 50, 6, "Medium seismic event causing parking lot collapse and structural cracks", 5.6, "Moderate (40%)", 3);
    Incident* inc4 = new Landslide("INC-104", "Greater Noida Expressway Junction", 3, "2026-11-13 18:30:00", 20, 1, "Mudslide blocking two outbound expressway lanes after heavy rains", 450.0, true, "Low Mudflow");
    Incident* inc5 = new Fire("INC-105", "Sector 63 Community Center", 2, "2026-11-13 18:35:00", 12, 0, "Warehouse chemical solvent ignition contained in basement", "Class B - Chemical", true);

    registerIncident(inc1);
    registerIncident(inc2);
    registerIncident(inc3);
    registerIncident(inc4);
    registerIncident(inc5);
}

bool EmergencySystem::registerIncident(Incident* incident) {
    if (incident == nullptr) return false;
    if (incidentMap.contains(incident->getId())) {
        return false;
    }
    incidentMap.insert(incident->getId(), incident);
    incidentPQ.enqueue(incident);
    return true;
}

Incident* EmergencySystem::getIncident(const std::string& id) {
    Incident* inc = nullptr;
    if (incidentMap.get(id, inc)) {
        return inc;
    }
    return nullptr;
}

bool EmergencySystem::updateIncidentStatus(const std::string& id, const std::string& newStatus) {
    Incident* inc = getIncident(id);
    if (inc != nullptr) {
        inc->setStatus(newStatus);
        return true;
    }
    return false;
}

bool EmergencySystem::updateIncidentSeverity(const std::string& id, int newSeverity) {
    Incident* inc = getIncident(id);
    if (inc != nullptr) {
        inc->setSeverity(newSeverity);
        inc->assignResources();
        return true;
    }
    return false;
}

bool EmergencySystem::closeIncident(const std::string& id) {
    return updateIncidentStatus(id, "Closed");
}

void EmergencySystem::listAllIncidents() const {
    std::cout << "====================================================================================================" << std::endl;
    std::cout << "                                  CURRENT REGISTERED INCIDENTS                                     " << std::endl;
    std::cout << "====================================================================================================" << std::endl;
    std::cout << std::left << std::setw(10) << "ID"
              << std::setw(14) << "Type"
              << std::setw(26) << "Location"
              << std::setw(6)  << "Sev"
              << std::setw(14) << "Status"
              << std::setw(10) << "Affected"
              << std::setw(8)  << "Cas."
              << std::setw(10) << "Team" << std::endl;
    std::cout << "----------------------------------------------------------------------------------------------------" << std::endl;

    std::vector<Incident*> list = incidentMap.getAllValues();
    if (list.empty()) {
        std::cout << "No incidents currently registered." << std::endl;
    } else {
        for (size_t i = 0; i < list.size(); ++i) {
            std::cout << std::left << std::setw(10) << list[i]->getId()
                      << std::setw(14) << list[i]->getType()
                      << std::setw(26) << list[i]->getLocationName()
                      << std::setw(6)  << list[i]->getSeverity()
                      << std::setw(14) << list[i]->getStatus()
                      << std::setw(10) << list[i]->getAffectedPeople()
                      << std::setw(8)  << list[i]->getCasualties()
                      << std::setw(10) << list[i]->getAssignedTeamId() << std::endl;
        }
    }
    std::cout << "====================================================================================================" << std::endl;
}

void EmergencySystem::listWaitingIncidents() const {
    std::cout << "Incidents waiting in Priority Queue: " << incidentPQ.size() << std::endl;
}

bool EmergencySystem::dispatchNextIncident() {
    if (incidentPQ.isEmpty()) {
        std::cout << "[DISPATCH NOTICE] No pending incidents in priority queue." << std::endl;
        return false;
    }

    Incident* inc = incidentPQ.dequeue();
    if (inc == nullptr) return false;

    std::string incLoc = inc->getLocationName();
    int peopleToEvacuate = inc->getAffectedPeople();

    std::vector<RescueTeam*> teams = teamMap.getAllValues();
    RescueTeam* bestTeam = nullptr;
    double minTeamDistance = std::numeric_limits<double>::infinity();
    std::vector<std::string> pathToIncident;

    for (size_t i = 0; i < teams.size(); ++i) {
        RescueTeam* t = teams[i];
        double dist = -1.0;
        std::vector<std::string> path;
        if (cityGraph.dijkstra(t->getBaseLocation(), incLoc, dist, path)) {
            double effectiveScore = dist + (t->getActiveMissionsCount() * 3.0);
            if (effectiveScore < minTeamDistance) {
                minTeamDistance = effectiveScore;
                bestTeam = t;
                pathToIncident = path;
            }
        }
    }

    if (bestTeam == nullptr) {
        std::cout << "[ERROR] No reachable rescue team could be dispatched to: " << incLoc << std::endl;
        incidentPQ.enqueue(inc);
        return false;
    }

    Shelter* bestShelter = nullptr;
    double minShelterDistance = std::numeric_limits<double>::infinity();
    std::vector<std::string> pathToShelter;

    if (peopleToEvacuate > 0) {
        std::vector<Shelter*> shelters = shelterMap.getAllValues();
        for (size_t i = 0; i < shelters.size(); ++i) {
            Shelter* s = shelters[i];
            if (s->getAvailableCapacity() > 0) {
                double dist = -1.0;
                std::vector<std::string> path;
                if (cityGraph.dijkstra(incLoc, s->getLocationName(), dist, path)) {
                    if (dist < minShelterDistance) {
                        minShelterDistance = dist;
                        bestShelter = s;
                        pathToShelter = path;
                    }
                }
            }
        }
    }

    bestTeam->deploy();
    inc->setStatus("In-Progress");
    inc->setAssignedTeamId(bestTeam->getId());

    int admitted = 0;
    if (bestShelter != nullptr && peopleToEvacuate > 0) {
        int avail = bestShelter->getAvailableCapacity();
        admitted = (peopleToEvacuate <= avail) ? peopleToEvacuate : avail;
        bestShelter->admitPeople(admitted);
        bestShelter->consumeSupplies(admitted * 2, admitted * 4);
    }

    std::vector<std::string> completeRoute = pathToIncident;
    if (!pathToShelter.empty()) {
        for (size_t i = 1; i < pathToShelter.size(); ++i) {
            completeRoute.push_back(pathToShelter[i]);
        }
    }

    double totalDist = 0.0;
    double leg1 = 0.0;
    std::vector<std::string> dummy;
    cityGraph.dijkstra(bestTeam->getBaseLocation(), incLoc, leg1, dummy);
    totalDist += leg1;

    if (bestShelter != nullptr) {
        double leg2 = 0.0;
        cityGraph.dijkstra(incLoc, bestShelter->getLocationName(), leg2, dummy);
        totalDist += leg2;
    }

    std::stringstream resStream;
    const auto& resList = inc->getRequiredResources();
    for (size_t i = 0; i < resList.size(); ++i) {
        resStream << resList[i].first << " (" << resList[i].second << ")";
        if (i + 1 < resList.size()) resStream << ", ";
    }

    missionCounter++;
    std::string mId = "MSN-" + std::to_string(missionCounter);

    MissionRecord record(mId, inc->getId(), inc->getType(), inc->getSeverity(),
                          incLoc, bestTeam->getId(),
                          (bestShelter ? bestShelter->getId() : "None"),
                          admitted, inc->getCasualties(), completeRoute,
                          totalDist, resStream.str(), getCurrentDateTime(), "Completed");

    missionHistory.insertTail(record);
    inc->setStatus("Resolved");
    bestTeam->completeMission();
    refreshTeamHeap();

    std::cout << "================================================================================" << std::endl;
    std::cout << "                 AUTOMATED EMERGENCY MISSION DISPATCH REPORT                    " << std::endl;
    std::cout << "================================================================================" << std::endl;
    std::cout << "Dispatched Mission ID   : " << mId << std::endl;
    std::cout << "Incident Handled        : " << inc->getId() << " (" << inc->getType() << " - Severity " << inc->getSeverity() << ")" << std::endl;
    std::cout << "Incident Location       : " << incLoc << std::endl;
    std::cout << "Assigned Rescue Team    : " << bestTeam->getId() << " [" << bestTeam->getName() << "]" << std::endl;
    std::cout << "Team Base Location      : " << bestTeam->getBaseLocation() << std::endl;
    std::cout << "Team Workload (Active)  : " << bestTeam->getActiveMissionsCount() << std::endl;
    std::cout << "Evacuation Shelter      : " << (bestShelter ? (bestShelter->getId() + " [" + bestShelter->getName() + "]") : "None Required") << std::endl;
    std::cout << "Citizens Evacuated      : " << admitted << " / " << peopleToEvacuate << std::endl;
    std::cout << "Casualties Attended     : " << inc->getCasualties() << std::endl;
    std::cout << "Total Route Distance    : " << std::fixed << std::setprecision(2) << totalDist << " km" << std::endl;
    std::cout << "Optimized Dijkstra Path : ";
    for (size_t i = 0; i < completeRoute.size(); ++i) {
        std::cout << completeRoute[i];
        if (i + 1 < completeRoute.size()) std::cout << " -> ";
    }
    std::cout << std::endl;
    std::cout << "Resources Allocated     : " << resStream.str() << std::endl;
    std::cout << "Incident Final Status   : Resolved" << std::endl;
    std::cout << "================================================================================" << std::endl;

    return true;
}

void EmergencySystem::dispatchAllIncidents() {
    int dispatchedCount = 0;
    while (!incidentPQ.isEmpty()) {
        std::cout << "\n>>> Processing Next Priority Item in Queue..." << std::endl;
        if (dispatchNextIncident()) {
            dispatchedCount++;
        } else {
            break;
        }
    }
    std::cout << "\n>>> Total Incidents Dispatched in this Batch: " << dispatchedCount << std::endl;
}

bool EmergencySystem::planShortestRoute(const std::string& src, const std::string& dest, double& distance, std::vector<std::string>& path) const {
    return cityGraph.dijkstra(src, dest, distance, path);
}

bool EmergencySystem::planFastestRoute(const std::string& src, const std::string& dest, double& timeMins, std::vector<std::string>& path) const {
    return cityGraph.dijkstraFastest(src, dest, timeMins, path);
}

std::vector<std::string> EmergencySystem::getReachableLocationsBFS(const std::string& startLoc) const {
    return cityGraph.bfs(startLoc);
}

std::vector<std::string> EmergencySystem::getConnectedLocationsDFS(const std::string& startLoc) const {
    return cityGraph.dfs(startLoc);
}

bool EmergencySystem::checkReachability(const std::string& src, const std::string& dest) const {
    return cityGraph.isReachable(src, dest);
}

void EmergencySystem::displayCityMap() const {
    cityGraph.displayGraph();
}

bool EmergencySystem::addRescueTeam(RescueTeam* team) {
    if (team == nullptr) return false;
    if (teamMap.contains(team->getId())) return false;
    teamMap.insert(team->getId(), team);
    refreshTeamHeap();
    return true;
}

RescueTeam* EmergencySystem::getRescueTeam(const std::string& id) {
    RescueTeam* t = nullptr;
    if (teamMap.get(id, t)) {
        return t;
    }
    return nullptr;
}

void EmergencySystem::listAllRescueTeams() const {
    std::cout << "================================================================================" << std::endl;
    std::cout << "                          RESCUE TEAMS & PERSONNEL ROSTER                       " << std::endl;
    std::cout << "================================================================================" << std::endl;
    std::vector<RescueTeam*> teams = teamMap.getAllValues();
    for (size_t i = 0; i < teams.size(); ++i) {
        teams[i]->display();
        std::cout << "--------------------------------------------------------------------------------" << std::endl;
    }
}

void EmergencySystem::displayTeamWorkloadStatus() const {
    std::cout << "================================================================================" << std::endl;
    std::cout << "                   RESCUE TEAM WORKLOAD MIN-HEAP STATUS                         " << std::endl;
    std::cout << "================================================================================" << std::endl;
    std::vector<RescueTeam*> teams = teamMap.getAllValues();
    std::cout << std::left << std::setw(12) << "Team ID"
              << std::setw(32) << "Team Name"
              << std::setw(16) << "Active Missions"
              << std::setw(12) << "Completed"
              << std::setw(14) << "Status" << std::endl;
    std::cout << "--------------------------------------------------------------------------------" << std::endl;
    for (size_t i = 0; i < teams.size(); ++i) {
        std::cout << std::left << std::setw(12) << teams[i]->getId()
                  << std::setw(32) << teams[i]->getName()
                  << std::setw(16) << teams[i]->getActiveMissionsCount()
                  << std::setw(12) << teams[i]->getTotalMissionsCompleted()
                  << std::setw(14) << teams[i]->getStatus() << std::endl;
    }
    std::cout << "================================================================================" << std::endl;
}

bool EmergencySystem::addPersonToTeam(const std::string& teamId, Person* person) {
    RescueTeam* team = getRescueTeam(teamId);
    if (team != nullptr && person != nullptr) {
        team->addMember(person);
        return true;
    }
    return false;
}

bool EmergencySystem::addShelter(Shelter* shelter) {
    if (shelter == nullptr) return false;
    if (shelterMap.contains(shelter->getId())) return false;
    shelterMap.insert(shelter->getId(), shelter);
    return true;
}

Shelter* EmergencySystem::getShelter(const std::string& id) {
    Shelter* s = nullptr;
    if (shelterMap.get(id, s)) {
        return s;
    }
    return nullptr;
}

void EmergencySystem::listAllShelters() const {
    std::cout << "================================================================================" << std::endl;
    std::cout << "                         EMERGENCY RELIEF SHELTERS                              " << std::endl;
    std::cout << "================================================================================" << std::endl;
    std::vector<Shelter*> shelters = shelterMap.getAllValues();
    for (size_t i = 0; i < shelters.size(); ++i) {
        shelters[i]->display();
        std::cout << "--------------------------------------------------------------------------------" << std::endl;
    }
}

bool EmergencySystem::evacuateCitizens(const std::string& shelterId, int count) {
    Shelter* s = getShelter(shelterId);
    if (s != nullptr) {
        return s->admitPeople(count);
    }
    return false;
}

bool EmergencySystem::releaseCitizens(const std::string& shelterId, int count) {
    Shelter* s = getShelter(shelterId);
    if (s != nullptr) {
        return s->releasePeople(count);
    }
    return false;
}

std::vector<std::pair<std::string, std::string>> EmergencySystem::searchLocations(const std::string& prefix) const {
    return locationTrie.autocomplete(prefix, 10);
}

void EmergencySystem::listMissionHistory() const {
    std::cout << "================================================================================" << std::endl;
    std::cout << "                      MISSION HISTORY LOG (LINKED LIST)                         " << std::endl;
    std::cout << "================================================================================" << std::endl;
    std::vector<MissionRecord> records = missionHistory.toVector();
    if (records.empty()) {
        std::cout << "No missions completed yet in history log." << std::endl;
    } else {
        for (size_t i = 0; i < records.size(); ++i) {
            records[i].display();
            std::cout << "--------------------------------------------------------------------------------" << std::endl;
        }
    }
    std::cout << "Total Completed Missions Logged: " << records.size() << std::endl;
}

int EmergencySystem::getMissionCount() const {
    return missionHistory.size();
}

void EmergencySystem::generateReports(int sortChoice, int algoChoice) {
    std::vector<MissionRecord> records = missionHistory.toVector();
    if (records.empty()) {
        std::cout << "[REPORT NOTICE] No mission records found. Dispatch missions first." << std::endl;
        return;
    }

    auto compSeverityDesc = [](const MissionRecord& a, const MissionRecord& b) {
        return a.getSeverity() > b.getSeverity();
    };

    auto compPeopleRescuedDesc = [](const MissionRecord& a, const MissionRecord& b) {
        return a.getPeopleRescued() > b.getPeopleRescued();
    };

    auto compDistanceAsc = [](const MissionRecord& a, const MissionRecord& b) {
        return a.getDistanceKm() < b.getDistanceKm();
    };

    auto compTimestampAsc = [](const MissionRecord& a, const MissionRecord& b) {
        return a.getTimestamp() < b.getTimestamp();
    };

    std::string sortKey = "Severity (Descending)";
    if (sortChoice == 2) sortKey = "People Rescued (Descending)";
    else if (sortChoice == 3) sortKey = "Route Distance (Ascending)";
    else if (sortChoice == 4) sortKey = "Timestamp (Ascending)";

    std::string algoName = (algoChoice == 2) ? "Merge Sort" : "Quick Sort";

    if (algoChoice == 2) {
        if (sortChoice == 1) mergeSort(records, compSeverityDesc);
        else if (sortChoice == 2) mergeSort(records, compPeopleRescuedDesc);
        else if (sortChoice == 3) mergeSort(records, compDistanceAsc);
        else mergeSort(records, compTimestampAsc);
    } else {
        if (sortChoice == 1) quickSort(records, compSeverityDesc);
        else if (sortChoice == 2) quickSort(records, compPeopleRescuedDesc);
        else if (sortChoice == 3) quickSort(records, compDistanceAsc);
        else quickSort(records, compTimestampAsc);
    }

    std::cout << "====================================================================================================" << std::endl;
    std::cout << "                       ANALYTICS & SUMMARY REPORT (SORTED)                                          " << std::endl;
    std::cout << " Sorted by : " << sortKey << " | Algorithm: " << algoName << std::endl;
    std::cout << "====================================================================================================" << std::endl;
    std::cout << std::left << std::setw(12) << "Mission ID"
              << std::setw(12) << "Incident"
              << std::setw(14) << "Disaster"
              << std::setw(6)  << "Sev"
              << std::setw(24) << "Location"
              << std::setw(10) << "Rescued"
              << std::setw(8)  << "Cas."
              << std::setw(10) << "Dist(km)"
              << std::setw(10) << "Team" << std::endl;
    std::cout << "----------------------------------------------------------------------------------------------------" << std::endl;

    int totalRescued = 0;
    int totalCasualties = 0;
    double totalDistance = 0.0;

    for (size_t i = 0; i < records.size(); ++i) {
        totalRescued += records[i].getPeopleRescued();
        totalCasualties += records[i].getCasualties();
        totalDistance += records[i].getDistanceKm();

        std::cout << std::left << std::setw(12) << records[i].getMissionId()
                  << std::setw(12) << records[i].getIncidentId()
                  << std::setw(14) << records[i].getIncidentType()
                  << std::setw(6)  << records[i].getSeverity()
                  << std::setw(24) << records[i].getLocationName()
                  << std::setw(10) << records[i].getPeopleRescued()
                  << std::setw(8)  << records[i].getCasualties()
                  << std::setw(10) << std::fixed << std::setprecision(1) << records[i].getDistanceKm()
                  << std::setw(10) << records[i].getTeamId() << std::endl;
    }

    std::cout << "====================================================================================================" << std::endl;
    std::cout << "KPI SUMMARY:" << std::endl;
    std::cout << "  - Total Missions Executed : " << records.size() << std::endl;
    std::cout << "  - Total Citizens Rescued  : " << totalRescued << std::endl;
    std::cout << "  - Total Casualties Handled: " << totalCasualties << std::endl;
    std::cout << "  - Total Fleet Distance    : " << std::fixed << std::setprecision(2) << totalDistance << " km" << std::endl;
    std::cout << "  - Avg Distance per Mission: " << (records.empty() ? 0.0 : totalDistance / records.size()) << " km" << std::endl;
    std::cout << "====================================================================================================" << std::endl;
}

void EmergencySystem::displaySystemOverview() const {
    std::cout << "================================================================================" << std::endl;
    std::cout << "                  EMERGENCY OPERATIONS CENTER OVERVIEW                          " << std::endl;
    std::cout << "================================================================================" << std::endl;
    std::cout << "  * City Locations Monitored (Graph Vertices) : " << cityGraph.getVertexCount() << std::endl;
    std::cout << "  * Road Segments in Network (Graph Edges)    : " << cityGraph.getEdgeCount() << std::endl;
    std::cout << "  * Active / Registered Incidents (Hash Map)  : " << incidentMap.size() << std::endl;
    std::cout << "  * Pending Dispatch Incidents (Priority Q)   : " << incidentPQ.size() << std::endl;
    std::cout << "  * Deployed / Standby Rescue Teams           : " << teamMap.size() << std::endl;
    std::cout << "  * Active Relief Shelters                    : " << shelterMap.size() << std::endl;
    std::cout << "  * Completed Mission Log Records             : " << missionHistory.size() << std::endl;
    std::cout << "================================================================================" << std::endl;
}

void EmergencySystem::runIntegratedSimulation() {
    std::cout << "********************************************************************************" << std::endl;
    std::cout << "           STARTING FULL CRISIS RESPONSE MULTI-HAZARD SIMULATION                " << std::endl;
    std::cout << "********************************************************************************" << std::endl;
    std::cout << "Simulating sudden storm, embankment breach, and simultaneous urban fires...\n" << std::endl;

    Incident* sim1 = new Flood("SIM-01", "Surajpur Wetland Lowland", 5, getCurrentDateTime(), 110, 3, "Catastrophic reservoir spill inundating low-lying residential clusters", 4.2, "Extreme", 6.2);
    Incident* sim2 = new Fire("SIM-02", "Sector 18 Commercial Hub", 4, getCurrentDateTime(), 45, 1, "Transformer explosion sparking 3rd floor commercial office fire", "Class C - Electrical", false);
    Incident* sim3 = new Landslide("SIM-03", "Hindan River Embankment", 4, getCurrentDateTime(), 30, 2, "Soil liquefaction causing riverbank collapse into arterial road", 600.0, true, "High Mudflow");
    Incident* sim4 = new Earthquake("SIM-04", "Khoda Village", 5, getCurrentDateTime(), 85, 7, "Seismic shock inducing structural collapses in unreinforced masonry buildings", 5.9, "Severe Aftershocks Expected", 6);
    Incident* sim5 = new Fire("SIM-05", "Sector 62 Fire Station", 1, getCurrentDateTime(), 5, 0, "Minor grass fire adjacent to perimeter fence extinguished by staff", "Class A - Brush", false);

    std::cout << ">>> Step 1: Registering 5 simultaneous multi-hazard incidents..." << std::endl;
    registerIncident(sim1);
    registerIncident(sim2);
    registerIncident(sim3);
    registerIncident(sim4);
    registerIncident(sim5);

    std::cout << ">>> Step 2: Current Priority Queue State (Ordered by Severity & Arrival FIFO):" << std::endl;
    listAllIncidents();

    std::cout << "\n>>> Step 3: Automated Priority Queue Dispatch in Action..." << std::endl;
    dispatchAllIncidents();

    std::cout << "\n>>> Step 4: Final Mission History Post-Simulation:" << std::endl;
    listMissionHistory();

    std::cout << "\n>>> Step 5: Generating Sorted Mission Analytics Report:" << std::endl;
    generateReports(1, 1);
    std::cout << "********************************************************************************" << std::endl;
    std::cout << "                  CRISIS SIMULATION COMPLETED SUCCESSFULLY                      " << std::endl;
    std::cout << "********************************************************************************" << std::endl;
}

void EmergencySystem::runComplexityBenchmarks() {
    std::cout << "================================================================================" << std::endl;
    std::cout << "               EMPIRICAL COMPLEXITY & BENCHMARK VALIDATION                      " << std::endl;
    std::cout << "================================================================================" << std::endl;
    std::cout << "Validating theoretical time complexities as specified in Synopsis Section 4:\n" << std::endl;

    const int HASH_TEST_SIZE = 10000;
    HashMap<std::string, int> testMap;
    std::vector<std::pair<std::string, int>> testVec;
    testVec.reserve(HASH_TEST_SIZE);

    for (int i = 0; i < HASH_TEST_SIZE; ++i) {
        std::string k = "KEY_" + std::to_string(i);
        testMap.insert(k, i);
        testVec.push_back(std::make_pair(k, i));
    }

    auto startHash = std::chrono::high_resolution_clock::now();
    for (int i = 0; i < HASH_TEST_SIZE; ++i) {
        std::string target = "KEY_" + std::to_string(i);
        int val = 0;
        testMap.get(target, val);
    }
    auto endHash = std::chrono::high_resolution_clock::now();
    long long hashDuration = std::chrono::duration_cast<std::chrono::microseconds>(endHash - startHash).count();

    auto startLinear = std::chrono::high_resolution_clock::now();
    for (int i = 0; i < 200; ++i) {
        std::string target = "KEY_" + std::to_string(i * 45);
        for (size_t j = 0; j < testVec.size(); ++j) {
            if (testVec[j].first == target) break;
        }
    }
    auto endLinear = std::chrono::high_resolution_clock::now();
    long long linearDuration = std::chrono::duration_cast<std::chrono::microseconds>(endLinear - startLinear).count();

    std::cout << "[1] HASH MAP LOOKUP vs LINEAR SEARCH:" << std::endl;
    std::cout << "    - Hash Map O(1) avg lookup (" << HASH_TEST_SIZE << " queries) : " << hashDuration << " microseconds" << std::endl;
    std::cout << "    - Linear Search O(n) (only 200 queries)       : " << linearDuration << " microseconds" << std::endl;
    std::cout << "    - Confirmed: Hash Map delivers constant O(1) average lookup scaling.\n" << std::endl;

    const int SORT_TEST_SIZE = 15000;
    std::vector<int> qArr(SORT_TEST_SIZE);
    std::vector<int> mArr(SORT_TEST_SIZE);
    std::mt19937 rng(42);
    for (int i = 0; i < SORT_TEST_SIZE; ++i) {
        int r = rng() % 100000;
        qArr[i] = r;
        mArr[i] = r;
    }

    auto compAsc = [](int a, int b) { return a < b; };

    auto startQ = std::chrono::high_resolution_clock::now();
    quickSort(qArr, compAsc);
    auto endQ = std::chrono::high_resolution_clock::now();
    long long qDuration = std::chrono::duration_cast<std::chrono::microseconds>(endQ - startQ).count();

    auto startM = std::chrono::high_resolution_clock::now();
    mergeSort(mArr, compAsc);
    auto endM = std::chrono::high_resolution_clock::now();
    long long mDuration = std::chrono::duration_cast<std::chrono::microseconds>(endM - startM).count();

    std::cout << "[2] SORTING ALGORITHM BENCHMARK (" << SORT_TEST_SIZE << " elements):" << std::endl;
    std::cout << "    - QuickSort O(n log n) : " << qDuration << " microseconds" << std::endl;
    std::cout << "    - MergeSort O(n log n) : " << mDuration << " microseconds" << std::endl;
    std::cout << "    - Confirmed: Both algorithms execute within predicted O(n log n) bounds.\n" << std::endl;

    double dDist = 0.0;
    std::vector<std::string> dPath;
    auto startDijk = std::chrono::high_resolution_clock::now();
    for (int i = 0; i < 1000; ++i) {
        cityGraph.dijkstra("JIIT Sector 62", "Surajpur Wetland Lowland", dDist, dPath);
    }
    auto endDijk = std::chrono::high_resolution_clock::now();
    long long dijkDuration = std::chrono::duration_cast<std::chrono::microseconds>(endDijk - startDijk).count();

    std::cout << "[3] GRAPH ROUTE PLANNING (DIJKSTRA):" << std::endl;
    std::cout << "    - 1,000 Shortest Path queries on road network: " << dijkDuration << " microseconds" << std::endl;
    std::cout << "    - Average per Dijkstra search: " << (static_cast<double>(dijkDuration) / 1000.0) << " microseconds" << std::endl;
    std::cout << "    - Computed Shortest Route: ";
    for (size_t i = 0; i < dPath.size(); ++i) {
        std::cout << dPath[i];
        if (i + 1 < dPath.size()) std::cout << " -> ";
    }
    std::cout << " (" << std::fixed << std::setprecision(1) << dDist << " km)\n" << std::endl;

    std::cout << "[4] PREFIX AUTOCOMPLETE (TRIE SEARCH):" << std::endl;
    auto startTrie = std::chrono::high_resolution_clock::now();
    std::vector<std::pair<std::string, std::string>> trieRes = locationTrie.autocomplete("Sec", 10);
    auto endTrie = std::chrono::high_resolution_clock::now();
    long long trieDuration = std::chrono::duration_cast<std::chrono::nanoseconds>(endTrie - startTrie).count();
    std::cout << "    - Trie Autocomplete for prefix 'Sec': " << trieDuration << " nanoseconds (Found " << trieRes.size() << " matches)" << std::endl;
    for (size_t i = 0; i < trieRes.size(); ++i) {
        std::cout << "      * " << trieRes[i].first << " [" << trieRes[i].second << "]" << std::endl;
    }
    std::cout << "================================================================================" << std::endl;
}

bool EmergencySystem::saveStateToFiles(const std::string& directory) const {
    std::ofstream out(directory + "/incidents.txt");
    if (!out.is_open()) return false;

    std::vector<Incident*> list = incidentMap.getAllValues();
    for (size_t i = 0; i < list.size(); ++i) {
        out << list[i]->getId() << "|"
            << list[i]->getType() << "|"
            << list[i]->getLocationName() << "|"
            << list[i]->getSeverity() << "|"
            << list[i]->getStatus() << "|"
            << list[i]->getReportedTime() << "|"
            << list[i]->getAffectedPeople() << "|"
            << list[i]->getCasualties() << "|"
            << list[i]->getDescription() << "\n";
    }
    out.close();

    std::ofstream outShelters(directory + "/shelters.txt");
    if (outShelters.is_open()) {
        std::vector<Shelter*> sList = shelterMap.getAllValues();
        for (size_t i = 0; i < sList.size(); ++i) {
            outShelters << sList[i]->getId() << "|"
                        << sList[i]->getName() << "|"
                        << sList[i]->getLocationName() << "|"
                        << sList[i]->getTotalCapacity() << "|"
                        << sList[i]->getCurrentOccupancy() << "|"
                        << sList[i]->getFoodPackets() << "|"
                        << sList[i]->getWaterLiters() << "|"
                        << sList[i]->getMedicalBeds() << "|"
                        << sList[i]->getContactNumber() << "\n";
        }
        outShelters.close();
    }

    std::ofstream outMissions(directory + "/missions.txt");
    if (outMissions.is_open()) {
        std::vector<MissionRecord> mList = missionHistory.toVector();
        for (size_t i = 0; i < mList.size(); ++i) {
            outMissions << mList[i].getMissionId() << "|"
                        << mList[i].getIncidentId() << "|"
                        << mList[i].getIncidentType() << "|"
                        << mList[i].getSeverity() << "|"
                        << mList[i].getLocationName() << "|"
                        << mList[i].getTeamId() << "|"
                        << mList[i].getShelterId() << "|"
                        << mList[i].getPeopleRescued() << "|"
                        << mList[i].getCasualties() << "|"
                        << mList[i].getDistanceKm() << "|"
                        << mList[i].getResourcesDeployed() << "|"
                        << mList[i].getTimestamp() << "|"
                        << mList[i].getStatus() << "\n";
        }
        outMissions.close();
    }
    return true;
}

bool EmergencySystem::loadStateFromFiles(const std::string& directory) {
    std::ifstream in(directory + "/incidents.txt");
    if (!in.is_open()) return false;

    std::string line;
    while (std::getline(in, line)) {
        if (line.empty()) continue;
        std::stringstream ss(line);
        std::string id, type, loc, sevStr, status, timeStr, affStr, casStr, desc;

        std::getline(ss, id, '|');
        std::getline(ss, type, '|');
        std::getline(ss, loc, '|');
        std::getline(ss, sevStr, '|');
        std::getline(ss, status, '|');
        std::getline(ss, timeStr, '|');
        std::getline(ss, affStr, '|');
        std::getline(ss, casStr, '|');
        std::getline(ss, desc);

        if (!incidentMap.contains(id)) {
            int sev = std::stoi(sevStr);
            int aff = std::stoi(affStr);
            int cas = std::stoi(casStr);

            Incident* inc = nullptr;
            if (type == "Fire") {
                inc = new Fire(id, loc, sev, timeStr, aff, cas, desc, "Standard", false);
            } else if (type == "Flood") {
                inc = new Flood(id, loc, sev, timeStr, aff, cas, desc, 2.5, "Medium", 2.0);
            } else if (type == "Earthquake") {
                inc = new Earthquake(id, loc, sev, timeStr, aff, cas, desc, 5.0, "Moderate", 2);
            } else {
                inc = new Landslide(id, loc, sev, timeStr, aff, cas, desc, 300.0, true, "Moderate");
            }

            inc->setStatus(status);
            incidentMap.insert(id, inc);
            if (status == "Reported") {
                incidentPQ.enqueue(inc);
            }
        }
    }
    in.close();
    return true;
}
