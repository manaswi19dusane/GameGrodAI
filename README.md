# 🎮 GameGuard AI

> Detecting unfair gameplay using intelligent telemetry

GameGuard AI is a full-stack machine learning application built to detect cheating behavior in online multiplayer games. It analyzes gameplay telemetry, system info, and behavioral patterns to flag potential cheaters using an intelligent model.

---

## 🚀 Features

* 📄 Upload game telemetry data as CSV
* 🧠 Detect cheaters based on system + gameplay signals
* 📊 View predictions with confidence levels
* 🔐 Flags like "VM Detected" and "Secure Boot Off"
* 🌙 Light/Dark mode toggle
* 🔄 Real-time feedback with loading indicators
* 📜 Scrollable prediction result table

---

## 🧱 Tech Stack

| Frontend                   | Backend        | ML/Infra                     |
| -------------------------- | -------------- | ---------------------------- |
| React + Vite + TailwindCSS | Flask + Python | Scikit-learn, Pandas, Joblib |

---

## 📂 Folder Structure

```
GameGuardAI/
├── backend/
│   ├── app.py                  # Flask server
│   └── models/                 # ML model + utilities
│       ├── model.py
│       ├── *.pkl               # Encoders, model, imputers
│       ├── train.csv           # Training data
│       ├── test.py             # Manual test runner
│       └── sample_test1.csv    # Sample test files
├── frontend/
│   ├── src/                    # React + Tailwind frontend
│   │   ├── GameGuardAI.jsx
│   │   ├── App.jsx
│   │   └── index.css, main.jsx
│   └── public/
│   └── vite.config.js
└── README.md
```

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/GameGuardAI.git
cd GameGuardAI
```

---

### 2. Backend Setup (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

If `requirements.txt` is not yet created, install manually:

```bash
pip install flask flask-cors pandas scikit-learn joblib
```

---

### 3. Frontend Setup (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs on: [http://localhost:5173](http://localhost:5173)

Make sure your Flask backend is running on [http://localhost:5000](http://localhost:5000)

---

## 📁 Sample Test CSVs

* `test_sample_1.csv`: Mixed fair and flagged players
* `test_sample_3.csv`: All clean players
* `sample_test_valid_5_rows.csv`: 5-row valid structure for testing

---

## 🧠 ML Model Overview

* Trained on telemetry + system behavior features
* Uses `RandomForestClassifier` (or similar) for classification
* Handles class imbalance and unseen categorical values
* Prediction includes:

  * Player ID
  * Classification (Cheater / Fair)
  * Confidence Score
  * Behavior Flags

---

## 📸 Screenshots

### Upload + Analyze
<img width="1892" height="811" alt="GameGuard ai" src="https://github.com/user-attachments/assets/0f1d69ac-3079-4207-8c48-0c10d32e708e" />


### Results Dashboard

<img width="1891" height="893" alt="Screenshot 2025-07-31 180459" src="https://github.com/user-attachments/assets/d69be5bc-ec83-45eb-ac96-55dcff92e303" />

### Demo


https://github.com/user-attachments/assets/6edbe5d6-5a8a-423d-88eb-cec90b21299b



---

## 👨‍💻 Authors

* [Siddhi Nagapure](https://github.com/Siddhi-Nagapure-5)
* Special thanks to collaborators and dataset providers

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
