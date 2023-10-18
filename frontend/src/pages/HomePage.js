import React from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group"
import Header from '../components/Header';
import Category from "../components/Category"
import AddCategoryButton from "../components/AddCategoryButton"
import EditContext from '../components/EditContext';
import "../css/homePage.css"
import { getUserDataRequest } from '../tools/requests';

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            loaded: false,
            editing: {
                editState: false,
                toggleEditState: () => {
                    this.setState({
                        editing: {...this.state.editing, editState: !this.state.editing.editState}
                    })
                }
            },
        }
        this.categories = []
        this.getData()
    }

    render()
    {
        if (this.state.loaded)
        {

            return(
                <>
                    <EditContext.Provider value={this.state.editing}>
                        <Header showPanel={true}/>
                        <TransitionGroup className='home' component="main">
                            <div className="category-list">
                                {this.categories.map((item, i) => (
                                    <CSSTransition key={i} timeout={500} classNames="link-block">
                                        <Category data={item} />
                                    </CSSTransition>
                                ))}
                            </div>
                            {this.state.editing.editState ? (
                                <CSSTransition key="addCategoryButton" timeout={{ enter: 0, exit: 500 }} classNames="add-category-button">
                                    <AddCategoryButton />
                                </CSSTransition>
                            ) : (
                                <></>
                            )}
                        </TransitionGroup>
                    </EditContext.Provider>
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