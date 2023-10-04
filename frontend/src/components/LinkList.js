import React from "react"
import LinkBlock from "./LinkBlock"
import "../css/linkList.css"

class LinkList extends React.Component
{
    render()
    {
        var className = "link-list"
        if (this.props.minimized)
        {
            className += " minimized"
        }
        return(
            <ol className={className}>
                {this.props.content.map((item, i) => <li key={i}><LinkBlock link={item} minimized={this.props.minimized}/></li>)}
            </ol>
        )
    }
}

export default LinkList