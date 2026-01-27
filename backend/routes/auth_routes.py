from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
from database import users_collection
from models.user import User
import base64
import os

auth_bp = Blueprint('auth', __name__)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'uploads/profile_pictures'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['email', 'password', 'name']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already registered'}), 400
        
        # Handle profile picture (base64 encoded)
        profile_picture = data.get('profile_picture', None)
        
        # Create new user
        user = User(data['email'], data['password'], data['name'], profile_picture)
        result = users_collection.insert_one(user.to_dict())
        
        return jsonify({
            'message': 'User created successfully. Please login to continue.',
            'user_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['email', 'password']):
            return jsonify({'error': 'Missing email or password'}), 400
        
        # Find user
        user = users_collection.find_one({'email': data['email']})
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not User.verify_password(data['password'], user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'profile_picture': user.get('profile_picture')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    try:
        user_id = get_jwt_identity()
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'profile_picture': user.get('profile_picture')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
