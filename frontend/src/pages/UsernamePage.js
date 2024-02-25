import React from 'react';
import Header from '../components/Header';
import { changeUsernameRequest } from '../tools/requests';

class UsernamePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            passwordInput: '',
            newUsernameInput: '',

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

    submit(event)
    {
        event.preventDefault()
        changeUsernameRequest(this.state.passwordInput, this.state.newUsernameInput)
        .then(response => {
            switch (response.status) {
                case 200:
                    break
                case 401:
                    this.setState({
                        invalidInput: true,
                        invalidString: 'Wrong password'
                    })
                    break
                case 409:
                    this.setState({
                        invalidInput: true,
                        invalidString: 'Username is already taken'
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

    render()
    {
        return(
            <>
                <Header panel={"account"}/>
                <main>
                    <form>
                        <h2 className='title'>Change Username</h2>
                        <div className='container'>
                            <input 
                                className={"form-item" + (this.state.paintRed ? " red" : "")} 
                                type="password" 
                                placeholder="Password"
                                name="passwordInput"
                                value={this.state.passwordInput} 
                                onChange={this.input}
                            />
                            <input 
                                className={"form-item" + (this.state.paintRed ? " red" : "")}
                                placeholder="New username"
                                name="newUsernameInput"
                                value={this.state.newUsernameInput} 
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

export default UsernamePage