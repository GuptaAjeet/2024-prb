import React from "react";

const Button = props =>{
    
    const fSubmit       =   (props.fSubmit) ? props.fSubmit : false;
    const buttonClass   =   (props.className) ? props.className : 'btn btn-primary';
    
    return (
        <>
            {
                (fSubmit) 
                ? <button disabled className={buttonClass}> <i className="fas fa-circle-notch fa-spin spinner-icon"></i> Please Wait ... </button>
                : <button { ...props.button } className={buttonClass}>{props.children} </button>
            }
        </>
    );
}

export default Button;