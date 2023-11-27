from flask import jsonify, request
from flask_login import login_required, login_user, logout_user, current_user
from flask_mail import Message
from flasgger.utils import swag_from

from app import app, mail
from user import User
from dbinterface import *
from tools.keygen import generateKey
from tools.hash import hash

# User Requests

@app.route('/api/login', methods=["POST"])
@swag_from('./docs/login.yml')
def authorization():
    data = request.get_json()
    updateUserTiming(data['login'])
    if authentication(data['login'], hash(data['password'])):
        response = {"success": True, "redirect_url": "/"}
        login_user(User(data['login']))
        return jsonify(response), 200
    else:
        response = {"success": False}
        return jsonify(response), 401

@app.route('/api/logout', methods=["GET"])
@login_required
@swag_from('./docs/logout.yml')
def logoutCurrentUser():
    updateUserTiming(current_user.id)
    try:
        logout_user()
        response = {"success": True, "redirect_url": "/login"}
        statusCode = 200
    except:
        response = {"success": False}
        statusCode = 500
    return jsonify(response), statusCode

@app.route('/api/userdata', methods=["GET"])
@login_required
@swag_from('./docs/userdata.yml')
def throwData():
    updateUserTiming(current_user.id)
    return getUserData(current_user.id), 200

@app.route('/api/delete_account', methods=['POST'])
@login_required
@swag_from('./docs/delete_account.yml')
def deleteAccountProcessing():
    data = request.get_json()
    if not authentication(current_user.id, hash(data["password"])):
        response = {
            "success": False
        }
        status_code = 401
    else:
        try:
            logout_user()
            deleteAccount(current_user.id)
            response = {"success": True, "redirect_url": "/login"}
            status_code = 200
        except:
            response = {"success": False}
            status_code = 500
    return jsonify(response), status_code

@app.route('/api/rename_user', methods=['POST'])
@login_required
@swag_from('./docs/rename_user.yml')
def renameUserProcessing():
    data = request.get_json()
    updateUserTiming(current_user.id)
    if not authentication(current_user.id, hash(data["password"])):
        response = {
            "success": False
        }
        status_code = 401
    elif not isNameFree(data["newName"]):
        response = {
            "success": False
        }
        status_code = 409
    else:
        renameUser(current_user.id, data["newName"])
        response = {
            "success": True
        }
    return jsonify(response), 409

# Category Requests

@app.route('/api/rename_category', methods=["POST"])
@login_required
@swag_from('./docs/rename_category.yml')
def renameCategoryProcessing():
    data = request.get_json()
    updateUserTiming(current_user.id)
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
@swag_from('./docs/delete_category.yml')
def deleteCategoryProcessing():
    data = request.get_json()
    updateUserTiming(current_user.id)
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
@swag_from('./docs/new_category.yml')
def newCategoryProcessing():
    updateUserTiming(current_user.id)
    newCategory(current_user.id, "")
    return jsonify({"success": True}), 200

# Link Requests

@app.route('/api/rename_link', methods=["POST"])
@login_required
@swag_from('./docs/rename_link.yml')
def renameLinkProcessing():
    data = request.get_json()
    updateUserTiming(current_user.id)
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
@swag_from('./docs/change_url.yml')
def changeUrlProccessing():
    data = request.get_json()
    updateUserTiming(current_user.id)
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
@swag_from('./docs/delete_link.yml')
def deleteLinkProcessing():
    data = request.get_json()
    updateUserTiming(current_user.id)
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
@swag_from('./docs/new_link.yml')
def newLinkProcessing():
    data = request.get_json()
    updateUserTiming(current_user.id)
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
        updateKeyTiming(data["email"])
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