import json
import os
from datetime import datetime
from flask import Blueprint, request, jsonify
from pathlib import Path

feedback_bp = Blueprint('feedback', __name__)
FEEDBACK_FILE = Path(__file__).parent.parent / 'data' / 'feedback.json'

def ensure_data_directory():
    """Ensure the data directory exists"""
    data_dir = FEEDBACK_FILE.parent
    if not data_dir.exists():
        data_dir.mkdir(parents=True)

def load_feedback():
    """Load feedback from JSON file"""
    ensure_data_directory()
    if not FEEDBACK_FILE.exists():
        return {"feedback": []}
    try:
        with open(FEEDBACK_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"feedback": []}
    except Exception as e:
        print(f"Error loading feedback: {e}")
        return {"feedback": []}

def save_feedback(data):
    """Save feedback to JSON file"""
    ensure_data_directory()
    try:
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving feedback: {e}")
        return False

@feedback_bp.route('/api/feedback', methods=['POST'])
def add_feedback():
    """Add new feedback"""
    try:
        data = request.get_json()
        
        if not data or not all(key in data for key in ['name', 'email', 'feedback']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        feedback_data = load_feedback()
        
        # create new feedback entry
        new_feedback = {
            'id': len(feedback_data['feedback']) + 1,
            'name': data['name'],
            'email': data['email'],
            'feedback': data['feedback'],
            'rating': data.get('rating', 5),
            'date': data.get('date') or datetime.now().strftime('%Y-%m-%d')
        }
        
        feedback_data['feedback'].append(new_feedback)
        if save_feedback(feedback_data):
            return jsonify({'message': 'Feedback submitted successfully', 'feedback': new_feedback}), 201
        else:
            return jsonify({'error': 'Failed to save feedback'}), 500
            
    except Exception as e:
        print(f"Error in add_feedback: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@feedback_bp.route('/api/feedback', methods=['GET'])
def get_feedback():
    """Get all feedback"""
    try:
        feedback_data = load_feedback()
        return jsonify(feedback_data['feedback'])
    except Exception as e:
        print(f"Error in get_feedback: {e}")
        return jsonify({'error': 'Failed to load feedback'}), 500