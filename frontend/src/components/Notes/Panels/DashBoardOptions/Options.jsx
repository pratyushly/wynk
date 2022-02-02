import React from "react";
import { Menu, Transition } from "@headlessui/react";
const Options = (props) => {

    return (
        <Menu>
            {({ open }) => (
                <>
                    <Menu.Button className={`px-3 text-options-toggle select-none cursor-pointer rounded-sm focus:outline-none focus:bg-options-hover `} >
                        ⋮
                    </Menu.Button>
                    <Transition
                        as={React.Fragment}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform opacity-0"
                        enterTo="transform  opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform opacity-100"
                        leaveTo="transform opacity-0">
                        <Menu.Items className="bg-options-background py-2 rounded-md shadow-modal text-sm text-options-heading focus:outline-none space-y-1 absolute right-3 top-full mt-2" >
                            <Menu.Item>
                                {
                                    ({ active }) => (
                                        <div className={`${active && 'bg-options-hover'} px-4 py-1 cursor-pointer`} onClick={()=>{window.print();}}>Print</div>
                                    )
                                }
                            </Menu.Item>
                            <Menu.Item>
                                {
                                    ({ active }) => (
                                        <div className={`${active && 'bg-options-hover'} px-4 py-1 cursor-pointer`} onClick={props.logout}>Logout</div>
                                    )
                                }
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </>
            )} 
        </Menu>
    );
};

export default Options;
