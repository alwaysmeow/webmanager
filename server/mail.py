from os import getenv
from dotenv import load_dotenv
from smtplib import SMTP
from email.mime.text import MIMEText

load_dotenv('../.env')

class Mail:
    def __init__(self):
        smtp = "smtp.gmail.com"
        port = 587
        self.username = "webmanagerbot@gmail.com"
        password = getenv("MAIL_PASSWORD")

        self.server = SMTP(smtp, port)
        self.server.starttls()
        self.server.login(self.username, password)
    
    def sendKey(self, recepient, key):
        message = MIMEText(f"Your registration key: {key}")
        message["Subject"] = "WebManager Register Key"
        message["From"] = self.username
        message["To"] = recepient
        self.server.sendmail(self.username, recepient, message.as_string())

mail = Mail()