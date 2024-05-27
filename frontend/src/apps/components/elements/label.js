import React, {Fragment} from "react";
import Error from "./error";

const Label = props =>{
    
    const errors      =   (props.error) ? props.error : "";
    const children    =   (props.children) ? props.children : '';
    const mandatory   =   (props.mandatory) ? <sup className="text-danger mt-4" style={{'fontSize':12}}>*</sup> : '';
    
    return (
        <Fragment>
            { 
                children !== ''  &&
                <label htmlFor={props.forAttr}>
                    {children} {mandatory}       
                    { (errors.valid !== undefined && errors.valid === false) && <Error>{errors.message}</Error>}
                </label> 
            }
        </Fragment>
    );
}

export default Label;