import React from "react";
import Input from "./Input";

const Email = props =>{

    props.attr.type = 'email';
    props.attr.maxLength = 50;

    const removeScpace =(e)=>{
        return e.target.value = (e.target.value.replace(/^\s+|\s+$/gm,'')).toLowerCase(); 
    }
    
    props.attr.onKeyPress  = removeScpace;
    props.attr.onKeyDown   = removeScpace;
    props.attr.onKeyUp    = removeScpace;

    return (
        <Input attr={props.attr} label={props.label} mandatory={props.mandatory} className={props.className} error={props.error}/>
    );
}

export default Email;