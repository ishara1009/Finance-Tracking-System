from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth_routes import auth_bp
from routes.income_routes import income_bp
from routes.expense_routes import expense_bp
from routes.dashboard_routes import dashboard_bp

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(income_bp, url_prefix='/api/income')
app.register_blueprint(expense_bp, url_prefix='/api/expense')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

@app.route('/')
def home():
    return {'message': 'Finance Tracker API is running'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
