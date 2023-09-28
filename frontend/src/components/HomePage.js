import React from 'react';
import Header from './Header';

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.getData()
    }

    render()
    {
        return(
            <>
                <Header/>
                <main>

                </main>
            </>
        )
    }

    getData()
    {
        const request = {
            method: "GET",
            credentials: 'include'
        }
        
        fetch("api/data", request)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
    }
}

export default HomePage