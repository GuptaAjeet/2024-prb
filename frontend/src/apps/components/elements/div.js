import React from "react";

const VDiv  = (props)=>{

    const col = (props.col !== undefined) ? props.col : '12';
    const label = (props.label !== undefined) ? props.label : '';

    return(
        <div className={`col-md-${col} mb-2`}>
            <label htmlFor="fullName">{label}</label>
            <span className="form-view-control">{props.children}</span>
        </div> 
    );
}

export default VDiv;