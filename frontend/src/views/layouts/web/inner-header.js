import React from "react";

const InnerBanner = (props) =>{
    return(
        <div className="inner-banner">
            <div className={`${(props.attr.size === undefined) ? "container" : "container-fluid ps-4"} `}>
                <div className="inner-banner-content">
                    <h2>{props.attr.h2}</h2>
                    {/* {
                        (props.attr.label !== undefined) &&
                        // <nav>
                        //     <ol className="breadcrumb">
                        //         <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        //         <li className="breadcrumb-item active" aria-current="page">
                        //             {props.attr.label}
                        //         </li>
                        //     </ol>
                        // </nav>
                    } */}
                    { (props.attr.logout !== undefined) && props.attr.logout }
                </div>
            </div>
        </div>
    )
}

export default InnerBanner