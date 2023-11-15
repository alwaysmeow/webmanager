import string
import random

def generateKey():
    characters = string.ascii_letters + string.digits
    key = ''
    for i in range(16):
        key += random.choice(characters)
    return key