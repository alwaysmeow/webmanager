export async function loginRequest(login, passwordHash)
{
    const postdata = {
        login: login,
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
    
    return await fetch('/api/login', request)
    .then(response => {
        return response.json()
    })
}

export async function logoutRequest()
{
    const request = {
        method: "GET",
        credentials: 'include'
    }
        
    return await fetch('/api/logout', request)
    .then(response => {
        return response.json()
    })
}

export async function getUserDataRequest()
{
    const request = {
        method: "GET",
        credentials: 'include'
    }
    
    return await fetch("api/userdata", request)
    .then(response => response.json())
    .catch(() => null)
}