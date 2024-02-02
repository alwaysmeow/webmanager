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
                        <button className='form-item'>Change password</button>
                        <button className='form-item'>Change username</button>
                        <button className='form-item delete-account-button'>Delete account</button>
                    </form>
                </main>
            </>
        )
    }
}

export default AccountPage