import React from 'react';
import '../css/header.css'

class Header extends React.Component
{
    render()
    {
        return(
            <header>
                <div>meowmeow</div>
                <button id="logout-button">Logout</button>
            </header>
        )
    }
}

export default Header