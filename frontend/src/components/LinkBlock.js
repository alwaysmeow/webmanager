import React from "react"
import "../css/linkBlock.css"
import UserDataContext from "./UserDataContext";

class LinkBlock extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            name: "",
            url: null
        }
    }

    componentDidMount()
    {
        const item = this.context.userdata[this.props.categoryIndex].content[this.props.linkIndex]
        this.setState({
            name: item.name,
            url: item.url
        })
    }

    render()
    {
        if (this.state.url !== null)
        {
            return(
                <a className="link-block" href={this.state.url} onClick={(event) => {if (this.props.minimized) {event.preventDefault()}}}>
                    <img src={new URL(this.state.url).origin + '/favicon.ico'}/>
                    <div>{this.state.name}</div>
                </a>
            )
        }
        else
            return <></>
    }
}

LinkBlock.contextType = UserDataContext

export default LinkBlock