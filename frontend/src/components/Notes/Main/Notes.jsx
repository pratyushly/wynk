import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tabletBreakPoint from "./tabletBreakPoint";
import Tile from "./Tile";
import axios from "axios";
import ModalStructure from "../../Modal/Structure";
import Options from "../Panels/DashBoardOptions/Options";
import SettingPanel from "../Panels/SettingsPanel/Structure/Structure";
import DeleteModal from "../../Modal/DeleteModal";
import projectName from "../../ProjectDetails/name";
function Notes(props) {

    const syncTime = 2;
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [notEditable, setNotEditable] = useState(false);
    const [modal, setModal] = useState({ state: false, deleteId: null });
    const [openSettings, setOpenSettings] = useState(false);
    let [flag, setFlag] = useState({
        addTile: false,
        changeHandler: false,
        time: syncTime,
        eventName:null,
        eventValue:null
    });

    const welcomeNote = {
        id: "Welcome",
        title: 'Welcome 😃',
        content: ""
    }
    const newNote = {
        id: Date.now(),
        title: 'Untitled',
        content: ""
    }

    const [notes, setNotes] = useState([welcomeNote]);
    const [selectedNote, setSelectedNote] = useState(notes[notes.length - 1]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get('/notes', {
            headers: {
                'x-access-token': token
            }
        })
            .then(function (response) {
                if (typeof response.data === "string") {
                    // console.log("Error inside notes loading");
                    navigate("/");
                }
                else {
                    // console.log("Notes successfully rendered");
                    setNotes(response.data);
                    setSelectedNote(notes[notes.length - 1]);
                }
            });
        window.addEventListener('resize', handleR);
        handleR();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log("Syncronising");
            const token = localStorage.getItem("token");
            if (flag.addTile) {
                setFlag(prev => {
                    return ({
                        ...prev,
                        addTile: false,
                        time: syncTime
                    });
                });
                addTile();
            }
            else if (flag.changeHandler) {
                setFlag(prev => {
                    return ({
                        ...prev,
                        changeHandler: false,
                        time: syncTime,
                        eventName:null,
                        eventValue:null
                    });
                });
                changeHandler(flag.eventName,flag.eventValue);
            }
            else {
                axios.get('/notes', {
                    headers: {
                        'x-access-token': token
                    }
                })
                    .then(function (response) {
                        if (typeof response.data === "string") {
                            console.log(response.data);
                            props.logout();
                        }
                        setNotes(response.data);
                        if (selectedNote.id !== "Welcome") {
                            let flag = 0;
                            for (let i = 0; i < response.data.length; i++) {
                                if (response.data[i].id === selectedNote.id) {
                                    setSelectedNote(response.data[i]);
                                    flag = 1;
                                    break;
                                }
                            }
                            if (!flag) {
                                setSelectedNote(welcomeNote);
                            }
                            document.title = selectedNote.title.length > 18 ? (projectName + " | " + selectedNote.title.substring(0, 18) + "...") : projectName + " | " + selectedNote.title;
                        }
                        else {
                            document.title = projectName;
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }, (flag.time * 1000));
        // console.log("Setting interval - " + interval);
        return () => {
            // console.log("Clearing interval - " + interval);
            clearInterval(interval);
        }
    }, [flag]);

    function addTile() {
        const token = localStorage.getItem("token");
        axios.patch('/notes/update', newNote, {
            headers: {
                'x-access-token': token
            }
        })
            .then(function (response) {
                // console.log("Saved");
            })
            .catch(function (error) {
                console.log(error);
            });
        setSelectedNote(newNote);
        setNotes((prev) => {
            return (
                [...prev, newNote]
            );
        });
        console.log("inside addTile Function");
    }

    async function changeHandler(name,value) {

        let newobj = Object;
        await setSelectedNote((prev) => {
            newobj = {
                ...prev,
                [name]: value
            };
            return (newobj);
        });
        const token = localStorage.getItem("token");
        await axios.patch('/notes/update', newobj, {
            headers: {
                'x-access-token': token
            }
        })
            .then(function (response) {
                // console.log("Saved");
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('/notes', {
            headers: {
                'x-access-token': token
            }
        })
            .then(function (response) {
                if (typeof response.data === "string") {
                    navigate("/");
                }
                else {
                    setNotes(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function handleSelectNote(id) {
        setSelectedNote(notes.find((note) => {
            return note.id === id;
        })
        );
        setFlag(prev=>{return ({...prev});});
        if (window.innerWidth < tabletBreakPoint)
            handleMenu();
    }

    async function deleteNote(id) {
        const token = localStorage.getItem("token");
        await axios.delete('/notes/delete', {
            data: { id },
            headers: {
                'x-access-token': token
            }
        });
        setNotes(prev => {
            return (
                prev.filter(individualNote => {
                    return individualNote.id !== id;
                })
            );
        });
        if (selectedNote.id === id) {
            setSelectedNote(welcomeNote);
            setFlag(prev=>{return ({...prev});});
        }
    }

    function handleMenu() {
        if (menuOpen) {
            setMenuOpen(false);
            setNotEditable(false);
        }
        else {
            setMenuOpen(true);
            setNotEditable(true);
        }
    }
    function handleR(event) {
        if (window.innerWidth >= tabletBreakPoint) {
            setMenuOpen(true);
        }
        else {
            setMenuOpen(false);
        }
        setNotEditable(false);
    }

    const [longPress, setLongPress] = useState(false);
    document.onkeydown = event => {
        if (!openSettings && !modal.state) {
            if (event.ctrlKey && event.key === '/') {
                console.log(longPress);
                if (!longPress) {
                    setFlag(prev => {
                        return ({
                            ...prev,
                            addTile: true,
                            time: 0.01
                        });
                    });
                    setLongPress(true);
                }
            }
            else if (event.ctrlKey && event.key === 'Delete') {
                console.log(longPress);
                if (!longPress) {
                    if (selectedNote.id !== "Welcome") {
                        setModal({ state: true, deleteId: selectedNote.id })
                    }
                    setLongPress(true);
                }
            }
            else if (event.ctrlKey && event.shiftKey && event.key === 'S') {
                setOpenSettings(true);
            }
            else if (event.ctrlKey && event.shiftKey && event.key === 'L') {
                props.logout();
            }
        }
    };
    document.onkeyup = event => {
        if (event.key === "/" || event.key === "Delete") {
            setLongPress(false);
        }
    };

    return (
        <>

            <ModalStructure
                isOpen={openSettings}
                onRequestClose={setOpenSettings}
                setModalTurnOffState={false}
                modalLabel={"Settings"}
                contentBoxAdditionalClasses={'h-4/5 w-4/5 sm:w-3/4 sm:h-4/5 md:w-3/4 md:h-4/5 lg:w-3/5 m-4 border-0'}
            >
                <SettingPanel />
            </ModalStructure>

            <div className="bg-dark text-darkwhite font-open selection:bg-[#2E5565] print:bg-white print:text-printBlack" >
                <div className="px-4 py-8 bg-hover md:hidden font-semibold text-xl print:hidden">
                    <div className="px-4 flex justify-between items-center cursor-pointer" onClick={handleMenu}>
                        <div className="flex space-x-4  ">
                            <div>
                                ☰
                            </div>
                            <div>
                                Menu
                            </div>
                        </div>
                        <div className="block md:hidden">
                            <button onClick={() => (setOpenSettings(true))} className="w-full rounded-sm py-2 hover:bg-hover focus:outline-none focus:bg-hover">   <i className="fas fa-cog mr-1"></i></button>
                        </div>
                    </div>
                </div>
                <div className={`grid grid-cols-12 min-h-screen ${menuOpen && 'divide-y divide-gray-100'} space-y-4 md:space-y-0 md:divide-y-0 md:divide-x md:divide-gray-600 p-4 md:p-8 print:divide-none`}>
                    <div className={`${menuOpen ? 'col-span-12' : 'absolute -translate-x-96'} md:block md:col-span-4 md:p-2 lg:col-span-3 lg:p-4 print:hidden`}>
                        <div className="text-xl md:text-base flex flex-col justify-between h-full">
                            <div className="p-4 flex flex-col h-full space-y-8">
                                <div className="flex justify-between font-semibold text-2xl relative">
                                    <div>
                                        Dashboard
                                    </div>
                                    <Options logout={props.logout}
                                        setOpenSettings={setOpenSettings}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    {notes.map((note) => {
                                        if (note.id === "Welcome")
                                            return null;
                                        return (
                                            <Tile key={note.id}
                                                note={note}
                                                onClick={handleSelectNote}
                                                onDelete={(id) => { setModal({ state: true, deleteId: id }) }}
                                            />
                                        );
                                    }
                                    )}
                                    <div>
                                        <button onClick={() => {
                                            setFlag(prev => {
                                                return ({
                                                    ...prev,
                                                    addTile: true,
                                                    time: 0.01
                                                });
                                            });
                                        }} className="w-full mt-2 hover:bg-hover px-3 py-2 focus:outline-none focus:bg-hover">+ Add Page</button>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="hidden md:block relative bg-red-600">
                                fgfg
                                <div className="absolute top-0">
                                    <button onClick={() => (setOpenSettings(true))} className="w-full rounded-sm py-2 hover:bg-hover focus:outline-none focus:bg-hover">   <i className="fas fa-cog mr-1"></i> Settings</button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className={` ${(menuOpen && notEditable) && 'opacity-30 pt-8'}  col-span-12 md:mt-0 md:col-span-8 md:p-2 lg:col-span-9 lg:p-4 flex flex-col`} onClick={notEditable ? handleMenu : undefined}>
                        <div className="px-4 py-2">
                            <textarea name='title' id="" className="w-full bg-transparent text-3xl font-bold focus:outline-none no-scrollbar resize-none" value={selectedNote.title} onChange={(event) => {
                                setFlag(prev => {
                                    return ({
                                        ...prev,
                                        changeHandler: true,
                                        time: 0.01,
                                        eventName:event.target.name,
                                        eventValue:event.target.value
                                    });
                                });
                            }} disabled={notEditable || selectedNote.id === "Welcome"} />
                        </div>
                        <div className="px-4 flex-1">
                            <textarea name="content" id="" className="w-full h-full bg-transparent focus:outline-none pr-2 no-scrollbar resize-none text-justify" value={selectedNote.content} onChange={(event) => {
                                setFlag(prev => {
                                    return ({
                                        ...prev,
                                        changeHandler: true,
                                        time: 0.01,
                                        eventName:event.target.name,
                                        eventValue:event.target.value
                                    });
                                });
                            }} disabled={notEditable || selectedNote.id === "Welcome"} placeholder={selectedNote.title === "Untitled" ? "Start typing..." : null}></textarea>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block md:absolute bottom-8 right-8">
                    <button onClick={() => (setOpenSettings(true))} className="w-full rounded-full flex justify-center items-center p-2 hover:bg-hover focus:outline-none focus:bg-hover"><i className="fas fa-cog"></i></button>
                </div>
            </div>
            <DeleteModal
                isOpen={modal.state}
                onRequestClose={setModal}
                setModalTurnOffState={{ state: false, deleteId: null }}
                modalLabel="Delete Confirmation"
                onCancel={() => { setModal({ state: false, deleteId: null }); }}
                onDelete={async () => { await deleteNote(modal.deleteId); setModal({ state: false, deleteId: null }); }}
            />

        </>
    );
}
export default Notes;