#ifndef PERSON_H
#define PERSON_H

#include <string>
#include <iostream>

class Person {
protected:
    std::string id;
    std::string name;
    std::string phone;
    std::string email;

public:
    Person(const std::string& id, const std::string& name, const std::string& phone, const std::string& email);
    virtual ~Person();

    std::string getId() const;
    std::string getName() const;
    std::string getPhone() const;
    std::string getEmail() const;

    virtual std::string getRole() const = 0;
    virtual void displayDetails() const;
    virtual Person* clone() const = 0;
};

class Volunteer : public Person {
private:
    std::string skills;
    int hoursContributed;
    bool available;

public:
    Volunteer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
              const std::string& skills, int hoursContributed, bool available = true);

    std::string getSkills() const;
    int getHoursContributed() const;
    bool isAvailable() const;

    void setAvailable(bool status);
    void addHours(int hours);

    std::string getRole() const override;
    void displayDetails() const override;
    Person* clone() const override;
};

class RescueOfficer : public Person {
private:
    std::string rank;
    std::string certificationLevel;
    int missionsLed;

public:
    RescueOfficer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
                  const std::string& rank, const std::string& certificationLevel, int missionsLed = 0);

    std::string getRank() const;
    std::string getCertificationLevel() const;
    int getMissionsLed() const;

    void incrementMissionsLed();

    std::string getRole() const override;
    void displayDetails() const override;
    Person* clone() const override;
};

class MedicalOfficer : public Person {
private:
    std::string medicalSpecialty;
    std::string licenseNumber;
    int triageExperienceYears;

public:
    MedicalOfficer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
                   const std::string& medicalSpecialty, const std::string& licenseNumber, int triageExperienceYears);

    std::string getMedicalSpecialty() const;
    std::string getLicenseNumber() const;
    int getTriageExperienceYears() const;

    std::string getRole() const override;
    void displayDetails() const override;
    Person* clone() const override;
};

#endif
