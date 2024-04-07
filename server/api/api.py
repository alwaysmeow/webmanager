from flask import jsonify, request
from flask_login import login_required, login_user, logout_user, current_user
from flasgger.utils import swag_from

from app import app, celery
from user import User

# import sys
# sys.path.append('../')

from database import database
from tools.hash import hash

# User Requests

@app.route('/api/login', methods=["POST"])
@swag_from('./docs/login.yml')
def authorization():
    data = request.get_json()
    database.updateUserTiming(data['login'])
    if database.authentication(data['login'], hash(data['password'])):
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
    database.updateUserTiming(current_user.id)
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
    database.updateUserTiming(current_user.id)
    return database.getUserData(current_user.id), 200

@app.route('/api/delete_account', methods=['DELETE'])
@login_required
@swag_from('./docs/delete_account.yml')
def deleteAccountProcessing():
    data = request.get_json()
    if not database.authentication(current_user.id, hash(data["password"])):
        response = {
            "success": False
        }
        status_code = 401
    else:
        try:
            print(current_user.id)
            database.deleteAccount(current_user.id)
            logout_user()
            response = {"success": True, "redirect_url": "/login"}
            status_code = 200
        except:
            response = {"success": False}
            status_code = 500
    return jsonify(response), status_code

@app.route('/api/rename_user', methods=['PUT'])
@login_required
@swag_from('./docs/rename_user.yml')
def renameUserProcessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if not database.authentication(current_user.id, hash(data["password"])):
        response = {
            "success": False
        }
        status_code = 401
    elif not database.isNameFree(data["newName"]):
        response = {
            "success": False
        }
        status_code = 409
    else:
        database.renameUser(current_user.id, data["newName"])
        logout_user()
        login_user(User(data["newName"]))
        response = {
            "success": True
        }
        status_code = 200
    return jsonify(response), status_code

@app.route('/api/change_password', methods=['PUT'])
@login_required
@swag_from('./docs/change_password.yml')
def changePasswordProcessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if not database.authentication(current_user.id, hash(data["oldPassword"])):
        response = {
            "success": False
        }
        status_code = 401
    else:
        database.changePassword(current_user.id, data["newPasswordHash"])
        response = {
            "success": True
        }
        status_code = 200
    return jsonify(response), status_code

# Category Requests

@app.route('/api/rename_category', methods=["PUT"])
@login_required
@swag_from('./docs/rename_category.yml')
def renameCategoryProcessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if database.categoryExist(current_user.id, data["categoryIndex"]):
        database.renameCategory(current_user.id, data["categoryIndex"], data["newName"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/delete_category', methods=["DELETE"])
@login_required
@swag_from('./docs/delete_category.yml')
def deleteCategoryProcessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if database.categoryExist(current_user.id, data["categoryIndex"]):
        database.deleteCategory(current_user.id, data["categoryIndex"])
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
    database.updateUserTiming(current_user.id)
    database.newCategory(current_user.id, "")
    return jsonify({"success": True}), 200

@app.route('/api/move_category', methods=["POST"])
@login_required
@swag_from('./docs/move_category.yml')
def moveCategoryProcessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if database.categoryExist(current_user.id, data["oldCategoryIndex"]) and database.categoryExist(current_user.id, data["newCategoryIndex"]):
        database.moveCategory(current_user.id, data["oldCategoryIndex"], data["newCategoryIndex"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/toggle_category', methods=["PUT"])
@login_required
@swag_from('./docs/toggle_category.yml')
def toggleCategoryProcessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if database.categoryExist(current_user.id, data["categoryIndex"]):
        database.toggleCategory(current_user.id, data["categoryIndex"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

# Link Requests

@app.route('/api/rename_link', methods=["PUT"])
@login_required
@swag_from('./docs/rename_link.yml')
def renameLinkProcessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if database.linkExist(current_user.id, data["categoryIndex"], data["linkIndex"]):
        database.renameLink(current_user.id, data["categoryIndex"], data["linkIndex"], data["newName"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/change_url', methods=["PUT"])
@login_required
@swag_from('./docs/change_url.yml')
def changeUrlProccessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if database.linkExist(current_user.id, data["categoryIndex"], data["linkIndex"]):
        database.changeUrl(current_user.id, data["categoryIndex"], data["linkIndex"], data["newUrl"])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/delete_link', methods=["DELETE"])
@login_required
@swag_from('./docs/delete_link.yml')
def deleteLinkProcessing():
    data = request.get_json()
    database.updateUserTiming(current_user.id)
    if database.linkExist(current_user.id, data["categoryIndex"], data["linkIndex"]):
        database.deleteLink(current_user.id, data["categoryIndex"], data["linkIndex"])
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
    database.updateUserTiming(current_user.id)
    if database.categoryExist(current_user.id, data["categoryIndex"]):
        database.newLink(current_user.id, data["categoryIndex"], "", "")
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

# Key Requests

@app.route('/api/send_key', methods=["POST"])
@swag_from('./docs/send_key.yml')
def sendKey():
    data = request.get_json()
    if database.isEmailFree(data["email"]):
        celery.send_task('tasks.sendKey', args=[data["email"]])
        response = {"success": True}
        statusCode = 200
    else:
        response = {"success": False}
        statusCode = 400
    return jsonify(response), statusCode

@app.route('/api/create_account', methods=["POST"])
@swag_from('./docs/create_account.yml')
def createAccount():
    data = request.get_json()
    if not database.findKey(data["key"]):
        return jsonify({"success": False, "code": 1}), 401
    elif not database.isNameFree(data["username"]):
        return jsonify({"success": False, "code": 2}), 409
    else:
        database.registerAccount(data["username"], data["passwordHash"], database.getEmailByKey(data["key"]))
        database.deleteKey(data["key"])
        login_user(User(data["username"]))
        return jsonify({"success": True, "redirect_url": "/"}), 200