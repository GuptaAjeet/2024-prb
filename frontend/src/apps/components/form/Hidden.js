import React from "react";
import Input from "./Input";

const Hidden = props =>{

    props.attr.type = 'hidden';

    return (
        <Input attr={props.attr} label={props.label} mandatory={props.mandatory} className={props.className} error={props.error}/>
    );
}

export default Hidden;
