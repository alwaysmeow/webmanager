// User Requests

export async function loginRequest(login, password)
{
    const postdata = {
        login: login,
        password: password
    }

    const request = {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }
    
    return await fetch('/api/login', request)
    .then(response => response.json())
}

export async function logoutRequest()
{
    const request = {
        method: "GET",
        credentials: 'include'
    }
        
    return await fetch('/api/logout', request)
    .then(response => response.json())
}

export async function getUserDataRequest()
{
    const request = {
        method: "GET",
        credentials: 'include',
        headers: {
            'Cache-Control': 'no-cache, no-store'
        },
    }
    
    return await fetch("api/userdata", request)
    .then(response => response.json())
    .catch(() => null)
}

export function deleteAccountRequest(password)
{
    const postdata = {
        password: password
    }

    const request = {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/delete_account", request)
}

export function changeUsernameRequest(password, newName)
{
    const postdata = {
        password: password, 
        newName: newName
    }

    const request = {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/rename_user", request)
}

export function changePasswordRequest(oldPassword, newPasswordHash)
{
    const postdata = {
        oldPassword: oldPassword, 
        newPasswordHash: newPasswordHash
    }

    const request = {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/change_password", request)
}

// Category Requests

export function renameCategoryRequest(categoryIndex, newName)
{
    const postdata = {
        categoryIndex: categoryIndex,
        newName: newName
    }

    const request = {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/rename_category", request)
}

export function deleteCategoryRequest(categoryIndex)
{
    const postdata = {
        categoryIndex: categoryIndex
    }

    const request = {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/delete_category", request)
}

export function newCategoryRequest()
{
    const request = {
        method: "POST",
        credentials: 'include'
    }

    fetch("api/new_category", request)
}

export function moveCategoryRequest(oldCategoryIndex, newCategoryIndex)
{
    const postdata = {
        oldCategoryIndex: oldCategoryIndex,
        newCategoryIndex: newCategoryIndex
    }

    const request = {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/move_category", request)
}

export function toggleCategoryRequest(categoryIndex)
{
    const postdata = {
        categoryIndex: categoryIndex
    }

    const request = {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/toggle_category", request)
}

// Link Requests

export function renameLinkRequest(categoryIndex, linkIndex, newName)
{
    const postdata = {
        categoryIndex: categoryIndex,
        linkIndex: linkIndex,
        newName: newName
    }

    const request = {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/rename_link", request)
}

export function changeUrlRequest(categoryIndex, linkIndex, newUrl)
{
    const postdata = {
        categoryIndex: categoryIndex,
        linkIndex: linkIndex,
        newUrl: newUrl
    }

    const request = {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/change_url", request)
}

export function deleteLinkRequest(categoryIndex, linkIndex)
{
    const postdata = {
        categoryIndex: categoryIndex,
        linkIndex: linkIndex
    }

    const request = {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/delete_link", request)
}

export function newLinkRequest(categoryIndex)
{
    const postdata = {
        categoryIndex: categoryIndex
    }

    const request = {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    fetch("api/new_link", request)
}

// Key Requests

export async function sendKeyRequest(email)
{
    const postdata = {
        email: email
    }

    const request = {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    return await fetch("api/send_key", request)
    .then(response => response.json())
}

export async function createAccountRequest(key, username, passwordHash)
{
    const postdata = {
        key: key,
        username: username,
        passwordHash: passwordHash
    }

    const request = {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }

    return await fetch("api/create_account", request)
    .then(response => response.json())
}