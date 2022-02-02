import React from 'react';
import TabOptions from "../Elements/TabOptions";
import projectName from "../../../../../ProjectDetails/name";
const About = () => {
    return (
        <TabOptions heading="About">
            <div>{projectName} helps takes notes on the go!</div>
            <div className='flex flex-col space-y-1'>
                <div>
                    Notes can be taken from PC, tablet or mobile device at the same time!
                </div>
                <span className='text-sm text-slate-400'>
                    ({projectName} syncronises all your notes across all your devices, in realtime)
                </span>
            </div>
            <div className='text-slate-300 text-xs pt-4'>
            © {projectName} | Pratyush Goel
            </div>
        </TabOptions>
    );
};

export default About;
