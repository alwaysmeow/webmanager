FROM python:3.11

# context: /..
# pip freeze > requirements.txt
COPY ./api/requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY /api /app
COPY /database.py /app/database.py
COPY /tools /app/tools

EXPOSE 8000

ENTRYPOINT [ "python3"]
CMD ["run.py"]