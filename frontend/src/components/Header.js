import React from 'react';
import '../css/header.css'

class Header extends React.Component
{
/*
    componentDidMount()
    {
        this.setState({userName: this.props.userName})
    }
*/
    render()
    {
        return(
            <header>
                <div></div>
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