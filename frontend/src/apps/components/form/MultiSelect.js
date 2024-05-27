import React, { Fragment } from "react";
import Label from "../elements/label";
import Multiselect from 'multiselect-react-dropdown';

const MultiSelect = (props) => {
    const options               = (props.options !== null) ? props.options : null;
    const selectedValues        = (props.selectedValues !== null) ? props.selectedValues : [];
    const label                 = props.label ? props.label : "";
    const mandatory             = props.mandatory ? true : false;
    const inputClass            = props.className ? props.className : "";
    const disable               = props.disable ? props.disable : false;
    const inputErr              = props.error !== undefined ? props.error : "";
    const inputBorder           = props.error !== undefined && props.error.isvalid === false ? "border border-danger"  : "";
    
    return (
        <Fragment>
            <Label mandatory={mandatory} error={inputErr}>{label}</Label>
            <Multiselect
                options={options} // Options to display in the dropdown
                selectedValues={selectedValues} // Preselected value to persist in dropdown
                className={`${inputClass} ${inputBorder}`}
                showArrow="true"
                displayValue={props.displayValues}
                singleSelect={props.singleSelect == 'true' ? true : false}
                disable={disable}
                {...props.attr} // Property name to display in the dropdown options
            />
        </Fragment>
    );
};

export default MultiSelect;
