"use client"

import { useEffect, useState } from "react";
import FetchAdvisers from "./FetchAdvisers";
import Link from "next/link";
import "./styles.css"

function TeamCard( {adviser} ) {

    let name = adviser.name;
    for (let i = 0; i < adviser.certifications.length; ++i) {
        name += ", " + adviser.certifications[i];  
    }

    return <Link href={`/team/${adviser.id}`} className="teamcard">
        <img src={adviser.image_url}></img>
        <h1>{name}</h1>
        <h2>{adviser.title}</h2>
    </Link>
}

export default function TeamPage() {

    const [listOfAdvisers, setListOfAdvisers] = useState([]); 

    useEffect(() => {
        async function loadAdvisers() {
        const data = await FetchAdvisers();
            setListOfAdvisers(data);
        }
        loadAdvisers(); 
    }, []);

    return (
        <div className="meetmyteam">
            <h3>MEET THE TEAM</h3>
            <div className="teamboard">
                {listOfAdvisers.map((a) => (
                    <TeamCard key={a.id} adviser={a} />
                ))}
            </div>
        </div>
    );
}