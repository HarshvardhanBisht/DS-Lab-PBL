#ifndef SHELTER_H
#define SHELTER_H

#include <string>
#include <iostream>

class Shelter {
private:
    std::string id;
    std::string name;
    std::string locationName;
    int totalCapacity;
    int currentOccupancy;
    int foodPackets;
    int waterLiters;
    int medicalBeds;
    std::string contactNumber;

public:
    Shelter(const std::string& id, const std::string& name, const std::string& locationName,
            int totalCapacity, int currentOccupancy, int foodPackets, int waterLiters,
            int medicalBeds, const std::string& contactNumber);

    std::string getId() const;
    std::string getName() const;
    std::string getLocationName() const;
    int getTotalCapacity() const;
    int getCurrentOccupancy() const;
    int getAvailableCapacity() const;
    int getFoodPackets() const;
    int getWaterLiters() const;
    int getMedicalBeds() const;
    std::string getContactNumber() const;

    bool hasCapacity(int people) const;
    bool admitPeople(int count);
    bool releasePeople(int count);
    void addSupplies(int food, int water);
    bool consumeSupplies(int food, int water);

    void display() const;
};

#endif
