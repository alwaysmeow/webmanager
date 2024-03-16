import React from 'react';
import Header from '../components/Header';
import { deleteAccountRequest, getUserDataRequest } from '../tools/requests';

class DeletePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            passwordInput: '',

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
        deleteAccountRequest(this.state.passwordInput)
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
                default:
                    this.setState({
                        invalidInput: true,
                        invalidString: 'Something wrong. Try next time'
                    })
            }
            return response.json()
        })
        .then(data => {
            if (data.success)
                window.location.href = data.redirect_url
        })
    }

    render()
    {
        return(
            <>
                <Header panel={"account"}/>
                <main>
                    <form>
                        <h2 className='title'>Delete Account</h2>
                        <div className='container'>
                            <input 
                                className={"form-item"} 
                                type="password" 
                                placeholder="Password"
                                name="passwordInput"
                                value={this.state.passwordInput} 
                                onChange={this.input}
                            />
                            <div 
                                className={"invalid-string"
                                + ((this.state.invalidInput) ? " appeared" : "")}
                            >
                                {this.state.invalidString}
                            </div>
                            <button
                                className='form-item delete-account-button'
                                onClick={this.submit}
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                </main>
            </>
        )
    }

    componentDidMount()
    {
        getUserDataRequest()
        .then(data => {
            if (data === null)
                window.location.href = '/login'
        })
    }
}

export default DeletePage