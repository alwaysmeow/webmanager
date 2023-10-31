import React from "react"
import { X } from 'react-feather'
import UserDataContext from "./UserDataContext"
import { deleteCategoryRequest } from "../tools/requests"
import "../css/linkListButton.css"
import "../css/deleteCategoryButton.css"

class DeleteCategoryButton extends React.Component
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
            this.context.deleteCategory(this.props.categoryIndex)
            deleteCategoryRequest(this.props.trueCategoryIndex)
        }
    }

    render()
    {
        return(
            <div className={"link-list-button delete-category-button" + (this.props.minimized ? " minimized" : "") + (this.props.hide ? " hided" : "")}
                onClick={this.handleClick}
            >
                <X/>
            </div>
        )
    }
}

DeleteCategoryButton.contextType = UserDataContext

export default DeleteCategoryButton