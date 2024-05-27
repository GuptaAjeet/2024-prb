import React, {Fragment} from "react";

const Error = props =>{
    return(
        <Fragment>
            { props.children !== undefined && <small className="text-danger text-start login-error"  style={{'fontSize':12}}>{props.children}</small>}
        </Fragment>  
    );
}

export default Error;