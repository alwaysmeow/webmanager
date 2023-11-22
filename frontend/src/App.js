import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'

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
                        <Route path="/account" element={<AccountPage/>}/>
                    </Routes>
                </Router>
            </>
        )
    }
}

export default App;