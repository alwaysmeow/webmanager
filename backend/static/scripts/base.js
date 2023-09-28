function logout()
{
    const request = {
        method: "GET"
    }
    
    fetch('/logout', request)
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (data.success)
        {
            window.location.href = data.redirect_url
        }
    })
}

logoutButton = document.getElementById("logout-button")
logoutButton.addEventListener('click', logout)