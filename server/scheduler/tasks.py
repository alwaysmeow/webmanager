from celery import Celery
from celery.schedules import crontab
from datetime import timedelta

import sys
sys.path.append('../')
from database import database

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
}

@celery.task
def dbClearing():
    database.deleteInactiveUsers()
    database.deleteExpiredKeys()