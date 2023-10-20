import React from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import LinkBlock from "./LinkBlock"
import AddLinkButton from "./AddLinkButton"
import "../css/category.css"
import { renameCategoryRequest } from "../tools/requests"

class Category extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            isOpen: true,
            name: this.props.data.name
        }

        this.switchVisible = this.switchVisible.bind(this)
        this.inputCategoryName = this.inputCategoryName.bind(this)
        this.renameCategory = this.renameCategory.bind(this)
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

    inputCategoryName(event)
    {
        this.setState({name: event.target.value})
    }

    renameCategory(event)
    {
        if (this.state.name !== this.props.data.name)
        {
            renameCategoryRequest(this.props.index, this.state.name)
            // BUG: cannot return old name without page reloading
            // this.props.data.name doesn't change after request, so we should work with data in HomePage (HomePage.categories)
            // Maybe HomePage.categories should be in HomePage.state.categories
        }
    }

    render()
    {
        return(
            <div className={"category" + (this.state.isOpen ? "" : " minimized")} onClick={this.handleClick}>
                {
                    this.props.editing
                    ?
                        <input className="category-head" value={this.state.name} onChange={this.inputCategoryName} onBlur={this.renameCategory}/>
                    :
                        <div className="category-head" onClick={this.headClick}>{this.state.name}</div>
                }
                
                <div className="category-content">
                    <TransitionGroup className="link-list" component="ol">
                        {this.props.data.content.map((item, i) => 
                            <CSSTransition key={i} timeout={{ enter: 0, exit: 500 }} classNames="link-block">
                                <LinkBlock link={item} minimized={!this.state.isOpen}/>
                            </CSSTransition>
                        )}
                        <AddLinkButton minimized={!this.state.isOpen} hide={!this.props.editing}/> 
                    </TransitionGroup>
                </div>
            </div>
        )
    }
}

export default Category