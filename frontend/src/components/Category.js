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

    render()
    {
        // Should be refactored
        // Problem with switchVisible handle

        return(
            <div className={"category" + (this.state.isOpen ? "" : " minimized")} onClick={this.switchVisible}>
                <div className="category-head">{this.props.data.name}</div>
                <TransitionGroup className="link-list" component="ol">
                    {this.props.data.content.map((item, i) => 
                        <CSSTransition key={i} timeout={{ enter: 0, exit: 500 }} classNames="link-block">
                            <LinkBlock link={item} minimized={!this.state.isOpen}/>
                        </CSSTransition>
                    )}
                    {this.context.editState ? 
                        <CSSTransition key={"addLinkButton"} timeout={{ enter: 0, exit: 500 }} classNames="add-link-button">
                            <AddLinkButton minimized={!this.state.isOpen}/> 
                        </CSSTransition>
                    : <></>}
                </TransitionGroup>
            </div>
        )
    }
}

Category.contextType = EditContext

export default Category