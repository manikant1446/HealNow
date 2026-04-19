// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DoctorRegistry
 * @dev Decentralized identity registry for healthcare providers.
 *      Stores doctor profiles on-chain with DID integration and verification.
 */
contract DoctorRegistry {
    struct DoctorProfile {
        string name;
        string specialty;
        string hospital;
        string did;              // Decentralized Identifier
        string qualifications;
        bool isVerified;
        uint256 registeredAt;
        uint256 totalPatients;
        bool exists;
    }

    address public admin;
    mapping(address => DoctorProfile) public doctors;
    address[] public doctorAddresses;

    // Specialty index for search
    mapping(string => address[]) private specialtyIndex;

    event DoctorRegistered(address indexed doctor, string name, string specialty);
    event DoctorVerified(address indexed doctor);
    event DoctorProfileUpdated(address indexed doctor);
    event PatientCountUpdated(address indexed doctor, uint256 newCount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(doctors[msg.sender].exists, "Doctor not registered");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Register a new doctor profile
     */
    function registerDoctor(
        string calldata _name,
        string calldata _specialty,
        string calldata _hospital,
        string calldata _did,
        string calldata _qualifications
    ) external {
        require(!doctors[msg.sender].exists, "Doctor already registered");

        doctors[msg.sender] = DoctorProfile({
            name: _name,
            specialty: _specialty,
            hospital: _hospital,
            did: _did,
            qualifications: _qualifications,
            isVerified: false,
            registeredAt: block.timestamp,
            totalPatients: 0,
            exists: true
        });

        doctorAddresses.push(msg.sender);
        specialtyIndex[_specialty].push(msg.sender);

        emit DoctorRegistered(msg.sender, _name, _specialty);
    }

    /**
     * @dev Admin verifies a doctor
     */
    function verifyDoctor(address _doctor) external onlyAdmin {
        require(doctors[_doctor].exists, "Doctor not registered");
        doctors[_doctor].isVerified = true;
        emit DoctorVerified(_doctor);
    }

    /**
     * @dev Update doctor profile
     */
    function updateProfile(
        string calldata _name,
        string calldata _hospital,
        string calldata _qualifications
    ) external onlyRegistered {
        DoctorProfile storage doc = doctors[msg.sender];
        doc.name = _name;
        doc.hospital = _hospital;
        doc.qualifications = _qualifications;
        emit DoctorProfileUpdated(msg.sender);
    }

    /**
     * @dev Increment patient count (called after consultation)
     */
    function incrementPatientCount(address _doctor) external {
        require(doctors[_doctor].exists, "Doctor not registered");
        doctors[_doctor].totalPatients++;
        emit PatientCountUpdated(_doctor, doctors[_doctor].totalPatients);
    }

    /**
     * @dev Get doctor profile
     */
    function getDoctor(address _doctor) external view returns (DoctorProfile memory) {
        require(doctors[_doctor].exists, "Doctor not registered");
        return doctors[_doctor];
    }

    /**
     * @dev Get all registered doctor addresses
     */
    function getAllDoctors() external view returns (address[] memory) {
        return doctorAddresses;
    }

    /**
     * @dev Search doctors by specialty
     */
    function getDoctorsBySpecialty(string calldata _specialty) external view returns (address[] memory) {
        return specialtyIndex[_specialty];
    }

    /**
     * @dev Check if a doctor is registered
     */
    function isDoctor(address _addr) external view returns (bool) {
        return doctors[_addr].exists;
    }

    /**
     * @dev Get total number of registered doctors
     */
    function getDoctorCount() external view returns (uint256) {
        return doctorAddresses.length;
    }
}
