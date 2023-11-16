import string
import random

def generateKey():
    characters = string.ascii_letters + string.digits
    key = ''
    for _ in range(16):
        key += random.choice(characters)
    return key