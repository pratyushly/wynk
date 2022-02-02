import React from 'react';
import { useNavigate } from "react-router-dom";
import projectName from "../ProjectDetails/name";
import logo from "../images/logo.jpg";
import heroImage from "../images/heroImage.png";

const Home = () => {
    const year = new Date().getFullYear();
    const navigate = useNavigate();
    return (
        <div className='space-y-8 selection:bg-slate-700 selection:text-white'>
            <header className="text-gray-600 font-open text-2xl">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                    <a className="flex font-medium items-center text-gray-900 mb-4 md:mb-0 cursor-pointer" href="/">
                        <img src={logo} alt="Wynk Logo" className='h-12' />
                        <span className="ml-3 font-bold">{projectName}</span>
                    </a>
                    <div className='space-x-4'>
                        <button onClick={()=>(navigate("/login"))} className="font-semibold text-base inline-flex items-center hover:bg-gray-100 border-0 py-1 px-3 focus:outline-none focus:bg-gray-100 rounded mt-4 md:mt-0 ">Login
                        </button>
                        <button onClick={()=>(navigate("/register"))} className="font-semibold text-base inline-flex items-center bg-slate-700 hover:bg-slate-800 text-white border-0 py-1 px-3 focus:outline-none focus:bg-slate-800 rounded mt-4 md:mt-0">{'Try ' + projectName + ' free'}
                        </button>
                    </div>
                </div>
            </header>
            <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                        <h1 className="title-font text-3xl sm:text-5xl lg:text-7xl mb-4 text-gray-900 font-bold">Make Notes
                            <br className="inline-block" />On the go
                        </h1>
                        <p className="mb-8 leading-relaxed text-xl">Notes get syncronised across all your devices in realtime</p>
                        <div className="flex justify-center">
                            <button onClick={()=>(navigate("/register"))} className="inline-flex text-white font-semibold bg-slate-700 border-0 py-2 px-8 focus:outline-none focus:bg-slate-800 hover:bg-slate-800 rounded text-lg">{'Try ' + projectName + ' free'}</button>
                        </div>
                    </div>
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    {/* Image Credit - www.notion.so */}
                        <img className="object-cover object-center rounded" alt="hero" src={heroImage} />
                    </div>
                </div>
            </section>
            <footer className="text-gray-600 body-font !mt-16">
                <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col ">
                    <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900" href="/">
                        <img src={logo} alt="Wynk Logo" className='h-12' />
                        <span className="ml-3 text-xl">{projectName}</span>
                    </a>
                    <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">{'© ' + year + ' '}
                        <a href="/">{projectName + ' -'}</a>
                        <a href="mailto:pratyushg444@gmail.com" className="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@PratyushGoel</a>
                    </p>
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                        <a className="ml-3 text-gray-500 hover:text-[#555]" href='http://www.linkedin.com/in/DeveloperPratyush' target='blank' >
                            <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2" stroke="none"></circle>
                            </svg>
                        </a>
                        <a className="ml-3 text-gray-500 hover:text-[#555]" href='https://github.com/DeveloperPratyush' target='blank'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </a>
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
