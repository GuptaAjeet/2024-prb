import { useEffect, useState } from "react";
import { Helper } from "../../../apps";

const NumberInput = ({
  defaultValue,
  currentValue,
  disabled,
  onChange,
  name,
  id = null,
  decimal,
  style
}) => {
  
  const [value, setValue] = useState(
    // Helper.numberFormat(
      // defaultValue || 0, decimal !== false ? 5 : 0
      defaultValue || 0, decimal ? decimal : 0
      // )
  );

  useEffect(()=>{
    setValue(currentValue);
  },[currentValue])
  // const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if(inputValue<0){
      setValue(0);
      event.target.value = 0;
      onChange && onChange(event);
    }else if (parseFloat(inputValue) <= 9999999999.99999 || !inputValue || isNaN(parseFloat(inputValue))) {
      let roundedValue;
      if (inputValue.includes(".") && inputValue.split(".")[1].length > 0) {
        if(inputValue.split(".")[1].length > 5){
          roundedValue = parseFloat(inputValue).toFixed(decimal ? decimal : 0);
        }else{
          if(decimal === false){
            roundedValue = parseFloat(inputValue).toFixed(0);
          }else{
            roundedValue = parseFloat(inputValue).toFixed(inputValue.split(".")[1].length);
          }
        }
      } else if (
        inputValue.includes(".") &&
        inputValue.split(".")[1].length === 0
      ) {
        roundedValue = parseFloat(inputValue) + ".";
      } else {
        roundedValue = isNaN(parseFloat(inputValue))
          ? ""
          : parseFloat(inputValue);
      } 
      setValue(roundedValue);
      event.target.value = roundedValue;
      onChange && onChange(event);
    }
    // else if(inputValue==="."){
    //   setValue("0.");
    //   event.target.value = "0.";
    // }
  };
  return (
    <input
      id={id}
      type="text"
      className="form-control text-right-input"
      value={currentValue || value}
      name={name}
      // onFocus={(e) => {
      //   setValue(e.target.value.replace(/[₹,]/g, ""));
      // }}
      onChange={handleChange}
      // onBlur={(e) => {
      //   setValue(
      //     Helper.numberFormat(e.target.value, decimal ? decimal : 0)
      //   );
      // }}
      placeholder=""
      disabled={disabled}
      style={style}
    />
  );
};

export default NumberInput;