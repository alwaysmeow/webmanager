import React from "react"
import LinkBlock from "./LinkBlock"

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
        var className = "category"
        if (!this.state.isOpen)
        {
            className += " minimized"
        }
        return(
            <div className={className}>
                <div className="category-head" onClick={this.switchVisible}>{this.props.data.name}</div>
                <ol className="link-list">
                    {this.props.data.content.map((item, i) => <li><LinkBlock link={item} key={i} minimized={!this.state.isOpen}/></li>)}
                </ol>
            </div>
        )
    }
}

export default Category