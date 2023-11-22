from celery import Celery
from celery.schedules import crontab
from dbinterface import deleteExpiredKeys, deleteInactiveUsers
from datetime import timedelta

celery = Celery("WebManagerTasks", broker="redis://localhost:6379/0")

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
    deleteInactiveUsers()
    deleteExpiredKeys()