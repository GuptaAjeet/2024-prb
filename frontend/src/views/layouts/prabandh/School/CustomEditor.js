import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  Fragment,
} from "react";

const CustomEditor = React.forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value || "");
  const refInput = useRef(null);

  useEffect(() => {
    const eInput = refInput.current;
    if(eInput){
      eInput.focus();
      eInput.select();
    }
    props.setSaveDisable(true)
    return () => {
      props.setSaveDisable(false)
    }
  }, []);
  useImperativeHandle(ref, () => ({
    getValue() {
      return value;
    },
  }));

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue) || inputValue === "") {
      setValue(inputValue);
    } else {
    }
  };
  const handleSubmit = () => {
    props.stopEditing();
  };

  return (
    <Fragment>
      {props?.node?.selected ? <>
      <input
        ref={refInput}
        value={value}
        onChange={handleInputChange}
        className="form-controol ag-cell-edit-input"
        style={{
          display: "inline",
          height: "40px",
          width: "100px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <span
        onClick={handleSubmit}
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
      >
        <i
          className="bi bi-check2-circle"
          style={{
            fontSize: "20px",
            color: "green",
            verticalAlign: "middle",
            cursor: "pointer",
          }}
        />
      </span></> : '' }
    </Fragment>
  );
});

export default CustomEditor;
