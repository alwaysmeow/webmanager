from app import app
from api import *

if __name__ == "__main__":
    app.run(debug=True, port="8000")