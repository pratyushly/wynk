import React from 'react';

const Update = (props) => {
    return <button className={`text-white bg-[#2EAADC] px-3 py-2 rounded-sm hover:bg-[#069CCD] focus:outline-none focus:bg-[#069CCD] ${props.additionalClasses}`}>Update</button>;
};

export default Update;
