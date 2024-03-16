FROM python:3.11

# pip freeze > requirements.txt
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY . /app

EXPOSE 8000

ENTRYPOINT [ "python3"]
CMD ["run.py"]