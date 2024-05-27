import React from "react";
import Input from "./Input";

const Date = props =>{
    props.attr.type      = 'date';
    props.attr.maxLength = 10;
    return (
        <Input attr={props.attr} label={props.label} mandatory={props.mandatory} className={props.className} error={props.error}/>
    );
}

export default Date;