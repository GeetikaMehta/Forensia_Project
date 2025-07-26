import cv2
from deepface import DeepFace

class EmotionAnalyzer:
    def __init__(self):
        self.current_emotion = "Unknown"
        self.emotion_scores = {}
        self.emotion_history = {
            'angry': [], 'disgust': [], 'fear': [], 
            'happy': [], 'sad': [], 'surprise': [], 'neutral': []
        }
        
    def analyze(self, frame):
        """analyze emotions in a frame using DeepFace"""
        try:
            analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            
            if isinstance(analysis, list):
                emotions = analysis[0]['emotion']
                dominant = analysis[0]['dominant_emotion']
            else:
                emotions = analysis['emotion']
                dominant = analysis['dominant_emotion']
            
            self.current_emotion = dominant
            self.emotion_scores = emotions
            
            # store emotion history (limit to last 50 entries for each)
            for emotion, score in emotions.items():
                self.emotion_history[emotion].append(score)
                if len(self.emotion_history[emotion]) > 50:
                    self.emotion_history[emotion].pop(0)
                    
            return dominant, emotions
        except Exception as e:
            # failed to detect emotions
            return "Unknown", {}