from celery import Celery
from celery.schedules import crontab
from datetime import timedelta

import sys
sys.path.append('../')
from database import database

celery = Celery("WebManagerTasks", broker="redis://localhost:6379/0")

# redis-server
# celery -A tasks beat -l info
# celery -A tasks worker -l info

celery.conf.beat_schedule = {
    'clearing': {
        'task': 'WebManagerTasks.dbClearing',
        'schedule': timedelta(minutes=1), # test schedule
    },
}

@celery.task
def dbClearing():
    database.deleteInactiveUsers()
    database.deleteExpiredKeys()