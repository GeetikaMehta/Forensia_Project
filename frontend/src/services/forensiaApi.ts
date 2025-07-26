/**
 * API client for communication with the Forensia backend
 */

// Base URL of the API - ensure this matches your Flask server
const API_URL = "http://localhost:5000/api";

// Add a helper function to handle API requests with better error management
async function apiRequest(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error}`);
    // Return a standardized error response
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// TypeScript interfaces for the API responses
export interface EmotionData {
  dominant: string | null;
  scores: {
    [key: string]: number;
  };
}

export interface GestureLandmark {
  x: number;
  y: number;
  z: number;
}

export interface GestureData {
  landmarks: GestureLandmark[];
}

export interface AnalysisResponse {
  success: boolean;
  emotion: EmotionData;
  face_detected: boolean;
  gestures: GestureData[];
  timestamp: number;
  time_str: string;
}

export interface SessionInfo {
  id: string;
  filename: string;
  start_time: number;
  end_time: number;
  duration: number;
  frames_count: number;
}

export interface ReportInfo {
  id: string;
  filename: string;
  session_info: {
    start_time: number;
    end_time: number;
    duration: number;
  };
}

/**
 * Start a new analysis session
 */
export async function startSession() {
  return await apiRequest(`${API_URL}/sessions/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Analyze a video frame
 */
export async function analyzeFrame(sessionId: string, frameData: string) {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ frame: frameData }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Server returned ${response.status}: ${response.statusText}`,
        emotion: { dominant: null, scores: {} },
        face_detected: false,
        gestures: [],
        timestamp: 0,
        time_str: "",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("API error in analyzeFrame:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      emotion: { dominant: null, scores: {} },
      face_detected: false,
      gestures: [],
      timestamp: 0,
      time_str: "",
    };
  }
}

/**
 * Save the current frame analysis
 */
export async function saveFrame(sessionId: string, analysisData: any) {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/save-frame`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(analysisData),
  });
  return await response.json();
}

/**
 * End the current session
 */
export async function endSession(sessionId: string) {
  const response = await fetch(`${API_URL}/sessions/${sessionId}/end`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

/**
 * Get all available sessions
 */
export async function getSessions() {
  const response = await fetch(`${API_URL}/sessions`);
  const data = await response.json();
  return data.success ? (data.sessions as SessionInfo[]) : [];
}

/**
 * Get a specific session's data
 */
export async function getSessionData(sessionId: string) {
  const response = await fetch(`${API_URL}/sessions/${sessionId}`);
  return await response.json();
}

/**
 * Get all available reports
 */
export async function getReports() {
  const response = await fetch(`${API_URL}/reports`);
  const data = await response.json();
  return data.success ? (data.reports as ReportInfo[]) : [];
}

/**
 * Get a specific report's data
 */
export async function getReportData(reportId: string) {
  const response = await fetch(`${API_URL}/reports/${reportId}`);
  return await response.json();
}

/**
 * Get a specific report by ID
 * Returns raw text content instead of JSON
 */
export async function getReportById(reportId: string) {
  try {
    const response = await fetch(`${API_URL}/reports/${reportId}`);

    if (!response.ok) {
      throw new Error(`Error fetching report: ${response.status}`);
    }

    // Get the raw text instead of trying to parse as JSON
    const reportContent = await response.text();

    // Check if the report content is empty
    if (!reportContent || reportContent.trim() === "") {
      throw new Error("Report is empty");
    }

    // Return as an object with content property
    return {
      id: reportId,
      content: reportContent,
      date: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching report ${reportId}:`, error);
    throw error;
  }
}
