from flask import Flask
from flask_mail import Mail
from flask_cors import CORS
from flasgger import Swagger
from os import getenv

# from dotenv import load_dotenv
# load_dotenv('../../.env')

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'webmanagerbot@gmail.com'
app.config['MAIL_PASSWORD'] = getenv("MAIL_PASSWORD")
app.config['SWAGGER'] = {
    'title': 'WebManagerAPI',
    'description': 'This is an API for WebManager',
    'version': 0.1,
}

CORS(app, supports_credentials=True)
app.secret_key = getenv("FLASK_KEY")

mail = Mail(app)

swagger = Swagger(app)