#include <iostream>
#include <string>
#include <limits>
#include "../include/EmergencySystem.h"

void displayBanner() {
    std::cout << "\n";
    std::cout << "====================================================================================================" << std::endl;
    std::cout << "                 JAYPEE INSTITUTE OF INFORMATION TECHNOLOGY, NOIDA                                  " << std::endl;
    std::cout << "                    DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING                                    " << std::endl;
    std::cout << "                                   DATA STRUCTURES LAB PBL                                  " << std::endl;
    std::cout << "====================================================================================================" << std::endl;
}

void printMenu() {
    std::cout << "\n============================== EMERGENCY CONTROL CENTER MENU ==============================" << std::endl;
    std::cout << " [1]  Incident Management (Register, View, Update, Close)" << std::endl;
    std::cout << " [2]  Emergency Dispatch (Highest Priority / Batch Dispatch - Priority Queue + FIFO)" << std::endl;
    std::cout << " [3]  City Road Network & Route Planner (Weighted Graph, Dijkstra, BFS, DFS)" << std::endl;
    std::cout << " [4]  Rescue Teams & Personnel Roster (Polymorphic Personnel, Min-Heap Workload)" << std::endl;
    std::cout << " [5]  Relief Shelters & Evacuation Management (Capacities, Occupancy, Supplies)" << std::endl;
    std::cout << " [6]  Location Prefix Autocomplete Search (Trie Data Structure)" << std::endl;
    std::cout << " [7]  Mission History Log & Audit Trail (Dynamic Linked List)" << std::endl;
    std::cout << " [8]  Analytics & Summary Reports (QuickSort & MergeSort on Missions)" << std::endl;
    std::cout << " [9]  Run Full Multi-Hazard Crisis Simulation (End-to-End DSA Workflow)" << std::endl;
    std::cout << " [10] Run Empirical Complexity & Performance Benchmarks (Empirical Verification)" << std::endl;
    std::cout << " [11] System Operations Overview & Key Metrics" << std::endl;
    std::cout << " [12] Save / Load System State (File Persistence)" << std::endl;
    std::cout << " [0]  Exit System" << std::endl;
    std::cout << "===========================================================================================" << std::endl;
    std::cout << "Enter Choice (0-12): ";
}

void clearInputBuffer() {
    std::cin.clear();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

void handleIncidentManagement(EmergencySystem& sys) {
    std::cout << "\n--- INCIDENT MANAGEMENT SUBMENU ---" << std::endl;
    std::cout << " 1. Register New Incident (Fire / Flood / Earthquake / Landslide)" << std::endl;
    std::cout << " 2. Search Incident by ID (O(1) Hash Map Lookup)" << std::endl;
    std::cout << " 3. List All Incidents" << std::endl;
    std::cout << " 4. Update Incident Severity" << std::endl;
    std::cout << " 5. Close Incident" << std::endl;
    std::cout << "Enter Sub-choice (1-5): ";

    int sub;
    if (!(std::cin >> sub)) {
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    if (sub == 1) {
        std::cout << "\nSelect Disaster Type:" << std::endl;
        std::cout << " 1. Fire\n 2. Flood\n 3. Earthquake\n 4. Landslide\nChoice: ";
        int dType;
        std::cin >> dType;
        clearInputBuffer();

        std::string id, loc, desc, timeStr = "2026-11-14 00:00:00";
        int sev, aff, cas;

        std::cout << "Enter Incident ID (e.g. INC-201): ";
        std::getline(std::cin, id);
        std::cout << "Enter Location Name: ";
        std::getline(std::cin, loc);
        std::cout << "Enter Severity (1 to 5): ";
        std::cin >> sev;
        std::cout << "Enter Affected People Count: ";
        std::cin >> aff;
        std::cout << "Enter Casualties Count: ";
        std::cin >> cas;
        clearInputBuffer();
        std::cout << "Enter Description: ";
        std::getline(std::cin, desc);

        Incident* newInc = nullptr;
        if (dType == 1) {
            std::string intensity;
            char hazChar;
            std::cout << "Enter Fire Intensity (e.g. Class A - Structural): ";
            std::getline(std::cin, intensity);
            std::cout << "Hazardous Materials Present? (y/n): ";
            std::cin >> hazChar;
            clearInputBuffer();
            newInc = new Fire(id, loc, sev, timeStr, aff, cas, desc, intensity, (hazChar == 'y' || hazChar == 'Y'));
        } else if (dType == 2) {
            double waterLvl, area;
            std::string flow;
            std::cout << "Enter Water Level (meters): ";
            std::cin >> waterLvl;
            clearInputBuffer();
            std::cout << "Enter Flow Rate (e.g. High / Torrential): ";
            std::getline(std::cin, flow);
            std::cout << "Enter Inundated Area (sq km): ";
            std::cin >> area;
            clearInputBuffer();
            newInc = new Flood(id, loc, sev, timeStr, aff, cas, desc, waterLvl, flow, area);
        } else if (dType == 3) {
            double mag;
            int structures;
            std::string aftershock;
            std::cout << "Enter Richter Magnitude: ";
            std::cin >> mag;
            clearInputBuffer();
            std::cout << "Enter Aftershock Risk: ";
            std::getline(std::cin, aftershock);
            std::cout << "Enter Collapsed Structures Count: ";
            std::cin >> structures;
            clearInputBuffer();
            newInc = new Earthquake(id, loc, sev, timeStr, aff, cas, desc, mag, aftershock, structures);
        } else {
            double debris;
            char blockedChar;
            std::string mudflow;
            std::cout << "Enter Debris Volume (cubic meters): ";
            std::cin >> debris;
            std::cout << "Road Blocked? (y/n): ";
            std::cin >> blockedChar;
            clearInputBuffer();
            std::cout << "Enter Mudflow Risk: ";
            std::getline(std::cin, mudflow);
            newInc = new Landslide(id, loc, sev, timeStr, aff, cas, desc, debris, (blockedChar == 'y' || blockedChar == 'Y'), mudflow);
        }

        if (sys.registerIncident(newInc)) {
            std::cout << "[SUCCESS] Incident registered and placed into Priority Queue." << std::endl;
        } else {
            std::cout << "[ERROR] Failed to register incident (Duplicate ID)." << std::endl;
            delete newInc;
        }
    } else if (sub == 2) {
        std::cout << "Enter Incident ID to Search: ";
        std::string id;
        std::getline(std::cin, id);
        Incident* inc = sys.getIncident(id);
        if (inc != nullptr) {
            std::cout << "\n--- INCIDENT RECORD FOUND (O(1) Hash Map) ---" << std::endl;
            inc->displayDetails();
        } else {
            std::cout << "[NOT FOUND] No incident with ID: " << id << std::endl;
        }
    } else if (sub == 3) {
        sys.listAllIncidents();
    } else if (sub == 4) {
        std::cout << "Enter Incident ID: ";
        std::string id;
        std::getline(std::cin, id);
        std::cout << "Enter New Severity (1-5): ";
        int s;
        std::cin >> s;
        clearInputBuffer();
        if (sys.updateIncidentSeverity(id, s)) {
            std::cout << "[SUCCESS] Incident severity updated and resources re-allocated." << std::endl;
        } else {
            std::cout << "[ERROR] Incident ID not found." << std::endl;
        }
    } else if (sub == 5) {
        std::cout << "Enter Incident ID to Close: ";
        std::string id;
        std::getline(std::cin, id);
        if (sys.closeIncident(id)) {
            std::cout << "[SUCCESS] Incident status updated to Closed." << std::endl;
        } else {
            std::cout << "[ERROR] Incident ID not found." << std::endl;
        }
    }
}

void handleEmergencyDispatch(EmergencySystem& sys) {
    std::cout << "\n--- EMERGENCY DISPATCH SUBMENU ---" << std::endl;
    std::cout << " 1. Dispatch Next Highest-Severity Incident (Max-Heap + FIFO)" << std::endl;
    std::cout << " 2. Batch Dispatch All Waiting Incidents" << std::endl;
    std::cout << "Enter Choice (1-2): ";
    int ch;
    if (!(std::cin >> ch)) {
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    if (ch == 1) {
        sys.dispatchNextIncident();
    } else if (ch == 2) {
        sys.dispatchAllIncidents();
    }
}

void handleRoutePlanner(EmergencySystem& sys) {
    std::cout << "\n--- CITY ROAD NETWORK & ROUTE PLANNER SUBMENU ---" << std::endl;
    std::cout << " 1. Display City Road Network Topology (Weighted Graph)" << std::endl;
    std::cout << " 2. Compute Shortest Path via Dijkstra's Algorithm (Distance)" << std::endl;
    std::cout << " 3. Compute Fastest Route via Dijkstra's Algorithm (Travel Time)" << std::endl;
    std::cout << " 4. Network Reachability & Traversal Check via DFS" << std::endl;
    std::cout << " 5. Shortest Hop Traversal via BFS" << std::endl;
    std::cout << "Enter Choice (1-5): ";
    int ch;
    if (!(std::cin >> ch)) {
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    if (ch == 1) {
        sys.displayCityMap();
    } else if (ch == 2) {
        std::cout << "Enter Source Location: ";
        std::string src;
        std::getline(std::cin, src);
        std::cout << "Enter Destination Location: ";
        std::string dest;
        std::getline(std::cin, dest);

        double dist = 0.0;
        std::vector<std::string> path;
        if (sys.planShortestRoute(src, dest, dist, path)) {
            std::cout << "\n[DIJKSTRA SHORTEST PATH FOUND]" << std::endl;
            std::cout << "Total Distance: " << dist << " km" << std::endl;
            std::cout << "Route: ";
            for (size_t i = 0; i < path.size(); ++i) {
                std::cout << path[i];
                if (i + 1 < path.size()) std::cout << " -> ";
            }
            std::cout << std::endl;
        } else {
            std::cout << "[ERROR] Path not found or invalid location names." << std::endl;
        }
    } else if (ch == 3) {
        std::cout << "Enter Source Location: ";
        std::string src;
        std::getline(std::cin, src);
        std::cout << "Enter Destination Location: ";
        std::string dest;
        std::getline(std::cin, dest);

        double timeMins = 0.0;
        std::vector<std::string> path;
        if (sys.planFastestRoute(src, dest, timeMins, path)) {
            std::cout << "\n[DIJKSTRA FASTEST PATH FOUND]" << std::endl;
            std::cout << "Estimated Travel Time: " << timeMins << " minutes" << std::endl;
            std::cout << "Route: ";
            for (size_t i = 0; i < path.size(); ++i) {
                std::cout << path[i];
                if (i + 1 < path.size()) std::cout << " -> ";
            }
            std::cout << std::endl;
        } else {
            std::cout << "[ERROR] Path not found or invalid location names." << std::endl;
        }
    } else if (ch == 4) {
        std::cout << "Enter Starting Location for DFS Traversal: ";
        std::string src;
        std::getline(std::cin, src);
        std::vector<std::string> order = sys.getConnectedLocationsDFS(src);
        if (order.empty()) {
            std::cout << "[ERROR] Invalid location name." << std::endl;
        } else {
            std::cout << "\n[DFS REACHABLE NODES (" << order.size() << " locations)]:" << std::endl;
            for (size_t i = 0; i < order.size(); ++i) {
                std::cout << "  " << (i + 1) << ". " << order[i] << std::endl;
            }
        }
    } else if (ch == 5) {
        std::cout << "Enter Starting Location for BFS Traversal: ";
        std::string src;
        std::getline(std::cin, src);
        std::vector<std::string> order = sys.getReachableLocationsBFS(src);
        if (order.empty()) {
            std::cout << "[ERROR] Invalid location name." << std::endl;
        } else {
            std::cout << "\n[BFS LEVEL-BY-LEVEL DISCOVERY (" << order.size() << " locations)]:" << std::endl;
            for (size_t i = 0; i < order.size(); ++i) {
                std::cout << "  " << (i + 1) << ". " << order[i] << std::endl;
            }
        }
    }
}

void handleRescueTeams(EmergencySystem& sys) {
    std::cout << "\n--- RESCUE TEAMS & PERSONNEL SUBMENU ---" << std::endl;
    std::cout << " 1. List All Rescue Teams & Personnel Roster" << std::endl;
    std::cout << " 2. View Team Workload Min-Heap Status" << std::endl;
    std::cout << " 3. Register New Personnel (Volunteer / Rescue Officer / Medical Officer)" << std::endl;
    std::cout << "Enter Choice (1-3): ";
    int ch;
    if (!(std::cin >> ch)) {
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    if (ch == 1) {
        sys.listAllRescueTeams();
    } else if (ch == 2) {
        sys.displayTeamWorkloadStatus();
    } else if (ch == 3) {
        std::cout << "Assign to which Team ID? (e.g. RT-01): ";
        std::string tId;
        std::getline(std::cin, tId);

        std::cout << "Select Personnel Role:\n 1. Volunteer\n 2. Rescue Officer\n 3. Medical Officer\nChoice: ";
        int role;
        std::cin >> role;
        clearInputBuffer();

        std::string id, name, phone, email;
        std::cout << "Enter Person ID: ";
        std::getline(std::cin, id);
        std::cout << "Enter Full Name: ";
        std::getline(std::cin, name);
        std::cout << "Enter Phone: ";
        std::getline(std::cin, phone);
        std::cout << "Enter Email: ";
        std::getline(std::cin, email);

        Person* p = nullptr;
        if (role == 1) {
            std::string skills;
            int hours;
            std::cout << "Enter Skills: ";
            std::getline(std::cin, skills);
            std::cout << "Enter Contributed Hours: ";
            std::cin >> hours;
            clearInputBuffer();
            p = new Volunteer(id, name, phone, email, skills, hours);
        } else if (role == 2) {
            std::string rank, cert;
            std::cout << "Enter Rank: ";
            std::getline(std::cin, rank);
            std::cout << "Enter Certification Level: ";
            std::getline(std::cin, cert);
            p = new RescueOfficer(id, name, phone, email, rank, cert);
        } else {
            std::string spec, lic;
            int exp;
            std::cout << "Enter Medical Specialty: ";
            std::getline(std::cin, spec);
            std::cout << "Enter Medical License Number: ";
            std::getline(std::cin, lic);
            std::cout << "Enter Triage Experience (Years): ";
            std::cin >> exp;
            clearInputBuffer();
            p = new MedicalOfficer(id, name, phone, email, spec, lic, exp);
        }

        if (sys.addPersonToTeam(tId, p)) {
            std::cout << "[SUCCESS] Person added to Rescue Team " << tId << "." << std::endl;
        } else {
            std::cout << "[ERROR] Invalid Team ID. Person registration aborted." << std::endl;
            delete p;
        }
    }
}

void handleShelters(EmergencySystem& sys) {
    std::cout << "\n--- RELIEF SHELTERS & EVACUATION SUBMENU ---" << std::endl;
    std::cout << " 1. List All Shelters (Capacities & Occupancy)" << std::endl;
    std::cout << " 2. Manual Evacuation Admission into Shelter" << std::endl;
    std::cout << " 3. Discharge Citizens from Shelter" << std::endl;
    std::cout << "Enter Choice (1-3): ";
    int ch;
    if (!(std::cin >> ch)) {
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    if (ch == 1) {
        sys.listAllShelters();
    } else if (ch == 2) {
        std::cout << "Enter Shelter ID (e.g. SH-01): ";
        std::string sId;
        std::getline(std::cin, sId);
        std::cout << "Enter Number of Citizens to Evacuate: ";
        int count;
        std::cin >> count;
        clearInputBuffer();
        if (sys.evacuateCitizens(sId, count)) {
            std::cout << "[SUCCESS] Evacuated " << count << " citizens into shelter." << std::endl;
        } else {
            std::cout << "[ERROR] Capacity exceeded or invalid Shelter ID." << std::endl;
        }
    } else if (ch == 3) {
        std::cout << "Enter Shelter ID: ";
        std::string sId;
        std::getline(std::cin, sId);
        std::cout << "Enter Number of Citizens to Discharge: ";
        int count;
        std::cin >> count;
        clearInputBuffer();
        if (sys.releaseCitizens(sId, count)) {
            std::cout << "[SUCCESS] Discharged " << count << " citizens from shelter." << std::endl;
        } else {
            std::cout << "[ERROR] Invalid Shelter ID." << std::endl;
        }
    }
}

void handleTrieSearch(EmergencySystem& sys) {
    std::cout << "\n--- LOCATION AUTOCOMPLETE SEARCH (TRIE) ---" << std::endl;
    std::cout << "Enter search prefix (e.g. 'Sec', 'JII', 'Jay', 'Hos'): ";
    std::string prefix;
    std::getline(std::cin, prefix);

    std::vector<std::pair<std::string, std::string>> matches = sys.searchLocations(prefix);
    if (matches.empty()) {
        std::cout << "[NO MATCHES] No locations found starting with '" << prefix << "'." << std::endl;
    } else {
        std::cout << "\n[AUTOCOMPLETE RESULTS (" << matches.size() << " found)]:" << std::endl;
        for (size_t i = 0; i < matches.size(); ++i) {
            std::cout << "  [" << (i + 1) << "] " << matches[i].first << " (" << matches[i].second << ")" << std::endl;
        }
    }
}

void handleReports(EmergencySystem& sys) {
    std::cout << "\n--- MISSION REPORTS & ANALYTICS SUBMENU ---" << std::endl;
    std::cout << "Sort Missions By:" << std::endl;
    std::cout << " 1. Severity (Highest First)\n 2. People Rescued (Highest First)\n 3. Route Distance (Shortest First)\n 4. Timestamp\nChoice (1-4): ";
    int sortChoice;
    std::cin >> sortChoice;
    clearInputBuffer();

    std::cout << "Select Sorting Algorithm:\n 1. QuickSort (Divide and Conquer)\n 2. MergeSort (Stable Divide and Conquer)\nChoice (1-2): ";
    int algoChoice;
    std::cin >> algoChoice;
    clearInputBuffer();

    sys.generateReports(sortChoice, algoChoice);
}

int main() {
    EmergencySystem sys;
    sys.initializeDefaultData();

    displayBanner();

    int choice = -1;
    while (choice != 0) {
        printMenu();
        if (!(std::cin >> choice)) {
            clearInputBuffer();
            choice = -1;
            continue;
        }
        clearInputBuffer();

        switch (choice) {
            case 1:
                handleIncidentManagement(sys);
                break;
            case 2:
                handleEmergencyDispatch(sys);
                break;
            case 3:
                handleRoutePlanner(sys);
                break;
            case 4:
                handleRescueTeams(sys);
                break;
            case 5:
                handleShelters(sys);
                break;
            case 6:
                handleTrieSearch(sys);
                break;
            case 7:
                sys.listMissionHistory();
                break;
            case 8:
                handleReports(sys);
                break;
            case 9:
                sys.runIntegratedSimulation();
                break;
            case 10:
                sys.runComplexityBenchmarks();
                break;
            case 11:
                sys.displaySystemOverview();
                break;
            case 12: {
                std::cout << "\n 1. Save State to 'data/' folder\n 2. Load State from 'data/' folder\nChoice: ";
                int fChoice;
                std::cin >> fChoice;
                clearInputBuffer();
                if (fChoice == 1) {
                    if (sys.saveStateToFiles("data")) {
                        std::cout << "[SUCCESS] State saved to data/ files." << std::endl;
                    } else {
                        std::cout << "[ERROR] Failed to save state." << std::endl;
                    }
                } else if (fChoice == 2) {
                    if (sys.loadStateFromFiles("data")) {
                        std::cout << "[SUCCESS] State loaded from data/ files." << std::endl;
                    } else {
                        std::cout << "[ERROR] Failed to load state." << std::endl;
                    }
                }
                break;
            }
            case 0:
                std::cout << "\n================================================================================" << std::endl;
                std::cout << "       Thank you for using JIIT Emergency Response Management System.           " << std::endl;
                std::cout << "================================================================================\n" << std::endl;
                break;
            default:
                std::cout << "[ERROR] Invalid option selected. Please choose between 0 and 12." << std::endl;
                break;
        }
    }

    return 0;
}
