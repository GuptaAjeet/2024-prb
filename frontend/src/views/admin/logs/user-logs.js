import React, { lazy, useEffect, useState } from "react";
import { Hook,Table,Helper,API,Column } from "../../../apps";
import { useSelector,useDispatch } from 'react-redux';
import Features from "../../../redux/features";

const UserLogs = () => {
    const dispatch                      =   useDispatch();
    const handler                       =   useSelector((state) => state.handler);

    useEffect(()=>{
        dispatch(Features.makeHandler({'page':1,'limit':10}));
    },[]);

    const object    =   Hook.usePost({url :"api/logs/user-logs",data : {
                            'page':handler.page,'limit':handler.limit,'reload':handler.reload
                        }});                
    let rows   =   [];
    
    if(object !== null && object.data !== undefined){
        object.data.map((row,i) => {
            return rows[i]    =  {
                'srl':Helper.counter(++i,handler.limit,handler.page),
                'user_name':(row.users_id > 0) ? row.volunteer_name:'Anonymous',
                'login_status':<div className="">
                                    {(row.login_status === 1) ? <span className="text-success">Success</span>:<span className="text-danger">Failed</span>}
                                </div>,
                'user_login':row.log_in,
                'user_logout':row.log_out,
                'user_platform':row.platform,
                'user_os':row.os,
                'user_ip':row.ip_address,
                'user_date':Helper.dateFormate(row.created_at)
            };
        });
    }

    return (
        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                { (object) && <Table object={{'columns':Column.userLogs(),'data':rows,'count':object.count}} /> }
            </div>
        </div>
    )
}

export default UserLogs