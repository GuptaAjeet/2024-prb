import React, { useState, useRef } from "react";
import { Hook, API, Form } from "../../../../apps";
import { Modal } from "../../../../apps/components/elements";
import { useDispatch } from "react-redux";
import Features from "../../../../redux/features";

const UpdatePass = (props) => {
    var oldpass = useRef();
    var password = useRef();
    var cpassword = useRef();
    const defaultValidationInputs = [oldpass, password, cpassword];
    const [fInputs, SetFInputs] = useState(defaultValidationInputs);
    const [fSubmit, setFSubmit] = useState(false);

    const dispatch = useDispatch();
    const { handleChange, values, errors, form } = Hook.useForm(fInputs)

    const updateHandler = (e) => {
        e.preventDefault();

        const dataToUpdate = { id: props.id, data: values };
        const isErrors = Object.keys(errors).some((key) => !errors[key].valid);
        if (dataToUpdate.data.password !== dataToUpdate.data.cpassword) {
            dispatch(Features.showToast({ message: "New Password and Confirm Password not match." }));
            return;
        }
        if (dataToUpdate !== null && !isErrors) {
            setFSubmit(true);
            dispatch(Features.showLoader());
            API.post(`api/admin-users/change/password`, { token: sessionStorage.getItem('token'), id: props.id, oldpass: dataToUpdate.data.oldpass, password: dataToUpdate.data.password }, (response) => {
                setFSubmit(false);
                dispatch(Features.showToast({ message: response.message }));
                dispatch(Features.hideLoader());
                if (response.status) {
                    dispatch(Features.hideModal());
                }
            });
        }
    };

    return (
        <Modal clickHandler={updateHandler} close={props?.close}>
            <div className="row p-3">
                <div className="col-md-6 mb-4">
                    <Form.Password attr={{ ref: oldpass, id: "oldpass", name: "oldpass", onChange: handleChange, onFocus: handleChange, maxLength: 100 }}
                        label="Old Password" error={errors.oldpass} mandatory="true" />
                </div>

                <div className="col-md-6 mb-4">
                    <Form.Password attr={{ ref: password, id: "password", name: "password", onChange: handleChange, onFocus: handleChange }}
                        label="New Password" error={errors.password} mandatory="true" />
                </div>

                <div className="col-md-6 mb-4">
                    <Form.Password attr={{ ref: cpassword, id: "cpassword", name: "cpassword", onChange: handleChange, onFocus: handleChange }}
                        label="Confirm Password" error={errors.cpassword} mandatory="true" />
                </div>

                <div className="col-md-12">
                    <Form.Button button={{ type: "submit", disabled: form.disable, onClick: updateHandler }} className="btn btn-success float-end" fSubmit={fSubmit}>
                        Save
                    </Form.Button>
                </div>
            </div>
        </Modal>
    );
};

export default UpdatePass;