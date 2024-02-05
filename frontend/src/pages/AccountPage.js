import React from 'react';
import Header from '../components/Header';
import { User } from 'react-feather'
import '../css/accountPage.css'

class AccountPage extends React.Component
{
    render()
    {
        return(
            <>
                <Header panel={"account"}/>
                <main className='account-page'>
                    <form className='button-panel'>
                        <div className='account-panel'>
                            <User/>
                            <h2>meow</h2>
                        </div>
                        <button className='form-item' 
                            onClick={(event) => {
                                event.preventDefault()
                                window.location.href += "/password"
                            }}
                        >
                            Change password
                        </button>
                        <button className='form-item' 
                            onClick={(event) => {
                                event.preventDefault()
                                window.location.href += "/username"
                            }}
                        >
                            Change username
                        </button>
                        <div className="separating-line"/>
                        <button className='form-item delete-account-button' 
                            onClick={(event) => {
                                event.preventDefault()
                                window.location.href += "/delete"
                            }}
                        >
                            Delete account
                        </button>
                    </form>
                </main>
            </>
        )
    }
}

export default AccountPage