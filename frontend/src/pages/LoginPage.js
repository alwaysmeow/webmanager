import React from 'react';
import LoginForm from '../components/LoginForm';
import '../css/loginPage.css';

class LoginPage extends React.Component
{
    render()
    {
        return(
            <>
                <main>
                    <LoginForm/>
                </main>
            </>
        )
    }
}

export default LoginPage