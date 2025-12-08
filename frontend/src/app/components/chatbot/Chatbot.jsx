"use client" 

import { useState, useEffect } from "react" 
import { MdChatBubbleOutline, MdHorizontalRule, MdOpenInFull, MdCloseFullscreen, MdOutlineCancel, MdPersonOutline } from "react-icons/md";
import { FiArrowUp } from "react-icons/fi";
import { useChat } from "@ai-sdk/react"; 
import { DefaultChatTransport, TextStreamChatTransport } from 'ai';

export function BotMessage({ children }) {
    return (
        <div className="flex flex-row items-start gap-2 p-4">
            <img src="/Graphic_Arrow_Navy_Transparent.svg" alt="Atlatl Logo" className="w-8 h-8 mt-1"/>
            <div className="font-work-sans text-dark-blue">{children}</div>
        </div>
    )
}

export function HumanMessage({ children }) {
    return (
        <div className="flex flex-row-reverse items-start gap-2 p-4">
            <MdPersonOutline className="w-12 h-12 mt-1 text-dark-blue"/>
            {/* <div className="font-work-sans text-dark-blue border-dark-blue border-2 px-2">{children}</div> */}
            <div className="relative max-w-[80%] text-dark-blue font-work-sans">

                <div className="border-1 border-dark-blue rounded-xl px-3 py-2 bg-white">
                    {children}
                </div>

                {/* Bubble Tail (points to user icon) */}
                <div
                    className="
                        absolute
                        right-[-5.5px]
                        top-4
                        w-3 h-3
                        bg-white
                        border-r-1 border-b-1 border-dark-blue
                        rotate-315
                    "
                />
            </div>
        </div>
    )
}

export function Chatbot( { isOpen, toggleChatbot }  ) {

    const [input, setInput] = useState('');
    const [isLarge, setIsLarge] = useState(false);  
    const { messages, sendMessage, setMessages, status } = useChat({
        transport: new DefaultChatTransport({
            // api: 'http://localhost:3001/api/chat',
            api: '/api/chat',
        }),
    });

    const handleCancel = () => {
        setMessages([]);        // clear chat history
        toggleChatbot();        // hide widget
    };

    const toggleLarge = () => {
        setIsLarge((isLarge) => !isLarge);
    }

    return (
        // <div className={"rounded-[8px] border-3 border-[#245383] bg-[#F5FAFF] relative flex flex-col" + (isOpen ? "" : " hidden") + (isLarge ? " w-96 h-128 lg:w-128 lg:h-128" : " w-80 h-96")}>
        <div className={"rounded-[8px] border-3 border-[#245383] bg-[#F5FAFF] relative flex flex-col" + (isLarge ? " w-80 h-120 lg:w-128 lg:h-144" : " w-80 h-96")}>
            <div className="bg-[#DDEEFF] flex justify-between">
                <div className="flex items-center gap-2">
                    <img src="/images/triangle_blue.svg" alt="Atlatl Logo" className="w-8 h-8"/>
                    <h1 className="text-xl font-work-sans text-dark-blue text-bold">Atla</h1>
                </div>
                <div className="flex items-center gap-2">
                    <MdHorizontalRule onClick={toggleChatbot} className="text-dark-blue w-8 h-8 cursor-pointer"/>
                    <MdOpenInFull onClick={toggleLarge} className={"text-dark-blue w-8 h-8 cursor-pointer" + (isLarge ? " hidden" : "")}/>
                    <MdCloseFullscreen onClick={toggleLarge} className={"text-dark-blue w-8 h-8 cursor-pointer" + (isLarge ? "" : " hidden")}/>
                    <MdOutlineCancel onClick={handleCancel} className="text-dark-blue text-bold w-8 h-8 cursor-pointer"/>
                </div>
            </div>
            {/* --- CHAT SECTION --- */}
            <div className="flex-1 overflow-y-auto overflow-hidden mb-20">
                {/* --- SAMPLE MESSAGE --- */} 
                {/* <BotMessage>Hi! I’m Atla, an AI chatbot here to help you with any questions you have. How can I assist you today?</BotMessage>
                <HumanMessage>Hi Atla! Can you tell me more about Atlatl's services?</HumanMessage>
                <BotMessage>Of course! Atlatl specializes in providing cutting-edge AI solutions tailored to your business needs. We offer services such as AI consulting, custom model development, and integration support. How can we help you achieve your goals?</BotMessage> */}
                <BotMessage>Hi! I’m Atla, an AI chatbot here to help you with any questions you have. How can I assist you today?</BotMessage>
                {messages.map((m) => {
                    const isBot = m.role === "assistant" || m.role === "system";

                    // Combine all text parts into a single string
                    const text =
                        m.parts
                            ?.filter((part) => part.type === "text")
                            .map((part) => part.text)
                            .join(" ") ?? "";

                    if (!text) return null;

                    if (isBot) {
                        return (
                            <BotMessage key={m.id}>
                                {text}
                            </BotMessage>
                        );
                    }

                    return (
                        <HumanMessage key={m.id}>
                            {text}
                        </HumanMessage>
                    );
                })}
            </div>

            {/* --- INPUT SECTION --- */}
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-4 bg-[#F5FAFF]">
                <form
                    className="flex items-center h-[54px] bg-white rounded-full border border-[#378CE7] shadow-sm px-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log(input); 
                        if (!input.trim()) return;
                        sendMessage({text : input}); 
                        setInput('');
                    }}
                >
                    <input
                    type="text"
                    placeholder="What would you like to know?"
                    className="flex-1 bg-transparent outline-none text-md placeholder-gray-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    />

                    <button
                    type="submit"
                    className="ml-3 w-9 h-9 rounded-[400px] bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    disabled={status === "streaming"}
                    >
                    <FiArrowUp className="w-4 h-4 text-gray-600" />
                    </button>
                </form>            
            </div>
        </div>
    )
}

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false); 

    const toggleChatbot = () => {
        // console.log(`Clicked ${isOpen ? "Open": "Closed"}`);
        setIsOpen((isOpen) => !isOpen); 
    }

    return (
        <div className="fixed bottom-6 right-6 flex flex-col-reverse items-end gap-4 z-50">
            <button onClick={toggleChatbot} className="w-14 h-14 rounded-full bg-[#1A73E8] flex items-center justify-center shadow-lg">
                <MdChatBubbleOutline  className="text-white w-10 h-10 cursor-pointer" />
            </button>
            <div 
                className={`
                    origin-bottom-right
                    transform
                    transition-all
                    duration-300
                    ease-out
                    ${isOpen
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "hidden opacity-0 translate-y-4 scale-95 pointer-events-none"
                    }
                `}            
            >
                <Chatbot isOpen={isOpen} toggleChatbot={toggleChatbot} />
            </div>
        </div>
    );
}