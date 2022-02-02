import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Structure from "./Elements/Structure";
import Button from "./Elements/Button";
import { Transition } from "@headlessui/react";
import validator from 'validator';
function SignupForm(props) {
    const navigate = useNavigate();
    const [cpasswordLabel, setcpasswordLabel] = useState("Confirm Password");
    const [userNameExists, setUserNameExists] = useState(false);
    const [contactExists, setContactExists] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);
    const [confirmPasswordClass, setConfirmPasswordClass] = useState("text-gray-600");
    const [formOnceSubmitted, setFormOnceSubmitted] = useState(false);
    const [missingField, setMissingField] = useState(false);
    const [codeRequired, setCodeRequired] = useState(false);
    const [codeTransitioning, setCodeTransitioning] = useState(false);
    const [noEmail, setNoEmail] = useState(false);

    const [user, setUser] = useState({
        username: "",
        contactDetail: '',
        password: '',
        confirmPassword: '',
        activationCode: ''
    });

    function changeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        setUser((prev) => {
            return ({
                ...prev,
                [name]: value
            });
        });
        // If condition that form has been submitted once
        if (formOnceSubmitted) {
            if (name === "confirmPassword") {
                if (user.password === value) {
                    confirmPasswordToggle("equal");
                }
                else {
                    confirmPasswordToggle("!equal");
                }
            }
            else if (name === "password") {
                if (user.confirmPassword === value) {
                    confirmPasswordToggle("equal");
                }
                else {
                    confirmPasswordToggle("!equal");
                }
            }
        }
        else if (name === "username" && userNameExists) {
            setUserNameExists(false);
        }
        else if (name === "contactDetail" && (contactExists || invalidEmail)) {
            setInvalidEmail(false);
            setContactExists(false);
        }
        else if (name === "activationCode" && invalidCode) {
            setInvalidCode(false);
        }
        setMissingField(false);
    }
    function confirmPasswordToggle(equality) {
        if (equality === "equal") {
            setcpasswordLabel("Confirm Password");
            setConfirmPasswordClass("text-gray-600");
        }
        else {
            setcpasswordLabel("Password Don't Match!");
            setConfirmPasswordClass("text-red-600");
        }
    }

    function submitHandler(event) {
        event.preventDefault();
        if (user.activationCode === "") {
            setInvalidCode(true);
        }
        else if (user.username === "" || user.password === "" || user.confirmPassword === "" || user.contactDetail === "") {
            navigate("/");
        }
        else if (user.password !== user.confirmPassword) {
            navigate("/");
        }
        else {
            const verificationCode = localStorage.getItem("verificationCode");
            axios.post("/register", user, {
                headers: {
                    'x-verification-code': verificationCode
                }
            })
                .then(function (response) {
                    if (response.data.message === "Registration Successfull") {
                        localStorage.setItem("token", response.data.token);
                        localStorage.removeItem("verificationCode");
                        props.authenticate();
                        return;
                    }
                    else if (response.data.message === "Invalid Code") {
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

    function generateCode() {
        if (user.username === "" || user.password === "" || user.confirmPassword === "" || user.contactDetail === "") {
            setMissingField(true);
        }
        else if (user.password !== user.confirmPassword) {
            confirmPasswordToggle();
            setFormOnceSubmitted(true);
        }
        else if(!validator.isEmail(user.contactDetail)){
            setInvalidEmail(true);
        }
        else {
            axios.post("/register/newRequest", user)
                .then(function (response) {
                    if (response.data.message === "Token Created") {
                        localStorage.setItem("verificationCode", response.data.token)
                        setCodeRequired(true);
                    }
                    else if (response.data.message === "User already exists") {
                        setUserNameExists(true);
                    }
                    else if (response.data.message === "Contact detail already exists") {
                        setContactExists(true);
                    }
                    else {
                        navigate("/");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    document.onkeydown = event => {
        if (event.key === "Enter") {
            if (!codeRequired)
                generateCode();
        }
    };

    return (
        <Structure formHeading="Register!">
            <form className={`mt-12 ${codeTransitioning && 'mt-0'} `} action="" method="POST" onSubmit={submitHandler}>
                <Transition
                    show={codeRequired}
                    beforeEnter={() => { setCodeTransitioning(true); setTimeout(() => { setCodeTransitioning(false); }, 700); }}
                    enter="transition ease-in-out duration-700 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-700 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className={`text-gray-600 ${codeTransitioning ? 'invisible' : 'visible pb-4'} `}>A verification code has been sent to your email!</div>
                    <div className={`relative mt-4 ${codeTransitioning ? 'top-[58px] -right-4' : ''}`}>
                        <input id="activationCode" name="activationCode" type="number"
                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                            placeholder="john@doe.com" value={user.activationCode} onChange={changeHandler} />
                        <label htmlFor="activationCode"
                            className={`absolute left-0 -top-3.5 ${invalidCode && 'text-red-600'} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:${!invalidCode && 'text-gray-400'} peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${invalidCode && 'text-red-600'} peer-focus:text-sm`}>{invalidCode ? "Invalid Code!" : "Verification Code"}</label>
                        <div className={`${codeTransitioning ? 'invisible' : 'visible'} relative top-8 block mx-auto rounded text-gray-500 cursor-pointer`}>
                            <span onClick={() => { noEmail ? setNoEmail(false) : setNoEmail(true) }} className="hover:text-gray-800 transition select-none">
                                Didn't receive email?
                            </span>
                        </div>
                        <div className={`${noEmail ? 'visible' : 'invisible'} relative top-8 block mx-auto rounded text-gray-500 `}>Kindly check spam</div>
                    </div>
                </Transition>
                <Transition
                    show={!codeRequired}
                    enter="transition ease-in-out duration-700 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-700 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div className={`text-red-600 text-sm relative -top-[12px] ${missingField ? "visible" : "invisible"} `}>All fields are required!</div>
                    <div className="relative">
                        <input id="username" name="username" type="text"
                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                            placeholder="john@doe.com" value={user.username} onChange={changeHandler} />
                        <label htmlFor="username"
                            className={`absolute left-0 -top-3.5 ${userNameExists && 'text-red-600'} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${userNameExists && 'text-red-600'} peer-focus:text-sm`}>{userNameExists ? "Username Already Exists!" : "Username"}</label>
                    </div>
                    <div className="mt-6 relative">
                        <input id="contactDetail" name="contactDetail" type="email"
                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                            placeholder="john@doe.com" value={user.contactDetail} onChange={changeHandler} />
                        <label htmlFor="contactDetail"
                            className={`absolute left-0 -top-3.5 ${(contactExists || invalidEmail) && 'text-red-600'} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${(contactExists || invalidEmail) && 'text-red-600'} peer-focus:text-sm`}>{contactExists ? "Email Already Exists!" : invalidEmail?'Enter correct email' : "Email"}</label>
                    </div>
                    <div className="mt-6 relative">
                        <input id="password" type="password" name="password"
                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                            placeholder="Password" value={user.password} onChange={changeHandler} />
                        <label htmlFor="password"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                    </div>
                    <div className="mt-6 relative">
                        <input id="confirmPassword" type="password" name="confirmPassword"
                            className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-slate-600"
                            placeholder="Confirm Password" value={user.confirmPassword} onChange={changeHandler} />
                        <label htmlFor="confirmPassword"
                            className={`absolute left-0 -top-3.5 ${confirmPasswordClass} text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:${!formOnceSubmitted ? 'text-gray-400' : confirmPasswordClass} peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:${confirmPasswordClass} peer-focus:text-sm`}>{cpasswordLabel}</label>
                    </div>
                </Transition>

                {!codeRequired ? <button type="button" onClick={generateCode} className="mt-[76px] px-4 py-2 rounded bg-slate-500 hover:bg-slate-400 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-80 cursor-pointer">
                    Sign up
                </button> : <Button text="Verify" />}

            </form>
            <span
                className="mt-4 block text-sm text-center font-medium">
                Already have a account? <Link to="/login" className="text-slate-600 hover:underline focus:outline-none focus:ring-2 focus:ring-slate-500">Login</Link> </span>
        </Structure>
    );
}
export default SignupForm;