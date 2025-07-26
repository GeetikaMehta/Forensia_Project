import cv2
import mediapipe as mp
import numpy as np

class GestureAnalyzer:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)
        self.mp_drawing = mp.solutions.drawing_utils
        self.gesture_history = []

    def _calculate_finger_states(self, hand_landmarks):
        """Calculate if fingers are extended or not"""
        # get fingertip y-coordinates (inverted in image coordinates)
        thumb_tip = hand_landmarks.landmark[4].y
        thumb_base = hand_landmarks.landmark[2].y
        index_tip = hand_landmarks.landmark[8].y
        index_base = hand_landmarks.landmark[5].y
        middle_tip = hand_landmarks.landmark[12].y
        middle_base = hand_landmarks.landmark[9].y
        ring_tip = hand_landmarks.landmark[16].y
        ring_base = hand_landmarks.landmark[13].y
        pinky_tip = hand_landmarks.landmark[20].y
        pinky_base = hand_landmarks.landmark[17].y

        # for thumb, also consider x-coordinate for sideways movement
        thumb_tip_x = hand_landmarks.landmark[4].x
        thumb_base_x = hand_landmarks.landmark[2].x

        # check if fingers are extended (tip above base)
        fingers_extended = [
            thumb_tip_x > thumb_base_x,  # thumb
            index_tip < index_base,      # index
            middle_tip < middle_base,     # middle
            ring_tip < ring_base,        # ring
            pinky_tip < pinky_base       # pinky
        ]

        return fingers_extended

    def _recognize_gesture(self, hand_landmarks):
        """Recognize specific gestures based on finger positions"""
        fingers_extended = self._calculate_finger_states(hand_landmarks)
        
        # common interrogation-related gestures
        if all(fingers_extended):
            return "Open Hand"
        elif not any(fingers_extended):
            return "Closed Fist"
        elif fingers_extended[1] and not any(fingers_extended[2:]):
            return "Pointing"
        elif fingers_extended[1] and fingers_extended[2] and not any(fingers_extended[3:]):
            return "Victory/Peace"
        elif fingers_extended[0] and not any(fingers_extended[1:]):
            return "Thumbs Up"
        elif not fingers_extended[0] and all(fingers_extended[1:]):
            return "Four Fingers"
        elif fingers_extended[0] and fingers_extended[1] and not any(fingers_extended[2:]):
            return "Gun Gesture"
        else:
            return "Other"

    def analyze(self, frame):
        """Analyze hand gestures in a frame."""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)

        gestures = []
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # recognize the gesture
                gesture_name = self._recognize_gesture(hand_landmarks)
                
                # extract hand landmarks
                landmarks = [{"x": lm.x, "y": lm.y, "z": lm.z} for lm in hand_landmarks.landmark]
                gestures.append({
                    "type": gesture_name,
                    "landmarks": landmarks
                })

                # draw hand landmarks on the frame
                self.mp_drawing.draw_landmarks(frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)

        # save gestures to history (limit to last 50 entries)
        self.gesture_history.append(gestures)
        if len(self.gesture_history) > 50:
            self.gesture_history.pop(0)

        return frame, gestures