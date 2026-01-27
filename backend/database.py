from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGODB_URI)
db = client[Config.DATABASE_NAME]

# Collections
users_collection = db['users']
incomes_collection = db['incomes']
expenses_collection = db['expenses']

# Create indexes
users_collection.create_index('email', unique=True)
incomes_collection.create_index('user_id')
expenses_collection.create_index('user_id')
