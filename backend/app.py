from flask import Flask
from flask_mail import Mail
from flask_cors import CORS

from dotenv import load_dotenv
from os import getenv

from dbinterface import *

load_dotenv()

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'webmanagerbot@gmail.com'
app.config['MAIL_PASSWORD'] = getenv("MAIL_PASSWORD")

CORS(app, supports_credentials=True)
app.secret_key = getenv("KEY")

mail = Mail(app)