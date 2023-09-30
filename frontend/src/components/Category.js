import React from "react"
import LinkBlock from "./LinkBlock"

class Category extends React.Component
{
    render()
    {
        return(
            <div className="category">
                <div className="category-head">{this.props.data.name}</div>
                <ol className="link-list">
                    {this.props.data.content.map((item, i) => <LinkBlock link={item} key={i}/>)}
                </ol>
            </div>
        )
    }
}

export default Category