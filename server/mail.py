from os import getenv
from dotenv import load_dotenv
from smtplib import SMTP, SMTPException
from email.mime.text import MIMEText

load_dotenv('../.env')

def mail(func):
    def wrapper(self, *args, **kwargs):
        try:
            func(self, *args, **kwargs)
        except SMTPException as e:
            print(f"SMTP Exception: {e}")
            self.reconnect()
            func(self, *args, **kwargs)
    return wrapper

class Mail:
    def __init__(self):
        self.username = "webmanagerbot@gmail.com"
        self.smtp = "smtp.gmail.com"
        self.port = 587
        self.server = None
        self.connect()

    def connect(self):
        try:
            password = getenv("MAIL_PASSWORD")
            self.server = SMTP(self.smtp, self.port)
            self.server.starttls()
            self.server.login(self.username, password)
        except SMTPException as e:
            print(f"SMTP Exception: {e}")
            self.server = None

    def disconnect(self):
        if self.server:
            try:
                self.server.quit()
            except:
                print("Can't disconnect")
    
    def reconnect(self):
        self.disconnect()
        self.connect()

    @mail
    def sendKey(self, recepient, key):
        message = MIMEText(f"Your registration key: {key}")
        message["Subject"] = "WebManager Register Key"
        message["From"] = self.username
        message["To"] = recepient
        self.server.sendmail(self.username, recepient, message.as_string())
    
    @mail
    def sendWarning(self, recepient):
        message = MIMEText("We warn you that in a week your account will be deleted due to low activity.")
        message["Subject"] = "Account deletion warning"
        message["From"] = self.username
        message["To"] = recepient
        self.server.sendmail(self.username, recepient, message.as_string())

mail = Mail()