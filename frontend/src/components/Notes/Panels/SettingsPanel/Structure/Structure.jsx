import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tabletBreakPoint from "../../../Main/tabletBreakPoint";
import MyAccount from "../Tabs/MyAccount/MyAccount";
import KeyboardShortcuts from "../Tabs/KeyboardShortcuts/KeyboardShortcuts";
import About from "../Tabs/About/About";
import { Tab } from '@headlessui/react';
const SettingPanel = () => {
    const [userDetails, setUserDetails] = useState({ email: null });
    const [displayTab, setDisplayTab] = useState(true);
    useEffect(() => {
        userDetailUpdated();
        window.addEventListener('resize', handleR);
        handleR();
    }, []);

    function userDetailUpdated() {
        const token = localStorage.getItem("token");
        axios.get('/userDetails', {
            headers: {
                'x-access-token': token
            }
        })
            .then(function (response) {
                if (typeof response.data !== "string")
                    setUserDetails(response.data);
            });
    }

    function handleR(event) {
        if (window.innerWidth <= tabletBreakPoint) {
            setDisplayTab(false);
        }
        else {
            setDisplayTab(true);
        }
    }

    return (
        <Tab.Group vertical as="div" className="h-full flex flex-col sm:flex-row text-darkwhite font-open border-0" >
            <Tab.List className="py-4 grid grid-cols-2 gap-y-2 px-4 sm:px-0 sm:flex sm:flex-col sm:gap-y-0 bg-settings-panel text-settings-panelText">
                <div className={'w-min row-start-1 col-start-1 text-settings-username sm:mb-2 px-4 self-center sm:self-auto'}>{userDetails.email}</div>
                <Tab as={React.Fragment}>
                    {({ selected }) => (
                        <div className={`${selected ? ' ' : " "} row-start-2 col-start-1 px-4 py-1 flex items-center space-x-2 hover:bg-settings-panelHover focus:outline-none focus:bg-settings-panelHover cursor-pointer w-full`}>
                            <i className="fas fa-user text-darkWhite"></i>
                            <div>
                                My Account
                            </div>
                        </div>
                    )}
                </Tab>
                {displayTab &&
                    <Tab as={React.Fragment}>
                        {({ selected }) => (
                            <div className={`${selected ? ' ' : " "} px-4 py-1 flex items-center space-x-2 hover:bg-settings-panelHover focus:outline-none focus:bg-settings-panelHover cursor-pointer w-full `}>
                                <i className="fas fa-keyboard text-darkWhite"></i>
                                <div>
                                    Keyboard shortcuts
                                </div>
                            </div>
                        )}
                    </Tab>
                }
                <Tab as={React.Fragment}>
                    {({ selected }) => (
                        <div className={`${selected ? ' ' : " "}  row-start-2 col-start-2 px-4 py-1 flex items-center space-x-2 hover:bg-settings-panelHover focus:outline-none focus:bg-settings-panelHover cursor-pointer w-full `}>
                            <i className="fas fa-info-circle text-darkWhite"></i>
                            <div>About</div>
                        </div>
                    )}
                </Tab>
            </Tab.List>
            <Tab.Panels className={'flex-1 p-8 sm:p-12 md:p-16 pt-[48px] h-full overflow-hidden'} >
                <Tab.Panel className={`focus:outline-none flex flex-col space-y-16 h-full overflow-auto no-scrollbar`}><MyAccount userDetailUdpated={userDetailUpdated} /></Tab.Panel>
                {displayTab && <Tab.Panel className={`focus:outline-none flex flex-col space-y-16 h-full overflow-auto no-scrollbar`}><KeyboardShortcuts /> </Tab.Panel>}
                <Tab.Panel className={`focus:outline-none flex flex-col space-y-16 h-full overflow-auto no-scrollbar`}><About />  </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
};

export default SettingPanel;
