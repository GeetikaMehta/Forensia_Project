import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import { getSessions, getReports } from "../services/forensiaApi";

const DashBoardPage: React.FC = () => {
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get sessions and reports
      const sessions = await getSessions();
      const reports = await getReports();

      // Sort by most recent and take top 5
      const sortedSessions = sessions
        .sort((a, b) => b.start_time - a.start_time)
        .slice(0, 5);
      const sortedReports = reports
        .sort((a, b) => {
          return (
            (b.session_info?.end_time || 0) - (a.session_info?.end_time || 0)
          );
        })
        .slice(0, 5);

      setRecentSessions(sortedSessions);
      setRecentReports(sortedReports);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Background />

      <main className="flex-grow container mx-auto p-4 z-10 relative">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-white">
          <h1 className="text-3xl font-bold mb-6">Our AI-Powered Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
              {loading ? (
                <p className="text-gray-300">Loading sessions...</p>
              ) : recentSessions.length > 0 ? (
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <Link
                      key={session.id}
                      to={`/results?session=${session.id}`}
                      className="block p-3 bg-slate-600 rounded hover:bg-slate-500"
                    >
                      <div className="font-medium">Session {session.id}</div>
                      <div className="text-sm text-gray-300">
                        {formatDate(session.start_time)}
                      </div>
                      <div className="text-sm">
                        {session.frames_count} frames
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No sessions found</p>
              )}
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
              {loading ? (
                <p className="text-gray-300">Loading reports...</p>
              ) : recentReports.length > 0 ? (
                <div className="space-y-2">
                  {recentReports.map((report) => (
                    <Link
                      key={report.id}
                      to={`/results?report=${report.id}`}
                      className="block p-3 bg-slate-600 rounded hover:bg-slate-500"
                    >
                      <div className="font-medium">Report {report.id}</div>
                      {report.session_info?.start_time && (
                        <div className="text-sm text-gray-300">
                          {formatDate(report.session_info.start_time)}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No reports found</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/interrogation"
              className="block p-6 bg-blue-600 rounded-lg text-center hover:bg-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">New Analysis</h2>
              <p>Start a new forensic analysis session</p>
            </Link>

            <Link
              to="/results"
              className="block p-6 bg-green-600 rounded-lg text-center hover:bg-green-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">View Results</h2>
              <p>Browse sessions and generated reports</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashBoardPage;
