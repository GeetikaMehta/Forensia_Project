import sys
import os

# get the absolute path to the 'backend' directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
# add backend directory's parent (the project root) to the Python path
sys.path.insert(0, os.path.dirname(backend_dir))

import cv2
import time
import numpy as np
import os
from datetime import datetime

# import from modules - use absolute imports
from app.analyzers import EmotionAnalyzer, FaceAnalyzer, GestureAnalyzer
from app.managers import ReportManager, SessionManager

class CriminalInvestigationSystem:
    def __init__(self):
        self.emotion_analyzer = EmotionAnalyzer()
        self.face_analyzer = FaceAnalyzer()
        self.gesture_analyzer = GestureAnalyzer()
        self.session_manager = SessionManager()
        self.report_manager = ReportManager()

        # analysis settings
        self.emotion_interval = 1.0  # seconds between emotion analysis updates
        self.last_emotion_time = 0
        self.emotion = None
        self.emotion_scores = {}

    def run_menu(self):
        """Display main menu and handle user input."""
        while True:
            print("1: Start Analysis\n2: View Past Sessions\n3: View Past Reports\n4: Exit")
            key = input("Select an option: ")

            if key == '1':
                return_to_menu = self.start_analysis()
                if not return_to_menu:
                    break
            elif key == '2':
                self.view_past_sessions()
            elif key == '3':
                self.report_manager.view_past_reports()
            elif key == '4':
                break
            else:
                continue

    def start_analysis(self):
        """Start investigation analysis."""
        print("--- Starting Analysis ---")
        # create a new session
        session_file, session_start_time = self.session_manager.create_session()

        # start video capture
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Cannot open camera")
            return True

        # add a delay to allow the camera to initialize
        time.sleep(2)
        return_to_menu = False
        running = True
        frames_saved = 0

        # create named window and set to fullscreen immediately
        cv2.namedWindow("Investigation Analysis", cv2.WINDOW_NORMAL)
        cv2.setWindowProperty("Investigation Analysis", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

        while running:
            # Capture frame
            ret, frame = cap.read()
            if not ret:
                print("--- cap.read() returned False ---")
                # Log frame shape and save the first frame for debugging
                if frames_saved == 0:
                    print(f"Frame shape: {frame.shape}")
                    cv2.imwrite("debug_frame.jpg", frame)
                print("Can't receive frame. Exiting...")
                break

            # process emotions at intervals
            current_time = time.time()
            if current_time - self.last_emotion_time >= self.emotion_interval:
                self.emotion, self.emotion_scores = self.emotion_analyzer.analyze(frame)
                self.last_emotion_time = current_time

            # process face
            face_frame, face_detected = self.face_analyzer.analyze(frame)

            # process gesture
            gesture_frame, gestures = self.gesture_analyzer.analyze(face_frame)

            # create display frame
            display_frame = gesture_frame

            # get screen dimensions for positioning the text
            screen_height, screen_width = display_frame.shape[:2]

            # if emotion is detected, overlay it prominently on frame
            if self.emotion and self.emotion != "Unknown":
                # display dominant emotion in large text
                cv2.putText(display_frame, f"Dominant Emotion: {self.emotion} ({self.emotion_scores[self.emotion]:.1f}%)",
                            (int(screen_width * 0.1), int(screen_height * 0.1)),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 3)

                # display all emotions with their percentages
                y_offset_emotions = int(screen_height * 0.2)  # start below the dominant emotion
                for emotion, score in self.emotion_scores.items():
                    cv2.putText(display_frame, f"{emotion.capitalize()}: {score:.1f}%",
                                (int(screen_width * 0.1), y_offset_emotions),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (10, 10, 10), 2)
                    y_offset_emotions += 30  # increment for the next emotion

            # display gestures
            if gestures:
                y_offset_gestures = y_offset_emotions + 50  # start below the emotions section
                for gesture in gestures:
                    cv2.putText(display_frame, f"Gesture: {gesture}",
                                (int(screen_width * 0.1), y_offset_gestures),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (50, 50, 50), 2)
                    y_offset_gestures += 30  # increment for the next gesture
            
            # display saved frames count
            cv2.putText(display_frame, f"Frames saved: {frames_saved}",
                        (int(screen_width * 0.1), int(screen_height * 0.85)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
            
            # display session instructions
            cv2.putText(display_frame, "Press 'q' to end session, 's' to save current frame",
                        (int(screen_width * 0.1), int(screen_height * 0.95)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            # display frame
            cv2.imshow("Investigation Analysis", display_frame)

            # handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):  # Quit analysis
                running = False
                # release resources immediately before finalizing
                cap.release()
                cv2.destroyAllWindows()
                # then finalize the session
                self.session_manager.finalize_session(session_file, session_start_time)
                break  # exit the loop immediately
            elif key == ord('r'):  # Return to menu
                return_to_menu = True
                running = False
                # release resources immediately before finalizing
                cap.release()
                cv2.destroyAllWindows()
                self.session_manager.finalize_session(session_file, session_start_time)
                break  # exit the loop immediately
            elif key == ord('s'):  # Save current frame data
                elapsed_time = current_time - session_start_time
                frames_saved = self.session_manager.save_frame_data(
                    session_file, elapsed_time, self.emotion, self.emotion_scores, gestures)
            elif key == ord('f'):  # toggle fullscreen
                current_prop = cv2.getWindowProperty("Investigation Analysis", cv2.WND_PROP_FULLSCREEN)
                new_prop = cv2.WINDOW_NORMAL if current_prop == cv2.WINDOW_FULLSCREEN else cv2.WINDOW_FULLSCREEN
                cv2.setWindowProperty("Investigation Analysis", cv2.WND_PROP_FULLSCREEN, new_prop)

        cap.release()
        cv2.destroyAllWindows()
        return return_to_menu
    
    def view_past_sessions(self):
        """View list of past sessions and allow user to select one to view details"""
        session_.files = self.session_manager.list_sessions()
        
        if not session_files:
            print("No saved sessions found.")
            input("Press Enter to continue...")
            return
        
        print("\nSaved Sessions:")
        for i, file in enumerate(session_files):
            print(f"{i+1}: {file}")
        
        choice = input("\nEnter session number to view (or press Enter to go back): ")
        if not choice:
            return
        
        try:
            index = int(choice) - 1
            if 0 <= index < len(session_files):
                self.session_manager.display_session_data(session_files[index])
            else:
                print("Invalid session number.")
        except ValueError:
            print("Invalid input.")
        
        input("Press Enter to continue...")

if __name__ == "__main__":
    system = CriminalInvestigationSystem()
    system.run_menu()