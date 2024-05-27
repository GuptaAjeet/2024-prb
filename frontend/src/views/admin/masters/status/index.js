import React, { lazy, useEffect, useState } from "react";
import { Hook,Table,Helper,API,Column} from "../../../../apps";
import { useSelector,useDispatch } from 'react-redux';
import Features from "../../../../redux/features";

const View   =   lazy(()=>import("./operate"));

const Status = () => {
    const [id,setId]    =   useState(null);
    const dispatch      =   useDispatch();
    const handler       =   useSelector((state) => state.handler);
    const reduxObj      =   useSelector((state) => state.modal);

    useEffect(()=>{
        dispatch(Features.makeHandler({'page':1,'limit':10}));
    },[]);

    const object    =   Hook.usePost({url :"api/status",data : {
                            'page':handler.page,'limit':handler.limit,'reload':handler.reload
                        }});

    let rows   =   [];
    const editHandler   = (e) =>{
        setId(e.currentTarget.getAttribute('data-id'));
        dispatch(Features.showModal({title:'Update Status'}));
    }

    const statusHandler   = (e) =>{
        dispatch(Features.showLoader());
        API.post("api/states/update-status",{'id':e.currentTarget.getAttribute('data-id')},(response)=>{
            dispatch(Features.makeHandler({'reload':(new Date()).getTime()}));
            dispatch(Features.showToast({message:response.message}));
        });
    } 

    if(object !== null){
        object.data.map((row,i) => {
            return rows[i]    =  {
                'srl':Helper.counter(++i,handler.limit,handler.page),
                'country_name':row.status_name,
                'country_status':<div className="text-center"><i className={`fa-regular fa-square-check ${(row.status_order === 1) ? 'text-success' :'text-danger'}`} onClick={statusHandler} key={i} data-id={row.id} ></i></div>,
                // 'action':<div className="text-center disabled"><i key={i} className="fa-solid fa-pen text-warning" onClick={editHandler} data-id={row.id} ></i></div>
            };
        });
    }
 
    return (
        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-sm-12">
                { (object) && <Table object={{ 'columns':Column.status(),'data':rows,'count':object.count }} /> }
            </div>
            { (reduxObj.view) && <View id={id} />}
        </div>
    )
}

export default Status