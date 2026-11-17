#ifndef SHELTER_H
#define SHELTER_H

#include <string>

/**
 * Shelter Class
 * Models evacuation centers and humanitarian supply depots.
 * Space Complexity: O(1)
 */
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
            int medicalBeds, const std::string& contactNumber)
        : id(id), name(name), locationName(locationName), totalCapacity(totalCapacity),
          currentOccupancy(currentOccupancy), foodPackets(foodPackets), waterLiters(waterLiters),
          medicalBeds(medicalBeds), contactNumber(contactNumber) {}

    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getLocationName() const { return locationName; }
    int getTotalCapacity() const { return totalCapacity; }
    int getCurrentOccupancy() const { return currentOccupancy; }
    int getAvailableCapacity() const { return totalCapacity - currentOccupancy; }
    int getFoodPackets() const { return foodPackets; }
    int getWaterLiters() const { return waterLiters; }
    int getMedicalBeds() const { return medicalBeds; }
    std::string getContactNumber() const { return contactNumber; }

    bool hasCapacity(int count) const {
        return (currentOccupancy + count) <= totalCapacity;
    }

    bool admitPeople(int count) {
        if (currentOccupancy + count <= totalCapacity) {
            currentOccupancy += count;
            return true;
        }
        return false;
    }

    bool releasePeople(int count) {
        if (count <= currentOccupancy) {
            currentOccupancy -= count;
            return true;
        }
        currentOccupancy = 0;
        return true;
    }

    void addSupplies(int food, int water) {
        foodPackets += food;
        waterLiters += water;
    }

    bool consumeSupplies(int food, int water) {
        if (foodPackets >= food && waterLiters >= water) {
            foodPackets -= food;
            waterLiters -= water;
            return true;
        }
        return false;
    }
};

#endif
