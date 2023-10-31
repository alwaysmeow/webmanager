import React from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import LinkBlock from "./LinkBlock"
import AddLinkButton from "./AddLinkButton"
import DeleteCategoryButton from "./DeleteCategoryButton"
import "../css/category.css"
import { renameCategoryRequest } from "../tools/requests"
import UserDataContext from "./UserDataContext"

class Category extends React.Component
{
    constructor(props)
    {
        super(props)
        this.firstRender = true
        this.state = {
            isOpen: true,
            name: "",
        }

        this.switchVisible = this.switchVisible.bind(this)
        this.inputCategoryName = this.inputCategoryName.bind(this)
        this.renameCategory = this.renameCategory.bind(this)
    }

    componentDidMount()
    {
        this.setState({
            name: this.context.userdata[this.props.index].name
        })
        this.firstRender = false
    }

    switchVisible()
    {
        this.setState({isOpen: !this.state.isOpen})
    }

    inputCategoryName(event)
    {
        this.setState({name: event.target.value})
    }

    renameCategory()
    {
        if (this.state.name !== this.context.userdata[this.props.index].name)
        {
            renameCategoryRequest(this.props.trueCategoryIndex, this.state.name)
            this.context.renameCategory(this.props.index, this.state.name)
        }
    }

    render()
    {
        const item = this.context.userdata[this.props.index]
        if (item == null)
            return <></>
        const content = item.content
        const empty = item.content.filter(item => item !== null).length === 0

        return(
            <div className={"category" + (this.state.isOpen ? "" : " minimized") + (empty ? " empty" : "")} 
                onClick={() => {if (!this.state.isOpen) this.switchVisible()}}
            >
            {
                this.props.editing
                ?
                        <input className="category-head" 
                            value={this.state.name} 
                            onChange={this.inputCategoryName} 
                            onBlur={this.renameCategory}
                            placeholder="Category"
                            disabled={!this.props.editing}
                        />
                :
                    this.state.name === ""
                    ?
                        <div className="category-head no-text" 
                            onClick={() => {if (this.state.isOpen) this.switchVisible()}}
                        >
                            Category
                        </div>
                    :
                        <div className="category-head" 
                            onClick={() => {if (this.state.isOpen) this.switchVisible()}}
                        >
                            {this.state.name}
                        </div>
            }
                <TransitionGroup className="link-list" component="div">
                    <DeleteCategoryButton 
                        minimized={!this.state.isOpen} 
                        hide={!this.props.editing} 
                        categoryIndex={this.props.index}
                        trueCategoryIndex={this.props.trueCategoryIndex}
                    /> 
                    {content.map((item, i) => 
                        <CSSTransition
                            in={true}
                            appear={true} 
                            key={i} 
                            timeout={{ enter: 500, exit: 500 }} 
                            classNames="link-block"
                        >
                            <LinkBlock
                                categoryIndex={this.props.index}
                                trueCategoryIndex={this.props.trueCategoryIndex}
                                linkIndex={i} 
                                trueLinkIndex={this.context.userdata[this.props.index].content
                                    .slice(0, i)
                                    .filter(item => item !== null).length}
                                minimized={!this.state.isOpen} 
                                editing={this.props.editing}
                                mounted={this.firstRender}
                            />
                        </CSSTransition>
                    )}
                    <AddLinkButton 
                        minimized={!this.state.isOpen} 
                        hide={!(this.props.editing || empty)} 
                        categoryIndex={this.props.index}
                        trueCategoryIndex={this.props.trueCategoryIndex}
                    /> 
                </TransitionGroup>
            </div>
        )
    }
}

Category.contextType = UserDataContext

export default Category