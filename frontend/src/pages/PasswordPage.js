import React from 'react';
import Header from '../components/Header';
import "../css/container.css"
import { changePasswordRequest } from '../tools/requests';
import hash from '../tools/hash'

class PasswordPage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            currentPasswordInput: '',
            newPasswordInput: '',
            repeatPasswordInput: '',

            invalidString: '',
            invalidInput: false
        }

        this.input = this.input.bind(this)
        this.submit = this.submit.bind(this)
    }

    input(event)
    {
        this.setState({
            [event.target.name]: event.target.value,
            invalidInput: false,
            invalidString: "",
        })
    }

    async submit(event)
    {
        event.preventDefault()
        if (this.state.newPasswordInput.length < 8)
        {
            this.setState({
                invalidInput: true,
                invalidString: 'New password is too short'
            })
        }
        else if (this.state.newPasswordInput !== this.state.repeatPasswordInput)
        {
            this.setState({
                invalidInput: true,
                invalidString: 'Wrong repeated password',
                repeatPasswordInput: ''
            })
        }
        else
        {
            changePasswordRequest(this.state.currentPasswordInput, await hash(this.state.newPasswordInput))
            .then(response => {
                switch (response.status) {
                    case 200:
                        break
                    case 401:
                        this.setState({
                            invalidInput: true,
                            invalidString: 'Wrong old password'
                        })
                        break
                    default:
                        this.setState({
                            invalidInput: true,
                            invalidString: 'Something wrong. Try next time'
                        })
                }
                return response.json()
            })
            .then(data => {
                // message
                console.log(data);
            })
        }
    }

    render()
    {
        return(
            <>
                <Header panel={"account"}/>
                <main>
                    <form>
                        <h2 className='title'>Change Password</h2>
                        <div className='container'>
                            <input 
                                className={"form-item" + (this.state.paintRed ? " red" : "")} 
                                type="password" 
                                placeholder="Current password"
                                name="currentPasswordInput"
                                value={this.state.currentPasswordInput} 
                                onChange={this.input}
                            />
                            <input 
                                className={"form-item" + (this.state.paintRed ? " red" : "")} 
                                type="password" 
                                placeholder="New password"
                                name="newPasswordInput"
                                value={this.state.newPasswordInput} 
                                onChange={this.input}
                            />
                            <input 
                                className={"form-item" + (this.state.paintRed ? " red" : "")} 
                                type="password" 
                                placeholder="Repeat password"
                                name="repeatPasswordInput"
                                value={this.state.repeatPasswordInput} 
                                onChange={this.input}
                            />
                            <div 
                                className={"invalid-string"
                                + ((this.state.invalidInput) ? " appeared" : "")}
                            >
                                {this.state.invalidString}
                            </div>
                            <button
                                className='form-item'
                                onClick={this.submit}
                            >
                                Change
                            </button>
                        </div>
                    </form>
                </main>
            </>
        )
    }
}

export default PasswordPage