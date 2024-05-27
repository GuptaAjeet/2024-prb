import React from "react";

const PageNotFound = () =>{
    const style = {'fontSize':'150px','fontWeight':'bold','height':'73vh'}

    const back = () =>{
        window.history.go(-1);
    }

    return(
        <div className="form-container outer">
            <div className="row text-center">
                <div className="col-md-12 pt-5">
                    <div className="text-danger" style={style}>
                        404
                        <h1>The page you are looking not found.</h1>
                        <button type="button" className="btn btn-primary" onClick={back}>Back</button>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default PageNotFound;