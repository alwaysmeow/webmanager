from celery import Celery
from celery.schedules import crontab
from datetime import timedelta

import sys
sys.path.append('../')
from database import database
from mail import mail

# url = "redis://localhost:6379/0"
url = "redis://redis:6379/0"

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
def sendWarnings():
    users = database.usersToWarn()
    for user in users:
        print(user["username"], user["email"])
        mail.sendWarning(user["email"])
        database.setWarningLetterSended(user["username"])