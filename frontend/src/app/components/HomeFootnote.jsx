'use client'

import "./HomeFootnote.css"
import { FiPlusCircle } from "react-icons/fi"; 
import { useState } from "react";

function Flashcard({title, children}) {

    const [hide, setHide] = useState(true); 

    return (
        <div className="flashcard">
            <div className="flashcard-title">
            <h2>{title}</h2>
            <div className={`flashcard-button ${hide? "collapsed" : "expanded"}`} onClick={() => { setHide(!hide); }}><FiPlusCircle /></div>
            </div>
            <div className={`flashcard-content ${hide? "collapsed" : "expanded"}`}>{children}</div>
        </div>
    )
}

export default function HomeFootnote() {
    return (
        <div className="footnote-section">
            <div className="word-board">
                <Flashcard title="DISCOVERY">Our process begins with a personalized discovery meeting, where we take the time to understand you - your goals, priorities, and long-term vision. Through in-depth conversations, we explore what matters most to you while also introducing you to Atlatl Advisers and how we can help guide your financial journey.</Flashcard>
                <Flashcard title="PLAN">In our second meeting, we'll review your initial financial plan, providing personalized recommedations to optimize your overall strategy. This includes guidance on estate planning, tax efficiency, and insurance solutions to help protect and grow your wealth.</Flashcard>
                <Flashcard title="AGREE">Together, we develop a comprehensive strategy that balances both sides of your financial picture, providing solutions to help you achieve your goals at every state of your life.</Flashcard>
                <Flashcard title="IMPLEMENT">Once we establish the framework of our partnership, we'll guide you through a seamless onboarding process, integrating you into our client portals and putting your tailored financial plan into action. </Flashcard>
            </div>
            <div className="ad-board">
                <h1>THE PROCESS</h1>
                <h3>A THOUGHTFUL, PERSONALIZED APPROACH TO BUILDING LASTING FINANCIAL SUCCESS</h3>
                <p>At Atlatl Advisers, we believe that great financial outcomes begin with a clear understanding of what matters most to you. </p>
                <p>Our structured, collaborative process ensures that every decision is aligned with your goals; from discovery to review, so you can move forward with clarity, confidence, and purpose.</p>
            </div>
        </div>
    );
}