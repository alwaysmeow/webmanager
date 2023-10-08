import React from 'react';
import '../css/loginPage.css'
import hash from '../tools/hash.js'

class LoginForm extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            loginInputValue: '',
            passwordInputValue: ''
        }

        this.loginInput = this.loginInput.bind(this)
        this.passwordInput = this.passwordInput.bind(this)
        this.submit = this.submit.bind(this)
    }

    passwordInput(event)
    {
        this.setState({
            passwordInputValue: event.target.value
        })
    }

    loginInput(event)
    {
        this.setState({
            loginInputValue: event.target.value
        })
    }

    render()
    {
        return(
            <form className="login-window" id="form">
                <p className="item">Log In</p>
                <input 
                    className="item" type="text" 
                    placeholder="Login" 
                    id="loginInput" 
                    value={this.state.loginInputValue} 
                    onChange={this.loginInput}
                />
                <input 
                    className="item" 
                    type="password" 
                    placeholder="Password" 
                    id="passwordInput" 
                    value={this.state.passwordInputValue} 
                    onChange={this.passwordInput}
                />
                <button className="item" type="submit" onClick={this.submit}>Send</button>
            </form>
        )
    }

    async submit(event)
    {
        event.preventDefault()

        const postdata = {
            login: this.state.loginInputValue,
            passwordHash: await hash(this.state.passwordInputValue)
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
            if (data.success)
            {
                window.location.href = data.redirect_url
            }
        })
    }
}

export default LoginForm