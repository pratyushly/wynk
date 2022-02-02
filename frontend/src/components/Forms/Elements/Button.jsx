import React from 'react';

const Button = (props) => {
    return (
        <button className="mt-[76px] px-4 py-2 rounded bg-slate-500 hover:bg-slate-400 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-80 cursor-pointer" >{props.text}</button>
    );
};

export default Button;
