import React from "react";
import Input from "./Input";

const Mobile = props =>{

    props.attr.maxLength = (props.attr.maxLength !== undefined) ? props.attr.maxLength : 10;

    return (
        <Input attr={props.attr} label={props.label} disabled={props.disabled} mandatory={props.mandatory} className={props.className} error={props.error}/>
    );
}

export default Mobile;