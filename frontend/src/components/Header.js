import React from 'react';
import '../css/header.css'

class Header extends React.Component
{
    render()
    {
        return(
            <header>
                <div>{ this.props.userName }</div>
                <button id="logout-button" onClick={this.logout}>Logout</button>
            </header>
        )
    }

    logout()
    {
        const request = {
            method: "GET",
            credentials: 'include'
        }
        
        fetch('/api/logout', request)
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.success)
            {
                window.location.href = data.redirect_url
            }
        })
    }
}

export default Header