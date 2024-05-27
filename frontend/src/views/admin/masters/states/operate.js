import React, { useRef } from "react";
import { Hook, Helper, API } from "../../../../apps";
import { Modal } from "../../../../apps/components/elements";
import { useDispatch } from "react-redux";
import Features from "../../../../redux/features";

const Operate = (props) => {
  const name = useRef();
  const dispatch = useDispatch();
  const object = Hook.usePost({
    url: "api/states/find",
    data: { id: props.id },
  });

  if (object !== null) {
    name.current.value = object.data.state_name;
  }

  const saveHandler = () => {
    dispatch(Features.showLoader());
    const data = { id: props.id, state_name: name.current.value };
    API.post("api/states/update", data, (response) => {
      dispatch(Features.showToast({ message: response.message }));
      dispatch(Features.hideLoader());
      dispatch(Features.hideModal());
      dispatch(Features.makeHandler({ reload: new Date().getTime() }));
    });
  };

  const changeHandler = (e) => {
    //console.log(e.target.value);
    //setSname(e.target.value);
  };

  return (
    <Modal clickHandler={saveHandler}>
      <div className="row p-3">
        <div className="col-md-12 mb-4">
          <label htmlFor="fullName">
            Name<sup className="text-danger">*</sup>
            <small className="text-danger ps-2">Please fill the name</small>
          </label>
          <input
            type="text"
            ref={name}
            className="form-control"
            id="fullName"
            onChange={changeHandler}
            onDrop={Helper.dropHandler}
            onPaste={Helper.pasteHandler}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Operate;
