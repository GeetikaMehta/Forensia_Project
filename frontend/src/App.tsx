import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import InterrogationPage from "./pages/InterrogationPage";
import ResultsPage from "./pages/ResultsPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import FeedbackPage from "./pages/FeedbackPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashBoard from "./components/Dashboard";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/interrogation" element={<InterrogationPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashBoard />
              </PrivateRoute>
            }
          />
          {/* Fallback route for unknown paths */}
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </Router>
  );
};

export default App;
