from app import app
from api import *
from user import *

if __name__ == "__main__":
    app.run(debug=True, port="8000")