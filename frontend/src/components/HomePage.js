import React from 'react';
import Header from './Header';
import Category from "./Category"
import "../css/homePage.css"

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            userName: "",
            loaded: false
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
                    <Header userName={this.state.userName}/>
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

    getData()
    {
        const request = {
            method: "GET",
            credentials: 'include'
        }
        
        fetch("api/data", request)
        .then(response => response.json())
        .then(data =>
        {
            this.setState({
                userName: data.userName,
                loaded: true
            })
            this.categories = data.categories;
            console.log(data);
        })
    }
}

export default HomePage