import React from 'react';
import RegisterForm from '../components/RegisterForm';
import '../css/loginPage.css';

class RegisterPage extends React.Component
{
    render()
    {
        return(
            <>
                <main>
                    <RegisterForm/>
                </main>
            </>
        )
    }
}

export default RegisterPage