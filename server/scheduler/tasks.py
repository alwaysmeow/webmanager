from celery import Celery
from datetime import timedelta

import sys
sys.path.append('../')
from database import database
from mail import mail
from tools.keygen import generateKey

# url = "redis://:qwerty@localhost:6379/0"
url = "redis://:qwerty@redis:6379/0"

celery = Celery("WebManagerTasks", broker=url)

# redis-server
# celery -A tasks beat -l info
# celery -A tasks worker -l info

celery.conf.beat_schedule = {
    'clearing': {
        'task': 'tasks.dbClearing',
        'schedule': timedelta(minutes=1), # test schedule
    },
    'warning': {
        'task': 'tasks.sendWarnings',
        'schedule': timedelta(minutes=1), #
    }
}

@celery.task
def dbClearing():
    database.deleteInactiveUsers()
    database.deleteExpiredKeys()

@celery.task
def sendKey(email):
    key = generateKey()
    while database.findKey(key):
        key = generateKey()
    if database.keySendedOnEmail(email):
        database.updateKey(email, key)
    else:
        database.newKey(email, key)
    database.updateKeyTiming(email)
    mail.sendKey(email, key)

@celery.task
def sendWarnings():
    users = database.usersToWarn()
    for user in users:
        mail.sendWarning(user["email"])
        database.setWarningLetterSended(user["username"])