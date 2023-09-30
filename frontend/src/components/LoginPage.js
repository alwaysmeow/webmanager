import React from 'react';
import LoginForm from './LoginForm';
import Header from './Header';
import '../css/loginPage.css';

class LoginPage extends React.Component
{
    render()
    {
        return(
            <>
                <Header/>
                <main>
                    <LoginForm/>
                </main>
            </>
        )
    }
}

export default LoginPage