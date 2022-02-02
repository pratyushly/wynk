import React from 'react';

const Cancel = (props) => {
    return <button className="px-4 py-2 text-sm rounded-[3px] hover:bg-[#c2c2c226] border border-[#ffffff24] transition focus:outline-none focus:bg-[#c2c2c226] select-none" onClick={() => props.onClick()}>Cancel</button>;
};

export default Cancel;
