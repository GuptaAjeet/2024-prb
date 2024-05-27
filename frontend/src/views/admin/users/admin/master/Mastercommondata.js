import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, Column, Helper, Hook, Table } from "../../../../../apps";
import Form from "../../../../../apps/components/form";
// import { Label, Modal } from "../../../../../apps/components/elements";
import Features from "../../../../../redux/features";
import axios from "axios";
// import { useLocation } from "react-router-dom";
import { REACT_APP_URL } from "../../../../../env";
import api from "../../../../../apps/utilities/api";
// import Features from "../../../../redux/features";

//import validate from "../../../../../apps/utilities/validate";

// const View = lazy(() => import("./MastercommondataOperate"));

const Mastercommondata = (props) => {
  const currentyr = new Date().getFullYear().toString();
  // const url = useLocation();

  var type_code = useRef();
  var master_type_detail_id = useRef();
  var district_id = useRef();
  var state_id = useRef();
  var block_id = useRef();
  var linkschool = useRef(0);
  var links_to_school = useRef(null);
  var master_status = useRef(0);
  var udise_code = useRef();
  var title = useRef();
  var description = useRef();
  const defaultValidationInputs = [
    title,
    type_code,
    district_id,
    state_id,
    block_id,
    links_to_school,
    udise_code,
    description,
    master_type_detail_id,
  ];
  const [fInputs, SetFInputs] = useState(defaultValidationInputs);
  // const [ROptions, setROption] = useState([]);
  const [DOptions, setDOptions] = useState([]);
  const [BOptions, setBOptions] = useState([]);
  const [mastertype_detail, setMastertype_detail] = useState([]);
  const [fSubmit, setFSubmit] = useState(false);
  const [edit, setEdit] = useState(false);
  // const model = useSelector((state) => state.modal);
  // const reduxObj = useSelector((state) => state.modal);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const SOption = Hook.useStates();
  const DOption = Hook.useDistricts();
  const BOption = Hook.useBlocks();
  const [vals, setVal] = useState({});
  const [data, setdata] = useState();
  const [schoolsList, setSchoolsList] = useState([]);

  const handler = useSelector((state) => state.handler);
  const { handleChange, values, errors, form } = Hook.useForm(fInputs);

  useEffect(() => {
    setVal(values);
    console.log(values);
  }, [values]);

  //setVal(values);

  const getalltypecode = Hook.usePost({
    url: "api/prabandh/mastertype/getalltypecode",
    data: {},
  });
  useEffect(() => {
    dispatch(
      Features.makeHandler({
        reload: new Date().getTime(),
        where: "",
      })
    );
  }, []);
  const object = Hook.usePost({
    url: "api/prabandh/mastercommondata",
    data: {
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      where: handler?.where,
    },
  });

  useEffect(() => {
    getDistrict();
    vals?.district_id && getBlock();
  }, [vals?.state_id, vals?.district_id]);

  const getDistrict = () => {
    if (vals?.state_id > 0) {
      setDOptions(Helper.districtFilter(DOption, vals?.state_id));
    }
  };

  const getBlock = () => {
    if (vals?.state_id > 0) {
      setBOptions(
        Helper.blockFilter(BOption, vals?.state_id, vals.district_id)
      );
    }
  };

  let typedata = [];
  let rows = [];
  // let userData = Helper.auth?.user;

  const searchData = (e) => {
    dispatch(
      Features.makeHandler({
        reload: new Date().getTime(),
        where: Helper.whereMasterObjSelector(e.target.value),
      })
    );
  };

  const editHandler = (e) => {
    setEdit(true);
    setId(e.currentTarget.getAttribute("data-id"));
    API.post(
      "api/prabandh/mastercommondata/getmastercommondatabyid",
      { id: e.currentTarget.getAttribute("data-id") },
      (response) => {
        const mt_dt_id = response.data.master_type_detail_id;
        if (response.status) {
          if (type_code.current) {
            type_code.current.value = response.data.master_type_id;
            // setTimeout(() => {
            type_code.current.dispatchEvent(
              new Event("change", { bubbles: true })
            );
            // }, 100);
          }
          if (title.current) {
            title.current.value = response.data.title;
          }
          if (state_id.current) {
            state_id.current.value = response.data.state_id;
            state_id.current.dispatchEvent(
              new Event("change", { bubbles: true })
            );
          }
          if (district_id.current) {
            setTimeout(() => {
              district_id.current.value = response.data.district_id;
              district_id.current.dispatchEvent(
                new Event("change", { bubbles: true })
              );
            }, 100);
          }
          if (block_id.current) {
            setTimeout(() => {
              block_id.current.value = response.data.block_id;
            }, 150);
          }
          if (master_type_detail_id.current) {
            setTimeout(() => {
              master_type_detail_id.current.value = String(mt_dt_id);
            }, 200);
          }
          if (udise_code.current) {
            udise_code.current.value = response.data.udise_code;
          }
          if (master_status.current) {
            master_status.current.value = response.data.status;
          }
          if (description.current) {
            description.current.value = response.data.description;
          }
          setdata(response.data);
        }
      }
    );
  };
  const master_statusHandler = (status, id) => {
    axios
      .post(`${REACT_APP_URL}api/prabandh/mastercommondata/update`, {
        data: {
          status: status ? 0 : 1,
          id: id,
        },
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Helper.token()}`

        }
      })
      .then(function (response) {
        dispatch(Features.showToast({ message: response.data.message }));
        // fetchData({
        //     'page': handler.page, 'limit': handler.limit, 'reload': handler.reload, 'where': handler?.where
        // });
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
            where: Helper.whereMasterObjSelector(),
          })
        );
      })
      .catch(function (error) {
        //console.log(error);
      });
    // dispatch(Features.showLoader());
    // API.post("api/admin-users/update", { 'id': id, 'data': { 'user_master_status': master_status == 1 ? 0 : 1 } }, (response) => {
    dispatch(
      Features.makeHandler({
        reload: new Date().getTime(),
        where: Helper.whereMasterObjSelector(),
      })
    );
    //     dispatch(Features.showToast({ message: response.message }));
    // });
  };

  const EditSubmitHandler = (e) => {
    // setFSubmit(true);
    e.preventDefault();
    dispatch(Features.showLoader());
    let type_code =
      getalltypecode &&
      getalltypecode?.data.filter((c) => c.id === vals.type_code);
    const data = {
      id: id,
      title: values.title ? values.title : title?.current?.value,
      type_code:
        type_code[0].type_code +
        currentyr.slice(-2) +
        block_id.current.value +
        Number(object?.count) +
        Number(1),
      status: vals.master_status
        ? vals.master_status
        : master_status?.current?.value,
      description: values.description
        ? values.description
        : description?.current?.value,
      state_id: vals.state_id ? vals.state_id : state_id?.current?.value,
      district_id: vals.district_id
        ? vals.district_id
        : district_id?.current?.value,
      block_id: vals.block_id ? vals.block_id : block_id?.current?.value,
      udise_code:
        vals.linkschool && linkschool.current.value === "1"
          ? vals.udise_code
          : -1,
      master_type_detail_id: values.master_type_detail_id
        ? values.master_type_detail_id
        : master_type_detail_id.current.value,
    };
    API.post(`api/prabandh/mastercommondata/updateall`, data, (response) => {
      setFSubmit(false);
      dispatch(Features.showToast({ message: response.message }));
      dispatch(Features.hideLoader());
      dispatch(Features.hideModal());
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
      setEdit(false);
      setVal({ master_type_detail_id: "0" });
    });
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
    if (state_id.current) {
      state_id.current.value = "";
    }
    if (district_id.current) {
      district_id.current.value = "";
    }
    if (block_id.current) {
      block_id.current.value = "";
    }
    if (master_type_detail_id.current) {
      master_type_detail_id.current.value = "";
    }
    if (udise_code.current) {
      udise_code.current.value = "";
    }
    if (master_status.current) {
      master_status.current.value = "";
    }
    if (description.current) {
      description.current.value = "";
    }
  };
  const createHandler = (e) => {
    e.preventDefault();
    setFSubmit(true);
    dispatch(Features.showLoader());
    let type_code =
      getalltypecode &&
      getalltypecode?.data.filter((c) => c.id === vals.type_code);
    const data = {
      title: vals.title,
      master_type_id: type_code[0].id,
      type_code:
        type_code[0].type_code +
        currentyr.slice(-2) +
        vals.block_id +
        Number(object?.count) +
        Number(1),
      status: vals.master_status
        ? vals.master_status
        : master_status.current.value,
      description: vals.description,
      state_id: vals.state_id,
      district_id: vals.district_id,
      block_id: vals.block_id,
      udise_code:
        vals.linkschool && linkschool.current.value === "1"
          ? vals.udise_code
          : -1,
      master_type_detail_id: vals.master_type_detail_id,
    };
    if (data !== null) {
      API.post(`api/prabandh/mastercommondata/create`, data, (response) => {
        setFSubmit(false);
        dispatch(Features.showToast({ message: response.message }));
        dispatch(Features.hideLoader());
        // fetchData({
        //     'page': handler.page, 'limit': handler.limit, 'reload': handler.reload, 'where': handler?.where
        // })
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
            where: Helper.whereMasterObjSelector(),
          })
        );
      });
    }
    setVal({});
    // type_code?.current?.value = "";
    title.current.value = "";
    state_id.current.value = "";
    district_id.current.value = "";
    block_id.current.value = "";
    master_type_detail_id.current.value = "";
    linkschool.current.value = "0";
    description.current.value = "";
  };
  useEffect(() => {
    if (vals?.type_code) {
      API.post(
        `api/prabandh/mastertype/getmastertypedetail`,
        { id: vals?.type_code },
        (response) => {
          //console.log(response);
          setMastertype_detail(
            response.data?.map((v) => ({
              name: v.atribute_name,
              id: v.master_type_detail_id,
            }))
          );
          setVal({ ...vals, master_type_detail_id: "0" });
        }
      );
    }
  }, [vals.type_code]);
  typedata =
    getalltypecode &&
    getalltypecode?.data.map((v, i) => ({ name: v.title, id: v.id }));
  // typedata =
  //   getalltypecode &&
  //   getalltypecode?.data.map((v, i) => ({
  //     name: v.title,
  //     id: v.type_code,
  //   }));

  //   const getSchoolsList = (block_id = 0, formGlobalCode = 0, summary = null) => {
  useEffect(() => {
    if (vals.block_id) {
      //console.log(vals.block_id);
      api.post(`api/schools/find`, { block_id: vals.block_id }, (res) => {
        //170603
        setSchoolsList(
          res.data?.map((v) => ({
            name: v.udise_sch_code,
            id: v.udise_sch_code,
          }))
        );
      });
    }
  }, [vals?.block_id]);
  //   };
  // if (vals?.block_id) {
  //   // typedata = typedata && typedata.map(v => ({ name: v.name, id: v.id + block_id?.current?.value + object?.count + 1 }))
  //   // vals
  //   setVal({ ...vals, type_code: vals.type_code + currentyr.slice(-2) + vals.block_id + object?.count + 1 })
  // }
  if (object !== null && object.data !== undefined) {
    object &&
      object.data &&
      object.data.map((row, i) => {
        return (rows[i] = {
          srl: Helper.counter(++i, handler.limit, handler.page),
          title: Helper.ucfirst(row.title ? row.title : ""),
          type_code: row.type_code,
          state_name: row.state_name,
          district_name: row.district_name,
          block_name: row.block_name,
          udise_code: row.udise_code === -1 ? "----" : row.udise_code,
          master_type: row.master_type_id,
          master_type_detail_id: row.atribute_name,
          description: row.description,
          status: (
            <div className="text-center">
              <i
                className={`fa-regular fa-square-check ${row.status === 1 ? "text-success" : "text-danger"
                  }`}
                onClick={(e) => master_statusHandler(row.status, row.id)}
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
              ></i>
            </div>
          ),
        });
      });
  }

  return (
    <div clickHandler={createHandler} className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>Master Common Data</h1>
      </div>
      <div className="dashboard-main-content-info mb-3">
        <div className="row ">
          <div className="mb-3 col-md-4">
            <Form.Select
              options={typedata ? typedata : []}
              attr={{
                ref: type_code,
                id: "type_code",
                name: "type_code",
                onChange: handleChange,
                onFocus: handleChange,
              }}
              label="Type Code"
              error={errors.type_code}
              mandatory="true"
              default="Select Type Code"
            />
          </div>

          <div className="col-md-4 mb-3">
            <Form.Text
              attr={{
                ref: title,
                id: "title",
                name: "title",
                type: "text",
                onChange: handleChange,
                onFocus: handleChange,
                maxLength: 100,
              }}
              label="Title"
              error={errors.title}
              mandatory="true"
            />
          </div>
          <div className="mb-3 col-md-4">
            <Form.Select
              options={SOption ? SOption : []}
              attr={{
                ref: state_id,
                id: "state_id",
                name: "state_id",
                onChange: handleChange,
                onFocus: handleChange,
              }}
              label="State"
              error={errors.state_id}
              mandatory="true"
              default="Select State"
            />
          </div>
          {vals?.state_id !== 0 && vals.state_id !== undefined ? (
            <div className="mb-3 col-md-4">
              <Form.Select
                options={
                  DOptions
                    ? DOptions.map((c) => ({ name: c.name, id: c.id }))
                    : []
                }
                attr={{
                  ref: district_id,
                  id: "district_id",
                  name: "district_id",
                  onChange: handleChange,
                  onFocus: handleChange,
                }}
                label="District"
                error={errors.district_id}
                mandatory="true"
                default="Select District"
              />
            </div>
          ) : (
            <div className="mb-3 col-md-4">
              <Form.Select
                options={
                  DOptions
                    ? DOptions.map((c) => ({ name: c.district_name, id: c.id }))
                    : []
                }
                attr={{
                  disabled: "true",
                  ref: district_id,
                  id: "district_id",
                  name: "district_id",
                  onChange: handleChange,
                  onFocus: handleChange,
                }}
                label="District"
                error={errors.district_id}
                mandatory="true"
                default="Select District"
              />
            </div>
          )}
          {vals?.district_id !== 0 &&
            vals?.state_id !== 0 &&
            vals.state_id !== undefined &&
            vals.district_id !== undefined ? (
            <div className="mb-3 col-md-4">
              <Form.Select
                options={BOptions ? BOptions : []}
                attr={{
                  ref: block_id,
                  id: "block_id",
                  name: "block_id",
                  onChange: handleChange,
                  onFocus: handleChange,
                }}
                label="Block"
                error={errors.block_id}
                mandatory="true"
                default="Select Block"
              />
            </div>
          ) : (
            <div className="mb-3 col-md-4">
              <Form.Select
                options={BOptions ? BOptions : []}
                attr={{
                  ref: block_id,
                  disabled: "true",
                  id: "block_id",
                  name: "block_id",
                  onChange: handleChange,
                  onFocus: handleChange,
                }}
                label="Block"
                error={errors.block_id}
                mandatory="true"
                default="Select Block"
              />
            </div>
          )}
          <div className="mb-3 col-md-4">
            <Form.Select
              options={[{ id: "1", name: "Yes" }]}
              attr={{
                ref: linkschool,
                id: "linkschool",
                name: "linkschool",
                onChange: handleChange,
                onFocus: handleChange,
              }}
              label="Link School"
              mandatory="true"
              default="No"
            />
          </div>
          {vals?.linkschool !== "0" && vals.linkschool !== undefined && (
            <div className="col-md-4 mb-4">
              <Form.Select
                options={schoolsList ? schoolsList : []}
                attr={{
                  ref: udise_code,
                  id: "udise_code",
                  name: "udise_code",
                  onChange: handleChange,
                  onFocus: handleChange,
                }}
                label="Udise Code"
                mandatory="true"
                default="Select Udise Code"
              />
            </div>
          )}
          <div className="mb-3 col-md-4">
            <Form.Select
              options={mastertype_detail ? mastertype_detail : []}
              attr={{
                ref: master_type_detail_id,
                id: "master_type_detail_id",
                name: "master_type_detail_id",
                onChange: handleChange,
                onFocus: handleChange,
              }}
              label="Attribute Type"
              error={errors.master_type_detail_id}
              mandatory="true"
              default="Select Attribute Type"
            />
          </div>
          <div className="mb-3 col-md-4">
            <Form.Select
              options={[{ id: 1, name: "Active" }]}
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

          <div className="col-md-4 mb-3">
            <Form.Textarea
              attr={{
                ref: description,
                id: "description",
                name: "description",
                onChange: handleChange,
                onFocus: handleChange,
                rows: "1"
              }}
              label="Description"
              error={errors.description}
              mandatory="true"
            />
          </div>
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
                className="btn btn-success float-end"
                fSubmit={fSubmit}
              >
                Save
              </Form.Button>
            </div>
          )}
        </div>
      </div>
      <div className="dashboard-main-content-info">
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          {object && (
            <Table
              object={{
                columns: Column.mastercommondata(),
                data: rows,
                count: object.count,
                create: false,
                search: true,
                handleChange: searchData,
              }}
            />
          )}
        </div>
        {/* {reduxObj.view && <View btntext={model.btntext} id={id} />} */}
      </div>
    </div>
  );
};

export default Mastercommondata;
