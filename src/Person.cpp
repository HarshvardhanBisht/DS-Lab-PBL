#include "../include/Person.h"
#include <iomanip>

Person::Person(const std::string& id, const std::string& name, const std::string& phone, const std::string& email)
    : id(id), name(name), phone(phone), email(email) {}

Person::~Person() {}

std::string Person::getId() const {
    return id;
}

std::string Person::getName() const {
    return name;
}

std::string Person::getPhone() const {
    return phone;
}

std::string Person::getEmail() const {
    return email;
}

void Person::displayDetails() const {
    std::cout << "ID: " << id << " | Name: " << name << " | Phone: " << phone << " | Email: " << email;
}

Volunteer::Volunteer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
                     const std::string& skills, int hoursContributed, bool available)
    : Person(id, name, phone, email), skills(skills), hoursContributed(hoursContributed), available(available) {}

std::string Volunteer::getSkills() const {
    return skills;
}

int Volunteer::getHoursContributed() const {
    return hoursContributed;
}

bool Volunteer::isAvailable() const {
    return available;
}

void Volunteer::setAvailable(bool status) {
    available = status;
}

void Volunteer::addHours(int hours) {
    hoursContributed += hours;
}

std::string Volunteer::getRole() const {
    return "Volunteer";
}

void Volunteer::displayDetails() const {
    Person::displayDetails();
    std::cout << " | Role: Volunteer | Skills: " << skills
              << " | Hours: " << hoursContributed
              << " | Status: " << (available ? "Available" : "Assigned") << std::endl;
}

Person* Volunteer::clone() const {
    return new Volunteer(*this);
}

RescueOfficer::RescueOfficer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
                             const std::string& rank, const std::string& certificationLevel, int missionsLed)
    : Person(id, name, phone, email), rank(rank), certificationLevel(certificationLevel), missionsLed(missionsLed) {}

std::string RescueOfficer::getRank() const {
    return rank;
}

std::string RescueOfficer::getCertificationLevel() const {
    return certificationLevel;
}

int RescueOfficer::getMissionsLed() const {
    return missionsLed;
}

void RescueOfficer::incrementMissionsLed() {
    missionsLed++;
}

std::string RescueOfficer::getRole() const {
    return "Rescue Officer";
}

void RescueOfficer::displayDetails() const {
    Person::displayDetails();
    std::cout << " | Role: Rescue Officer | Rank: " << rank
              << " | Cert: " << certificationLevel
              << " | Missions Led: " << missionsLed << std::endl;
}

Person* RescueOfficer::clone() const {
    return new RescueOfficer(*this);
}

MedicalOfficer::MedicalOfficer(const std::string& id, const std::string& name, const std::string& phone, const std::string& email,
                               const std::string& medicalSpecialty, const std::string& licenseNumber, int triageExperienceYears)
    : Person(id, name, phone, email), medicalSpecialty(medicalSpecialty), licenseNumber(licenseNumber), triageExperienceYears(triageExperienceYears) {}

std::string MedicalOfficer::getMedicalSpecialty() const {
    return medicalSpecialty;
}

std::string MedicalOfficer::getLicenseNumber() const {
    return licenseNumber;
}

int MedicalOfficer::getTriageExperienceYears() const {
    return triageExperienceYears;
}

std::string MedicalOfficer::getRole() const {
    return "Medical Officer";
}

void MedicalOfficer::displayDetails() const {
    Person::displayDetails();
    std::cout << " | Role: Medical Officer | Specialty: " << medicalSpecialty
              << " | License: " << licenseNumber
              << " | Triage Exp: " << triageExperienceYears << " yrs" << std::endl;
}

Person* MedicalOfficer::clone() const {
    return new MedicalOfficer(*this);
}
