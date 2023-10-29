import React from "react"
import "../css/addCategoryButton.css"
import { Plus } from 'react-feather'
import UserDataContext from "./UserDataContext"

class AddCategoryButton extends React.Component
{
    constructor(props)
    {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick()
    {
        this.context.appendCategory()
    }

    render()
    {
        return(
            <div className="add-category-button" onClick={this.handleClick}>
                <Plus/>
            </div>
        )
    }
}

AddCategoryButton.contextType = UserDataContext

export default AddCategoryButton