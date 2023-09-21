request = {
    method: "GET"
}

fetch("/data", request)
.then(response => {
    return response.json()
})
.then(data => {
    console.log(data)
})