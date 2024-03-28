from pymongo.mongo_client import MongoClient
from datetime import datetime, timedelta
from os import getenv

# from dotenv import load_dotenv
# load_dotenv('../.env')

class DataBase:
    def __init__(self, host, port):
        # client = client = MongoClient(host=host, port=port)
        client = MongoClient(host=host,
                             port=port,
                             username=getenv("MONGO_INITDB_ROOT_USERNAME"),
                             password=getenv("MONGO_INITDB_ROOT_PASSWORD"))
        
        db = client['WebManagerDB']
        self.userData = db['UserData']
        self.keys = db['Keys']

        self.keyLifetime = timedelta(weeks=1)
        self.inactiveUserLifetime = timedelta(days=365)
    
    # Account Interface

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
    
    def authentication(self, username, passwordHash):
        return not self.userData.find_one({"username": username, "passwordHash": passwordHash}) is None

    def isNameFree(self, username):
        return self.userData.find_one({"username": username}) is None

    def isEmailFree(self, email):
        return self.userData.find_one({"email": email}) is None

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

    def deleteAccount(self, username):
        self.userData.delete_one({"username": username})

    def renameUser(self, username, newName):
        self.userData.update_one(
            {"username": username},
            {"$set": {"username": newName}}
        )

    def changePassword(self, username, passwordHash):
        self.userData.update_one(
            {"username": username},
            {"$set": {"passwordHash": passwordHash}}
        )

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

    def setWarningLetterSended(self, username):
        self.userData.update_one(
            {"username": username},
            {"$set": 
                {
                    "warningLetter": True
                }
            }
        )

    def deleteInactiveUsers(self):
        self.userData.delete_many({"timing": {"$lt": datetime.utcnow() - self.inactiveUserLifetime}})

    # Category Interface

    def countCategories(self, username):
        userdata = self.userData.find_one({"username": username})
        return len(userdata["categories"])

    def deleteCategory(self, username, categoryIndex):
        self.userData.update_one(
            {"username": username}, 
            {"$unset": {f"categories.{categoryIndex}": 1}}
        )
        self.userData.update_one(
            {"username": username}, 
            {"$pull": {"categories": None}}
        )

    def renameCategory(self, username, categoryIndex, newName):
        self.userData.update_one(
            {"username": username},
            {"$set": {f"categories.{categoryIndex}.name": newName}}
        )

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

    def toggleCategory(self, username, categoryIndex):
        state = self.userData.find_one({"username" : username})["categories"][categoryIndex]["hided"]
        self.userData.update_one(
            {"username": username},
            {"$set": {f"categories.{categoryIndex}.hided": not state}}
        )

    def categoryExist(self, username, categoryIndex):
        if categoryIndex >= self.countCategories(username):
            return False
        return True

    # Link Interface

    def countLinks(self, username, categoryIndex):
        userdata = self.userData.find_one({"username": username})
        return len(userdata["categories"][categoryIndex]["content"])

    def deleteLink(self, username, categoryIndex, linkIndex):
        self.userData.update_one(
            {"username": username}, 
            {"$unset": {f"categories.{categoryIndex}.content.{linkIndex}": 1}}
        )
        self.userData.update_one(
            {"username": username}, 
            {"$pull": {f"categories.{categoryIndex}.content": None}}
        )

    def renameLink(self, username, categoryIndex, linkIndex, newName):
        self.userData.update_one(
            {"username": username},
            {"$set": {f"categories.{categoryIndex}.content.{linkIndex}.name": newName}}
        )

    def changeUrl(self, username, categoryIndex, linkIndex, newUrl):
        self.userData.update_one(
            {"username": username},
            {"$set": {f"categories.{categoryIndex}.content.{linkIndex}.url": newUrl}}
        )

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

    def linkExist(self, username, categoryIndex, linkIndex):
        if not self.categoryExist(username, categoryIndex):
            return False
        if linkIndex >= self.countLinks(username, categoryIndex):
            return False
        return True

    # Key Interface

    def findKey(self, key):
        return not self.keys.find_one({"key": key}) is None

    def deleteKey(self, key):
        self.keys.delete_one({"key": key})

    def newKey(self, email, key):
        self.keys.insert_one({
            "email": email,
            "key": key
        })

    def keySendedOnEmail(self, email):
        return not self.keys.find_one({"email": email}) is None

    def updateKey(self, email, key):
        self.keys.update_one(
            {"email": email},
            {"$set": {"key": key}}
        )

    def getEmailByKey(self, key):
        return self.keys.find_one({"key": key})["email"]

    def updateKeyTiming(self, email):
        self.keys.update_one(
            {"email": email},
            {"$set": {"timing": datetime.utcnow()}}
        )

    def deleteExpiredKeys(self):
        self.keys.delete_many({"timing": {"$lt": datetime.utcnow() - self.keyLifetime}})

# prod
# uri = "mongodb://mongodb:27017"
database = DataBase('mongodb', 27017)

# dev
# uri = "mongodb://localhost:27017"
# database = DataBase('localhost', 27017)