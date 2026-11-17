#include "../include/Incident.h"
#include <iomanip>

Incident::Incident(const std::string& id, const std::string& locationName, int severity,
                   const std::string& reportedTime, int affectedPeople, int casualties,
                   const std::string& description)
    : id(id), locationName(locationName), severity(severity), status("Reported"),
      reportedTime(reportedTime), affectedPeople(affectedPeople), casualties(casualties),
      assignedTeamId("None"), description(description) {}

Incident::~Incident() {}

std::string Incident::getId() const {
    return id;
}

std::string Incident::getLocationName() const {
    return locationName;
}

int Incident::getSeverity() const {
    return severity;
}

std::string Incident::getStatus() const {
    return status;
}

std::string Incident::getReportedTime() const {
    return reportedTime;
}

int Incident::getAffectedPeople() const {
    return affectedPeople;
}

int Incident::getCasualties() const {
    return casualties;
}

std::string Incident::getAssignedTeamId() const {
    return assignedTeamId;
}

std::string Incident::getDescription() const {
    return description;
}

const std::vector<std::pair<std::string, int>>& Incident::getRequiredResources() const {
    return requiredResources;
}

void Incident::setSeverity(int newSeverity) {
    severity = newSeverity;
}

void Incident::setStatus(const std::string& newStatus) {
    status = newStatus;
}

void Incident::setAssignedTeamId(const std::string& teamId) {
    assignedTeamId = teamId;
}

void Incident::setAffectedPeople(int count) {
    affectedPeople = count;
}

void Incident::setCasualties(int count) {
    casualties = count;
}

void Incident::displayDetails() const {
    std::cout << "Incident ID: [" << id << "] | Type: " << getType()
              << " | Location: " << locationName << " | Severity: " << severity
              << " | Status: " << status << " | Time: " << reportedTime << std::endl;
    std::cout << "  Affected: " << affectedPeople << " | Casualties: " << casualties
              << " | Assigned Team: " << assignedTeamId << std::endl;
    std::cout << "  Description: " << description << std::endl;
    std::cout << "  Allocated Resources: ";
    if (requiredResources.empty()) {
        std::cout << "None";
    } else {
        for (size_t i = 0; i < requiredResources.size(); ++i) {
            std::cout << requiredResources[i].first << ": " << requiredResources[i].second;
            if (i + 1 < requiredResources.size()) std::cout << ", ";
        }
    }
    std::cout << std::endl;
}

Fire::Fire(const std::string& id, const std::string& locationName, int severity,
           const std::string& reportedTime, int affectedPeople, int casualties,
           const std::string& description, const std::string& fireIntensity,
           bool hazardousMaterialsPresent)
    : Incident(id, locationName, severity, reportedTime, affectedPeople, casualties, description),
      fireIntensity(fireIntensity), hazardousMaterialsPresent(hazardousMaterialsPresent),
      waterTankersNeeded(0) {
    assignResources();
}

std::string Fire::getFireIntensity() const {
    return fireIntensity;
}

bool Fire::hasHazardousMaterials() const {
    return hazardousMaterialsPresent;
}

int Fire::getWaterTankersNeeded() const {
    return waterTankersNeeded;
}

void Fire::assignResources() {
    requiredResources.clear();
    int fireTrucks = severity;
    waterTankersNeeded = severity * 2;
    int firefighters = severity * 4;
    int burnKits = (affectedPeople / 10) + 2;

    if (hazardousMaterialsPresent) {
        fireTrucks += 1;
        waterTankersNeeded += 2;
        firefighters += 4;
        requiredResources.push_back(std::make_pair("Hazmat Foam Units", 2));
    }

    requiredResources.push_back(std::make_pair("Fire Trucks", fireTrucks));
    requiredResources.push_back(std::make_pair("Water Tankers", waterTankersNeeded));
    requiredResources.push_back(std::make_pair("Firefighter Units", firefighters));
    requiredResources.push_back(std::make_pair("Burn Trauma Kits", burnKits));
    requiredResources.push_back(std::make_pair("Ambulances", (casualties > 0 ? (casualties / 5 + 1) : 1)));
}

std::string Fire::getType() const {
    return "Fire";
}

void Fire::displayDetails() const {
    Incident::displayDetails();
    std::cout << "  [Fire Details] Intensity: " << fireIntensity
              << " | Hazardous Materials: " << (hazardousMaterialsPresent ? "Yes" : "No")
              << " | Water Tankers Needed: " << waterTankersNeeded << std::endl;
}

Incident* Fire::clone() const {
    return new Fire(*this);
}

Flood::Flood(const std::string& id, const std::string& locationName, int severity,
             const std::string& reportedTime, int affectedPeople, int casualties,
             const std::string& description, double waterLevelMeters,
             const std::string& flowRate, double inundationAreaSqKm)
    : Incident(id, locationName, severity, reportedTime, affectedPeople, casualties, description),
      waterLevelMeters(waterLevelMeters), flowRate(flowRate), inundationAreaSqKm(inundationAreaSqKm) {
    assignResources();
}

double Flood::getWaterLevelMeters() const {
    return waterLevelMeters;
}

std::string Flood::getFlowRate() const {
    return flowRate;
}

double Flood::getInundationAreaSqKm() const {
    return inundationAreaSqKm;
}

void Flood::assignResources() {
    requiredResources.clear();
    int rescueBoats = (affectedPeople / 15) + severity;
    int lifeJackets = affectedPeople + 10;
    int divingTeams = (waterLevelMeters > 3.0) ? 2 : 1;
    int waterPumps = severity * 2;

    requiredResources.push_back(std::make_pair("Motor Rescue Boats", rescueBoats));
    requiredResources.push_back(std::make_pair("Life Jackets", lifeJackets));
    requiredResources.push_back(std::make_pair("Diver Teams", divingTeams));
    requiredResources.push_back(std::make_pair("High-Capacity Water Pumps", waterPumps));
    requiredResources.push_back(std::make_pair("Emergency Food Packets", affectedPeople * 2));
    requiredResources.push_back(std::make_pair("Ambulances", (casualties > 0 ? (casualties / 4 + 1) : 2)));
}

std::string Flood::getType() const {
    return "Flood";
}

void Flood::displayDetails() const {
    Incident::displayDetails();
    std::cout << "  [Flood Details] Water Level: " << waterLevelMeters << " m"
              << " | Flow Rate: " << flowRate
              << " | Inundated Area: " << inundationAreaSqKm << " sq km" << std::endl;
}

Incident* Flood::clone() const {
    return new Flood(*this);
}

Earthquake::Earthquake(const std::string& id, const std::string& locationName, int severity,
                       const std::string& reportedTime, int affectedPeople, int casualties,
                       const std::string& description, double magnitudeRichter,
                       const std::string& aftershockRisk, int collapsedStructures)
    : Incident(id, locationName, severity, reportedTime, affectedPeople, casualties, description),
      magnitudeRichter(magnitudeRichter), aftershockRisk(aftershockRisk),
      collapsedStructures(collapsedStructures) {
    assignResources();
}

double Earthquake::getMagnitudeRichter() const {
    return magnitudeRichter;
}

std::string Earthquake::getAftershockRisk() const {
    return aftershockRisk;
}

int Earthquake::getCollapsedStructures() const {
    return collapsedStructures;
}

void Earthquake::assignResources() {
    requiredResources.clear();
    int excavators = (collapsedStructures / 2) + severity;
    int acousticDetectors = severity * 2;
    int traumaKits = (affectedPeople / 5) + 5;
    int emergencyTents = (affectedPeople / 8) + 4;

    requiredResources.push_back(std::make_pair("Hydraulic Excavators", excavators));
    requiredResources.push_back(std::make_pair("Acoustic Life Detectors", acousticDetectors));
    requiredResources.push_back(std::make_pair("Trauma Surgical Kits", traumaKits));
    requiredResources.push_back(std::make_pair("Relief Shelter Tents", emergencyTents));
    requiredResources.push_back(std::make_pair("Heavy Rescue Squads", severity * 3));
    requiredResources.push_back(std::make_pair("Ambulances", (casualties > 0 ? (casualties / 3 + 2) : 2)));
}

std::string Earthquake::getType() const {
    return "Earthquake";
}

void Earthquake::displayDetails() const {
    Incident::displayDetails();
    std::cout << "  [Earthquake Details] Magnitude: " << magnitudeRichter << " Richter"
              << " | Aftershock Risk: " << aftershockRisk
              << " | Collapsed Structures: " << collapsedStructures << std::endl;
}

Incident* Earthquake::clone() const {
    return new Earthquake(*this);
}

Landslide::Landslide(const std::string& id, const std::string& locationName, int severity,
                     const std::string& reportedTime, int affectedPeople, int casualties,
                     const std::string& description, double debrisVolumeCubicMeters,
                     bool roadBlocked, const std::string& mudflowRisk)
    : Incident(id, locationName, severity, reportedTime, affectedPeople, casualties, description),
      debrisVolumeCubicMeters(debrisVolumeCubicMeters), roadBlocked(roadBlocked),
      mudflowRisk(mudflowRisk) {
    assignResources();
}

double Landslide::getDebrisVolumeCubicMeters() const {
    return debrisVolumeCubicMeters;
}

bool Landslide::isRoadBlocked() const {
    return roadBlocked;
}

std::string Landslide::getMudflowRisk() const {
    return mudflowRisk;
}

void Landslide::assignResources() {
    requiredResources.clear();
    int earthMovers = severity + (debrisVolumeCubicMeters > 500.0 ? 2 : 1);
    int canineUnits = severity;
    int dumpTrucks = severity * 2;

    requiredResources.push_back(std::make_pair("Earth Movers / Bulldozers", earthMovers));
    requiredResources.push_back(std::make_pair("Canine Search Units", canineUnits));
    requiredResources.push_back(std::make_pair("Debris Dump Trucks", dumpTrucks));
    requiredResources.push_back(std::make_pair("Slope Stabilization Nets", severity * 5));
    requiredResources.push_back(std::make_pair("Ambulances", (casualties > 0 ? (casualties / 4 + 1) : 1)));
}

std::string Landslide::getType() const {
    return "Landslide";
}

void Landslide::displayDetails() const {
    Incident::displayDetails();
    std::cout << "  [Landslide Details] Debris Volume: " << debrisVolumeCubicMeters << " cu.m"
              << " | Road Blocked: " << (roadBlocked ? "Yes" : "No")
              << " | Mudflow Risk: " << mudflowRisk << std::endl;
}

Incident* Landslide::clone() const {
    return new Landslide(*this);
}
