#ifndef INCIDENT_H
#define INCIDENT_H

#include <string>
#include <vector>
#include <utility>
#include <iostream>

class Incident {
protected:
    std::string id;
    std::string locationName;
    int severity;
    std::string status;
    std::string reportedTime;
    int affectedPeople;
    int casualties;
    std::string assignedTeamId;
    std::string description;
    std::vector<std::pair<std::string, int>> requiredResources;

public:
    Incident(const std::string& id, const std::string& locationName, int severity,
             const std::string& reportedTime, int affectedPeople, int casualties,
             const std::string& description);
    virtual ~Incident();

    std::string getId() const;
    std::string getLocationName() const;
    int getSeverity() const;
    std::string getStatus() const;
    std::string getReportedTime() const;
    int getAffectedPeople() const;
    int getCasualties() const;
    std::string getAssignedTeamId() const;
    std::string getDescription() const;
    const std::vector<std::pair<std::string, int>>& getRequiredResources() const;

    void setSeverity(int newSeverity);
    void setStatus(const std::string& newStatus);
    void setAssignedTeamId(const std::string& teamId);
    void setAffectedPeople(int count);
    void setCasualties(int count);

    virtual void assignResources() = 0;
    virtual std::string getType() const = 0;
    virtual void displayDetails() const;
    virtual Incident* clone() const = 0;
};

class Fire : public Incident {
private:
    std::string fireIntensity;
    bool hazardousMaterialsPresent;
    int waterTankersNeeded;

public:
    Fire(const std::string& id, const std::string& locationName, int severity,
         const std::string& reportedTime, int affectedPeople, int casualties,
         const std::string& description, const std::string& fireIntensity,
         bool hazardousMaterialsPresent);

    std::string getFireIntensity() const;
    bool hasHazardousMaterials() const;
    int getWaterTankersNeeded() const;

    void assignResources() override;
    std::string getType() const override;
    void displayDetails() const override;
    Incident* clone() const override;
};

class Flood : public Incident {
private:
    double waterLevelMeters;
    std::string flowRate;
    double inundationAreaSqKm;

public:
    Flood(const std::string& id, const std::string& locationName, int severity,
          const std::string& reportedTime, int affectedPeople, int casualties,
          const std::string& description, double waterLevelMeters,
          const std::string& flowRate, double inundationAreaSqKm);

    double getWaterLevelMeters() const;
    std::string getFlowRate() const;
    double getInundationAreaSqKm() const;

    void assignResources() override;
    std::string getType() const override;
    void displayDetails() const override;
    Incident* clone() const override;
};

class Earthquake : public Incident {
private:
    double magnitudeRichter;
    std::string aftershockRisk;
    int collapsedStructures;

public:
    Earthquake(const std::string& id, const std::string& locationName, int severity,
               const std::string& reportedTime, int affectedPeople, int casualties,
               const std::string& description, double magnitudeRichter,
               const std::string& aftershockRisk, int collapsedStructures);

    double getMagnitudeRichter() const;
    std::string getAftershockRisk() const;
    int getCollapsedStructures() const;

    void assignResources() override;
    std::string getType() const override;
    void displayDetails() const override;
    Incident* clone() const override;
};

class Landslide : public Incident {
private:
    double debrisVolumeCubicMeters;
    bool roadBlocked;
    std::string mudflowRisk;

public:
    Landslide(const std::string& id, const std::string& locationName, int severity,
              const std::string& reportedTime, int affectedPeople, int casualties,
              const std::string& description, double debrisVolumeCubicMeters,
              bool roadBlocked, const std::string& mudflowRisk);

    double getDebrisVolumeCubicMeters() const;
    bool isRoadBlocked() const;
    std::string getMudflowRisk() const;

    void assignResources() override;
    std::string getType() const override;
    void displayDetails() const override;
    Incident* clone() const override;
};

#endif
