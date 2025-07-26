import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getReportById } from "../services/forensiaApi";
import Navbar from "../components/Navbar";

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!id) return;

        setLoading(true);
        const reportData = await getReportById(id);

        // reportData.content is the markdown text
        setReport(reportData.content);
        setError(null);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to load report. It may be in an invalid format.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading report...</div>;

  if (error) {
    return (
      <div className="bg-red-600 text-white p-4 rounded mb-4">
        <h3 className="font-bold">Error Loading Report</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <div className="backdrop-blur-md bg-black/60 border-b-4 border-purple-500 sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="flex-grow container mx-auto p-6">
        <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg shadow-lg text-white">
          <h1 className="text-3xl font-bold mb-6">Forensic Analysis Report</h1>

          {report ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          ) : (
            <p>No report content available</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportPage;
