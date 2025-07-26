import json
import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, jsonify, request

# create the auth blueprint
auth_bp = Blueprint('auth', __name__)

# configuration
SECRET_KEY = 'your-secret-key-here'  # In production, use environment variable
USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'users.json')

def init_users_file():
    """Initialize users.json if it doesn't exist"""
    if not os.path.exists(os.path.dirname(USERS_FILE)):
        os.makedirs(os.path.dirname(USERS_FILE))
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w') as f:
            json.dump({"users": []}, f)

def load_users():
    """Load users from JSON file"""
    init_users_file()
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users_data):
    """Save users to JSON file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users_data, f, indent=4)

def generate_token(user_id):
    """Generate JWT token"""
    token = jwt.encode({
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, SECRET_KEY, algorithm='HS256')
    return token

@auth_bp.route('/api/auth/signup', methods=['POST'])
def signup():
    """Handle user registration"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    users_data = load_users()
    
    # check if user already exists
    if any(user['email'] == data['email'] for user in users_data['users']):
        return jsonify({'error': 'User already exists'}), 409
    
    # create new user
    new_user = {
        'id': len(users_data['users']) + 1,
        'email': data['email'],
        'name': data.get('name', ''),  # Add name field with empty string as default
        'password': generate_password_hash(data['password']),
        'created_at': datetime.utcnow().isoformat()
    }
    
    users_data['users'].append(new_user)
    save_users(users_data)
    
    token = generate_token(new_user['id'])
    return jsonify({
        'message': 'User created successfully',
        'token': token,
        'user': {
            'id': new_user['id'],
            'email': new_user['email'],
            'name': new_user['name']
        }
    }), 201

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """Handle user login"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    users_data = load_users()
    
    #fFind user by email
    user = next((user for user in users_data['users'] if user['email'] == data['email']), None)
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    token = generate_token(user['id'])
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email']
        }
    }), 200

def verify_token():
    """Verify JWT token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None 