import React from 'react';
import Header from '../components/Header';
import { changeUsernameRequest, getUserDataRequest } from '../tools/requests';

class UsernamePage extends React.Component
{
    constructor(props)
    {
        getUserDataRequest()
        .then(data => {
            if (data === null)
                window.location.href = '/login'
        })

        super(props)
        this.state = {
            passwordInput: '',
            newUsernameInput: '',

            invalidString: '',
            invalidInput: false,
            successStatus: false
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
                    this.setState({
                        passwordInput: '',
                        successStatus: true
                    })
                    setTimeout(() => {
                        this.setState({successStatus: false})
                    }, 500)
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
                                className={"form-item"} 
                                type="password" 
                                placeholder="Password"
                                name="passwordInput"
                                value={this.state.passwordInput} 
                                onChange={this.input}
                            />
                            <input 
                                className={"form-item" + (this.state.successStatus ? " blue" : "")}
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