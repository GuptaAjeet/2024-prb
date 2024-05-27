import React, { Fragment } from "react";
import Label from "../elements/label";
import { Helper } from "../..";

const Select = (props) => {
    const options = (props.options !== null) ? props.options : null;
    const label = props.label ? props.label : "";
    const mandatory = props.mandatory ? true : false;
    const inputClass = props.className ? props.className : "";
    const inputErr = props.error !== undefined ? props.error : "";
    const inputBorder = props.error !== undefined && props.error.isvalid === false ? "border border-danger" : "";
    return (
        <Fragment>
            <Label mandatory={mandatory} error={inputErr}>{label}</Label>
            <select {...props.attr} className={`form-select ${inputClass} ${inputBorder}`}>
                {props.default !== undefined && (<option value="0" key={0 + props.default}>{props.default}</option>)}
                {
                    (options !== null) && options.map((row, i) => {
                        return <option key={row.id + row.name} value={row.id}> {row.name} </option>
                    })
                }
            </select>
        </Fragment>
    );
};

export default Select;
