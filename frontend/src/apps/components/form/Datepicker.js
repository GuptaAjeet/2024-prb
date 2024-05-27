import DPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useRef, useEffect } from "react";
import { Label } from "../elements";

const DatePicker = (props) => {
    const [startDate, setStartDate] = useState();
    const label               =   (props.label) ? props.label : '';
    const mandatory           =   (props.mandatory) ? true : false;
    const inputClass          =   (props.className) ? props.className : '';
    const inputErr            =   (props.error !== undefined) ? props.error : '';
    const inputBorder         =   (props.error !== undefined && props.error.valid === false) ? 'border border-danger': '';
    
    if(props.btntext !== 'Add'){ 
        setTimeout(() => {
            props.attr.value = (props.attr.ref.current !== undefined && props.attr.ref.current !== null ) && props.attr.ref.current.input.value;
        }, 50);       
    }

    return (
        <>
            <Label mandatory={mandatory} error={inputErr}>{label}</Label>
            <div className={`input-group`}> 
                <div className="input-group-append" style={{'width':'100%'}}>
                    <DPicker className={`form-control ${inputClass} ${inputBorder}`} 
                        { ...props.attr } 
                        onSelect={(val)=>{
                            if(props.attr.name === 'start_date'){ 
                                props.setSDate(val);
                            }else{
                                props.setLDate(val);
                                props.error.valid = true;
                            }                            
                        }} 
                        placeholderText={'DD/MM/YYYY' } 
                        dateFormat={'dd/MM/yyyy'}
                        selected={startDate} 
                        onChange={(date) => { 
                            return setStartDate(date),
                            props.attr.onChange 
                        }} 
                    /> 
                </div>
            </div>
        </>
    )

    /**
     * 
    onSelect={(val)=>{
        if(props.attr.name === 'start_date'){
            props.setSDate(val);
        }else{
            props.setLDate(val);
        }                            
    }} 
     */
}

export default DatePicker