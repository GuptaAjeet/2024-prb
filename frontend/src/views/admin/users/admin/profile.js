import React, { useState, useRef, useEffect } from "react";

import { Hook, API, Form, Helper } from "../../../../apps";
//import { Modal } from "../../../../apps/components/elements";
import { useDispatch } from 'react-redux';
import Features from "../../../../redux/features";    

const Profile = (props) => {
    // var isvalid = false;
    var name                        = useRef();
    var email                       = useRef();
    var role                        = useRef();
    var mobile                      = useRef();
    const [fInputs, SetFInputs]     = useState([name, email, role, mobile]);
    const [isEdit, setIsEdit]       = useState(true);
    const [fSubmit, setFSubmit]     = useState(false);
    const [disabled, setDisable]    = useState(true);
    const dispatch                  = useDispatch();   

    const login_user_id = 15;
    const object = Hook.usePost({ url: "api/admin-users/find-user", data: { 'id': login_user_id } });

    const { handleChange, values, errors, disable } = Hook.useForm(fInputs);
    useEffect(() => {
        if(object !== null && object.token !== undefined){
            setIsEdit(false);
            if (isEdit) {
                role.current.value = 'Admin';
                name.current.value = object.token.user_name;
                email.current.value = object.token.user_email;
                mobile.current.value = object.token.user_mobile;
            }
        }
    }, [object,values]);

    const submitHandle =(e)=> {
        setFSubmit(true);
        e.preventDefault()
        dispatch(Features.showLoader());
        API.post(`api/admin-users/profile-update`, {'data': values}, (response) => {
            if(response.status === true){
                Helper.storeToken(response.token);
                dispatch(Features.showToast({ message: response.message }));
            }else{
                dispatch(Features.showToast({ message: response.message }));
            }
            setFSubmit(false)
            dispatch(Features.hideLoader());
            dispatch(Features.makeHandler({ 'reload': (new Date()).getTime() }));
        })
    }

    return (
        <div className="row layout-top-spacing">
            <div className="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div className="widget-content widget-content-area br-6">
                    <div className="row">
                        <div className="col-md-2">
                            <img className="ps-3" src="../../activity_image/4/contribution-timeline-54550-16751501141.jpeg" alt="" style={{'height': '180px', 'width': '100%'}} />
                        </div>                        
                        <div className="col-md-10">
                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <Form.Text attr={{ ref: name, 'id': 'name', 'name': 'name', 'onChange': handleChange, 'onFocus': handleChange, 'maxLength': 100 }} label="Name" error={errors.name} mandatory="true" />
                          </div>
                            <div className="col-md-6 mb-4">
                                <Form.Email attr={{ ref: email, 'id': 'email', 'name': 'email', 'onChange': handleChange, 'onFocus': handleChange}} label="Email" error={errors.email} mandatory="true" />
                            </div>
                            <div className="col-md-6 mb-4">
                                <Form.Mobile attr={{ ref: mobile, 'id': 'mobile', 'name': 'mobile', 'onChange': handleChange, 'onFocus': handleChange }} label="Mobile" error={errors.mobile} mandatory="true" />
                            </div>
                            <div className="col-md-6 mb-4">
                                <Form.Text attr={{ ref: role, 'disabled': disabled, 'id': 'role', 'name': 'role', 'onChange': handleChange, 'onFocus': handleChange}} label="Role" error={errors.role} mandatory="true" />
                            </div>
                        </div>
                        </div>
                        <div className="col-md-12">
                            <Form.Button button={{ 'type': 'submit', 'disabled': disable, 'onClick':submitHandle,'onChange':handleChange, 'onFocus': handleChange}} className="btn btn-success float-end" fSubmit={fSubmit} >Save</Form.Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}
export default Profile;
