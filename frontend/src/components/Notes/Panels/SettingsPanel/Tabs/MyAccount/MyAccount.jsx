import React, { useState } from 'react';
import axios from 'axios';
import PanelElement from "../Elements/TabOptions";
import Update from "../../../../../Buttons/Update";
import DeleteButton from "../../../../../Buttons/Delete";
import DeleteModal from '../../../../../Modal/DeleteModal';

const MyAccount = (props) => {
    const [newUsername, setNewUsername] = useState("");
    const [userPassword, setUserPassword] = useState({ currentPassword: "", password: "", confirmPassword: "", notMatch: false, oldPasswordInvalid: false });
    const [updationSuccess, setUpdationSuccess] = useState({ username: false, password: false, usernameExist: false });
    const [passwordOnceSubmitted, setPasswordOnceSubmitted] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [invalid, setInvalid] = useState({
        username: false,
        password: false
    });

    function changeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        setInvalid({
            username:false,
            password:false
        });
        if (name === "email") {
            setNewUsername(value);
            if (updationSuccess.usernameExist)
                setUpdationSuccess(prev => {
                    return ({
                        ...prev,
                        usernameExist: false
                    });
                });
        }
        else if (name === "password" || name === "confirmPassword") {
            if (passwordOnceSubmitted) {
                if ((name === "password" && value !== userPassword.confirmPassword) || (name === "confirmPassword" && value !== userPassword.password)) {
                    setUserPassword(prev => {
                        return ({
                            ...prev,
                            [name]: value,
                            notMatch: true
                        });
                    });
                }
                else {
                    setUserPassword(prev => {
                        return ({
                            ...prev,
                            [name]: value,
                            notMatch: false
                        });
                    });
                }
            }
            else {
                setUserPassword(prev => {
                    return ({
                        ...prev,
                        [name]: value
                    });
                });
            }
        }
        else if (name === "currentPassword") {
            setUserPassword((prev => {
                return ({
                    ...prev,
                    [name]: value,
                    oldPasswordInvalid: false
                });
            }));
        }
    }

    function updatePassword(event) {
        event.preventDefault();
        if (userPassword.currentPassword !== "" && userPassword.password !== "") {
            if (userPassword.password === userPassword.confirmPassword) {
                console.log("Password Submitted");
                const token = localStorage.getItem("token");
                axios.patch("/userDetails/update/password", userPassword, {
                    headers: {
                        'x-access-token': token
                    }
                })
                    .then(function (response) {
                        if (response.data === "Updated") {
                            setUserPassword({ currentPassword: "", password: "", confirmPassword: "", notMatch: false, oldPasswordInvalid: false });
                            setUpdationSuccess(prev => {
                                return ({
                                    ...prev,
                                    password: true
                                });
                            });
                            setTimeout(() => {
                                setUpdationSuccess(prev => {
                                    return ({
                                        ...prev,
                                        password: false
                                    });
                                });
                            }, 3000);
                            setPasswordOnceSubmitted(false);
                        }
                        else if (response.data === "Wrong Password") {
                            setUserPassword(prev => {
                                return ({
                                    ...prev,
                                    oldPasswordInvalid: true
                                });
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            else {
                setPasswordOnceSubmitted(true);
                setUserPassword(prev => {
                    return ({
                        ...prev,
                        notMatch: true
                    });
                });
            }
        }
        else {
            setInvalid(prev => {
                return ({
                    ...prev,
                    password: true
                });
            })
        }
    }

    function updateUsername(event) {
        event.preventDefault();
        if (newUsername !== "") {
            const token = localStorage.getItem("token");
            axios.patch("/userDetails/update/username", { newUsername }, {
                headers: {
                    'x-access-token': token
                }
            })
                .then(function (response) {
                    if (response.data === "Updated") {
                        setNewUsername("");
                        setUpdationSuccess(prev => {
                            return ({
                                ...prev,
                                username: true
                            });
                        })
                        setTimeout(() => {
                            setUpdationSuccess(prev => {
                                return ({
                                    ...prev,
                                    username: false
                                });
                            })
                        }, 3000);
                        props.userDetailUdpated();
                    }
                    else if (response.data === "Username already exists") {
                        setUpdationSuccess(prev => {
                            return ({
                                ...prev,
                                usernameExist: true
                            });
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            setInvalid(prev => {
                return ({
                    ...prev,
                    username: true
                });
            })
        }
    }

    return (
        <>
            <PanelElement heading="Username" additionalClasses={``}>
                <form className='space-y-6 sm:flex sm:space-x-6 sm:space-y-0 text-sm items-center' onSubmit={updateUsername}>
                    <div className='relative'>
                        <input id="email" name="email" type="text"
                            className="bg-transparent peer h-10 border-b-2 border-slate-500 placeholder-transparent focus:outline-none focus:border-slate-400 "
                            placeholder="john@doe.com" onChange={changeHandler} value={newUsername} />
                        <label htmlFor="email"
                            className={`absolute left-0 -top-3.5 ${(updationSuccess.usernameExist || invalid.username) && 'text-[#eb5757]'} transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:${!invalid.username && 'text-gray-400'} peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${(updationSuccess.usernameExist || invalid.username) && 'text-[#eb5757]'} peer-focus:text-xs`}>{updationSuccess.usernameExist ? "Username Already Exists!" : invalid.username ? "Enter valid username" : "New Username"}</label>
                    </div>
                    <Update additionalClasses={"w-min sm:auto"} />
                    {updationSuccess.username && <div>Updated successfully</div>}
                </form>
            </PanelElement>
            <PanelElement heading="Password" additionalClasses={``}>
                <form className='space-y-8 sm:grid sm:grid-cols-2 sm:gap-8 sm:space-y-0 text-sm justify-center' onSubmit={updatePassword}>
                    <div className='relative'>
                        <input id="currentPassword" name="currentPassword" type="password"
                            className="w-full bg-transparent peer h-10 border-b-2 border-slate-500 placeholder-transparent focus:outline-none focus:border-slate-400"
                            placeholder="john@doe.com" onChange={changeHandler} value={userPassword.currentPassword} />
                        <label htmlFor="currentPassword"
                            className={`w-full absolute left-0 -top-3.5 ${userPassword.oldPasswordInvalid && 'text-[#eb5757]'} transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${userPassword.oldPasswordInvalid && 'text-[#eb5757]'} peer-focus:text-xs`}>{userPassword.oldPasswordInvalid ? "Invalid Password!" : "Current Password"}</label>
                    </div>
                    <div className='relative row-start-2'>
                        <input id="password" name="password" type="password"
                            className="w-full bg-transparent peer h-10 border-b-2 border-slate-500 placeholder-transparent focus:outline-none focus:border-slate-400"
                            placeholder="john@doe.com" onChange={changeHandler} value={userPassword.password} />
                        <label htmlFor="password"
                            className={`w-full absolute left-0 -top-3.5 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5  peer-focus:text-xs`}>New Password</label>
                    </div>
                    <div className='relative row-start-2'>
                        <input id="confirmPassword" name="confirmPassword" type="password"
                            className="w-full bg-transparent peer h-10 border-b-2 border-slate-500 placeholder-transparent focus:outline-none focus:border-slate-400"
                            placeholder="john@doe.com" onChange={changeHandler} value={userPassword.confirmPassword} />
                        <label htmlFor="confirmPassword"
                            className={`w-full absolute left-0 -top-3.5 ${userPassword.notMatch && 'text-[#eb5757]'} transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:${!userPassword.notMatch && 'text-gray-400'} peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${userPassword.notMatch && 'text-[#eb5757]'} peer-focus:text-xs`}>{userPassword.notMatch ? "Password Don't Match!" : "Confirm Password"}</label>
                    </div>
                    <div className='row-start-3'>
                        <Update additionalClasses='w-full' />
                    </div>
                    {(updationSuccess.password || invalid.password) && <div className={`row-start-3 self-center ${invalid.password && 'text-[#eb5757]'}`}>{invalid.password ? 'Recheck entered passwords' : 'Updated successfully'}</div>}

                </form>
            </PanelElement>
            <PanelElement heading="Account" additionalClasses={`pb-16 sm:pb-0`}>
                <DeleteButton deleteMessage="Delete Account" onClick={() => { setDeleteModal(true); }} />
            </PanelElement>
            <DeleteModal
                isOpen={deleteModal}
                onRequestClose={setDeleteModal}
                setModalTurnOffState={false}
                modalLabel="Delete Account"
                onCancel={() => { setDeleteModal(false); }}
                onDelete={async () => {
                    const token = localStorage.getItem("token"); await axios.delete("/userDetails/delete", {
                        headers: {
                            'x-access-token': token
                        }
                    }); console.log("Account deleted"); setDeleteModal(false);
                }}
            />
        </>
    );
};

export default MyAccount;
