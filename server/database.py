from pymongo.mongo_client import MongoClient
from pymongo.errors import ConnectionFailure
from datetime import datetime, timedelta
from os import getenv

# from dotenv import load_dotenv
# load_dotenv('../.env')

def dbRequest(func):
    def wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except ConnectionFailure:
            self.reconnect()
            return func(self, *args, **kwargs)
        except:
            return None
    return wrapper

class DataBase:
    def __init__(self, host, port, dev = False):
        self.host = host
        self.port = port
        self.dev = dev

        self.userData = None
        self.keys = None
        self.client = None
        self.connect()

        self.keyLifetime = timedelta(weeks=1)
        self.inactiveUserLifetime = timedelta(days=365)
    
    def connect(self):
        if self.dev:
            self.client = MongoClient(host=self.host, port=self.port)
        else:
            self.client = MongoClient(host=self.host,
                                port=self.port,
                                username=getenv("MONGO_INITDB_ROOT_USERNAME"),
                                password=getenv("MONGO_INITDB_ROOT_PASSWORD"))
        
        db = self.client['WebManagerDB']
        self.userData = db['UserData']
        self.keys = db['Keys']
    
    def disconnect(self):
        if self.client:
            self.userData = None
            self.keys = None
            self.client.close()
            self.client = None
    
    def reconnect(self):
        self.disconnect()
        self.connect()

    # Account Interface

    @dbRequest
    def getUserData(self, username):
        return self.userData.find_one(
            {"username" : username}, 
            {
                "_id": False, 
                "passwordHash": False, 
                "email": False,
                "timing": False,
                "warningLetter": False
            }
        )
    
    @dbRequest
    def authentication(self, username, passwordHash):
        return not self.userData.find_one({"username": username, "passwordHash": passwordHash}) is None

    @dbRequest
    def isNameFree(self, username):
        return self.userData.find_one({"username": username}) is None

    @dbRequest
    def isEmailFree(self, email):
        return self.userData.find_one({"email": email}) is None

    @dbRequest
    def registerAccount(self, username, passwordHash, email):
        userData = {
            "username": username,
            "email": email,
            "passwordHash": passwordHash,
            "categories": [],
            "timing": datetime.utcnow(),
            "warningLetter": False
        }
        self.userData.insert_one(userData)

    @dbRequest
    def deleteAccount(self, username):
        self.userData.delete_one({"username": username})

    @dbRequest
    def renameUser(self, username, newName):
        self.userData.update_one(
            {"username": username},
            {"$set": {"username": newName}}
        )

    @dbRequest
    def changePassword(self, username, passwordHash):
        self.userData.update_one(
            {"username": username},
            {"$set": {"passwordHash": passwordHash}}
        )

    @dbRequest
    def updateUserTiming(self, username):
        self.userData.update_one(
            {"username": username},
            {"$set": 
                {
                    "timing": datetime.utcnow(),
                    "warningLetter": False
                }
            }
        )

    @dbRequest
    def usersToWarn(self):
        cursor = self.userData.find({
            "timing": {"$lt": datetime.utcnow() + timedelta(weeks=1) - self.inactiveUserLifetime},
            "warningLetter": False
        }, {"username", "email"})
        return list(cursor)

    @dbRequest
    def setWarningLetterSended(self, username):
        self.userData.update_one(
            {"username": username},
            {"$set": 
                {
                    "warningLetter": True
                }
            }
        )

    @dbRequest
    def deleteInactiveUsers(self):
        self.userData.delete_many({"timing": {"$lt": datetime.utcnow() - self.inactiveUserLifetime}})

    # Category Interface

    @dbRequest
    def countCategories(self, username):
        userdata = self.userData.find_one({"username": username})
        return len(userdata["categories"])

    @dbRequest
    def deleteCategory(self, username, categoryIndex):
        self.userData.update_one(
            {"username": username}, 
            {"$unset": {f"categories.{categoryIndex}": 1}}
        )
        self.userData.update_one(
            {"username": username}, 
            {"$pull": {"categories": None}}
        )

    @dbRequest
    def renameCategory(self, username, categoryIndex, newName):
        self.userData.update_one(
            {"username": username},
            {"$set": {f"categories.{categoryIndex}.name": newName}}
        )

    @dbRequest
    def newCategory(self, username, categoryName):
        self.userData.update_one(
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

    @dbRequest
    def moveCategory(self, username, oldCategoryIndex, newCategoryIndex):
        if oldCategoryIndex == newCategoryIndex:
            return
        else:
            categories = self.userData.find_one(
                {"username": username}
            )["categories"]

            if oldCategoryIndex < newCategoryIndex:
                categories = categories[:oldCategoryIndex] + categories[oldCategoryIndex+1:newCategoryIndex+1] + [categories[oldCategoryIndex]] + categories[newCategoryIndex+1:]
            else:
                categories = categories[:newCategoryIndex] + [categories[oldCategoryIndex]] + categories[newCategoryIndex:oldCategoryIndex] + categories[oldCategoryIndex+1:]
            
            self.userData.update_one(
                {"username": username},
                {"$set": {"categories": categories}}
            )

    @dbRequest
    def toggleCategory(self, username, categoryIndex):
        state = self.userData.find_one({"username" : username})["categories"][categoryIndex]["hided"]
        self.userData.update_one(
            {"username": username},
            {"$set": {f"categories.{categoryIndex}.hided": not state}}
        )

    @dbRequest
    def categoryExist(self, username, categoryIndex):
        if categoryIndex >= self.countCategories(username):
            return False
        return True

    # Link Interface

    @dbRequest
    def countLinks(self, username, categoryIndex):
        userdata = self.userData.find_one({"username": username})
        return len(userdata["categories"][categoryIndex]["content"])

    @dbRequest
    def deleteLink(self, username, categoryIndex, linkIndex):
        self.userData.update_one(
            {"username": username}, 
            {"$unset": {f"categories.{categoryIndex}.content.{linkIndex}": 1}}
        )
        self.userData.update_one(
            {"username": username}, 
            {"$pull": {f"categories.{categoryIndex}.content": None}}
        )

    @dbRequest
    def renameLink(self, username, categoryIndex, linkIndex, newName):
        self.userData.update_one(
            {"username": username},
            {"$set": {f"categories.{categoryIndex}.content.{linkIndex}.name": newName}}
        )

    @dbRequest
    def changeUrl(self, username, categoryIndex, linkIndex, newUrl):
        self.userData.update_one(
            {"username": username},
            {"$set": {f"categories.{categoryIndex}.content.{linkIndex}.url": newUrl}}
        )

    @dbRequest
    def newLink(self, username, categoryIndex, linkName, url):    
        self.userData.update_one(
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

    @dbRequest
    def linkExist(self, username, categoryIndex, linkIndex):
        if not self.categoryExist(username, categoryIndex):
            return False
        if linkIndex >= self.countLinks(username, categoryIndex):
            return False
        return True

    # Key Interface

    @dbRequest
    def findKey(self, key):
        return not self.keys.find_one({"key": key}) is None

    @dbRequest
    def deleteKey(self, key):
        self.keys.delete_one({"key": key})

    @dbRequest
    def newKey(self, email, key):
        self.keys.insert_one({
            "email": email,
            "key": key
        })

    @dbRequest
    def keySendedOnEmail(self, email):
        return not self.keys.find_one({"email": email}) is None

    @dbRequest
    def updateKey(self, email, key):
        self.keys.update_one(
            {"email": email},
            {"$set": {"key": key}}
        )

    @dbRequest
    def getEmailByKey(self, key):
        return self.keys.find_one({"key": key})["email"]

    @dbRequest
    def updateKeyTiming(self, email):
        self.keys.update_one(
            {"email": email},
            {"$set": {"timing": datetime.utcnow()}}
        )

    @dbRequest
    def deleteExpiredKeys(self):
        self.keys.delete_many({"timing": {"$lt": datetime.utcnow() - self.keyLifetime}})

# prod
# uri = "mongodb://mongodb:27017"
database = DataBase("mongodb", 27017)

# dev
# uri = "mongodb://localhost:27017"
# database = DataBase('localhost', 27017, True)