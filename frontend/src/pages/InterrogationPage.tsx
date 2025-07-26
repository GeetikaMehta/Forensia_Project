import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";
import {
  analyzeFrame,
  startSession,
  endSession,
  saveFrame,
  EmotionData,
  GestureData,
} from "../services/forensiaApi";

const InterrogationPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [emotion, setEmotion] = useState<EmotionData | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [framesSaved, setFramesSaved] = useState(0);
  const [analysisLoop, setAnalysisLoop] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [errorMessage] = useState<string | null>(null);
  const [gestures, setGestures] = useState<GestureData[]>([]);

  // Check server connection on component mount
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      // Simple fetch to check if server is reachable
      const response = await fetch("http://localhost:5000/api/sessions", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        console.log("Server connection successful");
        setServerStatus("online");
      } else {
        console.error("Server returned error:", response.status);
        setServerStatus("offline");
      }
    } catch (error) {
      console.error("Failed to connect to server:", error);
      setServerStatus("offline");
    }
  };

  // Start a new session
  const startAnalysis = async () => {
    if (serverStatus !== "online") {
      // Recheck connection before giving up
      await checkServerConnection();

      // After rechecking, get the latest status directly from the server
      const response = await fetch("http://localhost:5000/api/sessions", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const latestStatus = response.ok ? "online" : "offline";
      if (latestStatus !== "online") {
        alert(
          "Cannot connect to the server. Please ensure the backend is running."
        );
        return;
      }
    }

    try {
      const result = await startSession();
      if (result.success) {
        setSessionId(result.session_id);
        setAnalyzing(true);
        startVideoCapture();
      } else {
        alert("Failed to start session: " + result.error);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Error connecting to the server");
    }
  };

  // End the current session
  const endAnalysis = async () => {
    if (sessionId) {
      try {
        const result = await endSession(sessionId);
        if (result.success) {
          setAnalyzing(false);
          setSessionId(null);
          setEmotion(null);
          setFramesSaved(0);
          stopVideoCapture();

          if (result.report) {
            alert(`Session ended and report generated: ${result.report}`);
          }
        }
      } catch (error) {
        console.error("Error ending session:", error);
        alert("Error connecting to the server");
      }
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (analyzing && sessionId) {
        endAnalysis();
      }
      if (analysisLoop) {
        cancelAnimationFrame(analysisLoop);
      }
    };
  }, [analyzing, sessionId, analysisLoop]);

  // Start video capture
  const startVideoCapture = async () => {
    try {
      console.log("Starting video capture");

      // Request higher quality video for better face detection
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (!videoRef.current) {
        throw new Error("Video element not available");
      }

      console.log("Camera stream obtained");
      videoRef.current.srcObject = stream;

      // Make sure video is ready before starting analysis
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          return reject("Video element not available");
        }

        const timeoutId = setTimeout(() => {
          reject("Video initialization timed out");
        }, 10000);

        videoRef.current.onloadedmetadata = () => {
          if (!videoRef.current) {
            clearTimeout(timeoutId);
            return reject("Video element not available after metadata loaded");
          }

          videoRef.current
            .play()
            .then(() => {
              clearTimeout(timeoutId);
              console.log(
                "Video started with dimensions:",
                videoRef.current?.videoWidth,
                videoRef.current?.videoHeight
              );
              // Wait a moment to ensure video is really playing
              setTimeout(resolve, 500);
            })
            .catch((err) => {
              clearTimeout(timeoutId);
              console.error("Failed to play video:", err);
              reject(err);
            });
        };
      });

      console.log("Video playing, starting analysis loop");
      // Start the analysis loop
      analyzeVideoFrame();
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        `Failed to access camera: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setAnalyzing(false);
    }
  };

  // Stop video capture
  const stopVideoCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    if (analysisLoop) {
      cancelAnimationFrame(analysisLoop);
      setAnalysisLoop(null);
    }
  };

  const captureCurrentFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const targetWidth = 640;
    const aspectRatio = video.videoWidth / video.videoHeight;
    canvas.width = targetWidth;
    canvas.height = targetWidth / aspectRatio;
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const analyzeVideoFrame = () => {
    if (!analyzing || !sessionId) return;

    const frameData = captureCurrentFrame();
    if (!frameData) return;

    const doAnalysis = async () => {
      try {
        const result = await analyzeFrame(sessionId!, frameData);
        if (result.success) {
          setEmotion(result.emotion);
          setFaceDetected(result.face_detected);
          setEmotion(result.emotion);
          setGestures(result.gestures);
          setGestures(result.gestures);
        } else {
          console.error("Analysis failed:", result.error);
        }
      } catch (error) {
        console.error("Error during frame analysis:", error);
      }
    };

    doAnalysis();

    setTimeout(() => {
      if (analyzing) {
        const loop = requestAnimationFrame(analyzeVideoFrame);
        setAnalysisLoop(loop);
      }
    }, 1500);
  };

  // ✅ Updated function with image saving
  const saveCurrentFrame = async () => {
    if (!analyzing || !sessionId) return;
    const frameData = captureCurrentFrame();
    if (!frameData) return;


    try {
      const analysisResult = await analyzeFrame(sessionId, frameData);
      if (analysisResult.success) {
        const analysisData = {
          emotion: analysisResult.emotion,
          gestures: analysisResult.gestures,
          timestamp: Date.now() / 1000,
          face_detected: analysisResult.face_detected,
          time_str: new Date().toISOString(),
          image: frameData, // ✅ include image in saved data
        };
        const result = await saveFrame(sessionId, analysisData);
        if (result.success) {
          setFramesSaved((prev) => prev + 1);
          console.log("✅ Frame saved:", result);
        } else {
          console.error("Error saving frame:", result.error);
        }
      } else {
        console.error("Analysis failed:", analysisResult.error);
      }
    } catch (error) {
      console.error("Error in saveCurrentFrame:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Background />

      <main className="flex-grow container mx-auto p-4 z-10 relative">
        <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Forensic Analysis
          </h1>

          {/* Server Status Alert */}
          {serverStatus === "checking" && (
            <div className="mb-4 p-3 bg-yellow-600 text-white rounded text-center">
              Connecting to server...
            </div>
          )}

          {serverStatus === "offline" && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded text-center">
              Server connection error. Please ensure the backend is running.
              <button
                onClick={checkServerConnection}
                className="ml-4 px-2 py-1 bg-white text-red-600 rounded hover:bg-gray-100"
              >
                Retry
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-orange-600 text-white rounded text-center">
              {errorMessage}
            </div>
          )}

          {/* Video Display */}
          <div className="mb-6">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-auto border-2 border-gray-700 rounded bg-gray-900"
                style={{
                  minHeight: "300px",
                  transform: "scaleX(-1)",
                }}
                autoPlay
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              {analyzing && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-sm rounded">
                  Analyzing...
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={analyzing ? endAnalysis : startAnalysis}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                analyzing
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={serverStatus !== "online" && !analyzing}
            >
              {analyzing ? "Stop Analysis" : "Start Analysis"}
            </button>

            <button
              onClick={saveCurrentFrame}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!analyzing}
            >
              Save Frame
            </button>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotion Analysis */}
            <div className="bg-slate-700 p-4 rounded">
              <h2 className="text-xl font-semibold mb-3">Emotion Analysis</h2>
              {emotion && emotion.dominant ? (
                <>
                  <div className="mb-2 text-lg">
                    <span className="font-medium">Dominant:</span>{" "}
                    {emotion.dominant}
                  </div>
                  <div className="space-y-2">
                    {Object.entries(emotion.scores || {}).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center">
                          <span className="w-24">{key}:</span>
                          <div className="flex-grow bg-slate-800 h-4 rounded overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 w-12 text-right">
                            {value.toFixed(1)}%
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-400">
                  {analyzing
                    ? "No emotions detected yet"
                    : "Start analysis to detect emotions"}
                </div>
              )}
            </div>

            {/* Session Info */}
            <div className="bg-slate-700 p-4 rounded">
              <h2 className="text-xl font-semibold mb-3">Session Info</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Session ID:</span>
                  <span className="font-mono">{sessionId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={analyzing ? "text-green-400" : "text-gray-400"}
                  >
                    {analyzing ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Face Detected:</span>
                  <span
                    className={faceDetected ? "text-green-400" : "text-red-400"}
                  >
                    {faceDetected ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frames Saved:</span>
                  <span>{framesSaved}</span>
                </div>
                <div className="flex justify-between">
                  <span>Server Status:</span>
                  <span
                    className={
                      serverStatus === "online"
                        ? "text-green-400"
                        : serverStatus === "checking"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {serverStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Face Detection Guidance */}
          {!faceDetected && analyzing && (
            <div className="mt-4">
              <div className="p-3 bg-yellow-600 rounded text-white">
                <h3 className="font-bold mb-1">No face detected</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Position your face in the center of the frame</li>
                  <li>Make sure your face is well-lit from the front</li>
                  <li>
                    Avoid backlighting (don't sit with a window behind you)
                  </li>
                  <li>Try moving closer to the camera</li>
                  <li>Ensure nothing is covering your face</li>
                </ul>
              </div>
              <div
                className="relative mt-4 mx-auto"
                style={{ width: "200px", height: "200px" }}
              >
                <div className="absolute inset-0 border-4 border-dashed border-yellow-400 rounded-full"></div>
                <div className="absolute inset-[25%] border-2 border-yellow-200 rounded-full"></div>
                <div className="text-center text-yellow-400 mt-[85px]">
                  Position face here
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InterrogationPage;
