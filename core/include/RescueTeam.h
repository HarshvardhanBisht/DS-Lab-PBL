#ifndef RESCUETEAM_H
#define RESCUETEAM_H

#include <string>
#include <vector>
#include <utility>
#include "Person.h"

/**
 * RescueTeam Class
 * Encapsulates response units with specialized equipment and personnel.
 * Space Complexity: O(M + E) where M is members and E is equipment items.
 */
class RescueTeam {
private:
    std::string id;
    std::string name;
    std::string specialty;
    std::string baseLocation;
    std::string status;
    int activeMissionsCount;
    int totalMissionsCompleted;
    std::vector<Person*> members;
    std::vector<std::pair<std::string, int>> equipment;

public:
    RescueTeam(const std::string& id, const std::string& name, const std::string& specialty,
               const std::string& baseLocation, const std::string& status = "Available")
        : id(id), name(name), specialty(specialty), baseLocation(baseLocation),
          status(status), activeMissionsCount(0), totalMissionsCompleted(0) {}

    ~RescueTeam() {
        for (Person* p : members) {
            delete p;
        }
        members.clear();
    }

    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getSpecialty() const { return specialty; }
    std::string getBaseLocation() const { return baseLocation; }
    std::string getStatus() const { return status; }
    int getActiveMissionsCount() const { return activeMissionsCount; }
    int getTotalMissionsCompleted() const { return totalMissionsCompleted; }
    const std::vector<Person*>& getMembers() const { return members; }
    const std::vector<std::pair<std::string, int>>& getEquipment() const { return equipment; }

    void setStatus(const std::string& s) { status = s; }
    void setBaseLocation(const std::string& loc) { baseLocation = loc; }

    void addMember(Person* p) {
        if (p) members.push_back(p);
    }

    void addEquipment(const std::string& item, int qty) {
        for (auto& eq : equipment) {
            if (eq.first == item) {
                eq.second += qty;
                return;
            }
        }
        equipment.push_back({item, qty});
    }

    void deploy() {
        activeMissionsCount++;
        status = "Deployed";
    }

    void completeMission() {
        if (activeMissionsCount > 0) activeMissionsCount--;
        totalMissionsCompleted++;
        if (activeMissionsCount == 0) status = "Available";
    }
};

#endif
