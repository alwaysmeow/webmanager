import React from 'react';
import '../css/header.css'
import { logoutRequest } from '../tools/requests'
import { LogOut, Edit, User, Grid } from 'react-feather'

class Header extends React.Component
{
    render()
    {
        return(
            <header>
                <div className="blank"/>
                <h2 className="appname">WebManager</h2>
                {
                    this.props.panel === "home" ?
                    <>
                        <div className="icon-button" onClick={() => {window.location.href = "/account"}}>
                            <User/>
                        </div>
                        <div className={"icon-button" + (this.props.editing ? " active" : "")} onClick={this.props.toggleEditState}>
                            <Edit/>
                        </div>
                        <div className="icon-button" onClick={this.logout}>
                            <LogOut/>
                        </div>
                    </> : 
                    this.props.panel === "account" ?
                    <>
                        <div className="icon-button" onClick={() => {window.location.href = "/"}}>
                            <Grid/>
                        </div>
                        <div className="icon-button" onClick={this.logout}>
                            <LogOut/>
                        </div>
                    </> :
                    <></>
                }
            </header>
        )
    }

    async logout()
    {
        const response = await logoutRequest()
        if (response.success)
            window.location.href = response.redirect_url
    }
}

export default Header