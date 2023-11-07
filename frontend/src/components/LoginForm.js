import React from 'react';
import '../css/form.css'
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
            paintRed: false,
            translatePasswordInput: ""
        }

        this.Input = this.Input.bind(this)
        this.submit = this.submit.bind(this)
        this.unsetPaintRed = this.unsetPaintRed.bind(this)
        this.waveLeft = this.waveLeft.bind(this)
        this.waveRight = this.waveRight.bind(this)
        this.endWaving = this.endWaving.bind(this)
        this.wave = this.wave.bind(this)
    }

    Input(event)
    {
        this.setState({
            [event.target.name]: event.target.value,
            invalidInput: false,
            paintRed: false,
        })
    }

    unsetPaintRed()
    {
        this.setState({paintRed: false})
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
        const timing = 150;
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
                    className="form-item" 
                    type="text"
                    placeholder="Username" 
                    name="loginInput"
                    value={this.state.loginInput} 
                    onChange={this.Input}
                />
                <input 
                    className={"form-item" + this.state.translatePasswordInput} 
                    type="password" 
                    placeholder="Password"
                    name="passwordInput" 
                    value={this.state.passwordInput} 
                    onChange={this.Input}
                />
                <button className={"form-item login-button" + (this.state.paintRed ? " red" : "")} 
                    type="submit" 
                    onClick={this.submit}
                >
                    Log In
                </button>
                <div className="separating-line"/>
                <button className="form-item"
                    onClick={(event) => {
                        event.preventDefault()
                        window.location.href = "/register"
                    }}
                >
                    Register
                </button>
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
                paintRed: true,
                passwordInput: ""
            })
            setTimeout(this.unsetPaintRed, 500)
            this.wave()
        }
    }
}

export default LoginForm