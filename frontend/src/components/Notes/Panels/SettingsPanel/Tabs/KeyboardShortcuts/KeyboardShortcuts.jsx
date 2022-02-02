import React from 'react';
import TabOptions from "../Elements/TabOptions";
import KeyMapping from './KeyMapping';
const KeyboardShortcuts = () => {
    return (
        <>
            {/* <TabOptions heading="Info">
                <div className='flex space-x-6 text-sm items-center'>

                </div>
            </TabOptions> */}
            <TabOptions heading="Shortcuts">
                <div className='grid grid-cols-2 gap-y-8 text-sm items-center'>
                    <KeyMapping shortcutKey="Ctrl + P" shortcutFunction="Print Note"/>
                    <KeyMapping shortcutKey="Ctrl + /" shortcutFunction="Create New Note"/>
                    <KeyMapping shortcutKey="Ctrl + Del" shortcutFunction="Delete Current Note"/>
                    <KeyMapping shortcutKey="Ctrl + Shift + S" shortcutFunction="Open Settings"/>
                    <KeyMapping shortcutKey="Ctrl + Shift + L" shortcutFunction="Logout"/>
                </div>
            </TabOptions>
        </>
    );
};

export default KeyboardShortcuts;
