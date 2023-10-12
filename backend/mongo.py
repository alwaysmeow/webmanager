from pymongo.mongo_client import MongoClient

uri = "mongodb://localhost:27017"

client = MongoClient('localhost', 27017)

db = client.WebManagerDB

def getUserData(username):
    return db.UserData.find_one({"username" : username}, {"_id": False, "passwordHash": False})

def authentication(username, passwordHash):
    return not db.UserData.find_one({"username": username, "passwordHash": passwordHash}) is None