import React from "react";
import "./App.css";
import TopBar from "./top-bar";
import MiddleBar from "./middle-bar";
import NavBar from "./nav-bar";
import { APP_ENVIRONMENT } from "../../../env";
const Header = (props) =>{
    return(        
        <header className="header">
            {APP_ENVIRONMENT==="testing" && <div style={{color: 'red',background: 'yellow',fontSize: '18px',zIndex: '99999',width: '100%',padding: 'unset',margin: 'unset'}}>
                <marquee behavior="alternate">Prabandh: This environment is for testing purposes only. Do not use real data.
                </marquee>
            </div>}
            <TopBar size={props.size}/>
            <MiddleBar size={props.size}/>
            <NavBar size={props.size}/>
        </header>
    )
}

export default Header