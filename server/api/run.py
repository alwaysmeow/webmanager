from app import app
from api import *
from waitress import serve

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port="8000")
    #serve(app, host="0.0.0.0", port="8000")