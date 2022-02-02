import React from 'react';
const PanelElements = (props) => {
    return (
        <div className={` ${props.additionalClasses} rounded flex flex-col space-y-8 w-full`}>
            <div className='pb-1 border-b-[1px] border-gray-600 text-lg'>{props.heading}</div>
                {props.children}
        </div>
    );
};

export default PanelElements;
