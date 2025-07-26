import os
import json
import time
from datetime import datetime
from app.managers.report_manager import ReportManager  # use absolute import

class SessionManager:
    def __init__(self, data_dir="session_data"):
        """Initialize the SessionManager"""
        self.data_dir = data_dir
        self.report_manager = ReportManager()
        
        # create data directory if it doesn't exist
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    def create_session(self):
        """Create a new session and return the session file path"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        session_file = os.path.join(self.data_dir, f"session_{timestamp}.json")
        
        # initialize session data
        session_data = {
            "start_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": None,
            "duration": None,
            "frames": []
        }
        
        # write initial session file
        with open(session_file, 'w') as file:
            json.dump(session_data, file, indent=4)
        
        print(f"Session started at: {session_data['start_time']}")
        print(f"Session file created: {session_file}")
        
        return session_file, time.time()
    
    def save_frame_data(self, session_file, timestamp, emotion, emotion_scores, gestures):
        """Save current frame data to the session file"""
        # read current session file
        with open(session_file, 'r') as file:
            session_data = json.load(file)
        
        # format timestamp for display
        time_str = f"{int(timestamp // 60):02d}:{int(timestamp % 60):02d}"
        
        # create frame data with current information
        frame_data = {
            "timestamp": timestamp,
            "time_str": time_str,
            "emotion": None,
            "gestures": None
        }
        
        # add emotion data if available
        if emotion and emotion != "Unknown":
            frame_data["emotion"] = {
                "dominant": emotion,
                "scores": emotion_scores
            }
        
        # add gesture data
        if gestures:
            frame_data["gestures"] = gestures
        
        # append this frame to the saved frames
        session_data["frames"].append(frame_data)
        
        # write updated data back to file
        with open(session_file, 'w') as file:
            json.dump(session_data, file, indent=4)
        
        print(f"Saved frame at {time_str} to {session_file}")
        
        return len(session_data["frames"])
    
    def finalize_session(self, session_file, start_time):
        """Update the session file with end time and duration"""
        if not os.path.exists(session_file):
            return
            
        end_time = time.time()
        duration = end_time - start_time
        
        # read current session file
        with open(session_file, 'r') as file:
            session_data = json.load(file)
        
        # update session data
        session_data["end_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        session_data["duration"] = duration
        
        # write updated data back to file
        with open(session_file, 'w') as file:
            json.dump(session_data, file, indent=4)
            
        print(f"Session completed and saved to {session_file}")
        print(f"Session duration: {int(duration // 60):02d}:{int(duration % 60):02d}")

        # generate report using the ReportManager
        return self.report_manager.generate_report(session_file)
    
    def list_sessions(self):
        """List all available sessions and return them"""
        session_files = [f for f in os.listdir(self.data_dir) if f.endswith('.json')]
        return session_files
    
    def display_session_data(self, filename):
        """Display detailed session data"""
        filepath = os.path.join(self.data_dir, filename)
        
        try:
            with open(filepath, 'r') as file:
                session_data = json.load(file)
                
            print("\n" + "="*50)
            print(f"Session Data: {filename}")
            print("="*50)
            print(f"Start Time: {session_data['start_time']}")
            print(f"End Time: {session_data.get('end_time', 'Not finished')}")
            
            if session_data.get('duration'):
                duration = session_data['duration']
                minutes = int(duration // 60)
                seconds = int(duration % 60)
                print(f"Duration: {minutes:02d}:{seconds:02d}")
            
            # display saved frames
            frames = session_data.get('frames', [])
            print(f"\nTotal Frames Saved: {len(frames)}")
            
            for i, frame in enumerate(frames):
                print(f"\nFrame {i+1} - Time: {frame.get('time_str', 'N/A')}")
                
                # display emotion data
                if frame.get('emotion'):
                    print(f"  Emotion: {frame['emotion']['dominant']} "
                          f"({frame['emotion']['scores'][frame['emotion']['dominant']]:.1f}%)")
                    
                # display gesture data
                if frame.get('gestures'):
                    gesture_str = ", ".join(str(g) for g in frame['gestures'])
                    print(f"  Gestures: {gesture_str}")
                
            return True
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error reading session file: {e}")
            return False