import React from 'react';
import '../css/header.css'
import { logoutRequest } from '../tools/requests'

class Header extends React.Component
{
    render()
    {
        return(
            <header>
                <div>{ this.props.username }</div>
                <button id="logout-button" onClick={this.logout}>Logout</button>
            </header>
        )
    }

    async logout()
    {
        const response = await logoutRequest()
        console.log(response);
        if (response.success)
            window.location.href = response.redirect_url
    }
}

export default Header