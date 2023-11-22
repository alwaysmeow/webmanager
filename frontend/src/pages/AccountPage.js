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
                <main>
                    <User/>
                </main>
            </>
        )
    }
}

export default AccountPage