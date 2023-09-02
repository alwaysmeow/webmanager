document.getElementById("form").addEventListener('submit', function(event){
    event.preventDefault()

    const data = {
        login: document.getElementById("loginInput").value,
        password: document.getElementById("passwordInput").value
    }

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    console.log(data)
    
    fetch('/submit', request)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })
});