import DPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState} from "react";
import { Helper } from "../../../apps";

const InputDate = (props) => {
    const [startDate, setStartDate] = useState(new Date("2024-05-18"));
    
    const minDate       = (props.minDate !== undefined) ? props.minDate : '';
    const maxDate       = (props.maxDate !== undefined) ? props.maxDate : '';

    const mandatory           =   (props.mandatory) ? true : false;
    const inputClass          =   (props.className) ? props.className : '';

    return (
        <>
            <DPicker className={`form-control ${inputClass}`} 
                { ...props.attr } 
                placeholderText={'DD-MM-YYYY' } 
                dateFormat={'dd-MM-yyyy'}
                minDate={ minDate }
                maxDate={ maxDate }
                selected={startDate} 
                onChange={(date) => { 
                    return setStartDate(date),
                    props.onChange(Helper.dateFormateInYmd(date))
                }} 
                isInputReadOnly={true}
            /> 
        </>
    )
}

export default InputDate