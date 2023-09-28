import React from 'react';
import '../css/loginPage.css'

class LoginForm extends React.Component
{
    render()
    {
        return(
            <form className="login-window" id="form">
                <p className="item">Log In</p>
                <input className="item" type="text" placeholder="Login" id="loginInput"/>
                <input className="item" type="text" placeholder="Password" id="passwordInput"/>
                <button className="item" type="submit" onClick={this.submit}>Send</button>
            </form>
        )
    }

    submit(event)
    {
        event.preventDefault()

        const postdata = {
            login: document.getElementById("loginInput").value,
            password: document.getElementById("passwordInput").value
        }

        const request = {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postdata)
        }
        
        fetch('/api/submit', request)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
            if (data.success)
            {
                window.location.href = data.redirect_url
            }
        })
    }
}

export default LoginForm