"use client"

import "./TeamPageReal.css"

export default function TeamPageReal( {adviser} ) {

    let name = adviser.name;
    for (let i = 0; i < adviser.certifications.length; ++i) {
        name += ", " + adviser.certifications[i];  
    }

    let image_url = "../" + adviser.image_url; 

    let description = [];

    let listOfDescriptions = adviser.description.split("\n"); 

    for (let i = 0; i < listOfDescriptions.length; ++i) {
        if (listOfDescriptions[i][0] === '-') {
            // Start a list
            const listItems = [];

            // Collect all consecutive lines starting with '-'
            while (i < listOfDescriptions.length && listOfDescriptions[i][0] === '-') {
            listItems.push(
                <li key={i}>{listOfDescriptions[i].slice(1).trim()}</li>
            );
            i++; // move to next line
            }

            // Push the <ul> to description
            description.push(<ul key={`ul-${i}`}>{listItems}</ul>);

            // Step back one since the for loop will increment again
            i--;
        } else {
            description.push(<p key={i}>{listOfDescriptions[i]}</p>);
        }
    }

    return (
        <div className="teammate-card">
            <img src={image_url}></img>
            <div className="descriptions">
                <div className="namecard">
                    <h1>{name}</h1>
                    <h2>{adviser.title}</h2>
                </div>
                <div>
                    {description}
                </div>
            </div>
        </div>
    );
}