import React from "react"
import "../css/linkBlock.css"

class LinkBlock extends React.Component
{
    componentDidMount()
    {
        console.log(new URL(this.props.link.url).origin + '/favicon.ico')
    }

    render()
    {
        var className = "link-block"
        if (this.props.minimized)
        {
            className += " minimized"
        }
        return(
            <a className={className} href={this.props.link.url} onClick={(event) => {if (this.props.minimized) {event.preventDefault()}}}>
                <img src={new URL(this.props.link.url).origin + '/favicon.ico'}/>
                <div>{this.props.link.name}</div>
            </a>
        )
    }
}

export default LinkBlock