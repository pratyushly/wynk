import React from 'react';

const KeyMapping = (props) => {
    return (
        <>
            <div>
                <span className='font-mono rounded bg-hover px-3 py-2'>
                    {props.shortcutKey}
                </span>
            </div>
            <div>
                {props.shortcutFunction}
            </div>
        </>
    );
};

export default KeyMapping;
