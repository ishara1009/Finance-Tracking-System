from bson import ObjectId
from datetime import datetime

class Expense:
    def __init__(self, user_id, title, amount, category, date, description=''):
        self.user_id = user_id
        self.title = title
        self.amount = float(amount)
        self.category = category
        self.date = date
        self.description = description
        self.created_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'title': self.title,
            'amount': self.amount,
            'category': self.category,
            'date': self.date,
            'description': self.description,
            'created_at': self.created_at
        }
