# HealNow - Web3 Healthcare Platform

HealNow is a decentralized healthcare and doctor-patient collaboration platform built on Web3 technologies. It leverages blockchain for immutability and transparency while maintaining a seamless Web2-like user experience using managed wallets. 

The platform features a social graph-based trust discovery system, secure consultation tracking, appointment management, and actionable analytics for healthcare providers.

## 🌟 Key Features

### For Patients:
- **Trust-Based Doctor Discovery**: Find doctors trusted by your social network (Contact Access).
- **Appointment Booking**: View available slots and book appointments seamlessly.
- **My Appointments**: Manage and cancel pending/confirmed appointments.
- **Medical Dashboard**: Access your consultation history and upcoming appointments.

### For Doctors:
- **Dynamic Analytics Dashboard**: Real-time insights, patient trends, disease distribution, and peak hours powered by Chart.js.
- **Consultation Management**: Create patient consultations, auto-registering patients on-the-fly.
- **Appointment Manager**: Approve, reject, or complete appointment requests.
- **PDF Reports**: Export consultation history to PDF with a single click.
- **Doctor Collaboration & Referrals**: Refer critical cases to specialists with priority tracking.

### Web3 & Security:
- **Decentralized Identities (DID)**: Managed Ethereum wallets created automatically on registration.
- **Smart Contracts**: Doctor Registry, Medical Records, Referral System, and Review System (deployed on Hardhat/Polygon Amoy).
- **Secure Authentication**: JWT-based authentication combined with managed private keys.

## 💻 Technology Stack

- **Frontend**: React, Vite, React Router, Chart.js, jsPDF, Vanilla CSS (Glassmorphism UI).
- **Backend**: Node.js, Express, MongoDB (Memory Server for dev), Mongoose, JWT.
- **Web3**: Ethers.js, Solidity, Hardhat.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+)
- [Git](https://git-scm.com/)

### 1. Clone the repository
```bash
git clone https://github.com/manikant1446/HealNow.git
cd HealNow
```

### 2. Setup the Backend
```bash
cd backend
npm install
npm start
```
*Note: The backend runs on `http://localhost:5001`. It uses an in-memory MongoDB server for testing. Demo data (3 patients, 2 doctors) is automatically seeded.*

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5174`.*

## 🧪 Demo Credentials

The backend automatically seeds these users so you can test the platform immediately:

**Password for all accounts:** `password123`

**Doctors:**
- `doctor@healnow.com` (Sarah Johnson - Cardiology)
- `neurologist@healnow.com` (Michael Chen - Neurology)

**Patients:**
- `patient@healnow.com` (Alex Thompson)
- `priya@healnow.com` (Priya Sharma)
- `rahul@healnow.com` (Rahul Verma)

## 📁 Project Structure

```
HealNow/
├── backend/
│   ├── models/        # Mongoose schema (User, Consultation, Appointment, Contact, Referral)
│   ├── routes/        # Express API endpoints
│   ├── middleware/    # JWT Auth & Role protection
│   └── server.js      # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components organized by role (doctor/patient/common)
│   │   ├── contexts/    # Global state (AuthContext)
│   │   └── index.css    # Global styling & Design System
│   └── vite.config.js
└── blockchain/
    ├── contracts/     # Solidity Smart Contracts
    └── scripts/       # Deployment scripts
```

## 🛡️ Future Enhancements
- Transition to a persistent MongoDB Atlas database.
- Deploy smart contracts to Polygon Mainnet.
- Integrate IPFS via Pinata for decentralized diagnostic report storage.
