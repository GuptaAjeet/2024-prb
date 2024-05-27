import React from "react";
import Input from "./Input";

const Udise = props =>{

    props.attr.maxLength = 11;

    return (
        <Input attr={props.attr} label={props.label} mandatory={props.mandatory} className={props.className} error={props.error}/>
    );
}

export default Udise;