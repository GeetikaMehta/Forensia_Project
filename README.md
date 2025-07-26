# Forensia: Uncovering Evidence through Emotions


<!-- ![Forensia](./Forensia.png) -->
<img src="./Forensia.png" alt="Forensia" width="950"/>

## Overview 

Forensia is an advanced AI-powered system designed to analyze human emotions and behaviors through video surveillance. Built for law enforcement and security applications, it detects subtle facial expressions and micro-behaviors to identify moments of deception, tension, or evasion. The platform generates comprehensive reports highlighting inconsistencies and potential areas of concern, providing investigators with valuable insights that might otherwise go unnoticed.

## Features

- **Real-time Emotion Analysis**: Detect and analyze facial expressions and emotions during interrogations
- **Behavioral Pattern Recognition**: Identify suspicious behavioral patterns and inconsistencies
- **AI-Generated Reports**: Automatically generate comprehensive markdown reports using Google's Gemini API
- **Interactive Dashboard**: Review statistics, trends, and analysis results in a comprehensive dashboard
- **Secure Authentication**: User login and registration system with encrypted credentials
- **Session Management**: Create, organize, and access past interrogation sessions

## Technology Stack 

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Vite as the build tool

### Backend
- Python 3.x
- Flask and Flask-SocketIO
- DeepFace for emotion analysis
- MediaPipe for gesture recognition
- Google Generative AI (Gemini) for report generation
- OpenCV for video processing
- TensorFlow for ML models

## Installation 

### Prerequisites
- Node.js and npm
- Python 3.x
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/jasneet-arora27/Forensia.git
cd Forensia/backend

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with required API keys
# GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage 

1. **Start the Backend Server**:
   ```bash
   cd backend
   .\venv\Scripts\Activate
   python api.py
   ```

2. **Launch the Frontend Application**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Project Structure

```
.
├── backend/
│   ├── api.py                 # Main API entry point
│   ├── requirements.txt       # Python dependencies
│   ├── app/                   # Application modules
│   │   ├── analyzers/         # Emotion and behavior analysis modules
│   │   ├── generators/        # AI report generation
│   │   ├── managers/          # Session and report management
│   │   ├── auth.py            # Authentication handling
│   │   ├── feedback.py        # User feedback handling
│   │   └── main.py            # Core application logic
│   ├── data/                  # Stored user and feedback data
│   ├── session_data/          # Recording session data
│   └── session_reports/       # Generated analysis reports
└── frontend/
    ├── index.html             # Entry HTML file
    ├── src/                   # React application source
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Application pages
    │   ├── services/          # API service connectors
    │   ├── assets/            # Static resources
    │   └── App.tsx            # Main application component
    ├── package.json           # Frontend dependencies
    └── tailwind.config.js     # Tailwind CSS configuration
```

## Key Capabilities 

- **Dashboard Overview**: Gain immediate insight into behavioral patterns and emotional responses
- **Report Generation**: AI-powered analysis reports highlighting key findings and anomalies
- **24/7 Analysis Available**: Process and analyze data anytime

## Privacy Features

- **Analysis-Only Storage**: Forensia only saves analysis results (emotions, gestures, timestamps) rather than storing actual video frames
- **No Facial Images Stored**: Face and gesture detection occurs in real-time without persistent image storage
- **Secure Data Handling**: All session data is stored in JSON format with no personally identifiable information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- DeepFace and MediaPipe for providing the foundational AI models
- Google Gemini API for report generation capabilities

---

Made with ❤️ by Jasneet Arora