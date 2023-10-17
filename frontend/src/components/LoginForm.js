import React from 'react';
import '../css/loginPage.css'
import hash from '../tools/hash.js'
import { loginRequest } from '../tools/requests';

class LoginForm extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            loginInput: '',
            passwordInput: ''
        }

        this.Input = this.Input.bind(this)
        this.submit = this.submit.bind(this)
    }

    Input(event)
    {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    render()
    {
        return(
            <form className="login-window" id="form" autoComplete="off">
                <h2>Log In</h2>
                <input 
                    className="item" 
                    type="text"
                    placeholder="Username" 
                    id="loginInput" 
                    value={this.state.loginInputValue} 
                    onChange={this.Input}
                />
                <input 
                    className="item" 
                    type="password" 
                    placeholder="Password" 
                    id="passwordInput" 
                    value={this.state.passwordInputValue} 
                    onChange={this.Input}
                />
                <button className="item" type="submit" onClick={this.submit}>Log In</button>
            </form>
        )
    }

    async submit(event)
    {
        event.preventDefault()
        const response = await loginRequest(this.state.loginInput, await hash(this.state.passwordInput))
        if (response.success)
            window.location.href = response.redirect_url
    }
}

export default LoginForm