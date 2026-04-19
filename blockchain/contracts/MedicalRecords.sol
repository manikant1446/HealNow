// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MedicalRecords
 * @dev Enhanced medical records management with categories, doctor-specific access,
 *      and referral-based access delegation. Records stored as IPFS CIDs on-chain.
 */
contract MedicalRecords {
    enum Category { Diagnosis, Lab, Prescription, Imaging, Other }

    struct Record {
        string ipfsCid;
        Category category;
        address addedBy;       // doctor or patient who added it
        uint256 timestamp;
        string description;
    }

    // patient => list of records
    mapping(address => Record[]) private patientRecords;
    // patient => doctor => hasAccess
    mapping(address => mapping(address => bool)) private accessGrants;
    // patient => list of doctors with access
    mapping(address => address[]) private accessList;
    // patient => doctor => record was added
    mapping(address => mapping(address => bool)) public hasInteraction;

    event RecordAdded(address indexed patient, string ipfsCid, Category category, address addedBy);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);

    modifier onlyPatient(address patient) {
        require(msg.sender == patient, "Only the patient can perform this action");
        _;
    }

    modifier hasAccess(address patient) {
        require(
            msg.sender == patient || accessGrants[patient][msg.sender],
            "No access to patient records"
        );
        _;
    }

    /**
     * @dev Patient adds their own record
     */
    function addRecord(
        string calldata _ipfsCid,
        Category _category,
        string calldata _description
    ) external {
        patientRecords[msg.sender].push(Record({
            ipfsCid: _ipfsCid,
            category: _category,
            addedBy: msg.sender,
            timestamp: block.timestamp,
            description: _description
        }));
        emit RecordAdded(msg.sender, _ipfsCid, _category, msg.sender);
    }

    /**
     * @dev Doctor adds a record for a patient (requires access)
     */
    function addRecordForPatient(
        address _patient,
        string calldata _ipfsCid,
        Category _category,
        string calldata _description
    ) external hasAccess(_patient) {
        patientRecords[_patient].push(Record({
            ipfsCid: _ipfsCid,
            category: _category,
            addedBy: msg.sender,
            timestamp: block.timestamp,
            description: _description
        }));
        hasInteraction[_patient][msg.sender] = true;
        emit RecordAdded(_patient, _ipfsCid, _category, msg.sender);
    }

    /**
     * @dev Patient grants access to a doctor
     */
    function grantAccess(address _doctor) external {
        require(!accessGrants[msg.sender][_doctor], "Access already granted");
        accessGrants[msg.sender][_doctor] = true;
        accessList[msg.sender].push(_doctor);
        emit AccessGranted(msg.sender, _doctor);
    }

    /**
     * @dev Patient revokes access from a doctor
     */
    function revokeAccess(address _doctor) external {
        require(accessGrants[msg.sender][_doctor], "No access to revoke");
        accessGrants[msg.sender][_doctor] = false;
        // Remove from list
        address[] storage list = accessList[msg.sender];
        for (uint i = 0; i < list.length; i++) {
            if (list[i] == _doctor) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
        emit AccessRevoked(msg.sender, _doctor);
    }

    /**
     * @dev Grant access via referral (called by ReferralSystem contract)
     */
    function grantAccessByReferral(address _patient, address _doctor) external {
        if (!accessGrants[_patient][_doctor]) {
            accessGrants[_patient][_doctor] = true;
            accessList[_patient].push(_doctor);
            emit AccessGranted(_patient, _doctor);
        }
    }

    /**
     * @dev Get all records for a patient
     */
    function getRecords(address _patient) external view hasAccess(_patient) returns (Record[] memory) {
        return patientRecords[_patient];
    }

    /**
     * @dev Get records by category
     */
    function getRecordsByCategory(address _patient, Category _category) external view hasAccess(_patient) returns (Record[] memory) {
        Record[] storage all = patientRecords[_patient];
        uint count = 0;
        for (uint i = 0; i < all.length; i++) {
            if (all[i].category == _category) count++;
        }
        Record[] memory filtered = new Record[](count);
        uint j = 0;
        for (uint i = 0; i < all.length; i++) {
            if (all[i].category == _category) {
                filtered[j] = all[i];
                j++;
            }
        }
        return filtered;
    }

    /**
     * @dev Get record count for a patient
     */
    function getRecordCount(address _patient) external view returns (uint256) {
        return patientRecords[_patient].length;
    }

    /**
     * @dev Check if a doctor has access to a patient's records
     */
    function checkAccess(address _patient, address _doctor) external view returns (bool) {
        return accessGrants[_patient][_doctor];
    }

    /**
     * @dev Get list of doctors with access to a patient's records
     */
    function getAccessList(address _patient) external view returns (address[] memory) {
        require(msg.sender == _patient, "Only patient can view access list");
        return accessList[_patient];
    }
}
