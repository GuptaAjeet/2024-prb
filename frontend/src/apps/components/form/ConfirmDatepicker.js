import DPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useRef, useEffect } from "react";
import { Label } from "../elements";

const ConfirmDatePicker = (props) => {
    const [startDate, setStartDate] = useState();
    const label               =   (props.label) ? props.label : '';
    const mandatory           =   (props.mandatory) ? true : false;
    const inputClass          =   (props.className) ? props.className : '';
    const inputErr            =   (props.error !== undefined) ? props.error : '';
    const inputBorder         =   (props.error !== undefined && props.error.valid === false) ? 'border border-danger': '';  
  

    return (
        <>
           <Label mandatory={mandatory} error={inputErr}>{label}</Label>
            <div className={`input-group`}> 
                <div className="input-group-append" style={{'width':'100%'}}>
                    <DPicker className={`form-control ${inputClass} ${inputBorder}`} 
                        { ...props.attr } 
                        onSelect={(val)=>{
                            if(props.attr.name === 'actualStartDate'){
                                props.setSDate(val);
                            }else{
                                props.setEDate(val);
                                props.error.valid = true;
                            }                           
                        }} 
                        placeholderText={'DD/MM/YYYY' } 
                        dateFormat={'dd/MM/yyyy'}
                        selected={startDate} 
                        onChange={(date) => {
                            return setStartDate(date),props.attr.onChange}} 
                    />                     
                    <span className={`input-group-text`}>
                        <i className="fa-regular fa-calendar-days"></i>
                    </span>
                </div>
            </div>
        </>
           
    )
}

export default ConfirmDatePicker