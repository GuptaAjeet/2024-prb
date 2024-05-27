import React, { lazy, useEffect, useState } from "react";
import { Hook,Table,Helper,API,Column} from "../../../../apps";
import { useSelector,useDispatch } from 'react-redux';
import Features from "../../../../redux/features";

const View   =   lazy(()=>import("./operate"));

const Countries = () => {
    const [id,setId]    =   useState(null);
    const dispatch      =   useDispatch();
    const handler       =   useSelector((state) => state.handler);
    const reduxObj      =   useSelector((state) => state.modal);

    useEffect(()=>{
        dispatch(Features.makeHandler({'page':1,'limit':10}));
    },[]);

    const object    =   Hook.usePost({url :"api/countries",data : {
                            'page':handler.page,'limit':handler.limit,'reload':handler.reload
                        }});

    let rows   =   [];

    const editHandler   = (e) =>{
        setId(e.currentTarget.getAttribute('data-id'));
        dispatch(Features.showModal({title:'Update State'}));
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
                'country_code':row.country_code,
                'country_name':row.country_name,
                'country_status':<div className="text-center"><i className={`fa-regular fa-square-check ${(row.country_status === 1) ? 'text-success' :'text-danger'}`} onClick={statusHandler} key={i} data-id={row.id} ></i></div>,
                // 'action':<div className="text-center"><i key={i} className="fa-solid fa-pen text-warning" onClick={editHandler} data-id={row.id} ></i></div>
            };
        });
    }
 
    return (
        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                { (object) && <Table object={{ 'columns':Column.country(),'data':rows,'count':object.count }} /> }
            </div>
            { (reduxObj.view) && <View id={id} />}
        </div>
    )
}

export default Countries