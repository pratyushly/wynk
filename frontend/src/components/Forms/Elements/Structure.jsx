import React from 'react';
import {Link} from "react-router-dom";
import projectName from "../../ProjectDetails/name";
import logo from "../../images/logo-white.png";

const Structure = (props) => {
    return (
        <div className="min-h-screen selection:bg-slate-500 selection:text-white ">
            <div className={`min-h-screen bg-slate-300 flex justify-center items-center`} >
                <div className="p-8 flex-1">
                    <div className="w-80 bg-white rounded-3xl mx-auto overflow-hidden shadow-xl">
                        <div className="relative h-48 bg-slate-500 rounded-bl-4xl">
                            <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                                <path fill="#ffffff" fillOpacity="1"
                                    d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,122.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                                </path>
                            </svg>
                            <a href="/" className='absolute top-10 left-8'>
                                <img src={logo} alt="wynk logo" className='h-12' />
                            </a>
                        </div>
                        <div className="px-10 pt-4 pb-4 bg-white rounded-tr-4xl">
                            <h1 className="text-2xl font-semibold text-gray-900">{props.formHeading}</h1>
                            {props.children}
                            <Link to="/" className='block text-center text-xs mt-4 text-slate-400'>{'© ' + projectName + ' | Pratyush Goel'}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Structure;
