from bson import ObjectId
from datetime import datetime
import bcrypt

class User:
    def __init__(self, email, password, name, profile_picture=None, phone_number=None):
        self.email = email
        self.password = self._hash_password(password)
        self.name = name
        self.profile_picture = profile_picture
        self.phone_number = phone_number
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
            'profile_picture': self.profile_picture,
            'phone_number': self.phone_number,
            'created_at': self.created_at
        }
