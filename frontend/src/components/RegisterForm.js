import React from 'react';
import '../css/form.css'
import '../css/registerPage.css'

class RegisterForm extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            emailInput: '',
            keyInput: '',
            usernameInput: '',
            passwordInput: '',
            keySended: false,
            invalidInput: false
        }

        this.Input = this.Input.bind(this)
        this.sendKey = this.sendKey.bind(this)
        this.register = this.register.bind(this)
    }

    Input(event)
    {
        this.setState({
            [event.target.name]: event.target.value,
            invalidInput: false,
            keySended: event.target.value == "emailInput"
        })
    }

    sendKey(event)
    {
        event.preventDefault()
        this.setState({
            keySended: true
        })
    }

    register()
    {

    }

    render()
    {
        return(
            <>
                <form className={"register-window" + (this.state.invalidInput ? " invalid" : "")} id="form" autoComplete="off">
                    <h1>Sign Up</h1>
                    <input 
                        className="form-item" 
                        type="text"
                        placeholder="Email" 
                        name="emailInput"
                        value={this.state.emailInput} 
                        onChange={this.Input}
                    />
                    <button className="form-item send-message-button"
                        onClick={this.sendKey}
                    >
                        Send Key
                    </button>
                    <div className={"register-container" + (this.state.keySended ? "" : " closed")}>
                        <div className="separating-line start"/>
                        <input 
                            className="form-item" 
                            type="text"
                            placeholder="Key" 
                            name="keyInput"
                            value={this.state.keyInput} 
                            onChange={this.Input}
                        />
                        <input 
                            className="form-item" 
                            type="text"
                            placeholder="Username" 
                            name="usernameInput"
                            value={this.state.usernameInput} 
                            onChange={this.Input}
                        />
                        <input 
                            className="form-item" 
                            type="password"
                            placeholder="Password" 
                            name="passwordInput"
                            value={this.state.passwordInput} 
                            onChange={this.Input}
                        />
                        <button className="form-item send-message-button"
                            type="submit" 
                        >
                            Register
                        </button>
                        <div className="separating-line end"/>
                    </div>
                    <button className="form-item"
                        onClick={(event) => {
                            event.preventDefault()
                            window.location.href = "/login"
                        }}
                    >
                        Log In
                    </button>
                </form>
            </>
        )
    }
}

export default RegisterForm