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
            passwordInput: '',
            invalidInput: false,
            translatePasswordInput: ""
        }

        this.Input = this.Input.bind(this)
        this.submit = this.submit.bind(this)
        this.unsetInvalidInput = this.unsetInvalidInput.bind(this)
        this.waveLeft = this.waveLeft.bind(this)
        this.waveRight = this.waveRight.bind(this)
        this.endWaving = this.endWaving.bind(this)
        this.wave = this.wave.bind(this)
    }

    Input(event)
    {
        this.setState({
            [event.target.name]: event.target.value,
            invalidInput: false
        })
    }

    unsetInvalidInput()
    {
        this.setState({invalidInput: false})
    }

    waveLeft()
    {
        this.setState({translatePasswordInput: " left"})
    }

    waveRight()
    {
        this.setState({translatePasswordInput: " right"})
    }

    endWaving()
    {
        this.setState({translatePasswordInput: ""})
    }

    wave()
    {
        const timing = 100;
        this.waveLeft()
        setTimeout(this.waveRight, timing)
        setTimeout(this.endWaving, timing * 2)
    }

    render()
    {
        return(
            <form className={"login-window" + (this.state.invalidInput ? " invalid" : "")} id="form" autoComplete="off">
                <h1>WebManager</h1>
                <input 
                    className="loginform-item" 
                    type="text"
                    placeholder="Username" 
                    name="loginInput"
                    value={this.state.loginInput} 
                    onChange={this.Input}
                />
                <input 
                    className={"loginform-item" + this.state.translatePasswordInput} 
                    type="password" 
                    placeholder="Password"
                    name="passwordInput" 
                    value={this.state.passwordInput} 
                    onChange={this.Input}
                />
                <button className="loginform-item login-button" type="submit" onClick={this.submit}>Log In</button>
                <div className="separating-line"/>
                <button className="loginform-item register-button">Register</button>
            </form>
        )
    }

    async submit(event)
    {
        event.preventDefault()
        const response = await loginRequest(this.state.loginInput, await hash(this.state.passwordInput))
        if (response.success)
            window.location.href = response.redirect_url
        else
        {
            this.setState({
                invalidInput: true,
                passwordInput: ""
            })
            setTimeout(this.unsetInvalidInput, 500)
            this.wave()
        }
    }
}

export default LoginForm