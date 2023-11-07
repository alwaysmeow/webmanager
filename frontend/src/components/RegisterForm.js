import React from 'react';
import '../css/form.css'
import '../css/registerPage.css'
import { sendKeyRequest, createAccountRequest } from '../tools/requests';
import hash from '../tools/hash'

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
            openContainer: true,
            invalidInput: false,
            paintRed: false,
            invalidCode: 0
        }

        this.Input = this.Input.bind(this)
        this.openContainer = this.openContainer.bind(this)
        this.sendKey = this.sendKey.bind(this)
        this.register = this.register.bind(this)
    }

    Input(event)
    {
        this.setState({
            [event.target.name]: event.target.value,
            invalidInput: false
        })
        if (event.target.name === "emailInput")
        {
            this.setState({
                keyInput: '',
                usernameInput: '',
                passwordInput: '',
                openContainer: false
            })
        }
        else
        {
            this.setState({
                invalidInput: false
            })
        }
    }

    unsetpaintRed()
    {
        this.setState({paintRed: false})
    }

    openContainer()
    {
        this.setState({
            openContainer: true
        })
    }

    sendKey(event)
    {
        event.preventDefault()
        sendKeyRequest(this.state.emailInput)
        this.openContainer()
    }

    async register(event)
    {
        event.preventDefault()
        if (this.state.usernameInput.length < 1)
        {
            this.setState({
                invalidInput: true,
                paintRed: true,
                invalidCode: 3
            })
        }
        else if (this.state.passwordInput.length < 8)
        {
            this.setState({
                invalidInput: true,
                paintRed: true,
                passwordInput: '',
                invalidCode: 4
            })
        }
        else
        {
            const response = await createAccountRequest(
                this.state.keyInput, 
                this.state.usernameInput, 
                await hash(this.state.passwordInput)
            )
            if (!response.success)
            {
                this.setState({
                    invalidInput: true,
                    paintRed: true,
                    invalidCode: response.code
                })
                if (response.code === 1)
                    this.setState({keyInput: ''})
            }
            console.log(response);
        }
        setTimeout(() => {this.setState({
            paintRed: false
        })}, 500)
    }

    render()
    {
        var invalidString
        if (this.state.invalidCode === 1)
            invalidString = "No such key exist"
        else if (this.state.invalidCode === 2)
            invalidString = "Username is already taken"
        else if (this.state.invalidCode === 3)
            invalidString = "Username is too short"
        else if (this.state.invalidCode === 4)
            invalidString = "Password is too short"
        else
            invalidString = ""

        return(
            <>
                <form className={"register-window" + (this.state.invalidInput ? " invalid" : "") + (this.state.openContainer ? "" : " closed")} 
                    id="form" 
                    autoComplete="off"
                    onClick={this.openContainer}
                >
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
                    <div className={"register-container"}>
                        <div className="separating-line start"/>
                        <input 
                            className={"form-item" 
                            + ((this.state.paintRed && this.state.invalidCode === 1) ? " red" : "")}
                            type="text"
                            placeholder="Key" 
                            name="keyInput"
                            value={this.state.keyInput}
                            onChange={this.Input}
                        />
                        <input 
                            className={"form-item"
                                 + ((this.state.paintRed && (this.state.invalidCode === 2 || this.state.invalidCode === 3)) ? " red" : "")}
                            type="text"
                            placeholder="Username" 
                            name="usernameInput"
                            value={this.state.usernameInput} 
                            onChange={this.Input}
                        />
                        <input 
                            className={"form-item" 
                                + ((this.state.paintRed && this.state.invalidCode === 4) ? " red" : "")}
                            type="password"
                            placeholder="Password" 
                            name="passwordInput"
                            value={this.state.passwordInput} 
                            onChange={this.Input}
                        />
                        <div className="invalid-string">{invalidString}</div>
                        <button className={"form-item register-button" + (this.state.paintRed ? " red" : "")}
                            type="submit"
                            onClick={this.register}
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