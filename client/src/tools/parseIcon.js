function parseIcon(url)
{
    fetch(url)
    .then(response => response.text())
    .then(text => {
        const parser = new DOMParser();
        const html = parser.parseFromString(text, 'text/html')
        return html.getElementsByTagName("icon")
    })
    .then(console.log)
}

export default parseIcon