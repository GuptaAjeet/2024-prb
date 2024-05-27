import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { Label } from "../elements";

const DPicker = (props) => {
    let date            = new Date();
    const minDate       = (props.minDate !== undefined) ? props.minDate : '';
    const maxDate       = (props.maxDate !== undefined) ? props.maxDate : '';
    const label         = (props.label) ? props.label : '';
    const mandatory     = (props.mandatory) ? true : false;
    const inputClass    = (props.className) ? props.className : '';
    const inputErr      = (props.error !== undefined) ? props.error : '';
    const inputBorder   = (props.error !== undefined && props.error.valid === false) ? 'border border-danger' : '';

    return (
        <>
            <Label mandatory={mandatory} error={inputErr}>{label}</Label>
            <div className={`form-group`}>
                <DatePicker className={`form-control ${inputClass} ${inputBorder}` }
                    {...props.attr}
                    onSelect={()=>props.error.valid = true} 
                    placeholderText={'DD/MM/YYYY'}
                    dateFormat={'dd/MM/yyyy'}
                    selected={props.date}
                    minDate={ minDate }
                    maxDate={ maxDate }
                    onChange={(date) => { return props.initalDate(date), props.attr.onChange }}
                    style={{width:'100%'}}
                />
            </div>
        </>

    )
}

export default DPicker