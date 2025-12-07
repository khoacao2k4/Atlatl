"use client";
import React from "react";
import Link from "next/link";
import Markdown from "../components/Markdown";
import { LOGIN_URL, APPLE_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constant";

const feature_list = [
    "Comprehensive Experience",
    "Modern Identity and Access Management",
    "Multi-factor Authentication and Biometrics",
    "E-Authorization",
    "Secure Data Encryption",
    "Customized Interface and Reporting",
    "Seamless Mobility",
    "Real-time Collaboration",
    "Alternative Asset Reporting",
    "Full-Holding Visibility"
]

export default function ClientPortalPage() {
    return (
        <>
            <section className="container mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 font-tenorite">
                {/* HEADER SECTION */}
                <div className="flex flex-col items-center text-center mb-16 space-y-8">

                    {/* Keywords with Dividers */}
                    <div className="flex max-xl:flex-wrap justify-center items-center gap-4 md:gap-0 font-songer text-2xl md:text-3xl lg:text-4xl font-bold text-darker-bold-blue">
                        <span className="px-6">Seamless</span>
                        <span className="hidden md:block h-8 w-[2px] bg-bold-blue"></span>

                        <span className="px-6">Secure</span>
                        <span className="hidden md:block h-8 w-[2px] bg-bold-blue"></span>

                        <span className="px-6">Personalized</span>
                        <span className="hidden md:block h-8 w-[2px] bg-bold-blue"></span>

                        <span className="px-6">Collaborative</span>
                    </div>

                    {/* Subtext */}
                    <p className="text-lg md:text-xl text-darker-bold-blue max-w-4xl leading-relaxed">
                        Our platform is designed to help you access your data securely and efficiently while engaging with our team.
                    </p>
                </div>
            </section>

            <section className="pb-16 md:pb-24 bg-white overflow-x-hidden font-tenorite">
                {/* MAIN CONTENT GRID */}
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                    {/* LEFT COLUMN: Features List */}
                    <div className="relative isolate p-8 md:p-12 flex flex-col justify-center">

                        {/* Background breakout layer */}
                        {/* - absolute inset-y-0: Full height.
                            - -z-10: Behind the text.
                            - Mobile: 'inset-0 rounded-3xl' -> Fills the box normally.
                            - Desktop (lg): 
                                - 'right-0': Anchors to the right edge of this column.
                                - 'left-auto': Unsets default left alignment.
                                - 'w-[200vw]': Makes it extremely wide to cover the left side of the screen.
                                - 'rounded-l-none': Flat edge on the left (since it goes off-screen).
                                - 'rounded-r-3xl': Keeps the right side rounded.
                        */}
                        <span className="absolute inset-y-0 bg-light-blue
                            inset-0 rounded-3xl 
                            lg:right-0 lg:left-auto lg:w-[200vw] lg:rounded-l-none lg:rounded-r-3xl"
                        />

                        <ul className="space-y-4 text-darker-bold-blue text-lg md:text-xl font-medium relative justify-center flex">
                            <Markdown
                                classNameUl="list-disc list-outside ml-6 mb-4 space-y-4"
                            >
                                {feature_list.map((string) => `- ${string}`).join("\n")}
                            </Markdown>
                        </ul>
                    </div>

                    {/* RIGHT COLUMN: Login Box Image */}
                    <div className="flex flex-col items-center justify-center space-y-12 px-4 md:px-0">
                        <div className="border-2 border-bold-blue rounded-none p-1 w-full max-w-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <a
                                href={LOGIN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full h-full cursor-pointer"
                            >
                                <img
                                    src="/images/black-diamond-login.jpg"
                                    alt="Black Diamond Client Login"
                                    className="w-full h-auto object-contain"
                                />
                            </a>
                        </div>

                        <Link href={`${LOGIN_URL}`} target="_blank" rel="noopener noreferrer"
                            className="py-3 px-8 bg-bold-blue shadow-md rounded-full
                                text-white font-bold font-songer text-lg text-center
                                hover:bg-white hover:text-bold-blue hover:cursor-pointer hover:ring-2 hover:ring-bold-blue
                                transition-all duration-300 transform
                                max-lg:text-3xl max-lg:w-[200px]">
                            Login
                        </Link>
                    </div>
                </div>

                {/* --- FOOTER SECTION --- */}
                <div className="mt-20 flex flex-col items-center space-y-10">
                    <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl w-full">
                        <Link href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer">
                            <img
                                src="/images/app-store.svg"
                                alt="Download on the App Store"
                                className="w-[150px] md:w-[200px] h-auto hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <Link href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer">
                            <img
                                src="/images/google-play.svg"
                                alt="Get it on Google Play"
                                className="w-[200px] md:w-[266px] h-auto hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}