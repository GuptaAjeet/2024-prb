import React, { Fragment, lazy, useState } from "react";
import InnerBanner from "../../../layouts/web/inner-header";
import { useSelector,useDispatch } from 'react-redux';
import Features from "../../../../redux/features";

const ViewVideo    =   lazy(()=>import("./view"));

const Videos = () => {
    const dispatch  =   useDispatch();
    const model     =   useSelector((state) => state.modal);
    const [actMod,setActMod]        =   useState({'id':0,'show':false});

    const videso = [
        {'title':'How to Register School','code':'owL9_UH0cis'},
        {'title':'How to Register Volunteer','code':'1kOpA8MRf4k'},
        {'title':'How to Add Activities','code':'2qoAp1OKfAA'},
    ];

    const viewOnYoutube = (e) =>{
        setActMod({'id':e.target.getAttribute('data-code'),'show':true});
        dispatch(Features.showModal({title:e.target.getAttribute('alt'), size:'xl'})); 
    }

    return(
        <Fragment>
            <div>
                <InnerBanner attr={{'h2':'Videos','label':'Videos'}} />
                <div id="content" className="inner-bg">
                    <div className="pt-3 pb-3">
                        <div className="container">
                            <h2 className="sec-title">Videos Manuals</h2>
                            <div className="row pb-5">
                                {
                                    videso.map(video=>
                                        <div className="col-lg-3 pointer" data-title={video.title} onClick={viewOnYoutube} >
                                            <div className="card">
                                                <img src={`https://img.youtube.com/vi/${video.code}/0.jpg`} data-code={video.code}  title="Click here to view video" className="card-img-top" alt={video.title} />
                                                <div className="card-body p-1 ps-2 pt-3">
                                                    <h6 className="card-title">
                                                        <i className="fa-brands fa-youtube" style={{color: '#f04d6d'}} /> {video.title}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                { (actMod.show) && <ViewVideo  code={actMod.id} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Videos;