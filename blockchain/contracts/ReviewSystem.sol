// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ReviewSystem
 * @dev Immutable, transparent doctor review & rating system.
 *      Only patients who have verified interactions can leave reviews.
 */
contract ReviewSystem {
    struct Review {
        address patient;
        address doctor;
        uint8 rating;       // 1-5
        string comment;
        uint256 timestamp;
    }

    // doctor => reviews
    mapping(address => Review[]) public doctorReviews;
    // doctor => total rating sum
    mapping(address => uint256) public ratingSum;
    // doctor => total review count
    mapping(address => uint256) public reviewCount;
    // patient => doctor => hasReviewed
    mapping(address => mapping(address => bool)) public hasReviewed;

    event ReviewAdded(address indexed patient, address indexed doctor, uint8 rating);

    /**
     * @dev Submit a review for a doctor
     */
    function addReview(
        address _doctor,
        uint8 _rating,
        string calldata _comment
    ) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(!hasReviewed[msg.sender][_doctor], "Already reviewed this doctor");
        require(msg.sender != _doctor, "Cannot review yourself");

        doctorReviews[_doctor].push(Review({
            patient: msg.sender,
            doctor: _doctor,
            rating: _rating,
            comment: _comment,
            timestamp: block.timestamp
        }));

        ratingSum[_doctor] += _rating;
        reviewCount[_doctor]++;
        hasReviewed[msg.sender][_doctor] = true;

        emit ReviewAdded(msg.sender, _doctor, _rating);
    }

    /**
     * @dev Get average rating for a doctor (returns value * 100 for precision)
     */
    function getAverageRating(address _doctor) external view returns (uint256) {
        if (reviewCount[_doctor] == 0) return 0;
        return (ratingSum[_doctor] * 100) / reviewCount[_doctor];
    }

    /**
     * @dev Get all reviews for a doctor
     */
    function getReviews(address _doctor) external view returns (Review[] memory) {
        return doctorReviews[_doctor];
    }

    /**
     * @dev Get review count for a doctor
     */
    function getReviewCount(address _doctor) external view returns (uint256) {
        return reviewCount[_doctor];
    }
}
