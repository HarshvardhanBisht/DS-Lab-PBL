#include "../include/RescueTeam.h"
#include <iomanip>

RescueTeam::RescueTeam(const std::string& id, const std::string& name, const std::string& specialty,
                       const std::string& baseLocation, const std::string& status)
    : id(id), name(name), specialty(specialty), baseLocation(baseLocation),
      status(status), activeMissionsCount(0), totalMissionsCompleted(0) {}

RescueTeam::~RescueTeam() {
    for (size_t i = 0; i < members.size(); ++i) {
        delete members[i];
    }
    members.clear();
}

std::string RescueTeam::getId() const {
    return id;
}

std::string RescueTeam::getName() const {
    return name;
}

std::string RescueTeam::getSpecialty() const {
    return specialty;
}

std::string RescueTeam::getBaseLocation() const {
    return baseLocation;
}

std::string RescueTeam::getStatus() const {
    return status;
}

int RescueTeam::getActiveMissionsCount() const {
    return activeMissionsCount;
}

int RescueTeam::getTotalMissionsCompleted() const {
    return totalMissionsCompleted;
}

const std::vector<Person*>& RescueTeam::getMembers() const {
    return members;
}

const std::vector<std::pair<std::string, int>>& RescueTeam::getEquipment() const {
    return equipment;
}

void RescueTeam::setStatus(const std::string& newStatus) {
    status = newStatus;
}

void RescueTeam::setBaseLocation(const std::string& location) {
    baseLocation = location;
}

void RescueTeam::addMember(Person* person) {
    if (person != nullptr) {
        members.push_back(person);
    }
}

void RescueTeam::addEquipment(const std::string& item, int quantity) {
    for (size_t i = 0; i < equipment.size(); ++i) {
        if (equipment[i].first == item) {
            equipment[i].second += quantity;
            return;
        }
    }
    equipment.push_back(std::make_pair(item, quantity));
}

bool RescueTeam::useEquipment(const std::string& item, int quantity) {
    for (size_t i = 0; i < equipment.size(); ++i) {
        if (equipment[i].first == item) {
            if (equipment[i].second >= quantity) {
                equipment[i].second -= quantity;
                return true;
            }
            return false;
        }
    }
    return false;
}

void RescueTeam::returnEquipment(const std::string& item, int quantity) {
    addEquipment(item, quantity);
}

void RescueTeam::deploy() {
    activeMissionsCount++;
    status = "Deployed";
}

void RescueTeam::completeMission() {
    if (activeMissionsCount > 0) {
        activeMissionsCount--;
    }
    totalMissionsCompleted++;
    if (activeMissionsCount == 0) {
        status = "Available";
    }
}

void RescueTeam::display() const {
    std::cout << "Team ID: [" << id << "] | Name: " << name
              << " | Specialty: " << specialty << std::endl;
    std::cout << "  Base: " << baseLocation << " | Status: " << status
              << " | Active Missions: " << activeMissionsCount
              << " | Completed: " << totalMissionsCompleted << std::endl;
    std::cout << "  Members (" << members.size() << "):" << std::endl;
    for (size_t i = 0; i < members.size(); ++i) {
        std::cout << "    ";
        members[i]->displayDetails();
    }
    std::cout << "  Equipment Inventory:" << std::endl;
    for (size_t i = 0; i < equipment.size(); ++i) {
        std::cout << "    - " << equipment[i].first << ": " << equipment[i].second << std::endl;
    }
}
