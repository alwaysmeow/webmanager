import React from "react"
import { X } from 'react-feather'
import UserDataContext from "./UserDataContext"
import "../css/linkListButton.css"
import "../css/deleteCategoryButton.css"

class DeleteCategoryButton extends React.Component
{
    render()
    {
        return(
            <div className={"link-list-button delete-category-button" 
                + (this.props.minimized ? " minimized" : "") 
                + (this.props.hide ? " hided" : "")}
                onClick={this.props.onClick}
            >
                <X/>
            </div>
        )
    }
}

DeleteCategoryButton.contextType = UserDataContext

export default DeleteCategoryButton