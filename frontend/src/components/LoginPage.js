import React from 'react';
import '../css/loginPage.css'
import LoginForm from './LoginForm';

class LoginPage extends React.Component
{
    render()
    {
        return(
            <main>
                <LoginForm/>
            </main>
        )
    }
}

export default LoginPage