import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'

class App extends React.Component
{
    render()
    {
        return(
            <>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/" element={<HomePage/>}/>
                    </Routes>
                </Router>
            </>
        )
    }
}

export default App;