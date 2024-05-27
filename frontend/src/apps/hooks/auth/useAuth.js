import { useState, useEffect } from "react";

const useAuth = () => {
    const [auth, setAuth] = useState({'login':false,'token':null});
    const login = localStorage.getItem("login");
    const token = localStorage.getItem("token");
    
    useEffect(() => { 
        if(!login){
            setAuth({'login':login,'token':token});
        }
       
    },[login,token]);

    return auth;
};

export default useAuth;