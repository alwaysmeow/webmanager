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
        if (this.state.isOpen)
        {
            return(
                <div className="category">
                <div className="category-head" onClick={this.switchVisible}>{this.props.data.name}</div>
                <ol className="link-list">
                    {this.props.data.content.map((item, i) => <li key={i}><LinkBlock link={item} minimized={!this.state.isOpen}/></li>)}
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
                </ol>
            </div>
            )
        }
    }
}

export default Category