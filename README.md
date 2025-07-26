Here’s your updated `README.md` with a **professional touch** and just the right amount of **emojis** to make it visually engaging without overdoing it:

---

## Overview

**Forensia** is an advanced **AI-powered system** designed to analyze human emotions and behaviors through video surveillance.
Built for law enforcement and security applications, it detects subtle **facial expressions** and **micro-behaviors** to identify moments of deception, tension, or evasion.
The platform generates comprehensive reports highlighting inconsistencies and potential areas of concern providing investigators with insights that might otherwise go unnoticed.

---

## Features

* 🎯 **Real-time Emotion Analysis**: Detect and interpret facial expressions during interrogations
* 🔍 **Behavioral Pattern Recognition**: Identify suspicious behaviors and inconsistencies
* 🧾 **AI-Generated Reports**: Automatically create detailed summaries using Google's Gemini API
* 📊 **Interactive Dashboard**: Explore emotion trends and behavioral data through a visual dashboard
* 🔐 **Secure Authentication**: User login and registration with encrypted credentials
* 📁 **Session Management**: Organize and review past interrogation sessions with ease

---

## Technology Stack

### Frontend

* React (TypeScript)
* Tailwind CSS
* React Router
* Vite

###  Backend

* Python 3.x
* Flask & Flask-SocketIO
* DeepFace (emotion recognition)
* MediaPipe (gesture tracking)
* OpenCV (video processing)
* TensorFlow (machine learning)
* Google Generative AI (Gemini) – for report generation

---

##Installation & Prerequisites

* Node.js and npm
* Python 3.x
* Git

---

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/GeetikaMehta/Forensia.git
cd Forensia/backend

# Set up a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Set your API key in .env
# GEMINI_API_KEY=your_gemini_api_key_here
```

---

###Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install frontend dependencies
npm install

# Start the frontend dev server
npm run dev
```

---

## 🚀 Usage

1. **Start the backend**

   ```bash
   cd backend
   .\venv\Scripts\activate
   python api.py
   ```

2. **Launch the frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the app**
   Open your browser at: `http://localhost:5173`

---

##Project Structure

```
.
├── backend/
│   ├── api.py
│   ├── requirements.txt
│   ├── app/
│   │   ├── analyzers/
│   │   ├── generators/
│   │   ├── managers/
│   │   ├── auth.py
│   │   ├── feedback.py
│   │   └── main.py
│   ├── data/
│   ├── session_data/
│   └── session_reports/
└── frontend/
    ├── index.html
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── assets/
    │   └── App.tsx
    ├── package.json
    └── tailwind.config.js
```

---

##Key Capabilities

Dashboard Overview: Real-time behavioral and emotional metrics.
AI Report Generation: Detailed summaries highlighting key observations.
24/7 Availability: Analyze sessions any time, from anywhere.

---

##Acknowledgments

* [DeepFace](https://github.com/serengil/deepface) and [MediaPipe](https://mediapipe.dev/) for emotion and gesture recognition
* [Google Generative AI (Gemini)](https://ai.google.dev/) for intelligent report generation

