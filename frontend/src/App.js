import LoginForm from "./components/Forms/Login";
import SignupForm from "./components/Forms/Register";
import Notes from "./components/Notes/Main/Notes";
import Home from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import RedirectRoute from "./components/RedirectRoute/RedirectRoute";
import projectName from "./components/ProjectDetails/name";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleAuthentication() {
    setIsAuthenticated(true);
  }
  function logout() {
    document.title = projectName;
    const token = localStorage.getItem("token");
    axios.post("/deauthentication", { token })
      .then(function (response) {
        if (response.data.message === "User DeAuthenticated") {
          setIsAuthenticated(false);
          // console.log("deauthenticated");
        }
        localStorage.setItem("token",response.data.token);
      });
      setIsAuthenticated(false);
  }

  function checkAuthentication() {
    const token = localStorage.getItem("token");
    axios.get("/authentication", {
      headers : {
        'x-access-token' : token
      }
    })
      .then(function (response) {
        if (response.data === "User Authenticated") {
          setIsAuthenticated(true);
          return true;
        }
        else {
          setIsAuthenticated(false);
          return false;
        }
      });
  }

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <>
      <div className="scroll-smooth">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Notes logout={logout} /> : <Home/>} />
          <Route path="/register" element={isAuthenticated ? <RedirectRoute /> : <SignupForm authenticate={handleAuthentication} />} />
          <Route path="/login" element={isAuthenticated ? <RedirectRoute /> : <LoginForm authenticate={handleAuthentication} />} />
          <Route path="/*" element={<RedirectRoute />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
