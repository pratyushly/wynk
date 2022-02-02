import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Structure from "./Elements/Structure";
import Button from "./Elements/Button";
import { Transition } from "@headlessui/react";

function LoginForm(props) {
    const navigate = useNavigate();
    const [usernameNotExists, setUsernameNotExists] = useState(false);
    const [formOnceSubmitted, setFormOnceSubmitted] = useState(false);
    const [codeTransitioning, setCodeTransitioning] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);
    const [contactNotExists, setContactNotExists] = useState(false);
    const [sentCode, setSentCode] = useState(false);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [noEmail, setNoEmail] = useState(false);

    const [screen, setScreen] = useState({
        login: true,
        code: false,
        reset: false
    });

    const [updateUser, setUpdateUser] = useState({
        contactDetail: "",
        activationCode: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [user, setUser] = useState({
        username: "",
        password: ''
    });

    function changeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        if (name === "username" || name === "password") {
            setUser((prev) => {
                return ({
                    ...prev,
                    [name]: value
                });
            });
            if (name === "username" && usernameNotExists) {
                setUsernameNotExists(false);
            }
            else if (name === "password" && wrongPassword) {
                setWrongPassword(false);
            }
        }
        else {
            setUpdateUser((prev) => {
                return ({
                    ...prev,
                    [name]: value
                });
            });
            if (name === "contactDetail" && contactNotExists) {
                setContactNotExists(false);
            }
            else if (name === "activationCode" && invalidCode) {
                setInvalidCode(false);
            }
            if (formOnceSubmitted) {
                if (name === "confirmNewPassword") {
                    (updateUser.newPassword === value) ? setWrongPassword(false) : setWrongPassword(true);

                }
                else if (name === "newPassword") {
                    (updateUser.confirmNewPassword === value) ? setWrongPassword(false) : setWrongPassword(true);

                }
            }
        }
    }

    function submitHandler(event) {
        event.preventDefault();
        axios.post("/login", user)
            .then(function (response) {
                if (response.data.message === "Login Successfull") {
                    localStorage.setItem("token", response.data.token);
                    props.authenticate();
                    return;
                }
                else if (response.data.message === 'User Not Found') {
                    setUsernameNotExists(true);
                }
                else if (response.data.message === 'Wrong Password') {
                    setWrongPassword(true);
                }
                localStorage.setItem("token", response.data.token);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function handleForgotPassword() {
        setUser({
            username: "",
            password: ''
        });
        setScreen({
            login: false,
            code: true,
            reset: false
        });
        setWrongPassword(false);
        setUsernameNotExists(false);
    }

    function handleResetCodeScreen() {
        if (!sentCode) {
            if (updateUser.contactDetail === "") {
                setContactNotExists(true);
                return;
            }
            axios.post("/login/forgotPassword", updateUser)
                .then(function (response) {
                    if (response.data.message === "Token Created") {
                        localStorage.setItem("verificationCode", response.data.token)
                        setSentCode(true);
                    }
                    else if (response.data.message === "User Not Found") {
                        setContactNotExists(true);
                    }
                    else {
                        navigate("/notes");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            if (updateUser.contactDetail === "") {
                setContactNotExists(true);
            }
            else if (updateUser.activationCode === "") {
                setInvalidCode(true);
            }
            else {
                const verificationCode = localStorage.getItem("verificationCode");
                axios.post("/login/forgotPassword", updateUser, {
                    headers: {
                        'x-verification-code': verificationCode
                    }
                })
                    .then(function (response) {
                        if (response.data.message === "Token Matched") {
                            localStorage.removeItem("verificationCode");
                            setSentCode(false);
                            setWrongPassword(false);
                            setScreen({
                                login: false,
                                code: false,
                                reset: true
                            });
                        }
                        else if (response.data.message === "User Not Found") {
                            setContactNotExists(true);
                        }
                        else if (response.data.message === "Invalid Token") {
                            setInvalidCode(true);
                        }
                        else {
                            navigate("/notes");
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }

    function handlePasswordUpdation() {
        if (updateUser.newPassword !== updateUser.confirmNewPassword) {
            setWrongPassword(true);
            setFormOnceSubmitted(true);
        }
        else {
            axios.post("/login/updatePassword", updateUser)
                .then(function (response) {
                    if (response.data.message === "Password Updated") {
                        localStorage.setItem("token", response.data.token);
                        console.log(localStorage.getItem("token"));
                        localStorage.removeItem("verificationCode");
                        props.authenticate();
                        return;
                    }
                    else {
                        navigate("/notes");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    document.onkeydown = event => {
        if(event.key==="Enter"){
            if(screen.code)
                handleResetCodeScreen();
            else if(screen.reset)
                handlePasswordUpdation();
        }
    };
    

    return (
        <Structure formHeading={screen.login ? "Welcome!" : screen.code ? "Reset Password" : "Change Password"}>
            <form className={`mt-12`} action="" method="POST" onSubmit={submitHandler}>
                <Transition
                    show={screen.reset}
                    enter="transition ease-in-out duration-700 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-700 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className={`mt-4 ${codeTransitioning ? 'relative top-16 -right-4' : ''}`}>
                        <div className={`relative `}>
                            <input id="newPassword" name="newPassword" type="password"
                                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                                placeholder="john@doe.com" value={updateUser.newPassword} onChange={changeHandler} />
                            <label htmlFor="newPassword"
                                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">New Password</label>
                        </div>
                        <div className={`mt-8 relative  `}>
                            <input id="confirmNewPassword" name="confirmNewPassword" type="password"
                                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                                placeholder="john@doe.com" value={updateUser.confirmNewPassword} onChange={changeHandler} />
                            <label htmlFor="confirmNewPassword"
                                className={`absolute left-0 -top-3.5 ${wrongPassword ? "text-red-600" : "text-slate-600"} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:${!formOnceSubmitted ? 'text-gray-400' : wrongPassword ? "text-red-600" : "text-slate-600"} peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${wrongPassword ? "text-red-600" : "text-slate-600"} peer-focus:text-sm`}>{wrongPassword ? "Password don't match" : "Confirm New Password"}</label>
                        </div>
                    </div>
                </Transition>
                <Transition
                    show={screen.code}
                    beforeEnter={() => { setCodeTransitioning(true); setTimeout(() => { setCodeTransitioning(false); }, 700); }}
                    enter="transition ease-in-out duration-700 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-700 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className={`text-gray-600 ${codeTransitioning ? 'hidden' : 'block pb-4'} ${sentCode ? "block" : "hidden"} `}>A verification code has been sent to your email!</div>
                    <div className={`mt-4 ${codeTransitioning ? 'absolute -top-4 pl-4' : screen.reset ? 'hidden' : ''}`}>
                        <div className={`relative `}>
                            <input id="contactDetail" name="contactDetail" type="email"
                                className={`peer h-10 w-full border-b-2 border-gray-300  placeholder-transparent focus:outline-none focus:border-slate-600 `}
                                placeholder="john@doe.com" value={updateUser.contactDetail} onChange={changeHandler} />
                            <label htmlFor="contactDetail"
                                className={`absolute left-0 -top-3.5 ${contactNotExists && 'text-red-600'} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${contactNotExists && 'text-red-600'} peer-focus:text-sm`}>{contactNotExists ? "No account found with this email" : "Resgistered Email"}</label>
                        </div>
                        <div className={`mt-8 relative ${sentCode ? "visible" : "invisible"} `}>
                            <input id="activationCode" name="activationCode" type="number"
                                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-slate-600 no-scrollbar"
                                placeholder="john@doe.com" value={updateUser.activationCode} onChange={changeHandler} />
                            <label htmlFor="activationCode"
                                className={`absolute left-0 -top-3.5 ${invalidCode && 'text-red-600'} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:${!invalidCode && 'text-gray-400'} peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${invalidCode && 'text-red-600'} peer-focus:text-sm`}>{invalidCode ? "Invalid Code!" : "Verification Code"}</label>
                        </div>
                        <div className={`${sentCode ? 'visible' : 'invisible'} relative top-8 block mx-auto rounded text-gray-500 cursor-pointer`}>
                            <span onClick={() => { noEmail ? setNoEmail(false) : setNoEmail(true) }} className="hover:text-gray-800 transition select-none">
                                Didn't receive email?
                            </span>
                        </div>
                        <div className={`${noEmail ? 'visible' : 'invisible'} relative top-8 block mx-auto rounded text-gray-500 `}>Kindly check spam</div>
                    </div>
                </Transition>
                <Transition
                    show={screen.login}
                    enter="transition ease-in-out duration-700 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-700 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className={`mt-4 ${screen.code ? '' : ''}`}>
                        <div className="relative">
                            <input id="username" name="username" type="text"
                                className="peer h-10 w-full border-b-2 border-slate-300 text-slate-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                                placeholder="john@doe.com" value={user.username} onChange={changeHandler} />
                            <label htmlFor="username"
                                className={`absolute left-0 -top-3.5 ${usernameNotExists && 'text-red-600'} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${usernameNotExists && 'text-red-600'} peer-focus:text-sm`}>{usernameNotExists ? "Username Doesn't Exist!" : "Username"}
                            </label>
                        </div>
                        <div className="mt-8 relative">
                            <input id="password" type="password" name="password"
                                className="peer h-10 w-full border-b-2 border-slate-300 text-slate-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                                placeholder="Password" value={user.password} onChange={changeHandler} />
                            <label htmlFor="password"
                                className={`absolute left-0 -top-3.5 ${wrongPassword ? "text-red-600" : "text-slate-600"} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${wrongPassword ? "text-red-600" : "text-slate-600"} peer-focus:text-sm`}>{wrongPassword ? "Invalid Password" : "Password"}</label>
                        </div>
                    </div>
                </Transition>
                {
                    screen.login && <>
                        <button type="button" onClick={handleForgotPassword} className="relative top-12 block mx-auto rounded text-slate-600 opacity-50 hover:opacity-70 font-semibold focus:outline-none focus:ring focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-80 cursor-pointer">
                            Forgot Password?
                        </button>
                        <Button text="Sign in" />
                    </>

                }
                {
                    screen.code && <button type="button" onClick={handleResetCodeScreen} className="mt-[76px] px-4 py-2 rounded bg-slate-500 hover:bg-slate-400 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-80 cursor-pointer">{sentCode ? 'Reset' : 'Next'}</button>
                }
                {
                    screen.reset &&
                    <button type="button" onClick={handlePasswordUpdation} className="mt-[76px] px-4 py-2 rounded bg-slate-500 hover:bg-slate-400 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-80 cursor-pointer">
                        Change Password
                    </button>
                }
            </form>
            <span
                className="mt-4 block text-sm text-center font-medium">
                Don't have account? <Link to="/register" className="text-slate-600 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-500">Register</Link> </span>
        </Structure>
    );
}
export default LoginForm;