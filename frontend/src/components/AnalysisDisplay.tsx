import React from 'react';

interface AnalysisData {
  emotion: {
    dominant: string | null;
    scores: Record<string, number>;
  };
  face_detected: boolean;
  gestures: Array<{
    type: string;
    landmarks: Array<{
      x: number;
      y: number;
      z: number;
    }>;
  }>;
  timestamp: number;
  time_str: string;
}

interface AnalysisDisplayProps {
  analysisData: AnalysisData | null;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysisData }) => {
  if (!analysisData) {
    return (
      <div className="text-white text-center p-4">
        Waiting for analysis data...
      </div>
    );
  }

  const { emotion, face_detected, gestures, time_str } = analysisData;

  return (
    <div className="bg-gray-900 rounded-lg p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotion Analysis */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Emotion Analysis</h3>
          {face_detected ? (
            <>
              <div className="mb-4">
                <span className="text-lg font-semibold">
                  Dominant Emotion: {" "}
                  <span className="text-purple-400">
                    {emotion.dominant || "Neutral"}
                  </span>
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(emotion.scores || {}).map(([emotion, score]) => (
                  <div key={emotion} className="flex items-center">
                    <span className="w-24 capitalize">{emotion}:</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-400 h-4 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="ml-2 w-16 text-right">{score.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-red-400">No face detected</p>
          )}
        </div>

        {/* Gesture Analysis */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Gesture Analysis</h3>
          {gestures.length > 0 ? (
            <div className="space-y-2">
              {gestures.map((gesture, index) => (
                <div key={index} className="flex items-center bg-gray-700 rounded-lg p-2">
                  <span className="text-lg font-semibold text-purple-400">
                    {gesture.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No gestures detected</p>
          )}
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-4 text-right text-gray-400">
        Time: {time_str}
      </div>
    </div>
  );
};

export default AnalysisDisplay; 