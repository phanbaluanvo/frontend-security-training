import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <>
            <header className="fixed top-0 left-0 right-0 bg-white py-4 px-6 flex justify-between items-center border-b shadow-md z-50 h-16">
                <Link to={'/'} >
                    <h1 className="text-2xl font-bold text-red-800">
                        AgentPhisher
                    </h1>
                </Link>
                <div className="flex-none space-x-2">
                    <Link to="/login" className="btn min-w-[5vw] btn-ghost">Login</Link>
                    <Link to="/signup" className="btn min-w-[5vw] text-white bg-red-700 hover:bg-red-800 border-none">Sign Up</Link>
                </div>
            </header>
            <div className="hero bg-base-200 min-h-screen px-6 py-12">
                <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                    <img
                        src="https://agent-phisher-bucket.s3.ca-central-1.amazonaws.com/images/hero-img.png"
                        className="w-60 rounded-lg shadow-2xl object-cover aspect-[2/3] bg-gray-900/5 border border-gray-200"
                    />
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold leading-tight">Cyber Security Training for Everyone</h1>
                        <p className="py-6 text-lg leading-relaxed text-gray-700">
                            Completely free and comprehensive cybersecurity training — built for everyone from tech enthusiasts to non-tech newcomers.
                            Learn to recognize and defend against the most common security threats you’re likely to face, all in a clear and accessible way.                        </p>
                        <Link to="/learn" className="btn min-w-[5vw] text-white bg-red-700 hover:bg-red-800 border-none">Get Started</Link>
                    </div>
                </div>
            </div>
            <footer className="bg-red-800">
                <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                    <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                        <div className="pb-6">
                            <a href="#" className="text-sm leading-6 text-white hover:text-gray-400">
                                Lessons
                            </a>
                        </div>
                        <div className="pb-6">
                            <a href="#" className="text-sm leading-6 text-white hover:text-gray-400">
                                Glossary
                            </a>
                        </div>
                        <div className="pb-6">
                            <a href="#" className="text-sm leading-6 text-white hover:text-gray-400">
                                Terms and Conditions
                            </a>
                        </div>
                        <div className="pb-6">
                            <a href="#" className="text-sm leading-6 text-white hover:text-gray-400">
                                Privacy Policy
                            </a>
                        </div>
                    </nav>
                    <p className="mt-10 text-center text-xs leading-5 text-white">
                        © 2025 AgentPhisher All rights reserved.
                    </p>
                </div>
            </footer>

        </>
    );
};

export default LandingPage;
