import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage'
import Header from './components/Header';

class App extends React.Component
{
    render()
    {
        return(
            <>
                <Header/>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage/>}></Route>
                    </Routes>
                </Router>
            </>
        )
    }
}

export default App;