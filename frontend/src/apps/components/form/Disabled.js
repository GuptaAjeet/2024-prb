import React, { useState } from "react";
import { Label } from "../elements";

const Disabled = props =>{
    const label               =   (props.label) ? props.label : '';
    const mandatory           =   (props.mandatory) ? true : false;
    const inputClass          =   (props.className) ? props.className : '';
    const inputErr            =   (props.error !== undefined) ? props.error : '';
    const inputBorder         =   (props.error !== undefined && props.error.valid === false) ? 'border border-danger': '';
    const edit                =   (props.edit !== undefined)  ? props.edit : true;
    props.attr.disabled = true
    return (
        <>
            <Label mandatory={mandatory} error={inputErr}>{label}</Label>
            <div className={`input-group`}>
                <input { ...props.attr } autoComplete="off" className={`form-control ${inputClass} ${inputBorder}`} />
                { 
                    (edit) &&
                    <div className="input-group-append">
                        <span className={`input-group-text `}>
                            <i className={`fas fa-pen text-primary` } onClick={props.editHandler} ></i>
                        </span>
                    </div>
                }
            </div>
        </>
        );
}

export default Disabled;