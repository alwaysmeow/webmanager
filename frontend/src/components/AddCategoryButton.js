import React from "react"
import "../css/addCategoryButton.css"
import { Plus } from 'react-feather'

class AddCategoryButton extends React.Component
{
    render()
    {
        return(
            <div className="add-category-button">
                <Plus/>
            </div>
        )
    }
}

export default AddCategoryButton