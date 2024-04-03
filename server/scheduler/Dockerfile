FROM python:3.11

# context: /..
# pip freeze > requirements.txt
COPY ./scheduler/requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY /scheduler /app
COPY /database.py /app/database.py

CMD celery -A tasks beat -l info & celery -A tasks worker -l info