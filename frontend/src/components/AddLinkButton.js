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
        newLinkRequest(this.trueIndex())
    }

    trueIndex()
    {
        let index = 0
        for (let i = 0; i < this.props.categoryIndex; i++)
            if (this.context.userdata[i] != null)
                index++
        return index
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