FROM python:3.11

RUN groupadd -g 1000 celeryuser && useradd -g 1000 -u 1000 celeryuser

# context: /..
# pip freeze > requirements.txt
COPY ./scheduler/requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY /scheduler /app
COPY /database.py /app/database.py
COPY /mail.py /app/mail.py

RUN chown -R celeryuser:celeryuser /app
USER celeryuser

CMD celery -A tasks beat -l info \
    & celery -A tasks worker -l info