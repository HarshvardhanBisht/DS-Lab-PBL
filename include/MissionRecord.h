#ifndef MISSIONRECORD_H
#define MISSIONRECORD_H

#include <string>
#include <vector>
#include <iostream>
#include <iomanip>

class MissionRecord {
private:
    std::string missionId;
    std::string incidentId;
    std::string incidentType;
    int severity;
    std::string locationName;
    std::string teamId;
    std::string shelterId;
    int peopleRescued;
    int casualties;
    std::vector<std::string> route;
    double distanceKm;
    std::string resourcesDeployed;
    std::string timestamp;
    std::string status;

public:
    MissionRecord()
        : missionId(""), incidentId(""), incidentType(""), severity(0),
          locationName(""), teamId(""), shelterId(""), peopleRescued(0),
          casualties(0), distanceKm(0.0), resourcesDeployed(""),
          timestamp(""), status("Completed") {}

    MissionRecord(const std::string& missionId, const std::string& incidentId,
                  const std::string& incidentType, int severity,
                  const std::string& locationName, const std::string& teamId,
                  const std::string& shelterId, int peopleRescued, int casualties,
                  const std::vector<std::string>& route, double distanceKm,
                  const std::string& resourcesDeployed, const std::string& timestamp,
                  const std::string& status = "Completed")
        : missionId(missionId), incidentId(incidentId), incidentType(incidentType),
          severity(severity), locationName(locationName), teamId(teamId),
          shelterId(shelterId), peopleRescued(peopleRescued), casualties(casualties),
          route(route), distanceKm(distanceKm), resourcesDeployed(resourcesDeployed),
          timestamp(timestamp), status(status) {}

    std::string getMissionId() const { return missionId; }
    std::string getIncidentId() const { return incidentId; }
    std::string getIncidentType() const { return incidentType; }
    int getSeverity() const { return severity; }
    std::string getLocationName() const { return locationName; }
    std::string getTeamId() const { return teamId; }
    std::string getShelterId() const { return shelterId; }
    int getPeopleRescued() const { return peopleRescued; }
    int getCasualties() const { return casualties; }
    const std::vector<std::string>& getRoute() const { return route; }
    double getDistanceKm() const { return distanceKm; }
    std::string getResourcesDeployed() const { return resourcesDeployed; }
    std::string getTimestamp() const { return timestamp; }
    std::string getStatus() const { return status; }

    void display() const {
        std::cout << "Mission ID: [" << missionId << "] | Incident: " << incidentId
                  << " (" << incidentType << " - Sev " << severity << ") | Time: " << timestamp << std::endl;
        std::cout << "  Location: " << locationName << " | Dispatched Team: " << teamId
                  << " | Evacuated To: " << (shelterId.empty() ? "N/A" : shelterId) << std::endl;
        std::cout << "  People Rescued: " << peopleRescued << " | Casualties: " << casualties
                  << " | Total Route Distance: " << std::fixed << std::setprecision(2) << distanceKm << " km" << std::endl;
        std::cout << "  Path Taken: ";
        if (route.empty()) {
            std::cout << "Direct";
        } else {
            for (size_t i = 0; i < route.size(); ++i) {
                std::cout << route[i];
                if (i + 1 < route.size()) std::cout << " -> ";
            }
        }
        std::cout << std::endl;
        std::cout << "  Resources Used: " << resourcesDeployed << std::endl;
        std::cout << "  Status: " << status << std::endl;
    }
};

#endif
