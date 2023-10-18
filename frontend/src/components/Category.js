import React from "react"
import LinkBlock from "./LinkBlock"
import AddLinkButton from "./AddLinkButton"
import EditContext from "./EditContext"
import "../css/category.css"

class Category extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            isOpen: true
        }

        this.switchVisible = this.switchVisible.bind(this)
    }

    switchVisible()
    {
        this.setState({isOpen: !this.state.isOpen})
    }

    render()
    {
        // Should be refactored
        // Problem with switchVisible handle

        console.log(this.context);

        if (this.state.isOpen)
        {
            return(
                <div className="category">
                    <div className="category-head" onClick={this.switchVisible}>{this.props.data.name}</div>
                    <ol className="link-list">
                        {this.props.data.content.map((item, i) => <li key={i}><LinkBlock link={item} minimized={!this.state.isOpen}/></li>)}
                        {this.context.editState ? <AddLinkButton minimized={!this.state.isOpen}/> : <></>}
                    </ol>
                </div>
            )
        }
        else
        {
            return(
                <div className="category minimized" onClick={this.switchVisible}>
                    <div className="category-head">{this.props.data.name}</div>
                    <ol className="link-list">
                        {this.props.data.content.map((item, i) => <li key={i}><LinkBlock link={item} minimized={!this.state.isOpen}/></li>)}
                        {this.context.editState ? <AddLinkButton minimized={!this.state.isOpen}/> : <></>}
                    </ol>
                </div>
            )
        }
    }
}

Category.contextType = EditContext

export default Category