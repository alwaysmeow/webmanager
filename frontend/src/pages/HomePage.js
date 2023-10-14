import React from 'react';
import Header from '../components/Header';
import Category from "../components/Category"
import "../css/homePage.css"
import { getDataRequest } from '../tools/requests';

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            loaded: false
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
                    <Header username={this.username}/>
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
        const response = await getDataRequest()
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