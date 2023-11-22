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

                deleteCategory: (categoryIndex) => {
                    var updated = this.state.userdataContext
                    delete updated.userdata[categoryIndex]
                    this.setState({
                        userdataContext: updated
                    })
                },

                appendCategory: () => {
                    var updated = this.state.userdataContext
                    updated.userdata.push({
                        content: [],
                        name: "",
                    })
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
                },

                deleteLink: (categoryIndex, linkIndex) => {
                    var updated = this.state.userdataContext
                    // empty element in array for correct CSSTransition
                    delete updated.userdata[categoryIndex].content[linkIndex]
                    this.setState({
                        userdataContext: updated
                    })
                },

                appendLink: (categoryIndex) => {
                    var updated = this.state.userdataContext
                    updated.userdata[categoryIndex].content.push({
                        name: "",
                        url: "",
                    })
                    this.setState({
                        userdataContext: updated
                    })
                }
            }
        }
        this.getData()
        this.firstRender = true

        this.toggleEditState = this.toggleEditState.bind(this)
    }

    componentDidUpdate()
    {
        if (this.state.loaded)
            this.firstRender = false
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
                    <Header panel="home" editing={this.state.editing} toggleEditState={this.toggleEditState}/>
                    <main className={"home" + (this.state.editing ? " editing" : "")}>
                        <UserDataContext.Provider value={this.state.userdataContext}>
                            <div className="category-list">
                                {this.state.userdataContext.userdata.map((item, i) => (
                                    <Category
                                        key={i}
                                        categoryIndex={i}
                                        trueCategoryIndex={this.state.userdataContext.userdata
                                            .slice(0, i)
                                            .filter(item => item !== null).length}
                                        editing={this.state.editing}
                                        mounted={this.firstRender}
                                    />
                                ))}
                            </div>
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