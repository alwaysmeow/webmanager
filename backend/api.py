from flask import jsonify, request
from flask_login import login_required, login_user, logout_user, current_user
from flask_mail import Message

from app import app, mail
from user import User
from dbinterface import *
from keygen import generateKey

# User Requests

@app.route('/api/login', methods=["POST"])
def authorization():
    data = request.get_json()
    if authentication(data['login'], data['passwordHash']):
        response = {"success": True, "redirect_url": "/"}
        login_user(User(data['login']))
        return jsonify(response), 200
    else:
        response = {"success": False}
        return jsonify(response), 200

@app.route('/api/logout', methods=["GET"])
@login_required
def logoutCurrentUser():
    try:
        logout_user()
        response = {"success": True, "redirect_url": "/login"}
    except:
        response = {"success": False}
    return jsonify(response), 200

@app.route('/api/userdata', methods=["GET"])
@login_required
def throwData():
    return getUserData(current_user.id), 200

@app.route('/api/delete_account', methods=['POST'])
@login_required
def deleteAccountProcessing():
    try:
        logout_user()
        deleteAccount(current_user.id)
        response = {"success": True, "redirect_url": "/login"}
    except:
        response = {"success": False}
    return jsonify(response), 200

@app.route('/api/rename_user', methods=['POST'])
@login_required
def renameUserProcessing():
    data = request.get_json()
    if not authentication(current_user.id, data["passwordHash"]):
        response = {
            "success": False,
            "code": 1
        }
    elif not isNameFree(data["newName"]):
        response = {
            "success": False,
            "code": 2
        }
    else:
        renameUser(current_user.id, data["newName"])
        response = {
            "success": True
        }
    return jsonify(response), 200

# Category Requests

@app.route('/api/rename_category', methods=["POST"])
@login_required
def renameCategoryProcessing():
    data = request.get_json()
    if categoryExist(current_user.id, data["categoryIndex"]):
        renameCategory(current_user.id, data["categoryIndex"], data["newName"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/delete_category', methods=["POST"])
@login_required
def deleteCategoryProcessing():
    data = request.get_json()
    if categoryExist(current_user.id, data["categoryIndex"]):
        deleteCategory(current_user.id, data["categoryIndex"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/new_category', methods=["POST"])
@login_required
def newCategoryProcessing():
    newCategory(current_user.id, "")
    return jsonify({"success": True}), 200

# Link Requests

@app.route('/api/rename_link', methods=["POST"])
@login_required
def renameLinkProcessing():
    data = request.get_json()
    if linkExist(current_user.id, data["categoryIndex"], data["linkIndex"]):
        renameLink(current_user.id, data["categoryIndex"], data["linkIndex"], data["newName"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/change_url', methods=["POST"])
@login_required
def changeUrlProccessing():
    data = request.get_json()
    if linkExist(current_user.id, data["categoryIndex"], data["linkIndex"]):
        changeUrl(current_user.id, data["categoryIndex"], data["linkIndex"], data["newUrl"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/delete_link', methods=["POST"])
@login_required
def deleteLinkProcessing():
    data = request.get_json()
    if linkExist(current_user.id, data["categoryIndex"], data["linkIndex"]):
        deleteLink(current_user.id, data["categoryIndex"], data["linkIndex"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/new_link', methods=["POST"])
@login_required
def newLinkProcessing():
    data = request.get_json()
    if categoryExist(current_user.id, data["categoryIndex"]):
        newLink(current_user.id, data["categoryIndex"], "", "")
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

# Key Requests

@app.route('/api/send_key', methods=["POST"])
def sendKey():
    data = request.get_json()
    if isEmailFree(data["email"]):
        key = generateKey()
        while findKey(key):
            key = generateKey()
        if keySendedOnEmail(data["email"]):
            updateKey(data["email"], key)
        else:
            newKey(data["email"], key)
        msg = Message("Key for WebManager", recipients=[data["email"]])
        msg.sender = 'webmanagerbot@gmail.com'
        msg.body = f'Your registration key: {key}'
        mail.send(msg)
        response = {"success": True}
    else:
        response = {"success": False}
    return jsonify(response), 200

@app.route('/api/create_account', methods=["POST"])
def createAccount():
    data = request.get_json()
    if not findKey(data["key"]):
        return jsonify({"success": False, "code": 1}), 200
    elif not isNameFree(data["username"]):
        return jsonify({"success": False, "code": 2}), 200
    else:
        registerAccount(data["username"], data["passwordHash"], getEmailByKey(data["key"]))
        deleteKey(data["key"])
        login_user(User(data["username"]))
        return jsonify({"success": True, "redirect_url": "/"}), 200