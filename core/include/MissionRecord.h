#ifndef MISSIONRECORD_H
#define MISSIONRECORD_H

#include <string>
#include <vector>

/**
 * MissionRecord Class
 * Stores history for missions and support undo / rollback actions.
 * Space Complexity: O(P) where P is path vertex count.
 */
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

    MissionRecord(const std::string& mId, const std::string& incId,
                  const std::string& incType, int sev,
                  const std::string& loc, const std::string& tId,
                  const std::string& shId, int rescued, int cas,
                  const std::vector<std::string>& r, double dist,
                  const std::string& res, const std::string& time,
                  const std::string& st = "Completed")
        : missionId(mId), incidentId(incId), incidentType(incType),
          severity(sev), locationName(loc), teamId(tId),
          shelterId(shId), peopleRescued(rescued), casualties(cas),
          route(r), distanceKm(dist), resourcesDeployed(res),
          timestamp(time), status(st) {}

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
};

#endif
