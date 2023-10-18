import React from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
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

    handleClick = () =>
    {
        if (!this.state.isOpen)
            this.switchVisible()
    }

    headClick = () =>
    {
        if (this.state.isOpen)
            this.switchVisible()
    }

    render()
    {
        return(
            <div className={"category" + (this.state.isOpen ? "" : " minimized")} onClick={this.handleClick}>
                <div className="category-head" onClick={this.headClick}>{this.props.data.name}</div>
                <div className="category-content">
                    <TransitionGroup className="link-list" component="ol">
                        {this.props.data.content.map((item, i) => 
                            <CSSTransition key={i} timeout={{ enter: 0, exit: 500 }} classNames="link-block">
                                <LinkBlock link={item} minimized={!this.state.isOpen}/>
                            </CSSTransition>
                        )}
                        <AddLinkButton minimized={!this.state.isOpen} hide={!this.context.editState}/> 
                    </TransitionGroup>
                </div>
            </div>
        )
    }
}

Category.contextType = EditContext

export default Category