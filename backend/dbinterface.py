from pymongo.mongo_client import MongoClient

uri = "mongodb://localhost:27017"

client = MongoClient('localhost', 27017)

db = client['WebManagerDB']
userDataCollection = db['UserData']
keyCollection = db['Keys']

# Account Interface

def getUserData(username):
    return userDataCollection.find_one({"username" : username}, {"_id": False, "passwordHash": False})

def authentication(username, passwordHash):
    return not userDataCollection.find_one({"username": username, "passwordHash": passwordHash}) is None

def isNameFree(username):
    return userDataCollection.find_one({"username": username}) is None

def registerAccount(username, passwordHash):
    userData = {
        "username": username,
        "passwordHash": passwordHash,
        "categories": []
    }
    userDataCollection.insert_one(userData)

def deleteAccount(username):
    userDataCollection.delete_one({"username": username})

# Category Interface

def deleteCategory(username, categoryIndex):
    userDataCollection.update_one(
        {"username": username}, 
        {"$unset": {f"categories.{categoryIndex}": 1}}
    )
    userDataCollection.update_one(
        {"username": username}, 
        {"$pull": {"categories": None}}
    )

def renameCategory(username, categoryIndex, newName):
    userDataCollection.update_one(
        {"username": username},
        {"$set": {f"categories.{categoryIndex}.name": newName}}
    )

def newCategory(username, categoryName):
    userDataCollection.update_one(
        {"username": username},
        {
            "$push": 
            {
                "categories": 
                {
                    "name": categoryName, 
                    "content": []
                }
            }
        }
    )

# Link Interface

def deleteLink(username, categoryIndex, linkIndex):
    userDataCollection.update_one(
        {"username": username}, 
        {"$unset": {f"categories.{categoryIndex}.content.{linkIndex}": 1}}
    )
    userDataCollection.update_one(
        {"username": username}, 
        {"$pull": {f"categories.{categoryIndex}.content": None}}
    )

def renameLink(username, categoryIndex, linkIndex, newName):
    userDataCollection.update_one(
        {"username": username},
        {"$set": {f"categories.{categoryIndex}.content.{linkIndex}.name": newName}}
    )

def changeUrl(username, categoryIndex, linkIndex, newUrl):
    userDataCollection.update_one(
        {"username": username},
        {"$set": {f"categories.{categoryIndex}.content.{linkIndex}.url": newUrl}}
    )

def newLink(username, categoryIndex, linkName, url):    
    userDataCollection.update_one(
        {"username": username},
        {
            "$push": 
            {
                f"categories.{categoryIndex}.content": 
                {
                    "name": linkName, 
                    "url": url
                }
            }
        }
    )

# Key Interface

def findKey(key):
    return not keyCollection.find_one({"key": key}) is None

def deleteKey(key):
    keyCollection.delete_one({"key": key})