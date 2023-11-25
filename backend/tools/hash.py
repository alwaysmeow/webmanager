import hashlib

def hash(string):
    sha256 = hashlib.sha256()
    sha256.update(string.encode('utf-8'))
    hashed_string = sha256.hexdigest()
    return hashed_string