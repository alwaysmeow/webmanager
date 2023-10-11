import React from 'react';
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';
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