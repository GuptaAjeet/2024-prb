import React, { Fragment, useState } from "react";
import Label from "../elements/label";

const Password = props => {
    const show = (props.show !== undefined) ? props.show : true;
    const label = (props.label) ? props.label : '';
    const mandatory = (props.mandatory) ? true : false;
    const inputClass = (props.className) ? props.className : '';
    const inputErr = (props.error !== undefined) ? props.error : '';
    const inputBorder = (props.error !== undefined && props.error.valid === false) ? 'border border-danger' : '';

    const [type, setType] = useState('password');
    const [eye, setEye] = useState('fa-eye');

    const passowrdToggelHandler = () => {
        if (props?.attr?.ref?.current?.value?.length === 0) {
            return null
        } else {
            let input = (type === 'password') ? 'text' : 'password';
            let icon = (eye === 'fa-eye') ? 'fa-eye-slash' : 'fa-eye';
            setType(input);
            setEye(icon);
        }
    }

    return (
        <Fragment>
            <Label mandatory={mandatory} error={inputErr}>{label}</Label>
            <div className={`input-group`}>
                <input type={type} {...props.attr} autoComplete="off" className={`form-control ${inputClass} ${inputBorder}`} />
                {
                    (show) &&
                    <div className="input-group-append" style={{ cursor: props?.attr?.ref?.current?.value?.length === 0 ? "not-allowed" : "pointer" }}>
                        <span className={`input-group-text ${inputBorder}`}>
                            <i className={`fas ${eye}`} onClick={passowrdToggelHandler}></i>
                        </span>
                    </div>
                }
            </div>
        </Fragment>
    );
}

export default Password;