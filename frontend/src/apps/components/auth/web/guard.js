import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import MLayout from "../../../../views/layouts/web/index";
import Layout from "../../../../views/layouts/web/web";
import {Helper} from "../../..";

function WebGuard(props) {
    if(localStorage.getItem("project") && Helper.token()){
        if(Helper.token() !==null && Helper.auth.flag === 'volunteer') {
            return <Navigate to="/auth/volunteer" replace />
        }
        if(Helper.token() !==null && Helper.auth.flag === 'school') {
            return <Navigate to="/auth/school" replace />
        }
        
        if(Helper.token() !==null && Helper.auth.flag === 'admin') {
            return <Navigate to={`/auth/admin`} replace />
        }
    
        if(props.attr.flag === 'school' || props.attr.flag === 'register'){
            return <MLayout  size={props.size} attr={props.attr} >{ props.children }</MLayout>
        }
    }
    
    return <Layout attr={props.attr} >{ props.children }</Layout>
}

export default WebGuard