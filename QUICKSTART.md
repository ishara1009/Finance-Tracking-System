# Finance Tracker - Quick Start Guide

## Step-by-Step Instructions

### 1. Start the Backend Server

Open a terminal/command prompt and run:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Keep this terminal window open. The backend will run on http://localhost:5000

### 2. Start the Frontend Server

Open a NEW terminal/command prompt and run:

```bash
cd frontend
npm install
npm start
```

The frontend will automatically open in your browser at http://localhost:3000

### 3. Start Using the App

1. Click "Get Started" or "Sign Up"
2. Create your account with name, email, and password
3. You'll be automatically logged in and redirected to your dashboard
4. Click "+ Add Income" to add income entries
5. Click "+ Add Expense" to add expense entries
6. View your financial data with beautiful charts!

## Quick Commands Reference

### Backend (Python/Flask)
- Install dependencies: `pip install -r requirements.txt`
- Run server: `python app.py`
- Server runs on: http://localhost:5000

### Frontend (React)
- Install dependencies: `npm install`
- Run development server: `npm start`
- Runs on: http://localhost:3000

## Troubleshooting

**If backend fails to start:**
- Make sure Python 3.8+ is installed
- Check if port 5000 is already in use
- Verify MongoDB connection string in .env file

**If frontend fails to start:**
- Make sure Node.js and npm are installed
- Delete node_modules folder and run `npm install` again
- Check if port 3000 is already in use

**If login doesn't work:**
- Make sure backend is running on port 5000
- Check browser console for errors
- Try creating a new account

## Default Test Credentials

You'll need to create your own account - there are no default credentials!

## Need Help?

Check the main README.md for complete documentation.
