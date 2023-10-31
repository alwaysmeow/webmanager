import React from "react"
import { Plus } from 'react-feather'
import UserDataContext from "./UserDataContext"
import { newLinkRequest } from "../tools/requests"
import "../css/linkListButton.css"
import "../css/addLinkButton.css"

class AddLinkButton extends React.Component
{
    constructor(props)
    {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick()
    {
        if (!(this.props.minimized || this.props.hide))
        {
            this.context.appendLink(this.props.categoryIndex)
            newLinkRequest(this.props.trueCategoryIndex)
        }
    }

    render()
    {
        return(
            <div className={"link-list-button add-link-button" + (this.props.minimized ? " minimized" : "") + (this.props.hide ? " hided" : "")}
                onClick={this.handleClick}
            >
                <Plus/>
            </div>
        )
    }
}

AddLinkButton.contextType = UserDataContext

export default AddLinkButton