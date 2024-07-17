from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from celery import Celery
from os import getenv

# from dotenv import load_dotenv
# load_dotenv('../../.env')

app = Flask(__name__)

app.config['SWAGGER'] = {
    'title': 'WebManagerAPI',
    'description': 'This is an API for WebManager',
    'version': 0.1,
}

CORS(app, supports_credentials=True)
app.secret_key = getenv("FLASK_KEY")

swagger = Swagger(app)

url = "redis://:qwerty@redis:6379/0"
celery = Celery("WebManagerTasks", broker=url)