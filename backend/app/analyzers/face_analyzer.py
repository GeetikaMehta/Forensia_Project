import cv2
import mediapipe as mp
import numpy as np

class FaceAnalyzer:
    def __init__(self):
        # initialize MediaPipe solutions
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        
        # initialize MediaPipe face mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # tracking variables
        self.eye_direction = "Unknown"
        self.head_pose = "Unknown"
        self.eye_direction_history = []
        self.head_movement_history = []
    
    def analyze(self, frame):
        """analyze face, eyes and head position"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        if not results.multi_face_landmarks:
            return frame, False
            
        # draw face mesh landmarks
        annotated_frame = frame.copy()
        for face_landmarks in results.multi_face_landmarks:
            self.mp_drawing.draw_landmarks(
                image=annotated_frame,
                landmark_list=face_landmarks,
                connections=self.mp_face_mesh.FACEMESH_TESSELATION,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp.solutions.drawing_styles.get_default_face_mesh_tesselation_style()
            )
            
            # draw iris landmarks
            self.mp_drawing.draw_landmarks(
                image=annotated_frame,
                landmark_list=face_landmarks,
                connections=self.mp_face_mesh.FACEMESH_IRISES,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp.solutions.drawing_styles.get_default_face_mesh_iris_connections_style()
            )
            
            # analyze eye direction
            self.eye_direction = self._analyze_eye_direction(face_landmarks, frame.shape)
            self.eye_direction_history.append(self.eye_direction)
            if len(self.eye_direction_history) > 50:
                self.eye_direction_history.pop(0)
                
            # analyze head position
            self.head_pose = self._analyze_head_position(face_landmarks, frame.shape)
            self.head_movement_history.append(self.head_pose)
            if len(self.head_movement_history) > 50:
                self.head_movement_history.pop(0)
        
        return annotated_frame, True
    
    def _analyze_eye_direction(self, face_landmarks, frame_shape):
        """analyze eye direction based on iris position"""
        h, w, _ = frame_shape
        
        try:
            # get iris landmarks and eye corners
            right_iris = [(face_landmarks.landmark[468].x * w, face_landmarks.landmark[468].y * h)]
            left_iris = [(face_landmarks.landmark[473].x * w, face_landmarks.landmark[473].y * h)]
            
            right_eye_right = (face_landmarks.landmark[33].x * w, face_landmarks.landmark[33].y * h)
            right_eye_left = (face_landmarks.landmark[133].x * w, face_landmarks.landmark[133].y * h)
            left_eye_right = (face_landmarks.landmark[362].x * w, face_landmarks.landmark[362].y * h)
            left_eye_left = (face_landmarks.landmark[263].x * w, face_landmarks.landmark[263].y * h)
            
            # calculate relative positions
            right_eye_center_x = (right_eye_right[0] + right_eye_left[0]) / 2
            left_eye_center_x = (left_eye_right[0] + left_eye_left[0]) / 2
            
            right_iris_x = right_iris[0][0]
            left_iris_x = left_iris[0][0]
            
            # determine direction based on iris position relative to eye center
            right_ratio = (right_iris_x - right_eye_left[0]) / (right_eye_right[0] - right_eye_left[0])
            left_ratio = (left_iris_x - left_eye_left[0]) / (left_eye_right[0] - left_eye_left[0])
            
            avg_ratio = (right_ratio + left_ratio) / 2
            
            # determine gaze direction
            if avg_ratio < 0.42:
                return "Left"
            elif avg_ratio > 0.58:
                return "Right"
            else:
                return "Forward"
                
        except Exception as e:
            return "Unknown"
    
    def _analyze_head_position(self, face_landmarks, frame_shape):
        """analyze head position based on facial landmarks"""
        h, w, _ = frame_shape
        
        try:
            # get key points for head pose estimation
            nose_tip = (face_landmarks.landmark[4].x * w, face_landmarks.landmark[4].y * h)
            left_eye = (face_landmarks.landmark[263].x * w, face_landmarks.landmark[263].y * h)
            right_eye = (face_landmarks.landmark[33].x * w, face_landmarks.landmark[33].y * h)
            
            # calculate head rotation based on eye line vs horizontal
            eye_line_angle = np.degrees(np.arctan2(right_eye[1] - left_eye[1], right_eye[0] - left_eye[0]))
            
            # determine head tilt
            if eye_line_angle < -5:
                tilt = "Tilted Right"
            elif eye_line_angle > 5:
                tilt = "Tilted Left"
            else:
                tilt = "Level"
                
            return tilt
                
        except Exception as e:
            return "Unknown"