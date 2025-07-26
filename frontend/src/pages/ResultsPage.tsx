import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import {
  getSessions,
  getReports,
  getSessionData,
  getReportData,
} from "../services/forensiaApi";

const ResultsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [sessions, setSessions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "sessions") {
      loadSessions();
    } else {
      loadReports();
    }
  }, [activeTab]);

  // Effect to handle initial load based on URL parameters (if any)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionIdParam = params.get("session");
    const reportIdParam = params.get("report");

    if (sessionIdParam) {
      setActiveTab("sessions");
      // Delay viewing details slightly to allow sessions to load
      setTimeout(() => viewDetails(sessionIdParam), 100);
    } else if (reportIdParam) {
      setActiveTab("reports");
      // Delay viewing details slightly to allow reports to load
      setTimeout(() => viewDetails(reportIdParam), 100);
    }
  }, []); // Run only on initial mount

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
      // Keep selectedId and detailData if they match the current tab
      if (activeTab !== "sessions") {
        setSelectedId(null);
        setDetailData(null);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading sessions:", err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
      // Keep selectedId and detailData if they match the current tab
      if (activeTab !== "reports") {
        setSelectedId(null);
        setDetailData(null);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (id: string) => {
    try {
      setLoading(true);
      setSelectedId(id);
      setDetailData(null); // Clear previous details

      if (activeTab === "sessions") {
        const result = await getSessionData(id);
        if (result.success) {
          setDetailData(result.session);
          setError(null);
        } else {
          setError(result.error || "Failed to load session details");
        }
      } else {
        // activeTab is "reports"
        // Assuming getReportData fetches the JSON with { id, filename, content }
        const result = await getReportData(id);
        if (result.success) {
          // Set the entire report object including the content string
          setDetailData(result.report);
          setError(null);
        } else {
          setError(result.error || "Failed to load report details");
        }
      }
    } catch (err) {
      console.error(
        `Error loading ${
          activeTab === "sessions" ? "session" : "report"
        } details:`,
        err
      );
      setError(
        `Failed to load ${
          activeTab === "sessions" ? "session" : "report"
        } details`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string | number) => {
    if (!timestamp) return "N/A";

    const date = new Date(typeof timestamp === 'string' ? timestamp : timestamp * 1000);

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    return date.toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    if (seconds === undefined || seconds === null) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Background />

      <main className="flex-grow container mx-auto p-4 z-10 relative">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-white">
          <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>

          <div className="mb-6">
            <div className="flex border-b border-gray-600">
              <button
                className={`px-4 py-2 ${
                  activeTab === "sessions"
                    ? "border-b-2 border-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => setActiveTab("sessions")}
              >
                Sessions
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "reports"
                    ? "border-b-2 border-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => setActiveTab("reports")}
              >
                Reports
              </button>
            </div>
          </div>

          {loading && !detailData ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-red-400 py-4">{error}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Pane: List of Sessions or Reports */}
              <div className="lg:col-span-1 overflow-auto max-h-[70vh]">
                <h2 className="text-xl font-semibold mb-4">
                  {activeTab === "sessions"
                    ? "Available Sessions"
                    : "Generated Reports"}
                </h2>

                {activeTab === "sessions" && sessions.length === 0 && (
                  <p>No sessions found.</p>
                )}

                {activeTab === "reports" && reports.length === 0 && (
                  <p>No reports found.</p>
                )}

                {activeTab === "sessions" && (
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded cursor-pointer ${
                          selectedId === session.id
                            ? "bg-blue-700"
                            : "bg-slate-700 hover:bg-slate-600"
                        }`}
                        onClick={() => viewDetails(session.id)}
                      >
                        <div className="font-medium">Session {session.id}</div>
                        <div className="text-sm text-gray-300">
                          {session.start_time
                            ? formatDate(session.start_time)
                            : "Unknown date"}
                        </div>
                        <div className="text-sm">
                          {session.frames_count} frames
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reports" && (
                  <div className="space-y-2">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-3 rounded cursor-pointer ${
                          selectedId === report.id
                            ? "bg-blue-700"
                            : "bg-slate-700 hover:bg-slate-600"
                        }`}
                        onClick={() => viewDetails(report.id)}
                      >
                        <div className="font-medium">Report {report.id}</div>
                        {report.session_info?.start_time && (
                          <div className="text-sm text-gray-300">
                            {formatDate(report.session_info.start_time)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Pane: Details */}
              <div className="lg:col-span-2 bg-slate-700 p-4 rounded overflow-auto max-h-[70vh]">
                {loading && detailData ? (
                  <div className="text-center py-8">Loading details...</div>
                ) : selectedId && detailData ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {activeTab === "sessions"
                        ? `Session ${detailData.id}`
                        : `Report ${detailData.id}`}
                    </h2>

                    {activeTab === "sessions" && (
                      <div>
                        {/* Session details rendering */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-semibold">Start Time:</div>
                            <div>
                              {detailData.data?.start_time
                                ? formatDate(detailData.data.start_time)
                                : "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">End Time:</div>
                            <div>
                              {detailData.data?.end_time
                                ? formatDate(detailData.data.end_time)
                                : "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">Duration:</div>
                            <div>
                              {detailData.data?.duration
                                ? formatDuration(detailData.data.duration)
                                : "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">Frames:</div>
                            <div>{detailData.data?.frames?.length || 0}</div>
                          </div>
                        </div>

                        {detailData.data?.frames &&
                          detailData.data.frames.length > 0 && (
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                Captured Frames
                              </h3>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-600">
                                    <th className="text-left py-2">#</th>
                                    <th className="text-left py-2">Time</th>
                                    <th className="text-left py-2">Emotion</th>
                                    {/* Add Gesture column header if needed */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailData.data.frames.map(
                                    (frame: any, idx: number) => (
                                      <tr
                                        key={idx}
                                        className="border-b border-gray-700"
                                      >
                                        <td className="py-2">{idx + 1}</td>
                                        <td className="py-2">
                                          {frame.time_str ||
                                            formatDate(frame.timestamp)}
                                        </td>
                                        <td className="py-2">
                                          {frame.emotion?.dominant || "N/A"}
                                        </td>
                                        {/* Display gestures if available */}
                                        {/* <td className="py-2">
                                          {frame.gestures && frame.gestures.length > 0
                                            ? frame.gestures.map((g: any) => g.gesture).join(', ')
                                            : 'N/A'}
                                        </td> */}
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                      </div>
                    )}

                    {activeTab === "reports" && (
                      // Use ReactMarkdown to render the report content
                      <div className="prose prose-invert max-w-none">
                        {/* detailData.content should be the markdown string */}
                        {detailData.content ? (
                          <ReactMarkdown>{detailData.content}</ReactMarkdown>
                        ) : (
                          <p>No report content available.</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-300">
                    Select a {activeTab === "sessions" ? "session" : "report"}{" "}
                    to view details
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsPage;
