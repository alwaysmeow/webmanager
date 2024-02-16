import React from 'react';
import Header from '../components/Header';

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

        this.Input = this.Input.bind(this)
        this.Submit = this.Submit.bind(this)
    }

    Input(event)
    {
        this.setState({
            [event.target.name]: event.target.value,
            invalidInput: false,
            invalidString: "",
        })
    }

    Submit(event)
    {
        event.preventDefault()
        this.setState({
            invalidInput: true,
            invalidString: "error",
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
                                onChange={this.Input}
                            />
                            <input 
                                className={"form-item" + (this.state.paintRed ? " red" : "")}
                                placeholder="New username"
                                name="newUsernameInput"
                                value={this.state.newUsernameInput} 
                                onChange={this.Input}
                            />
                            <div 
                                className={"invalid-string"
                                + ((this.state.invalidInput) ? " appeared" : "")}
                            >
                                {this.state.invalidString}
                            </div>
                            <button
                                className='form-item'
                                onClick={this.Submit}
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