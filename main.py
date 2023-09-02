from flask import Flask, render_template, url_for, request, Response, jsonify, redirect, session

app = Flask(__name__)

@app.route('/')
def welcome():
    return render_template("login.html", title = "Log In")

@app.route('/submit', methods=["POST"])
def loginCheck():
    data = request.get_json()
    print(data)
    if data['login'] != "meowmeow":
        response = {"success": False}
        return jsonify(response), 200
    else:
        response = {"success": True, "redirect_url": "/home"}
        return jsonify(response), 200

@app.route('/home')
def loadManager(login = "meowmeow"):
    if login:
        return render_template("home.html", title = "WebManager", login = login)
    else:
        return "No Login"

if __name__ == "__main__":
    app.run()