import React from "react";
import { Hook,API } from "../../../../apps";
import { Modal } from "../../../../apps/components/elements";
import { useDispatch } from 'react-redux';
import Features from "../../../../redux/features";

const Operate = (props) => {
    const dispatch  =   useDispatch(); 
    const object    =   Hook.usePost({url : "api/states/find",data : {'id':props.id}});
    const state     =   (object !== null) && object.data.state_name;

    const saveHandler = () =>{
        dispatch(Features.showLoader());
        const data = {id:props.id,'state_name':state};
        API.post("api/states/update",data,(response)=>{
            dispatch(sFeatures.howToast({message:response.message}));
            dispatch(Features.hideLoader());
            dispatch(Features.hideModal());  
            dispatch(Features.makeHandler({'reload':(new Date()).getTime()}));
        })
    }

    return(
        <Modal clickHandler={saveHandler}>
            <div className="row p-3">
                <div className="col-md-12 mb-4">
                    <label htmlFor="fullName">
                        Name<sup className="text-danger">*</sup>
                        <small className="text-danger ps-2">Please fill the name</small>
                    </label>
                    <input type="text" className="form-control" id="fullName" value={state} />
                </div>
            </div>
        </Modal>
    )
}

export default Operate;