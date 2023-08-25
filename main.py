from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/')
def welcome():
    return render_template("login.html", title = "Log In")


if __name__ == "__main__":
    app.run()