<div align="center">
  <img src="./frontend/public/favicon.svg" alt="HealNow Logo" width="120" />
  
  <h1>🏥 HealNow - Web3 Healthcare Platform</h1>
  
  <p><strong>A decentralized, trust-based healthcare and doctor-patient collaboration platform.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black" alt="Solidity" />
    <img src="https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white" alt="Ethereum" />
    <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  </p>
</div>

<br />

HealNow leverages the immutability of blockchain technology while maintaining a seamless Web2-like experience using managed decentralized wallets. It introduces a powerful social graph-based trust system, dynamic analytics, and a seamless smart referral network.

---

## ✨ Premium Features

### 🧑‍⚕️ For Doctors
| Feature | Description |
| :--- | :--- |
| **📊 Dynamic Analytics** | Real-time insights, patient trends, disease distributions, and peak hour tracking powered by Chart.js. |
| **📅 Appointment Manager** | Approve, reject, or complete patient appointment requests easily with interactive cards. |
| **📋 Consultation Tracking** | Form-based consultation creation that auto-registers new patients seamlessly on the backend. |
| **🤝 Smart Referrals** | Refer critical cases to specialist doctors with priority tagging (Critical, High, Medium, Low). |
| **📄 PDF Generation** | One-click export of patient consultation history into formatted PDF reports using `jsPDF`. |

### 👨‍👩‍👧‍👦 For Patients
| Feature | Description |
| :--- | :--- |
| **🔍 Trust-Based Discovery** | Find doctors via "Contact Access" — see if your trusted social contacts have visited a doctor. |
| **🗓️ Seamless Booking** | View dynamic 30-minute time slots (9 AM to 5 PM) to book appointments instantly. |
| **🩺 Medical Dashboard** | Securely view past diagnoses, consultation history, and manage upcoming appointments. |

---

## 🔐 Web3 Architecture & Security

- **Managed Decentralized Identities (DID):** Ethereum wallets are automatically generated for users upon registration, removing the friction of external wallet extensions like MetaMask.
- **Smart Contracts:** Deployed on Hardhat (Polygon Amoy compatible) for Doctor Registry, Medical Records, Referral Systems, and Reviews.
- **Robust Auth:** JWT-based authentication via Axios interceptors, securing both frontend routing and backend API logic.

---

## 🚀 Quick Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/en/) (v16+) and Git installed.

### 1. Clone the repository
```bash
git clone https://github.com/manikant1446/HealNow.git
cd HealNow
```

### 2. Start the Backend
The backend utilizes an in-memory MongoDB server for testing out-of-the-box (no external database setup required!).
```bash
cd backend
npm install
npm start
```
> **Note:** Runs on `http://localhost:5001`. The database will automatically seed demo patients and doctors.

### 3. Start the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> **Note:** Runs on `http://localhost:5174`. Uses Vite for ultra-fast HMR and build times.

---

## 🧪 Demo Accounts

The application automatically seeds the following accounts for immediate testing. 

🔑 **Password for all accounts:** `password123`

| Role | Name | Specialty | Email |
| :--- | :--- | :--- | :--- |
| **Doctor** | Dr. Sarah Johnson | Cardiology | `doctor@healnow.com` |
| **Doctor** | Dr. Michael Chen | Neurology | `neurologist@healnow.com` |
| **Patient** | Alex Thompson | - | `patient@healnow.com` |
| **Patient** | Priya Sharma | - | `priya@healnow.com` |
| **Patient** | Rahul Verma | - | `rahul@healnow.com` |

---

## 📂 Project Structure

```text
HealNow/
├── backend/
│   ├── config/        # Database & Seed Scripts
│   ├── middleware/    # JWT Auth & Roles (doctorOnly, patientOnly)
│   ├── models/        # Mongoose schemas (User, Appointment, Consultation)
│   └── routes/        # Express REST API endpoints
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (split by role & common)
│   │   ├── contexts/    # AuthContext with Axios interceptors
│   │   └── index.css    # Custom CSS Design System (Glassmorphism, animations)
│   └── vite.config.js
└── blockchain/
    ├── contracts/     # Solidity Smart Contracts (.sol)
    └── scripts/       # Hardhat deployment scripts
```

---

<div align="center">
  <i>Built with ❤️ for a decentralized healthcare future.</i>
</div>
