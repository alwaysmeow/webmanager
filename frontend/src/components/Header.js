import React from 'react';
import '../css/header.css'
import { logoutRequest } from '../tools/requests'
import { LogOut, Edit, User } from 'react-feather'

class Header extends React.Component
{
    render()
    {
        return(
            <header>
                <div className="blank"/>
                <h2 className="appname">WebManager</h2>
                {
                    this.props.showPanel ?
                    <>
                        <div className="icon-button">
                            <User/>
                        </div>
                        <div className={"icon-button" + (this.props.editing ? " active" : "")} onClick={this.props.toggleEditState}>
                            <Edit/>
                        </div>
                        <div className="icon-button" onClick={this.logout}>
                            <LogOut/>
                        </div>
                    </> : <></>
                }
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