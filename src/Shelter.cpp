#include "../include/Shelter.h"
#include <iomanip>

Shelter::Shelter(const std::string& id, const std::string& name, const std::string& locationName,
                 int totalCapacity, int currentOccupancy, int foodPackets, int waterLiters,
                 int medicalBeds, const std::string& contactNumber)
    : id(id), name(name), locationName(locationName), totalCapacity(totalCapacity),
      currentOccupancy(currentOccupancy), foodPackets(foodPackets), waterLiters(waterLiters),
      medicalBeds(medicalBeds), contactNumber(contactNumber) {}

std::string Shelter::getId() const {
    return id;
}

std::string Shelter::getName() const {
    return name;
}

std::string Shelter::getLocationName() const {
    return locationName;
}

int Shelter::getTotalCapacity() const {
    return totalCapacity;
}

int Shelter::getCurrentOccupancy() const {
    return currentOccupancy;
}

int Shelter::getAvailableCapacity() const {
    return totalCapacity - currentOccupancy;
}

int Shelter::getFoodPackets() const {
    return foodPackets;
}

int Shelter::getWaterLiters() const {
    return waterLiters;
}

int Shelter::getMedicalBeds() const {
    return medicalBeds;
}

std::string Shelter::getContactNumber() const {
    return contactNumber;
}

bool Shelter::hasCapacity(int people) const {
    return (currentOccupancy + people) <= totalCapacity;
}

bool Shelter::admitPeople(int count) {
    if (currentOccupancy + count <= totalCapacity) {
        currentOccupancy += count;
        return true;
    }
    return false;
}

bool Shelter::releasePeople(int count) {
    if (count <= currentOccupancy) {
        currentOccupancy -= count;
        return true;
    }
    currentOccupancy = 0;
    return true;
}

void Shelter::addSupplies(int food, int water) {
    foodPackets += food;
    waterLiters += water;
}

bool Shelter::consumeSupplies(int food, int water) {
    if (foodPackets >= food && waterLiters >= water) {
        foodPackets -= food;
        waterLiters -= water;
        return true;
    }
    return false;
}

void Shelter::display() const {
    double percentage = (totalCapacity > 0) ? ((double)currentOccupancy / totalCapacity * 100.0) : 0.0;
    std::cout << "Shelter ID: [" << id << "] | Name: " << name
              << " | Location: " << locationName << std::endl;
    std::cout << "  Capacity: " << currentOccupancy << " / " << totalCapacity
              << " (" << std::fixed << std::setprecision(1) << percentage << "% full)"
              << " | Free Space: " << getAvailableCapacity() << " people" << std::endl;
    std::cout << "  Supplies: Food Packets: " << foodPackets
              << " | Water: " << waterLiters << " L"
              << " | Medical Beds: " << medicalBeds
              << " | Contact: " << contactNumber << std::endl;
}
