import React from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group"
import Header from '../components/Header';
import Category from "../components/Category"
import AddCategoryButton from "../components/AddCategoryButton"
import "../css/homePage.css"
import { getUserDataRequest } from '../tools/requests';

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            loaded: false,
            editing: false
        }
        this.categories = []
        this.getData()

        this.toggleEditState = this.toggleEditState.bind(this)
    }

    toggleEditState()
    {
        this.setState({
            editing: !this.state.editing
        })
    }

    render()
    {
        if (this.state.loaded)
        {
            return(
                <>
                    <Header showPanel={true} editing={this.state.editing} toggleEditState={this.toggleEditState}/>
                    <main className={"home" + (this.state.editing ? " editing" : "")}>
                        <TransitionGroup className="category-list" component="div">
                            {this.categories.map((item, i) => (
                                <CSSTransition key={i} timeout={500} classNames="link-block">
                                    <Category data={item} index={i} editing={this.state.editing}/>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                        <TransitionGroup>
                            {this.state.editing ? (
                                <CSSTransition key="addCategoryButton" timeout={{ enter: 0, exit: 500 }} classNames="add-category-button">
                                    <AddCategoryButton />
                                </CSSTransition>
                            ) : (
                                <></>
                            )}
                        </TransitionGroup>
                    </main>
                </>
            )
        }
        else
        {
            return <div>loading</div>
        }
    }

    async getData()
    {
        const response = await getUserDataRequest()
        console.log(response)
        if (response === null)
            window.location.href = '/login'
        else
        {
            this.categories = response.categories
            this.setState({
                loaded: true
            })
        }
    }
}

export default HomePage