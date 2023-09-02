from flask import Flask, render_template, url_for, request, Response, jsonify

app = Flask(__name__)

@app.route('/')
def welcome():
    return render_template("login.html", title = "Log In")

@app.route('/submit', methods=["POST"])
def loginCheck():
    data = request.get_json()
    print(data)
    if data['login'] != "meowmeow":
        response = {"message": "barkbark"}
        return jsonify(response), 200
    else:
        response = {"message": "hello!"}
        return jsonify(response), 200

if __name__ == "__main__":
    app.run()