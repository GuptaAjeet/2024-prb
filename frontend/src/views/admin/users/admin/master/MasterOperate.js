import React, { useState, useRef, useEffect } from "react";
import { Hook, API, Form, Helper } from "../../../../../apps";
import { useDispatch } from 'react-redux';
import Features from "../../../../../redux/features";
import { Modal } from "../../../../../apps/components/elements";
//import validate from "../../../../../apps/utilities/validate";

const MasterOperate = (props) => {
    var title = useRef();
    var type_code = useRef();
    var description = useRef();
    var master_status = useRef(1);
    // var designation = useRef();
    // var coordinationStates = useRef([]);
    const defaultValidationInputs = [title, type_code, description];
    const [fInputs, SetFInputs] = useState(defaultValidationInputs);
    const [isEdit, setIsEdit] = useState(true);
    const [fSubmit, setFSubmit] = useState(false);
    const dispatch = useDispatch();
    const object = Hook.usePost({
        url: "api/prabandh/mastertype/getmasterbyid", data: { 'id': props.id }
    });
    const { handleChange, values, errors, form, } = Hook.useForm(fInputs);

    useEffect(() => {
        if (props.id > 0) {
            updateHandler();
        }
    }, [object, values])

    // let userData = Helper.auth?.user

    const updateHandler = () => {
        if (object !== null && object.data !== undefined) {
            const data = object.data;
            setIsEdit(false);
            if (isEdit) {
                // setROption(Helper.roleFilter(roles, [eRole]));
                // setTimeout(() => {
                //     role.current.value = eRole;
                //     role.current.disabled = true;
                //     values.role = eRole;
                // }, 10);
                // title.current.value = Helper.ucfirst(data.title);
                title.current.value = data.title;
                type_code.current.value = data.type_code;
                description.current.value = data.description;
                master_status.current.value = data.status;
                //              block.current.disabled      = true;                
                // }
                // }
                // else{
                //     setBOptions(Helper.blockFilter(BOption, data.user_state_id, data.user_district_id));
                //     setTimeout(() => {
                //         block.current.value = data.user_block_id;                    
                //     }, 10);
                //     setDisplay({ ...display, state: '', district: '', block: '' });
                // }
            }
        }
    }

    const createHandler = (e) => {
        setFSubmit(true);
        e.preventDefault()
        dispatch(Features.showLoader());
        const data = {
            id: props.id,
            title: title?.current?.value,
            type_code: type_code?.current?.value,
            status: master_status?.current?.value,
            description: description?.current?.value,
        }
        API.post(`api/prabandh/mastertype/updateall`, data, (response) => {
            setFSubmit(false)
            dispatch(Features.showToast({ message: response.message }));
            dispatch(Features.hideLoader());
            dispatch(Features.hideModal());
            dispatch(Features.makeHandler({ 'reload': (new Date()).getTime(), 'where': Helper.whereMasterObjSelector() }));
        })
    }
    const typecode = title?.current?.value?.length >= 1 ? title?.current?.value?.split(" ") : null
    if (!typecode) {
    }
    else if (typecode && typecode?.length === 1) {
        type_code.current.value = typecode[0]?.substring(0, 3).toUpperCase();
    } else if (typecode && typecode?.length === 2) {
        type_code.current.value = typecode[0]?.substring(0, 1).toUpperCase() + typecode[1]?.substring(0, 2).toUpperCase();
    } else if (typecode && typecode?.length === 3) {
        type_code.current.value = typecode[0]?.substring(0, 1).toUpperCase() + typecode[1]?.substring(0, 1).toUpperCase() + typecode[2]?.substring(0, 1).toUpperCase();
    }
    const master_statuss = [{ id: "1", name: "Active" }]
    return (
        <Modal close={props?.close}>
            <div className="row p-3">
                <div className="col-md-4 mb-4">
                    <Form.Text attr={{ ref: title, 'id': 'title', 'name': 'title', 'onChange': handleChange, 'onFocus': handleChange, 'maxLength': 100 }} label="Title" error={errors.title} mandatory="true" />
                </div>
                <div className="col-md-4 mb-4">
                    <Form.Udise disable type="number" style={{ width: "100%", textTransform: "uppercase", background: "white" }} attr={{ ref: type_code, "readOnly": true, 'id': 'type_code', 'name': 'type_code', 'onChange': handleChange, 'onFocus': handleChange, 'maxLength': "100%" }} label="Type code" error={errors.type_code} mandatory="true" />
                </div>

                <div className="mb-4 col-md-4">
                    <Form.Select options={master_statuss} attr={{ ref: master_status, 'id': 'master_status', 'name': 'master_status', 'onChange': handleChange, 'onFocus': handleChange }} label="Status" mandatory="true" default="Inactive" />
                </div>
                <div className="col-md-4 mb-4">
                    <Form.Textarea attr={{ ref: description, 'id': 'description', 'name': 'description', 'onChange': handleChange, 'onFocus': handleChange, 'maxLength': 100 }} label="Description" error={errors.description} mandatory="true" />
                </div>
                <div className="col-md-12">
                    <Form.Button button={{ 'type': 'submit', 'disabled': form.disable, 'onClick': createHandler }} className="btn btn-success float-end" fSubmit={fSubmit} >Save</Form.Button>
                </div>
            </div>
        </Modal>
    )
}

export default MasterOperate