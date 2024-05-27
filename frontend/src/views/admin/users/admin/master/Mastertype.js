import React, { lazy, useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, Column, Helper, Hook, Table } from "../../../../../apps";
import Form from "../../../../../apps/components/form";
import Features from "../../../../../redux/features";
import axios from "axios";
import { REACT_APP_URL } from "../../../../../env";

const View = lazy(() => import("./MasterOperate"));

const Mastertype = () => {
  var title = useRef();
  var type_code = useRef();
  var description = useRef();
  var master_status = useRef(1);

  const defaultValidationInputs = [title, description, type_code];
  const [fInputs, SetFInputs] = useState(defaultValidationInputs);
  const [id, setId] = useState(null);

  const [edit, setEdit] = useState(false);
  const [vals, setVal] = useState({});
  const [fSubmit, setFSubmit] = useState(false);
  const dispatch = useDispatch();
  const handler = useSelector((state) => state.handler);
  const model = useSelector((state) => state.modal);
  const reduxObj = useSelector((state) => state.modal);

  useEffect(() => {
    dispatch(
      Features.makeHandler({
        reload: new Date().getTime(),
        where: "",
      })
    );
  }, []);

  const fetchData = (data) => {
    axios.post(`${REACT_APP_URL}api/prabandh/mastertype`, {
      data,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Helper.token()}`
      }
    },)
      .then(function (response) { })
      .catch(function (error) { });
  };

  useEffect(() => {
    fetchData({
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      where: handler?.where,
    });
  }, []);

  const object = Hook.usePost({
    url: "api/prabandh/mastertype",
    data: {
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      where: handler.where,
    },
  });
  if (object===null) {
    dispatch(Features.hideLoader());
   }

  const { handleChange, values, errors, form } = Hook.useForm(fInputs);

  const editHandler = (e) => {
    setEdit(true);
    setId(e.currentTarget.getAttribute("data-id"));
    API.post("api/prabandh/mastertype/getmasterbyid", { id: e.currentTarget.getAttribute("data-id") },
      (response) => {
        const mt_dt_id = response.data.master_type_detail_id;
        if (response.status) {
          if (type_code.current) {
            type_code.current.value = response.data.type_code;
          }
          if (title.current) {
            title.current.value = response.data.title;
          }
          if (master_status.current) {
            master_status.current.value = response.data.status;
          }
          if (description.current) {
            description.current.value = response.data.description;
          }
          setTimeout(() => {
            setVal({ ...response.data, master_type_detail_id: mt_dt_id });
          }, [0]);
        }
      }
    );
  };

  const cancelHandler = () => {
    setEdit(false);
    setVal({});
    if (type_code.current) {
      type_code.current.value = "";
    }
    if (title.current) {
      title.current.value = "";
    }
    if (master_status.current) {
      master_status.current.value = "";
    }
    if (description.current) {
      description.current.value = "";
    }
  };

  const statusHandler = (status, id) => {
    axios
      .post(`${REACT_APP_URL}api/prabandh/mastertype/update`, {
        data: {
          status: status ? 0 : 1,
          id: id,
        },
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Helper.token()}`

        }
      },)
      .then(function (response) {
        dispatch(Features.showToast({ message: response.data.message }));
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
            where: Helper.whereMasterTypeObjSelector(),
          })
        );
      })
      .catch(function (error) { });
  };
  const createHandler = (e) => {
    setFSubmit(true);
    e.preventDefault();
    dispatch(Features.showLoader());
    const data = {
      title: values.title,
      type_code: values.type_code ? values.type_code : type_code?.current?.value,
      status: values.master_status
        ? values.master_status
        : master_status.current.value,
      description: values.description,
    };
    if (data !== null) {
      API.post(`api/prabandh/mastertype/create`, data, (response) => {
        if (title.current) { title.current.value = '' }
        type_code.current.value = ''
        description.current.value = ''
        master_status.current.value = 1
        setFSubmit(false);
        dispatch(Features.showToast({ message: response.message }));
        dispatch(Features.hideLoader());
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
            where: Helper.whereMasterTypeObjSelector(),
          })
        );
      });
    }
  };

  useEffect(() => {
    const trim =
      values?.title?.length >= 1
        ? values?.title?.replace(/^\s+|\s+$/gm, "")
        : null;
    let typecode = trim && trim.split(" ");
    if (!typecode) {
      if (type_code.current) {
        type_code.current.value = "";
      }
    } else if (
      (typecode && typecode?.length === 1) ||
      (typecode[1] && typecode[1].length === 0)
    ) {
      type_code.current.value = typecode[0]?.substring(0, 3).toUpperCase();
    } else if (
      typecode &&
      typecode?.length === 2 &&
      typecode &&
      typecode[1]?.length === 1
    ) {
      type_code.current.value =
        typecode[0]?.substring(0, 2).toUpperCase() +
        typecode[1]?.substring(0, 1).toUpperCase();
    } else if (typecode && typecode?.length === 2) {
      type_code.current.value =
        typecode[0]?.substring(0, 1).toUpperCase() +
        typecode[1]?.substring(0, 2).toUpperCase();
    } else if (typecode && typecode?.length === 3) {
      type_code.current.value =
        typecode[0]?.substring(0, 1).toUpperCase() +
        typecode[1]?.substring(0, 1).toUpperCase() +
        typecode[2]?.substring(0, 1).toUpperCase();
    }
  }, [values.title]);

  let rows = [];

  const searchData = (e) => {
    dispatch(
      Features.makeHandler({
        reload: new Date().getTime(),
        where: Helper.whereMasterTypeObjSelector(e.target.value),
      })
    );
  };

  const EditSubmitHandler = (e) => {
    setFSubmit(true);
    e.preventDefault();
    dispatch(Features.showLoader());
    const data = {
      id: id,
      title: title?.current?.value,
      type_code: type_code?.current?.value,
      status: master_status?.current?.value,
      description: description?.current?.value,
    };
    API.post(`api/prabandh/mastertype/updateall`, data, (response) => {
      dispatch(Features.showToast({ message: response.message }));
      if (response.status) {
        setEdit(false);
        setVal({ master_type_detail_id: "" });
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
            where: Helper.whereMasterObjSelector(),
          })
        );
        if (type_code.current) {
          type_code.current.value = "";
        }
        if (title.current) {
          title.current.value = "";
        }
        if (master_status.current) {
          master_status.current.value = "";
        }
        if (description.current) {
          description.current.value = "";
        }
      }
      setFSubmit(false);
      dispatch(Features.hideLoader());
    });
  };

  const addHandler = (e) => {
    dispatch(Features.showModal({ title: "Add User", btntext: "Add User" }));
  };
  if (object !== null && object.data !== undefined) {
    object &&
      object.data &&
      object.data.map((row, i) => {
        return (rows[i] = {
          srl: Helper.counter(++i, handler.limit, handler.page),
          title: Helper.ucfirst(row.title ? row.title : ""),
          type_code: row.type_code,
          description: row.description,
          status: (
            <div className="text-center">
              <i
                className={`fa-regular fa-square-check ${row.status === 1 ? "text-success" : "text-danger"
                  }`}
                onClick={(e) => statusHandler(row.status, row.id)}
                key={i}
                data-id={row.id}
              ></i>
            </div>
          ),
          action: (
            <div className="text-center">
              <i
                key={i}
                className="fa-solid fa-pen text-warning"
                onClick={editHandler}
                data-id={row.id}
                user_role_id={row.user_role_id}
              ></i>
            </div>
          ),
        });
      });
  }

  const master_statuss = [{ id: "1", name: "Active" }];

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>Master Type</h1>
      </div>
      <div className="dashboard-main-content-info mb-3">
        <div className="row">
          <div className="col-md-3 ">
            <Form.Text
              attr={{
                ref: title,
                id: "title",
                name: "title",
                onChange: handleChange,
                onFocus: handleChange,
                maxLength: 100,
              }}
              label="Title"
              error={errors.title}
              mandatory="true"
            />
          </div>
          <div className="col-md-2 ">
            <Form.Udise
              disable
              type="number"
              style={{
                width: "100%",
                textTransform: "uppercase",
                background: "white",
              }}
              attr={{
                ref: type_code,
                readOnly: true,
                id: "type_code",
                name: "type_code",
                onChange: handleChange,
                onFocus: handleChange,
                maxLength: "100%",
              }}
              label="Type code"
              error={errors.type_code}
              mandatory="true"
            />
          </div>

          <div className=" col-md-2">
            <Form.Select
              options={master_statuss}
              attr={{
                ref: master_status,
                id: "master_status",
                name: "master_status",
                onChange: handleChange,
                onFocus: handleChange,
              }}
              label="Status"
              mandatory="true"
              default="Inactive"
            />
          </div>
          <div className="col-md-5 ">
            <Form.Textarea
              attr={{
                ref: description,
                id: "description",
                name: "description",
                onChange: handleChange,
                onFocus: handleChange,
                maxLength: 100,
                rows: "1"
              }}
              label="Description"
              error={errors.description}
              mandatory="true"
            />
          </div>
          
          <div className="col-md-12 text-end">
            <label className="d-block">&nbsp; </label>
            {edit ? (
              <div
                className="col-md-12"
                style={{
                  display: "flex",
                  columnGap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <Form.Button
                  button={{
                    type: "submit",
                    disabled:
                      vals.master_type_detail_id === "0" ? true : form.disable,
                    onClick: EditSubmitHandler,
                  }}
                  className="btn btn-success float-end"
                  fSubmit={fSubmit}
                >
                  Submit
                </Form.Button>
                <Form.Button
                  button={{
                    type: "submit",
                    disabled: false,
                    onClick: cancelHandler,
                  }}
                  className="btn btn-primary float-end mr-3"
                  fSubmit={fSubmit}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </Form.Button>
              </div>
            ) : (
              <div className="col-md-12">
                <Form.Button
                  button={{
                    type: "submit",
                    disabled:
                      vals.master_type_detail_id === "0" ? true : form.disable,
                    onClick: createHandler,
                  }}
                  className="btn btn-success float-end "
                  fSubmit={fSubmit}
                >
                  Save
                </Form.Button>
              </div>
            )}
          </div>

        </div>
      </div>
      <div className="dashboard-main-content-info">
        <div className="col-xl-12 col-lg-12 col-sm-12">
          {object && (
            <Table
              object={{
                columns: Column.mastertype(),
                data: rows,
                count: object.count,
                addHandler: addHandler,
                create: false,
                search: true,
                handleChange: searchData,
              }}
            />
          )}
        </div>
        {reduxObj.view && id && (
          <View btntext={model.btntext} id={id} close={() => setId(null)} />
        )}
      </div>
    </div>
  );
};

export default Mastertype;
