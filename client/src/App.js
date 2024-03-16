import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import PasswordPage from './pages/PasswordPage';
import UsernamePage from './pages/UsernamePage'
import DeletePage from './pages/DeletePage'

class App extends React.Component
{
    render()
    {
        return(
            <>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/account">
                            <Route index element={<AccountPage/>}/>
                            <Route path="password" element={<PasswordPage/>}/>
                            <Route path="username" element={<UsernamePage/>}/>
                            <Route path="delete" element={<DeletePage/>}/>
                        </Route>
                    </Routes>
                </Router>
            </>
        )
    }
}

export default App;