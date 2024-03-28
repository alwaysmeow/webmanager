from flask_login import UserMixin, LoginManager
from app import app

class User(UserMixin):
    def __init__(self, id):
        super().__init__()
        self.id = id

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def loadUser(user_id):
    return User(user_id)