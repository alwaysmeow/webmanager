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
        this.handleDrop = this.handleDrop.bind(this)
    }

    componentDidMount()
    {
        setTimeout(() => this.setState({
            mounted: true
        }), 0)
    }

    componentDidUpdate()
    {
        const item = this.context.userdata[this.props.categoryIndex]
        if (!this.props.editing && item.name !== this.state.name)
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
        if (event.target.className === "category" || event.target.className === "category-head")
        {
            event.dataTransfer.setData("widget", "category")
            event.dataTransfer.setData("index", this.props.categoryIndex)
        }
        this.setState({dragging: 1})
        console.log(parseInt(event.dataTransfer.getData("index")));
    }

    handleDragEnd(event)
    {
        event.preventDefault()
        this.setState({dragging: 2})

        blockCategoriesAnimation()

        const categoryList = document.getElementsByClassName("category-list")[0]
        categoryList.classList.remove("move-up")
        categoryList.classList.add("moved-up")
        setTimeout(() => {
            categoryList.classList.remove("moved-up")
            this.setState({dragging: 0})
        }, 500)

        const oldOver = document.querySelectorAll(".space-down, .space-up")[0]
        if (oldOver != null)
        {
            oldOver.classList.remove("space-down")
            oldOver.classList.remove("space-up")
            oldOver.classList.add("dragged")
            setTimeout(() => {
                oldOver.classList.remove("dragged")
            }, 500)
        }
        
        this.setState({mounted: true})
    }

    handleDragEnter(event)
    {
        const targetCategory = findCategory(event.target)
        const targetIndex = this.props.categoryIndex
        const draggedIndex = parseInt(document.getElementsByClassName("category dragging")[0].getAttribute("index"))
        const categoryList = document.getElementsByClassName("category-list")[0]
        const oldOver = document.querySelectorAll(".space-down, .space-up")[0]
        
        if (oldOver != null)
        {
            oldOver.classList.remove("space-down")
            oldOver.classList.remove("space-up")
        }
        categoryList.classList.remove("move-up")
        
        if (draggedIndex > targetIndex)
            targetCategory.classList.add("space-up")
        else if (draggedIndex < targetIndex)
        {
            targetCategory.classList.add("space-down")
            categoryList.classList.add("move-up")
        }
    }

    handleDrop(event)
    {
        if (event.dataTransfer.getData("widget") === "category")
        {
            const targetIndex = this.props.categoryIndex
            const draggedIndex = parseInt(event.dataTransfer.getData("index"))
            if (targetIndex !== draggedIndex)
            {
                this.context.moveCategory(draggedIndex, targetIndex)
                moveCategoryRequest(draggedIndex, targetIndex)
            }
            console.log(draggedIndex, '>', targetIndex);
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
                + (this.state.dragging === 2 ? " no-animation" : "")}
                onClick={() => {if (!this.state.isOpen) this.switchVisible()}}
                index={this.props.categoryIndex}
                draggable={!this.props.editing}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onDragOver={(event) => {event.preventDefault()}}
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