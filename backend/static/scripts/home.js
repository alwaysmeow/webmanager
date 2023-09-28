const request = {
    method: "GET"
}

fetch("/data", request)
.then(response => response.json())
.then(data => {
    console.log(data)
})