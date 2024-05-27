import React, { Fragment } from "react";
import Label from "../elements/label";

const Input = props =>{
    if(props?.attr?.maxLength){
        props.attr.maxLength      =   (props.attr?.maxLength !== undefined) ? props.attr?.maxLength : 80;
    }
    const label               =   (props.label) ? props.label : '';
    const mandatory           =   (props.mandatory) ? true : false;
    const inputClass          =   (props.className) ? props.className : '';
    const inputErr            =   (props.error !== undefined) ? props.error : '';
    const inputBorder         =   (props.error !== undefined && props.error.valid === false) ? 'border border-danger': '';

    return (
        <Fragment>
            <Label mandatory={mandatory} error={inputErr}>{label}</Label>
            <input { ...props.attr } autoComplete="off" className={`form-control ${inputClass} ${inputBorder}`} />
        </Fragment>
    );
}

export default Input;