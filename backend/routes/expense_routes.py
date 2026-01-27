from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from database import expenses_collection
from models.expense import Expense
from datetime import datetime

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/', methods=['POST'])
@jwt_required()
def create_expense():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['title', 'amount', 'category', 'date']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create expense
        expense = Expense(
            user_id=user_id,
            title=data['title'],
            amount=data['amount'],
            category=data['category'],
            date=data['date'],
            description=data.get('description', '')
        )
        
        result = expenses_collection.insert_one(expense.to_dict())
        
        return jsonify({
            'message': 'Expense created successfully',
            'expense_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/', methods=['GET'])
@jwt_required()
def get_expenses():
    try:
        user_id = get_jwt_identity()
        expenses = list(expenses_collection.find({'user_id': user_id}).sort('date', -1))
        
        # Convert ObjectId to string
        for expense in expenses:
            expense['_id'] = str(expense['_id'])
            expense['created_at'] = expense['created_at'].isoformat()
        
        return jsonify({'expenses': expenses}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/<expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    try:
        user_id = get_jwt_identity()
        
        result = expenses_collection.delete_one({
            '_id': ObjectId(expense_id),
            'user_id': user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Expense not found'}), 404
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/<expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
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
        
        result = expenses_collection.update_one(
            {'_id': ObjectId(expense_id), 'user_id': user_id},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Expense not found'}), 404
        
        return jsonify({'message': 'Expense updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
