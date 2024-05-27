import React, {Fragment} from "react";
import Label from "../elements/label";

const Radio = props =>{
    
    const forAttr             =   (props.attr.id) ? props.attr.id : ''; 
    const label               =   (props.label) ? props.label : ''; 
    const inputClass          =   (props.className) ? props.className : '';
 
    return (
        <Fragment>
            <input type="radio" { ...props.attr } className={`me-2 ${inputClass}`} />
            <Label forAttr={forAttr}>{label}</Label>
        </Fragment>
    );
}

export default Radio;