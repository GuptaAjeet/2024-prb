import React, {Fragment} from "react";
import Label from "../elements/label";

const Textarea = props =>{
    
    const label               =   (props.label) ? props.label : '';
    const mandatory           =   (props.mandatory) ? true : false;
    const inputClass          =   (props.className) ? props.className : '';
    const inputErr            =   (props.error !== undefined) ? props.error : '';
    const inputBorder         =   (props.error !== undefined && props.error.isvalid === false) ? 'border border-danger': '';
    
    return (
        <Fragment>
            <Label mandatory={mandatory} error={inputErr} >{label}</Label>
            <textarea { ...props.attr } autoComplete="off" className={`form-control-textarea ${inputClass} ${inputBorder}`} ></textarea>
        </Fragment>
    );
}

export default Textarea;