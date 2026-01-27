from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from database import incomes_collection
from models.income import Income
from datetime import datetime

income_bp = Blueprint('income', __name__)

@income_bp.route('/', methods=['POST'])
@jwt_required()
def create_income():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['title', 'amount', 'category', 'date']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create income
        income = Income(
            user_id=user_id,
            title=data['title'],
            amount=data['amount'],
            category=data['category'],
            date=data['date'],
            description=data.get('description', '')
        )
        
        result = incomes_collection.insert_one(income.to_dict())
        
        return jsonify({
            'message': 'Income created successfully',
            'income_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@income_bp.route('/', methods=['GET'])
@jwt_required()
def get_incomes():
    try:
        user_id = get_jwt_identity()
        incomes = list(incomes_collection.find({'user_id': user_id}).sort('date', -1))
        
        # Convert ObjectId to string
        for income in incomes:
            income['_id'] = str(income['_id'])
            income['created_at'] = income['created_at'].isoformat()
        
        return jsonify({'incomes': incomes}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@income_bp.route('/<income_id>', methods=['DELETE'])
@jwt_required()
def delete_income(income_id):
    try:
        user_id = get_jwt_identity()
        
        result = incomes_collection.delete_one({
            '_id': ObjectId(income_id),
            'user_id': user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Income not found'}), 404
        
        return jsonify({'message': 'Income deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@income_bp.route('/<income_id>', methods=['PUT'])
@jwt_required()
def update_income(income_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        update_data = {}
        if 'title' in data:
            update_data['title'] = data['title']
        if 'amount' in data:
            update_data['amount'] = float(data['amount'])
        if 'category' in data:
            update_data['category'] = data['category']
        if 'date' in data:
            update_data['date'] = data['date']
        if 'description' in data:
            update_data['description'] = data['description']
        
        result = incomes_collection.update_one(
            {'_id': ObjectId(income_id), 'user_id': user_id},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Income not found'}), 404
        
        return jsonify({'message': 'Income updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
