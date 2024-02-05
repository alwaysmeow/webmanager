import React from 'react';
import Header from '../components/Header';

class PasswordPage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            currentPasswordInput: '',
            newPasswordInput: '',
            repeatPasswordInput: '',
        }

        this.Input = this.Input.bind(this)
        this.Submit = this.Submit.bind(this)
    }

    Input(event)
    {
        this.setState({[event.target.name]: event.target.value})
    }

    Submit(event)
    {
        event.preventDefault()
    }

    render()
    {
        return(
            <>
                <Header panel={"account"}/>
                <main>
                    <form>
                    <h2 className='title'>Change Password</h2>
                    <input 
                        className={"form-item" + (this.state.paintRed ? " red" : "")} 
                        type="password" 
                        placeholder="Current password"
                        name="currentPasswordInput"
                        value={this.state.currentPasswordInput} 
                        onChange={this.Input}
                    />
                    <input 
                        className={"form-item" + (this.state.paintRed ? " red" : "")} 
                        type="password" 
                        placeholder="New password"
                        name="newPasswordInput"
                        value={this.state.newPasswordInput} 
                        onChange={this.Input}
                    />
                    <input 
                        className={"form-item" + (this.state.paintRed ? " red" : "")} 
                        type="password" 
                        placeholder="Repeat password"
                        name="repeatPasswordInput"
                        value={this.state.repeatPasswordInput} 
                        onChange={this.Input}
                    />
                    <button
                        className='form-item'
                        onClick={this.Submit}
                    >
                        Change
                    </button>
                    </form>
                </main>
            </>
        )
    }
}

export default PasswordPage