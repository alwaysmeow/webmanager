import React, { createContext } from 'react';
import Header from '../components/Header';
import Category from "../components/Category"
import "../css/homePage.css"
import { getUserDataRequest } from '../tools/requests';

const Edit = createContext(false)

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            loaded: false,
            editing: false,
        }
        this.username = ""
        this.categories = []
        this.getData()
    }

    render()
    {
        if (this.state.loaded)
        {
            return(
                <>
                    <Header showPanel={true}/>
                    <main className='home'>
                        <ol className="category-list">
                            {this.categories.map((item, i) => <Category data = {item} key={i}/>)}
                        </ol>
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
            this.username = response.username
            this.setState({
                loaded: true
            })
        }
    }
}

export default HomePage