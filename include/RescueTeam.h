#ifndef RESCUETEAM_H
#define RESCUETEAM_H

#include <string>
#include <vector>
#include <utility>
#include <iostream>
#include "Person.h"

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
               const std::string& baseLocation, const std::string& status = "Available");
    ~RescueTeam();

    std::string getId() const;
    std::string getName() const;
    std::string getSpecialty() const;
    std::string getBaseLocation() const;
    std::string getStatus() const;
    int getActiveMissionsCount() const;
    int getTotalMissionsCompleted() const;
    const std::vector<Person*>& getMembers() const;
    const std::vector<std::pair<std::string, int>>& getEquipment() const;

    void setStatus(const std::string& newStatus);
    void setBaseLocation(const std::string& location);
    void addMember(Person* person);
    void addEquipment(const std::string& item, int quantity);
    bool useEquipment(const std::string& item, int quantity);
    void returnEquipment(const std::string& item, int quantity);

    void deploy();
    void completeMission();
    void display() const;
};

#endif
