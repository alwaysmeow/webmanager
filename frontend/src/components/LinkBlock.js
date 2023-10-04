import React from "react"
import "../css/linkBlock.css"

class LinkBlock extends React.Component
{
    render()
    {
        var className = "link-block"
        if (this.props.minimized)
        {
            className += " minimized"
        }
        return(
            <a className={className} href={this.props.link.url}>
                <div>pic</div>
                <div>{this.props.link.name}</div>
            </a>
        )
    }
}

export default LinkBlock