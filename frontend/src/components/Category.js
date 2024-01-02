import React from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import LinkBlock from "./LinkBlock"
import AddLinkButton from "./AddLinkButton"
import DeleteCategoryButton from "./DeleteCategoryButton"
import "../css/category.css"
import { renameCategoryRequest, deleteCategoryRequest, moveCategoryRequest } from "../tools/requests"
import UserDataContext from "./UserDataContext"
import { blockCategoriesAnimation, findCategory } from "../tools/dragAndDropTools"

class Category extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            isOpen: true,
            mounted: this.props.mounted,
            name: "",
            dragging: 0,
        }

        this.switchVisible = this.switchVisible.bind(this)
        this.inputCategoryName = this.inputCategoryName.bind(this)
        this.renameCategory = this.renameCategory.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDragEnter = this.handleDragEnter.bind(this)
        this.handleDragOver = this.handleDragOver.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
    }

    componentDidMount()
    {
        setTimeout(() => {this.setState({
            mounted: true
        })}, 0)
    }

    componentDidUpdate()
    {
        const item = this.context.userdata[this.props.categoryIndex]
        if (item != null && !this.props.editing && item.name !== this.state.name)
            this.setState({ name: item.name })
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
        if (this.state.name !== this.context.userdata[this.props.categoryIndex].name)
        {
            renameCategoryRequest(this.props.trueCategoryIndex, this.state.name)
            this.context.renameCategory(this.props.categoryIndex, this.state.name)
        }
    }

    deleteCategory()
    {
        if (this.props.editing && this.state.isOpen)
        {
            deleteCategoryRequest(this.props.trueCategoryIndex)
            this.setState({
                mounted: false
            })
            setTimeout(() => {
                this.context.deleteCategory(this.props.categoryIndex)
            }, 500)
        }
    }

    handleDragStart(event)
    {
        if (event.target.classList.contains("category") || event.target.classList.contains("category-head"))
        {
            event.dataTransfer.setData("widget", "category")
            event.dataTransfer.setData("index", this.props.categoryIndex)
            event.dataTransfer.setData("trueIndex", this.props.trueCategoryIndex)
        }
        this.setState({dragging: 1})
    }

    handleDragEnd(event)
    {
        event.preventDefault()
        this.setState({dragging: 0})

        const categoryList = document.querySelectorAll(".category-list")[0]
        categoryList.classList.remove("move-up")
        categoryList.classList.add("moved-up")
        setTimeout(() => {
            categoryList.classList.remove("moved-up")
        }, 500)

        const oldOver = document.querySelectorAll(".space-down, .space-up")[0]
        
        if (oldOver != null)
        {
            oldOver.classList.remove("space-down")
            oldOver.classList.remove("space-up")
        }
        
        this.setState({mounted: true})
    }

    handleDragEnter(event)
    {
        const targetCategory = findCategory(event.target)
        const targetIndex = this.props.categoryIndex
        const categoryList = document.getElementsByClassName("category-list")[0]
        const oldOver = document.querySelectorAll(".space-down, .space-up")[0]
        
        if (oldOver != null)
        {
            oldOver.classList.remove("space-down")
            oldOver.classList.remove("space-up")
        }
        categoryList.classList.remove("move-up")

        const dragged = document.querySelectorAll(".category.dragging")[0]
        if (dragged != null)
        {
            const draggedIndex = parseInt(dragged.getAttribute("index"))
            if (draggedIndex > targetIndex)
                targetCategory.classList.add("space-up")
            else if (draggedIndex < targetIndex)
            {
                targetCategory.classList.add("space-down")
                categoryList.classList.add("move-up")
            }
        }
        else // bug (no dragging element)
            this.setState({dragging:0})
    }

    handleDragOver(event)
    {
        event.preventDefault()
    }

    handleDrop(event)
    {
        if (event.dataTransfer.getData("widget") === "category")
        {
            const targetIndex = this.props.categoryIndex
            const draggedIndex = parseInt(event.dataTransfer.getData("index"))

            blockCategoriesAnimation()
            
            this.setState({dragging: 2})
            setTimeout(() => {
                this.setState({dragging: 0})
            }, 500)

            if (targetIndex !== draggedIndex)
            {
                const trueDraggedIndex = parseInt(event.dataTransfer.getData("trueIndex"))
                this.context.moveCategory(draggedIndex, targetIndex)
                moveCategoryRequest(trueDraggedIndex, this.props.trueCategoryIndex)
            }
            event.dataTransfer.clearData()
        }
    }

    render()
    {
        const item = this.context.userdata[this.props.categoryIndex]
        if (item == null)
            return <></>
        const content = item.content
        const empty = item.content.filter(item => item !== null).length === 0

        return(
            <div className={"category" 
                + (!this.state.isOpen ? " minimized" : "") 
                + (empty ? " empty" : "") 
                + (!this.state.mounted ? " unmounted" : "")
                + (this.state.dragging === 1 ? " dragging" : "")
                + (this.state.dragging === 2 ? " dragged" : "")}
                onClick={() => {if (!this.state.isOpen) this.switchVisible()}}
                index={this.props.categoryIndex}
                draggable={!this.props.editing}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDrop={this.handleDrop}
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
                        onClick={this.deleteCategory}
                    /> 
                    {content.map((item, i) => 
                        <CSSTransition
                            key={i} 
                            timeout={{ exit: 500 }} 
                            classNames="link-block-container"
                        >
                            <LinkBlock
                                categoryIndex={this.props.categoryIndex}
                                trueCategoryIndex={this.props.trueCategoryIndex}
                                linkIndex={i} 
                                trueLinkIndex={this.context.userdata[this.props.categoryIndex].content
                                    .slice(0, i)
                                    .filter(item => item !== null).length}
                                minimized={!this.state.isOpen} 
                                editing={this.props.editing}
                            />
                        </CSSTransition>
                    )}
                    <AddLinkButton 
                        minimized={!this.state.isOpen} 
                        hide={!(this.props.editing || empty)} 
                        categoryIndex={this.props.categoryIndex}
                        trueCategoryIndex={this.props.trueCategoryIndex}
                    /> 
                </TransitionGroup>
            </div>
        )
    }
}

Category.contextType = UserDataContext

export default Category