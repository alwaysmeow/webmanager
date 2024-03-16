from app import app
from api import *

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port="8000")