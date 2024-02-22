from pymongo.mongo_client import MongoClient
from datetime import datetime, timedelta

uri = "mongodb://localhost:27017"

client = MongoClient('localhost', 27017)

db = client['WebManagerDB']
userDataCollection = db['UserData']
keyCollection = db['Keys']

keyLifetime = timedelta(weeks=1)
inactiveUserLifetime = timedelta(days=365)

# Account Interface

def getUserData(username):
    return userDataCollection.find_one(
        {"username" : username}, 
        {
            "_id": False, 
            "passwordHash": False, 
            "email": False,
            "timing": False
        }
    )

def authentication(username, passwordHash):
    return not userDataCollection.find_one({"username": username, "passwordHash": passwordHash}) is None

def isNameFree(username):
    return userDataCollection.find_one({"username": username}) is None

def isEmailFree(email):
    return userDataCollection.find_one({"email": email}) is None

def registerAccount(username, passwordHash, email):
    userData = {
        "username": username,
        "email": email,
        "passwordHash": passwordHash,
        "categories": [],
        "timing": datetime.utcnow()
    }
    userDataCollection.insert_one(userData)

def deleteAccount(username):
    userDataCollection.delete_one({"username": username})

def renameUser(username, newName):
    userDataCollection.update_one(
        {"username": username},
        {"$set": {"username": newName}}
    )

def changePassword(username, passwordHash):
    userDataCollection.update_one(
        {"username": username},
        {"$set": {"passwordHash": passwordHash}}
    )

def updateUserTiming(username):
    userDataCollection.update_one(
        {"username": username},
        {"$set": {"timing": datetime.utcnow()}}
    )

def deleteInactiveUsers():
    userDataCollection.delete_many({"timing": {"$lt": datetime.utcnow() - inactiveUserLifetime}})

# Category Interface

def countCategories(username):
    userdata = userDataCollection.find_one({"username": username})
    return len(userdata["categories"])

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
                    "content": [],
                    "hided": False
                }
            }
        }
    )

def moveCategory(username, oldCategoryIndex, newCategoryIndex):
    if oldCategoryIndex == newCategoryIndex:
        return
    else:
        categories = userDataCollection.find_one(
            {"username": username}
        )["categories"]

        if oldCategoryIndex < newCategoryIndex:
            categories = categories[:oldCategoryIndex] + categories[oldCategoryIndex+1:newCategoryIndex+1] + [categories[oldCategoryIndex]] + categories[newCategoryIndex+1:]
        else:
            categories = categories[:newCategoryIndex] + [categories[oldCategoryIndex]] + categories[newCategoryIndex:oldCategoryIndex] + categories[oldCategoryIndex+1:]
        
        userDataCollection.update_one(
            {"username": username},
            {"$set": {"categories": categories}}
        )

def toggleCategory(username, categoryIndex):
    state = userDataCollection.find_one({"username" : username})["categories"][categoryIndex]["hided"]
    userDataCollection.update_one(
        {"username": username},
        {"$set": {f"categories.{categoryIndex}.hided": not state}}
    )

def categoryExist(username, categoryIndex):
    if categoryIndex >= countCategories(username):
        return False
    return True

# Link Interface

def countLinks(username, categoryIndex):
    userdata = userDataCollection.find_one({"username": username})
    return len(userdata["categories"][categoryIndex]["content"])

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

def linkExist(username, categoryIndex, linkIndex):
    if categoryIndex >= countCategories(username):
        return False
    if linkIndex >= countLinks(username, categoryIndex):
        return False
    return True

# Key Interface

def findKey(key):
    return not keyCollection.find_one({"key": key}) is None

def deleteKey(key):
    keyCollection.delete_one({"key": key})

def newKey(email, key):
    keyCollection.insert_one({
        "email": email,
        "key": key
    })

def keySendedOnEmail(email):
    return not keyCollection.find_one({"email": email}) is None

def updateKey(email, key):
    keyCollection.update_one(
        {"email": email},
        {"$set": {"key": key}}
    )

def getEmailByKey(key):
    return keyCollection.find_one({"key": key})["email"]

def updateKeyTiming(email):
    keyCollection.update_one(
        {"email": email},
        {"$set": {"timing": datetime.utcnow()}}
    )

def deleteExpiredKeys():
    keyCollection.delete_many({"timing": {"$lt": datetime.utcnow() - keyLifetime}})