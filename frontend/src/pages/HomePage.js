import React from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group"
import Header from '../components/Header';
import Category from "../components/Category"
import AddCategoryButton from "../components/AddCategoryButton"
import "../css/homePage.css"
import { getUserDataRequest } from '../tools/requests';
import UserDataContext from '../components/UserDataContext';

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            loaded: false,
            editing: false,

            userdataContext: {
                userdata: [],

                renameCategory: (categoryIndex, newName) => {
                    var updated = this.state.userdataContext
                    updated.userdata[categoryIndex].name = newName
                    this.setState({
                        userdataContext: updated
                    })
                },

                changeLinkParameter: (categoryIndex, linkIndex, parameter, newValue) => {
                    var updated = this.state.userdataContext
                    updated.userdata[categoryIndex].content[linkIndex][parameter] = newValue
                    this.setState({
                        userdataContext: updated
                    })
                }
            }
        }
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
                        <UserDataContext.Provider value={this.state.userdataContext}>
                            <TransitionGroup className="category-list" component="div">
                                {this.state.userdataContext.userdata.map((item, i) => (
                                    <CSSTransition key={i} timeout={500} classNames="link-block">
                                        <Category index={i} editing={this.state.editing}/>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                            <TransitionGroup component={null}>
                                {this.state.editing ? (
                                    <CSSTransition key="addCategoryButton" timeout={{ enter: 0, exit: 500 }} classNames="add-category-button">
                                        <AddCategoryButton />
                                    </CSSTransition>
                                ) : (
                                    <></>
                                )}
                            </TransitionGroup>
                        </UserDataContext.Provider>
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
            this.setState({
                loaded: true,
                userdataContext: {...this.state.userdataContext, userdata: response.categories}
            })
        }
    }
}

export default HomePage