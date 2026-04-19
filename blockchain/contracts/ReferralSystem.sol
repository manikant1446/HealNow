// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MedicalRecords.sol";

/**
 * @title ReferralSystem
 * @dev Smart referral workflow between doctors with access delegation.
 */
contract ReferralSystem {
    enum ReferralStatus { Pending, Accepted, Declined, Completed }

    struct Referral {
        uint256 id;
        address fromDoctor;
        address toDoctor;
        address patient;
        string reason;
        string notes;
        ReferralStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    MedicalRecords public medicalRecords;
    uint256 public referralCount;
    mapping(uint256 => Referral) public referrals;

    // doctor => incoming referral IDs
    mapping(address => uint256[]) public incomingReferrals;
    // doctor => outgoing referral IDs
    mapping(address => uint256[]) public outgoingReferrals;
    // patient => referral IDs involving them
    mapping(address => uint256[]) public patientReferrals;

    event ReferralCreated(uint256 indexed id, address indexed from, address indexed to, address patient);
    event ReferralAccepted(uint256 indexed id, address indexed doctor);
    event ReferralDeclined(uint256 indexed id, address indexed doctor);
    event ReferralCompleted(uint256 indexed id);

    constructor(address _medicalRecords) {
        medicalRecords = MedicalRecords(_medicalRecords);
    }

    /**
     * @dev Create a referral from one doctor to another
     */
    function createReferral(
        address _toDoctor,
        address _patient,
        string calldata _reason,
        string calldata _notes
    ) external {
        require(_toDoctor != msg.sender, "Cannot refer to yourself");
        require(_patient != address(0), "Invalid patient address");

        uint256 id = referralCount++;
        referrals[id] = Referral({
            id: id,
            fromDoctor: msg.sender,
            toDoctor: _toDoctor,
            patient: _patient,
            reason: _reason,
            notes: _notes,
            status: ReferralStatus.Pending,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        outgoingReferrals[msg.sender].push(id);
        incomingReferrals[_toDoctor].push(id);
        patientReferrals[_patient].push(id);

        emit ReferralCreated(id, msg.sender, _toDoctor, _patient);
    }

    /**
     * @dev Accept a referral - automatically grants record access
     */
    function acceptReferral(uint256 _id) external {
        Referral storage ref = referrals[_id];
        require(ref.toDoctor == msg.sender, "Not the target doctor");
        require(ref.status == ReferralStatus.Pending, "Referral not pending");

        ref.status = ReferralStatus.Accepted;
        ref.updatedAt = block.timestamp;

        // Grant medical record access to the referred doctor
        medicalRecords.grantAccessByReferral(ref.patient, msg.sender);

        emit ReferralAccepted(_id, msg.sender);
    }

    /**
     * @dev Decline a referral
     */
    function declineReferral(uint256 _id) external {
        Referral storage ref = referrals[_id];
        require(ref.toDoctor == msg.sender, "Not the target doctor");
        require(ref.status == ReferralStatus.Pending, "Referral not pending");

        ref.status = ReferralStatus.Declined;
        ref.updatedAt = block.timestamp;

        emit ReferralDeclined(_id, msg.sender);
    }

    /**
     * @dev Mark referral as completed
     */
    function completeReferral(uint256 _id) external {
        Referral storage ref = referrals[_id];
        require(
            ref.fromDoctor == msg.sender || ref.toDoctor == msg.sender,
            "Not involved in this referral"
        );
        require(ref.status == ReferralStatus.Accepted, "Referral not accepted");

        ref.status = ReferralStatus.Completed;
        ref.updatedAt = block.timestamp;

        emit ReferralCompleted(_id);
    }

    /**
     * @dev Get a referral by ID
     */
    function getReferral(uint256 _id) external view returns (Referral memory) {
        return referrals[_id];
    }

    /**
     * @dev Get incoming referrals for a doctor
     */
    function getIncomingReferrals(address _doctor) external view returns (uint256[] memory) {
        return incomingReferrals[_doctor];
    }

    /**
     * @dev Get outgoing referrals for a doctor
     */
    function getOutgoingReferrals(address _doctor) external view returns (uint256[] memory) {
        return outgoingReferrals[_doctor];
    }

    /**
     * @dev Get referrals involving a patient
     */
    function getPatientReferrals(address _patient) external view returns (uint256[] memory) {
        return patientReferrals[_patient];
    }
}
