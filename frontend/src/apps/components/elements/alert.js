import React, {useEffect,useState} from "react";

const Alert = (props)=>{
    const classes = (props.alert.class !== '') ? props.alert.class : '';
    const message = (props.alert.message !== '') ? props.alert.message : '';
    const [dispay,setDisplay] = useState(true);

    const alertCloseHandler=()=>{
        setDisplay(!dispay);
    }

    useEffect(()=>{
        if(!dispay){
            props.alert.message = '';
            setDisplay(true);
        }
    },[dispay]);

    return(
        <>
            {
                (message?.trim().length > 0 && dispay) && 
                <div className={`alert p-2 alert-${classes} text-start`} role="alert" style={{'fontSize':'14px'}}>
                    {message}
                    <i onClick={alertCloseHandler} className="fas fa-times float-end mt-1" style={{'fontSize':'14px','cursor':'pointer'}}></i>
                </div>
            }
        </>
    );
}

export default Alert;