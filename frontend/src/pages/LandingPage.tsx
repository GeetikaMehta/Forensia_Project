import { useNavigate } from "react-router-dom";
import { Shield, Brain, Video as VideoIcon, ChevronDown, Users, Activity, Clock, Star, BarChart, Calendar, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import b12Video from "../assets/videos/b14.mp4";
import i1 from "../assets/images/g.jpg";
import i2 from "../assets/images/j.jpg";
import i3 from "../assets/images/t.jpg";
import i5 from "../assets/images/r.jpg";
import i6 from "../assets/images/a2.jpg";
import i7 from "../assets/images/a3.png";
import dashboard from "../assets/images/dashboard.png";

// API URL
const API_URL = "http://localhost:5000/api";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    feedback: "",
    rating: 5
  });
  const [submitStatus, setSubmitStatus] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  // Static analytics data
  const stats = {
    activeUsers: 24,
    accuracy: 98.5,
    analysisTime: 0.5,
    totalAnalysis: 15243,
    recentCases: 156,
    detectedEmotions: {
      anger: 25,
      fear: 15,
      happiness: 30,
      sadness: 20,
      surprise: 10
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("");
    setSubmitError("");

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...feedbackForm,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("Thank you for your feedback!");
        setFeedbackForm({ name: "", email: "", feedback: "", rating: 5 });
        setTimeout(() => setSubmitStatus(""), 3000);
      } else {
        setSubmitError(data.error || "Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      setSubmitError("Error submitting feedback. Please try again later.");
      console.error("Error:", error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, trend, color }: any) => (
    <div className={`bg-gradient-to-br from-${color}-500/10 to-transparent p-6 rounded-xl 
                    border border-${color}-500/20 transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className={`text-${color}-400 w-8 h-8`} />
        <span className={`text-${color}-400 text-sm font-medium`}>
          {trend > 0 ? `↑ ${trend}%` : trend < 0 ? `↓ ${Math.abs(trend)}%` : '−0%'}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Navbar */}
      <div className="backdrop-blur-md bg-black/60 border-b-4 border-purple-500 sticky top-0 z-40">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src={b12Video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-[Orbitron] 
                       bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 
                       bg-clip-text text-transparent animate-shine tracking-wide 
                       drop-shadow-[0_0_15px_rgba(147,51,234,0.8)] mb-6 sm:mb-8">
            Forensia
          </h1>
          <h3 className="text-xl md:text-3xl lg:text-4xl font-medium font-[Orbitron] 
                       bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 
                       bg-clip-text text-transparent animate-shine tracking-wide 
                       drop-shadow-[0_0_15px_rgba(147,51,234,0.8)] mb-6 sm:mb-8">
            Uncovering Evidence through Emotions
          </h3>

          <p className="text-base md:text-lg lg:text-xl text-gray-300 opacity-90 max-w-4xl mx-auto text-center mb-10 sm:mb-12">
            Forensia uses AI to analyze emotions and behavior from video
            footage—helping investigators detect deception, spot hidden
            patterns, and gain deeper insight during criminal investigations.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/interrogation")}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 
                         rounded-xl text-lg font-medium overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">Analyze Now!</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 
                              opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="group relative px-8 py-4 bg-transparent border-2 border-purple-500
                         rounded-xl text-lg font-medium overflow-hidden transform hover:scale-105 transition-all duration-300
                         hover:bg-purple-500/20"
            >
              <span className="relative z-10">View Dashboard</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-10 py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-500/20">
              <Users className="w-12 h-12 text-purple-400 mb-4" />
              <h4 className="text-3xl font-bold text-white mb-2">1000+</h4>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20">
              <Activity className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-3xl font-bold text-white mb-2">98%</h4>
              <p className="text-gray-400">Accuracy Rate</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/20">
              <Clock className="w-12 h-12 text-cyan-400 mb-4" />
              <h4 className="text-3xl font-bold text-white mb-2">24/7</h4>
              <p className="text-gray-400">Analysis Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investigative Insights Section */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Investigative Insights
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[i1, i2, i3, i5, i6, i7].map((img, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={img}
                  alt={`Investigation ${index + 1}`}
                  className="object-cover w-full h-72 sm:h-80 transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                                flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">Case Study {index + 1}</h3>
                    <p className="text-gray-300 text-sm">
                      Discover how our AI-powered analysis helped solve complex investigations.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              What We Offer
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="text-purple-400 w-12 h-12 mb-6" />,
                title: "Security",
                desc: "Protect sensitive information using advanced security measures to ensure integrity.",
                gradient: "from-purple-500/20 to-transparent",
                border: "border-purple-500/20",
              },
              {
                icon: <Brain className="text-blue-400 w-12 h-12 mb-6" />,
                title: "AI Insights",
                desc: "Leverage AI to generate actionable insights from complex data streams.",
                gradient: "from-blue-500/20 to-transparent",
                border: "border-blue-500/20",
              },
              {
                icon: <VideoIcon className="text-cyan-400 w-12 h-12 mb-6" />,
                title: "Video Analysis",
                desc: "Analyze video data for emotional and behavioral cues to assist investigations.",
                gradient: "from-cyan-500/20 to-transparent",
                border: "border-cyan-500/20",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group p-8 rounded-xl bg-gradient-to-br ${item.gradient} 
                           border ${item.border} transition-all duration-300 
                           hover:transform hover:scale-105 hover:shadow-xl`}
              >
                {item.icon}
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Overview Section */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Analytics Overview
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive analysis metrics from our investigation platform
            </p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              title="Active Sessions"
              value={stats.activeUsers}
              trend={12}
              color="purple"
            />
            <StatCard
              icon={Activity}
              title="Accuracy Rate"
              value={`${stats.accuracy}%`}
              trend={2.5}
              color="blue"
            />
            <StatCard
              icon={Clock}
              title="Avg. Analysis Time"
              value={`${stats.analysisTime}s`}
              trend={-20}
              color="cyan"
            />
            <StatCard
              icon={BarChart}
              title="Total Analysis"
              value={stats.totalAnalysis.toLocaleString()}
              trend={18}
              color="pink"
            />
          </div>

          {/* Detailed Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/90 to-black/90 
                          border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  { icon: VideoIcon, text: "New interrogation session started", time: "2 minutes ago" },
                  { icon: AlertCircle, text: "Unusual behavior detected in Room 2", time: "15 minutes ago" },
                  { icon: CheckCircle, text: "Analysis completed for Case #1234", time: "1 hour ago" },
                  { icon: TrendingUp, text: "Weekly report generated", time: "3 hours ago" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <activity.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300 flex-grow">{activity.text}</span>
                    <span className="text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotion Distribution */}
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 
                          border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Emotion Distribution
              </h2>
              <div className="space-y-4">
                {Object.entries(stats.detectedEmotions).map(([emotion, value]) => (
                  <div key={emotion} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{emotion}</span>
                      <span className="text-gray-300">{value}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Descriptive Dashboard Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 mb-12">
            Our AI-Powered Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: Images */}
            <div className="space-y-6">
              <img
                src={dashboard}
                alt="Dashboard Preview"
                className="w-full h-auto rounded-xl shadow-lg object-cover transform hover:scale-105 transition-all duration-500"
              />
            </div>

            {/* Right: Text */}
            <div className="text-white text-lg leading-relaxed space-y-6">
              <p className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-800 rounded-xl p-6">
                Gain immediate insight into behavioral patterns and emotional
                responses captured during investigative sessions. The AI analyzes
                facial expressions, voice stress, and micro-behaviors to highlight
                moments of tension, evasion, or inconsistency—helping investigators
                pinpoint areas that may warrant deeper examination.
              </p>
              <p className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-800 rounded-xl p-6">
                Use dynamic filters and comparative tools to explore multiple
                sessions, identify recurring behavioral trends, and assess suspect
                responses over time. Whether you're building a psychological profile
                or verifying statements against behavioral cues, this overview
                delivers critical intelligence to enhance the accuracy and
                efficiency of your investigation.
              </p>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 
                           rounded-xl text-lg font-medium overflow-hidden transform hover:scale-105 
                           transition-all duration-300"
                >
                  <span className="relative z-10">View Full Dashboard</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 
                                opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Share Your Experience
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
            <p className="text-gray-400">Your feedback helps us improve and provide better service.</p>
            {submitStatus && (
              <div className="mt-4 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                {submitStatus}
              </div>
            )}
            {submitError && (
              <div className="mt-4 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {submitError}
              </div>
            )}
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={feedbackForm.email}
                onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-300 mb-2">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                rows={4}
                value={feedbackForm.feedback}
                onChange={(e) => setFeedbackForm({...feedbackForm, feedback: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Share your thoughts and suggestions..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFeedbackForm({...feedbackForm, rating})}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      feedbackForm.rating >= rating 
                        ? 'text-yellow-400 hover:text-yellow-300' 
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    <Star className={`w-6 h-6 ${feedbackForm.rating >= rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 
                         rounded-xl text-lg font-medium overflow-hidden transform hover:scale-105 
                         transition-all duration-300"
              >
                <span className="relative z-10">Submit Feedback</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 
                              opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/feedback")}
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              View All Feedback →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Define the Report type with at least an 'id' property
type Report = {
  id: string | number;
  // Add other properties as needed
};

// getReports function
export async function getReports() {
  try {
    const response = await fetch(`${API_URL}/reports`);

    if (!response.ok) {
      console.error(`Error fetching reports: ${response.status}`);
      return [];
    }

    // The list of reports might still be JSON
    const reportsList = await response.json();

    // Filter out any empty reports
    return reportsList.filter((report: Report) => report && report.id);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export default LandingPage;
