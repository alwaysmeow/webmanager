from flask import Flask, render_template, request, jsonify
from flask_login import LoginManager, login_user, login_required, current_user

from dotenv import load_dotenv
from os import getenv

from user import User

load_dotenv()

app = Flask(__name__)
app.secret_key = getenv("KEY")
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def loadUser(user_id):
    return User(user_id)

@app.route('/')
def welcome():
    return render_template("login.html", title = "Log In")

@app.route('/submit', methods=["POST"])
def loginCheck():
    data = request.get_json()
    if data['login'] == "meowmeow":
        response = {"success": True, "redirect_url": "/home"}
        login_user(User("meowmeow"))
        return jsonify(response), 200
    elif data['login'] == "barkbark":
        response = {"success": True, "redirect_url": "/home"}
        login_user(User("barkbark"))
        return jsonify(response), 200
    else:
        response = {"success": False}
        return jsonify(response), 200

@app.route('/home')
@login_required
def loadManager():
    print(current_user.id)
    return render_template("home.html", title = "WebManager", login = current_user.id)

if __name__ == "__main__":
    app.run(debug=True, host="192.168.0.14",port="1820")