import React from "react"
import "../css/addLinkButton.css"
import { Plus } from 'react-feather'
import UserDataContext from "./UserDataContext"
import { newLinkRequest } from "../tools/requests"

class AddLinkButton extends React.Component
{
    constructor(props)
    {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick()
    {
        this.context.appendLink(this.props.categoryIndex)
        newLinkRequest(this.props.categoryIndex)
    }

    render()
    {
        return(
            <div className={"add-link-button" + (this.props.minimized ? " minimized" : "") + (this.props.hide ? " hided" : "")}
                onClick={this.handleClick}
            >
                <Plus/>
            </div>
        )
    }
}

AddLinkButton.contextType = UserDataContext

export default AddLinkButton