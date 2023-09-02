document.getElementById("form").addEventListener('submit', function(event){
    event.preventDefault()

    const postdata = {
        login: document.getElementById("loginInput").value,
        password: document.getElementById("passwordInput").value
    }

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postdata)
    }
    
    fetch('/submit', request)
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (data.success)
        {
            window.location.href = data.redirect_url
        }
    })
});