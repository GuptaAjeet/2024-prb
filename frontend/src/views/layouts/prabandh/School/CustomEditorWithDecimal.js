import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  Fragment,
} from "react";

const CustomEditorWithDecimal = React.forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value || "");
  const refInput = useRef(null);

  const KEY_BACKSPACE = 'Backspace';
  const KEY_ENTER = 'Enter';
  const KEY_TAB = 'Tab';
  const KEY_ARROW_LEFT = 'ArrowLeft';
  const KEY_ARROW_RIGHT = 'ArrowRight';

  useEffect(() => {
    const eInput = refInput.current;
    eInput.focus();
    eInput.select();
  }, []);

  useImperativeHandle(ref, () => ({
    getValue() {
      return value;
    },
  }));

  const isLeftOrRight = (event) => {
    return [KEY_ARROW_LEFT, KEY_ARROW_RIGHT].indexOf(event.key) > -1;
  };

  const isCharNumeric = (charStr) => {
    if (charStr === '.') {
      return charStr;
    }
    return !!/\d/.test(charStr);
  };

  const isNumericKey = (event) => {
    const charStr = event.key;

    if (event.target.value.toString().indexOf(".") == -1) {
      return isCharNumeric(charStr);
    }
    else {
      if (charStr != '.') {
        return isCharNumeric(charStr);
      }
      return false;
    }
  };

  const isBackspace = (event) => {
    return event.key === KEY_BACKSPACE;
  };

  const finishedEditingPressed = (event) => {
    const key = event.key;
    return key === KEY_ENTER || key === KEY_TAB;
  };

  const validInput = (event) => {
    let value = event.target.value.toString();
    const enteredNumber = value.indexOf(".") > -1 ? value.split(".") : [value];

    if (enteredNumber.length > 1) {
      if (value.length > 15 || enteredNumber[1].length >= 5) {
        return false;
      }
      return true;
    }
    else {
      if (enteredNumber.length == 1 && enteredNumber[0].length <= 10) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  const handleKeyDown = (event) => {
    if (isLeftOrRight(event) || isBackspace(event)) {
      event.stopPropagation();
      return;
    }

    let validInputFlag = validInput(event);

    if ((!finishedEditingPressed(event) && !isNumericKey(event)) || (!validInputFlag)) {
      if (event.preventDefault) event.preventDefault();
    }

    if (finishedEditingPressed(event)) {
      props.stopEditing();
    }
  };

  const handleSubmit = () => {
    props.stopEditing();
  };

  return (
    <Fragment>
      <input
        ref={refInput}
        value={value}
        //  onChange={handleInputChange}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
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
      </span>
    </Fragment>
  );
});

export default CustomEditorWithDecimal;
