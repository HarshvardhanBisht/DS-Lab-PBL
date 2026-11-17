#ifndef INCIDENT_H
#define INCIDENT_H

#include <string>
#include <vector>
#include <utility>

/**
 * Base Incident Class
 * Models disaster incidents with polymorphic resource allocation.
 * Space Complexity: O(R) where R is the number of required resource types.
 */
class Incident {
protected:
    std::string id;
    std::string locationName;
    int severity;
    std::string status;
    long long reportedTimestamp;
    int waitMinutes;
    int affectedPeople;
    int casualties;
    std::string assignedTeamId;
    std::string description;
    std::vector<std::pair<std::string, int>> requiredResources;

public:
    Incident(const std::string& id, const std::string& locationName, int severity,
             long long reportedTimestamp, int affectedPeople, int casualties,
             const std::string& description)
        : id(id), locationName(locationName), severity(severity), status("Reported"),
          reportedTimestamp(reportedTimestamp), waitMinutes(0), affectedPeople(affectedPeople),
          casualties(casualties), assignedTeamId("None"), description(description) {}

    virtual ~Incident() {}

    std::string getId() const { return id; }
    std::string getLocationName() const { return locationName; }
    int getSeverity() const { return severity; }
    std::string getStatus() const { return status; }
    long long getReportedTimestamp() const { return reportedTimestamp; }
    int getWaitMinutes() const { return waitMinutes; }
    int getAffectedPeople() const { return affectedPeople; }
    int getCasualties() const { return casualties; }
    std::string getAssignedTeamId() const { return assignedTeamId; }
    std::string getDescription() const { return description; }
    const std::vector<std::pair<std::string, int>>& getRequiredResources() const { return requiredResources; }

    void setSeverity(int s) { severity = s; assignResources(); }
    void setStatus(const std::string& st) { status = st; }
    void setAssignedTeamId(const std::string& tid) { assignedTeamId = tid; }
    void incrementWaitMinutes(int delta = 1) { waitMinutes += delta; }
    void setWaitMinutes(int w) { waitMinutes = w; }
    void setAffectedPeople(int count) { affectedPeople = count; assignResources(); }

    /**
     * Effective Dynamic Priority Calculation
     * Formula: EffectivePriority = Severity * 100 + WaitMinutes * AgingFactor
     * Time Complexity: O(1)
     */
    double getEffectivePriority(double agingFactor = 1.5) const {
        return static_cast<double>(severity) * 100.0 + static_cast<double>(waitMinutes) * agingFactor;
    }

    virtual void assignResources() = 0;
    virtual std::string getType() const = 0;
    virtual Incident* clone() const = 0;
};

class Fire : public Incident {
private:
    std::string fireIntensity;
    bool hazardousMaterials;

public:
    Fire(const std::string& id, const std::string& locationName, int severity,
         long long reportedTimestamp, int affectedPeople, int casualties,
         const std::string& description, const std::string& intensity, bool hazmat)
        : Incident(id, locationName, severity, reportedTimestamp, affectedPeople, casualties, description),
          fireIntensity(intensity), hazardousMaterials(hazmat) {
        assignResources();
    }

    std::string getFireIntensity() const { return fireIntensity; }
    bool hasHazardousMaterials() const { return hazardousMaterials; }

    void assignResources() override {
        requiredResources.clear();
        int trucks = severity;
        int tankers = severity * 2;
        int firefighters = severity * 4;
        int burnKits = (affectedPeople / 10) + 2;
        if (hazardousMaterials) {
            trucks += 1;
            tankers += 2;
            firefighters += 4;
            requiredResources.push_back({"Hazmat Foam Units", 2});
        }
        requiredResources.push_back({"Fire Trucks", trucks});
        requiredResources.push_back({"Water Tankers", tankers});
        requiredResources.push_back({"Firefighter Units", firefighters});
        requiredResources.push_back({"Burn Trauma Kits", burnKits});
        requiredResources.push_back({"Ambulances", (casualties > 0 ? (casualties / 5 + 1) : 1)});
    }

    std::string getType() const override { return "Fire"; }
    Incident* clone() const override { return new Fire(*this); }
};

class Flood : public Incident {
private:
    double waterLevelMeters;
    std::string flowRate;

public:
    Flood(const std::string& id, const std::string& locationName, int severity,
          long long reportedTimestamp, int affectedPeople, int casualties,
          const std::string& description, double waterLevel, const std::string& flow)
        : Incident(id, locationName, severity, reportedTimestamp, affectedPeople, casualties, description),
          waterLevelMeters(waterLevel), flowRate(flow) {
        assignResources();
    }

    double getWaterLevelMeters() const { return waterLevelMeters; }
    std::string getFlowRate() const { return flowRate; }

    void assignResources() override {
        requiredResources.clear();
        int boats = (affectedPeople / 15) + severity;
        int jackets = affectedPeople + 10;
        int divers = (waterLevelMeters > 3.0) ? 2 : 1;
        requiredResources.push_back({"Motor Rescue Boats", boats});
        requiredResources.push_back({"Life Jackets", jackets});
        requiredResources.push_back({"Diver Teams", divers});
        requiredResources.push_back({"High-Capacity Pumps", severity * 2});
        requiredResources.push_back({"Emergency Food Packs", affectedPeople * 2});
        requiredResources.push_back({"Ambulances", (casualties > 0 ? (casualties / 4 + 1) : 2)});
    }

    std::string getType() const override { return "Flood"; }
    Incident* clone() const override { return new Flood(*this); }
};

class Earthquake : public Incident {
private:
    double magnitudeRichter;
    int collapsedStructures;

public:
    Earthquake(const std::string& id, const std::string& locationName, int severity,
               long long reportedTimestamp, int affectedPeople, int casualties,
               const std::string& description, double magnitude, int structures)
        : Incident(id, locationName, severity, reportedTimestamp, affectedPeople, casualties, description),
          magnitudeRichter(magnitude), collapsedStructures(structures) {
        assignResources();
    }

    double getMagnitudeRichter() const { return magnitudeRichter; }
    int getCollapsedStructures() const { return collapsedStructures; }

    void assignResources() override {
        requiredResources.clear();
        int excavators = (collapsedStructures / 2) + severity;
        int detectors = severity * 2;
        int traumaKits = (affectedPeople / 5) + 5;
        requiredResources.push_back({"Hydraulic Excavators", excavators});
        requiredResources.push_back({"Acoustic Life Detectors", detectors});
        requiredResources.push_back({"Trauma Surgical Kits", traumaKits});
        requiredResources.push_back({"Relief Tents", (affectedPeople / 8) + 4});
        requiredResources.push_back({"Heavy Rescue Squads", severity * 3});
        requiredResources.push_back({"Ambulances", (casualties > 0 ? (casualties / 3 + 2) : 2)});
    }

    std::string getType() const override { return "Earthquake"; }
    Incident* clone() const override { return new Earthquake(*this); }
};

class Landslide : public Incident {
private:
    double debrisVolumeCubicMeters;
    bool roadBlocked;

public:
    Landslide(const std::string& id, const std::string& locationName, int severity,
              long long reportedTimestamp, int affectedPeople, int casualties,
              const std::string& description, double debrisVolume, bool blocked)
        : Incident(id, locationName, severity, reportedTimestamp, affectedPeople, casualties, description),
          debrisVolumeCubicMeters(debrisVolume), roadBlocked(blocked) {
        assignResources();
    }

    double getDebrisVolumeCubicMeters() const { return debrisVolumeCubicMeters; }
    bool isRoadBlocked() const { return roadBlocked; }

    void assignResources() override {
        requiredResources.clear();
        int earthMovers = severity + (debrisVolumeCubicMeters > 500.0 ? 2 : 1);
        requiredResources.push_back({"Earth Movers", earthMovers});
        requiredResources.push_back({"Canine Search Units", severity});
        requiredResources.push_back({"Debris Dump Trucks", severity * 2});
        requiredResources.push_back({"Slope Stabilization Nets", severity * 5});
        requiredResources.push_back({"Ambulances", (casualties > 0 ? (casualties / 4 + 1) : 1)});
    }

    std::string getType() const override { return "Landslide"; }
    Incident* clone() const override { return new Landslide(*this); }
};

#endif
