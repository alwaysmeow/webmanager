import React from "react"

class LinkBlock extends React.Component
{
    render()
    {
        return(
            <div className="link-block" onClick={() => {window.location.href = this.props.link.url}}>
                <div>pic</div>
                <div>{this.props.link.name}</div>
            </div>
        )
    }
}

export default LinkBlock