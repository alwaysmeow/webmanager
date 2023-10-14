from flask import Flask, request, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_cors import CORS

from dotenv import load_dotenv
from os import getenv

from user import User
from mongo import getUserData, authentication

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = getenv("KEY")
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def loadUser(user_id):
    return User(user_id)

@app.route('/api/login', methods=["POST"])
def authorization():
    data = request.get_json()
    if authentication(data['login'], data['passwordHash']):
        response = {"success": True, "redirect_url": "/"}
        login_user(User(data['login']))
        return jsonify(response), 200
    else:
        response = {"success": False}
        return jsonify(response), 200

@app.route('/api/logout', methods=["GET"])
@login_required
def logoutCurrentUser():
    try:
        logout_user()
        response = {"success": True, "redirect_url": "/login"}
    except:
        response = {"success": False}
    return jsonify(response), 200

@app.route('/api/userdata', methods=["GET"])
@login_required
def throwData():
    return getUserData(current_user.id), 200

@app.route('/api/username', methods=["GET"])
def getUserName():
    try:
        response = {"logged": True, "name": current_user.id}
    except:
        response = {"logged": False}
    return jsonify(response), 200

if __name__ == "__main__":
    app.run(debug=True, port="8000")