import React from 'react';
import '../css/form.css'
import '../css/registerPage.css'
import { sendKeyRequest, createAccountRequest } from '../tools/requests';
import hash from '../tools/hash'
import isValidEmail from '../tools/isValidEmail';

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
            invalidCode: 0,
            invalidString: '',
            keySended: false,
            emailError: false,
            disabledEmailInput: false
        }

        this.Input = this.Input.bind(this)
        this.openContainer = this.openContainer.bind(this)
        this.sendKey = this.sendKey.bind(this)
        this.register = this.register.bind(this)
        this.paintRed = this.paintRed.bind(this)
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
                openContainer: false,
                keySended: false,
                emailError: false
            })
        }
        else
        {
            this.setState({
                invalidInput: false
            })
        }
    }

    paintRed()
    {
        this.setState({paintRed: true})
        setTimeout(() => {this.setState({
            paintRed: false
        })}, 500)
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
        if (!this.state.disabledEmailInput)
        {
            if (isValidEmail(this.state.emailInput))
            {
                var success = true;
                this.setState({disabledEmailInput: true})
                sendKeyRequest(this.state.emailInput)
                .then(response => {
                    if (!response.success)
                    {
                        this.setState({
                            invalidInput: true,
                            invalidCode: 5,
                            emailInput: '',
                            keySended: false,
                            disabledEmailInput: false
                        })
                        this.paintRed()
                        success = false
                    }
                })
                setTimeout(() =>{
                    if (success)
                    {
                        this.setState({
                            keySended: true
                        })
                        this.openContainer()
                        setTimeout(() => {
                            this.setState({disabledEmailInput: false})
                        }, 10000)
                    }
                }, 500)
            }
            else
            {
                this.setState({
                    invalidInput: true,
                    invalidCode: 5
                })
                this.paintRed()
            }
        }
    }

    async register(event)
    {
        event.preventDefault()
        if (this.state.usernameInput.length < 1)
        {
            this.setState({
                invalidInput: true,
                invalidCode: 3,
                invalidString: "Username is too short"
            })
            this.paintRed()
        }
        else if (this.state.passwordInput.length < 8)
        {
            this.setState({
                invalidInput: true,
                passwordInput: '',
                invalidCode: 4,
                invalidString: "Password is too short"
            })
            this.paintRed()
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
                    invalidCode: response.code
                })
                this.paintRed()
                if (response.code === 1)
                {
                    this.setState({
                        keyInput: '',
                        invalidString: "No such key exist"
                    })
                }
                else
                    this.setState({invalidString: "Username is already taken"})
            }
            console.log(response);
        }
    }

    render()
    {
        return(
            <>
                <form 
                    className={"register-window" 
                    + (this.state.openContainer ? "" : " closed") 
                    + (this.state.invalidInput ? " invalid" : "")} 
                    id="form" 
                    autoComplete="off"
                    onClick={(event) => {
                        if (!event.target.classList.contains('form-item'))
                            this.openContainer()
                    }}
                >
                    <h1>Sign Up</h1>
                    <input 
                        className={"form-item"
                        + ((this.state.paintRed && this.state.invalidCode === 5) ? " red" : "")
                        + (this.state.keySended ? " blue" : "")}
                        type="text"
                        placeholder="Email" 
                        name="emailInput"
                        value={this.state.emailInput} 
                        onChange={this.Input}
                        disabled={this.state.disabledEmailInput}
                    />
                    <button 
                        className={"form-item send-message-button"
                        + ((this.state.paintRed && this.state.invalidCode === 5) ? " red" : "")
                        + (this.state.disabledEmailInput ? " disabled" : "")}
                        onClick={this.sendKey}
                        disabled={this.state.disabledEmailInput}
                    >
                        Send Key
                    </button>
                    <div 
                        className={"register-container"
                        + ((this.state.invalidInput && this.state.invalidCode < 5) ? " invalid" : "")}
                    >
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
                        <div 
                            className={"invalid-string"
                            + ((this.state.invalidCode < 5 && this.state.invalidInput) ? " appeared" : "")}
                        >
                            {this.state.invalidString}
                        </div>
                        <button 
                            className={"form-item register-button" 
                            + ((this.state.paintRed && this.state.invalidCode < 5) ? " red" : "")}
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