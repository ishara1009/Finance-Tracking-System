from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import incomes_collection, expenses_collection
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    try:
        user_id = get_jwt_identity()
        
        # Get all incomes and expenses
        incomes = list(incomes_collection.find({'user_id': user_id}))
        expenses = list(expenses_collection.find({'user_id': user_id}))
        
        # Calculate totals
        total_income = sum(income['amount'] for income in incomes)
        total_expense = sum(expense['amount'] for expense in expenses)
        balance = total_income - total_expense
        
        # Get recent transactions
        recent_incomes = list(incomes_collection.find({'user_id': user_id}).sort('date', -1).limit(5))
        recent_expenses = list(expenses_collection.find({'user_id': user_id}).sort('date', -1).limit(5))
        
        # Convert ObjectId to string
        for income in recent_incomes:
            income['_id'] = str(income['_id'])
            income['type'] = 'income'
        
        for expense in recent_expenses:
            expense['_id'] = str(expense['_id'])
            expense['type'] = 'expense'
        
        # Get category-wise breakdown
        income_by_category = {}
        for income in incomes:
            category = income['category']
            income_by_category[category] = income_by_category.get(category, 0) + income['amount']
        
        expense_by_category = {}
        for expense in expenses:
            category = expense['category']
            expense_by_category[category] = expense_by_category.get(category, 0) + expense['amount']
        
        return jsonify({
            'summary': {
                'total_income': total_income,
                'total_expense': total_expense,
                'balance': balance,
                'income_count': len(incomes),
                'expense_count': len(expenses)
            },
            'recent_transactions': {
                'incomes': recent_incomes,
                'expenses': recent_expenses
            },
            'category_breakdown': {
                'income': income_by_category,
                'expense': expense_by_category
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
