import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'

class App extends React.Component
{
    render()
    {
        return(
            <>
                <Router>
                    <Routes>
                        <Route path="/"/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                    </Routes>
                </Router>
            </>
        )
    }
}

export default App;