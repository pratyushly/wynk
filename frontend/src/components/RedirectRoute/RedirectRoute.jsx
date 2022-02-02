import { useNavigate } from "react-router-dom";
import {useEffect} from "react";

function RedirectRoute(){
    const navigate = useNavigate();
    useEffect(()=> navigate("/"),[]);
    return(
        <>
        </>
    );
}

export default RedirectRoute;