import React, { useState, useRef, useEffect } from "react";
import { Hook,API,Form,Validate,Rules } from "../../../../apps";
import { Modal } from "../../../../apps/components/elements";
import { useDispatch } from 'react-redux';
import Features from "../../../../redux/features";

const Operate = (props) => {    
    var isvalid                 = false;
    var name = useRef();  
    const formInputs            = [name];   
    const [error, setError]     = useState({});    
    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch();
    const object = Hook.usePost({ url: "api/genders/find", data: { 'id': props.id } });
    useEffect(()=>{            
        if(object !== null && object.data !== undefined) {
            name.current.value =  object.data.gender_name;
        }
    },[object]) 

    const createHandler = (e) => {
        e.preventDefault();
        qalificationHandler();
        if(isvalid){
            dispatch(Features.showLoader());
            if (props.btntext === 'Add') {
                var url = 'create';
                var data = { 'gender_name': name.current.value };
            } else {
                var url = 'update';
                var data = { id: props.id, 'gender_name': name.current.value };
            }
            API.post(`api/genders/${url}`, data, (response) => {
                dispatch(Features.showToast({ message: response.message }));
                dispatch(Features.hideLoader());
                dispatch(Features.hideModal());
                dispatch(Features.makeHandler({ 'reload': (new Date()).getTime() }));
            })
        }
    }
    const qalificationHandler = () =>{
        if(Validate.isEmpty(name)){
            setMessage(name,Rules.name);
        }
        if (Validate.strLen(name) > 0) {
            setMessage(name,Rules.name, true);
        }       
    }

    const setMessage=(input,errorMessage,valid=false)=>{
        isvalid  = (valid) ? true :false;
        Validate.msgHandler(setError,input,errorMessage,valid);
        setDisable(Validate.isFormValid(formInputs));
    } 

    return (
        <Modal clickHandler={createHandler}>
            <div className="row p-3">
                <div className="col-md-12 mb-4">                    
                    <Form.Text attr={{ref:name,'id':'name','name':'name','onChange':qalificationHandler,'onFocus':qalificationHandler,'maxLength':100}}  label="Name" error={error.name} mandatory="true" /> 
                </div>
                <div className="col-md-12">
                    <Form.Button button={{'type':'submit','disabled':disable,'onClick':createHandler}} className="btn btn-success float-end" >Save</Form.Button>                    
                </div>
            </div>
        </Modal> 
    )
}
export default Operate;