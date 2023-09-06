from flask import Flask, render_template, request, jsonify
from flask_login import LoginManager, login_user, login_required

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
    if data['login'] != "meowmeow":
        response = {"success": False}
        return jsonify(response), 200
    else:
        response = {"success": True, "redirect_url": "/home"}
        login_user(User("meowmeow"))
        print("hello, meowmeow")
        return jsonify(response), 200

@app.route('/home')
@login_required
def loadManager(login = "meowmeow"):
    if login:
        return render_template("home.html", title = "WebManager", login = login)
    else:
        return "No Login"

if __name__ == "__main__":
    app.run()