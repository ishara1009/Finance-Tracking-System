from bson import ObjectId
from datetime import datetime
import bcrypt

class User:
    def __init__(self, email, password, name):
        self.email = email
        self.password = self._hash_password(password)
        self.name = name
        self.created_at = datetime.utcnow()
    
    def _hash_password(self, password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def verify_password(password, hashed_password):
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    def to_dict(self):
        return {
            'email': self.email,
            'password': self.password,
            'name': self.name,
            'created_at': self.created_at
        }
