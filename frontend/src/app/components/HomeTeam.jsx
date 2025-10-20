"use client";

import Link from "next/link";
import "./HomeTeam.css";

export default function HomeTeam() {
  return (
    <div className="hometeam-board">
        <div className="hometeam-text">
            <h1>PEOPLE WITH A PURPOSE</h1>
            <p>We strive to hire, inspire, and invest in the best talent across our respective disciplines and empower our team to thrive in an environment of respect. Our ability to celebrate different perspectives and foster a culture of inclusion leads to an exceptional client experience.</p>
        </div>
        <div className="member-card-list">
            <div className="member-card">
                <img src="images/placeholder-vertical.png" className="portrait"></img>
                <h2>ROSS FEDENIA, CFP</h2>
                <div>Founder and CEO</div>
            </div>
            <div className="member-card">
                <img src="images/placeholder-vertical.png" className="portrait"></img>
                <h2>MARK FEDENIA, PH.D</h2>
                <div>Director of Investments</div>
            </div>
            <div className="member-card">
                <img src="images/placeholder-vertical.png" className="portrait"></img>
                <h2>STEPHANIE KAMINSKI</h2>
                <div>Director of Operations</div>
            </div>
        </div>
        <button onClick={() => console.log("View More Team Members")}>
            VIEW MORE TEAM MEMBERS
        </button>
    </div>
  );
}
