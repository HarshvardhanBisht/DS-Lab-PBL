#ifndef PERSON_H
#define PERSON_H

#include <string>

/**
 * Base Person Class
 * Represents emergency response personnel.
 * Space Complexity: O(1) per instance
 */
class Person {
protected:
    std::string id;
    std::string name;
    std::string phone;
    std::string email;

public:
    Person(const std::string& id, const std::string& name, const std::string& phone, const std::string& email)
        : id(id), name(name), phone(phone), email(email) {}
    virtual ~Person() {}

    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getPhone() const { return phone; }
    std::string getEmail() const { return email; }

    virtual std::string getRole() const = 0;
    virtual std::string getDetails() const = 0;
    virtual Person* clone() const = 0;
};

/**
 * Derived Volunteer Class
 * Time Complexity: O(1) attribute access
 */
class Volunteer : public Person {
private:
    std::string skills;
    int hoursContributed;
    bool available;

public:
    Volunteer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
              const std::string& skills, int hoursContributed, bool available = true)
        : Person(id, name, phone, email), skills(skills), hoursContributed(hoursContributed), available(available) {}

    std::string getSkills() const { return skills; }
    int getHoursContributed() const { return hoursContributed; }
    bool isAvailable() const { return available; }
    void setAvailable(bool status) { available = status; }
    void addHours(int hours) { hoursContributed += hours; }

    std::string getRole() const override { return "Volunteer"; }
    std::string getDetails() const override {
        return "Skills: " + skills + " | Hours: " + std::to_string(hoursContributed) + " | Status: " + (available ? "Available" : "Assigned");
    }
    Person* clone() const override { return new Volunteer(*this); }
};

/**
 * Derived RescueOfficer Class
 * Time Complexity: O(1) attribute access
 */
class RescueOfficer : public Person {
private:
    std::string rank;
    std::string certificationLevel;
    int missionsLed;

public:
    RescueOfficer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
                  const std::string& rank, const std::string& certificationLevel, int missionsLed = 0)
        : Person(id, name, phone, email), rank(rank), certificationLevel(certificationLevel), missionsLed(missionsLed) {}

    std::string getRank() const { return rank; }
    std::string getCertificationLevel() const { return certificationLevel; }
    int getMissionsLed() const { return missionsLed; }
    void incrementMissionsLed() { missionsLed++; }

    std::string getRole() const override { return "RescueOfficer"; }
    std::string getDetails() const override {
        return "Rank: " + rank + " | Cert: " + certificationLevel + " | Missions: " + std::to_string(missionsLed);
    }
    Person* clone() const override { return new RescueOfficer(*this); }
};

/**
 * Derived MedicalOfficer Class
 * Time Complexity: O(1) attribute access
 */
class MedicalOfficer : public Person {
private:
    std::string medicalSpecialty;
    std::string licenseNumber;
    int triageExperienceYears;

public:
    MedicalOfficer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
                   const std::string& medicalSpecialty, const std::string& licenseNumber, int triageExperienceYears)
        : Person(id, name, phone, email), medicalSpecialty(medicalSpecialty), licenseNumber(licenseNumber), triageExperienceYears(triageExperienceYears) {}

    std::string getMedicalSpecialty() const { return medicalSpecialty; }
    std::string getLicenseNumber() const { return licenseNumber; }
    int getTriageExperienceYears() const { return triageExperienceYears; }

    std::string getRole() const override { return "MedicalOfficer"; }
    std::string getDetails() const override {
        return "Specialty: " + medicalSpecialty + " | License: " + licenseNumber + " | Triage Exp: " + std::to_string(triageExperienceYears) + " yrs";
    }
    Person* clone() const override { return new MedicalOfficer(*this); }
};

#endif
