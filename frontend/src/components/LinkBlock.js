import React from "react"
import "../css/linkBlock.css"
import UserDataContext from "./UserDataContext";
import { changeUrlRequest, deleteLinkRequest, renameLinkRequest } from "../tools/requests";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { X } from 'react-feather'

class LinkBlock extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            name: "",
            url: null,
            mouseover: false,
            focused: false,
            mounted: this.props.mounted,
            iconError: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleIconError = this.handleIconError.bind(this)
        this.deleteLink = this.deleteLink.bind(this)
    }

    componentDidMount()
    {
        const item = this.context.userdata[this.props.categoryIndex].content[this.props.linkIndex]
        this.setState({
            name: item.name,
            url: item.url,
        })
        setTimeout(() => {
            this.setState({mounted: true})
        }, 0)
    }

    handleFocus(event)
    {
        this.setState({focused: true})
        if (event.target.name === "url")
        {
            // this timeout fixes autoselect
            setTimeout(() => {
                event.target.select()
            }, 10)
        }
    }

    handleChange(event)
    {
        this.setState({[event.target.name]: event.target.value})
    }

    handleIconError(event)
    {
        this.setState({iconError: true})
        event.target.src = "./favicon.ico"
    }

    handleBlur(event)
    {
        const trueValue = this.context.userdata[this.props.categoryIndex].content[this.props.linkIndex][event.target.name]
        if (this.state[event.target.name] !== trueValue)
        {
            // Change context
            this.context.changeLinkParameter(
                this.props.categoryIndex, 
                this.props.linkIndex, 
                event.target.name, 
                this.state[event.target.name]
            )
            
            // Request
            if (event.target.name === "url")
            {
                changeUrlRequest(
                    this.props.trueCategoryIndex, 
                    this.props.trueLinkIndex, 
                    this.state[event.target.name]
                )
            }
            else
            {
                renameLinkRequest(
                    this.props.trueCategoryIndex, 
                    this.props.trueLinkIndex, 
                    this.state[event.target.name]
                )
            }
        }
        this.setState({focused: false})
    }

    deleteLink()
    {
        this.context.deleteLink(this.props.categoryIndex, this.props.linkIndex)
        deleteLinkRequest(this.props.trueCategoryIndex, this.props.trueLinkIndex)
    }

    getIcon()
    {
        try
        {
            return new URL(this.state.url).origin + '/favicon.ico'
        }
        catch
        {
            return "./favicon.ico"
        }
    }

    render()
    {
        if (this.props.editing)
        {
            return(
                <div className={"link-block-container" + (this.state.mounted ? "" : " unmounted")}
                    onMouseOver={() => {this.setState({mouseover: true})}} 
                    onMouseLeave={() => {this.setState({mouseover: false})}}
                >
                    <div className="link-block">
                        <TransitionGroup component="div" className="top-element-container">
                            {
                                this.state.mouseover || this.state.focused ?
                                    <CSSTransition key="url-input" timeout={{ enter: 250, exit: 250 }} classNames="url-input">
                                        <input value={this.state.url}
                                            className="url-input"
                                            name="url"
                                            onChange={this.handleChange}
                                            onFocus={this.handleFocus}
                                            onBlur={this.handleBlur}
                                            autoComplete="off"
                                            placeholder="URL"
                                        />
                                    </CSSTransition>
                                :
                                    <CSSTransition key="url-img" timeout={{ enter: 250, exit: 250 }} classNames="url-img">
                                        <img className="url-img"
                                            src={this.state.iconError ? "./favicon.ico" : this.getIcon()}
                                            onError={this.handleIconError}
                                            alt="icon"
                                        />   
                                    </CSSTransition>
                            }
                        </TransitionGroup>
                        <input value={this.state.name}
                            className="link-name"
                            name="name"
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            autoComplete="off"
                            placeholder="Name"
                        />
                    </div>
                    <div className="delete-link-button-container">
                        <div className={"delete-link-button" + ((!this.props.minimized & this.state.mouseover) ? "" : " hidden")}
                            onClick={this.deleteLink}
                        >
                            <X/>
                        </div>
                    </div>
                </div>
            )
        }
        else
        {
            return(
                <div className="link-block-container">
                    <a className={"link-block" + (this.state.mounted ? "" : " unmounted")} href={this.state.url} onClick={(event) => {if (this.props.minimized) {event.preventDefault()}}}>
                        <img className="url-img" 
                            src={this.state.iconError ? "./favicon.ico" : this.getIcon()}
                            onError={this.handleIconError}
                            alt="icon"
                        />
                        <div className="link-name">{this.state.name}</div>
                    </a>
                </div>
            )
        }
    }
}

LinkBlock.contextType = UserDataContext

export default LinkBlock