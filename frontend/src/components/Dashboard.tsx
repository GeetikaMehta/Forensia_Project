import dashboard from "../assets/images/dashboard.png";

const Dashboard = () => {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black py-16 px-8 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 mb-12">
        Our AI-Powered Dashboard
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: Images */}
        <div className="space-y-6">
          <img
            src={dashboard}
            alt="Dashboard 2"
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
