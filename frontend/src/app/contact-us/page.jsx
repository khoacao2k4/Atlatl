"use client"

import Link from 'next/link'; 
import "./styles.css"

function InputField({prompt, id, width, placeholder}) {
  return (
    <div className="input-field">
      <label for={id}>{prompt}</label>
      <input id={id} style={{  width: width  }} placeholder={placeholder}></input>
    </div>
  )
}

function MultilineInputField({prompt, id, width, height, placeholder}) {
  return (
    <div className="input-field">
      <label for={id}>{prompt}</label>
      <textarea id={id} style={{  width: width   }} rows={height} placeholder={placeholder}></textarea>
    </div>
  )
}

export default function ContactUsPage() {
  return (<div className="contact-us-page">

    <h1>LET'S CONNECT</h1>
    <div className="extended-form">
      <div className="info-box">
        <div>
        <img src="/Graphic_Arrow_Black.png" style={{ height: "60px" }}></img>
        <h2>ATLATL <br/> ADVISERS</h2>
        </div>
        <div>
          <p>608-351-4500</p>
          <p>info@atlatladvisers.com</p>
        </div>
        <div>
          2921 Landmark Place Suite 501 <br /> Madison, WI 53711
        </div>
        <button>SCHEDULE A MEETING</button>
      </div>
      <div className="contact-form">
        <div className="name-field">
          <InputField prompt={"First Name"} id={"first-name-input"} width={"100%"} />
          <InputField prompt={"Last Name"} id={"last-name-input"} width={"100%"} />
        </div>
        <InputField prompt={"Email"} id={"email-input"} width={"100%"} />
        <InputField prompt={"Phone"} id={"phone-input"} width={"100%"} />
        <InputField prompt={"What services are you inquiring about?"} id={"services-input"} width={"100%"} />
        <MultilineInputField prompt={"Message"} id={"message-input"} width={"100%"} height={"6"} placeholder={"Type your message here..."}/>

        <button style={{  margin: "10px 30% 20px 30%"   }}>SUBMIT</button>
      </div>
    </div>
    
    {/** The interactive Map */}
    <div></div>

    <h1>QUESTIONS?</h1>
    <Link href="/" className="faq">VIEW FAQ</Link>
  </div>);
}
