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
        phone_number = data.get('phone_number', None)
        
        # Create new user
        user = User(data['email'], data['password'], data['name'], profile_picture, phone_number)
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

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        
        if 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        # Find user by email
        user = users_collection.find_one({'email': data['email']})
        
        if not user:
            # Return success even if user not found (security best practice)
            return jsonify({
                'message': 'If an account exists with this email, password reset instructions have been sent.'
            }), 200
        
        # In a real application, you would:
        # 1. Generate a password reset token
        # 2. Send an email with reset link
        # For this demo, we'll return a success message
        
        return jsonify({
            'message': 'If an account exists with this email, password reset instructions have been sent.',
            'user_found': True,
            'email': data['email']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        
        if not all(key in data for key in ['email', 'new_password']):
            return jsonify({'error': 'Email and new password are required'}), 400
        
        # Find user
        user = users_collection.find_one({'email': data['email']})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Hash new password
        new_hashed_password = User('temp@temp.com', data['new_password'], 'temp').password
        
        # Update password
        users_collection.update_one(
            {'email': data['email']},
            {'$set': {'password': new_hashed_password}}
        )
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
