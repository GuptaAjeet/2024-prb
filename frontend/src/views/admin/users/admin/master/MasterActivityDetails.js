//import axios from "axios";
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
//import Helper from "../../../../../apps/utilities/helper";
import api from "../../../../../apps/utilities/api";
import { useRef } from "react";
import { useState, useMemo } from "react";
import Form from "../../../../../apps/components/form";
import { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import sweetAlert from "../../../../../apps/utilities/sweetalert";
import CustomLoadingOverlay from "../../../../layouts/prabandh/School/customLoadingOverlay";
import Select from "react-select";
import { Modal } from "../../../../../apps/components/elements";
import Features from "../../../../../redux/features";

const MasterActivityDetails = () => {
  //const [id, setId] = useState(null);
  //const [userRoleId, setUserRoleId] = useState();
  //const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();

  const schemesRef = useRef(0);
  const majorComponentsRef = useRef(0);
  const subComponentsRef = useRef(0);
  const activityRef = useRef(0);
  const recurringRef = useRef(0);
  const componentRef = useRef(0);
  const stateRef = useRef(0);
  const schoolRef = useRef(0);
  const stateRefM = useRef(0);
  const interventionRef = useRef("");
  const [pagesize, setpagesize] = useState(10);

  const loadingOverlayComponent = useMemo(() => CustomLoadingOverlay, []);
  const [schemes, setSchemes] = useState([]);
  const [majorComponents, setMajorComponents] = useState([]);
  const [subComponents, setSubComponents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [stateListM, setStateListM] = useState([]);
  const [prbMasterData, setPRBMasterData] = useState([]);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());
  const [stateSpecfic, setStateSpecfic] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsM, setSelectedOptionsM] = useState([]);
  const [selectedActivityFullDetails, setSelectedActivityFullDetails] =
    useState({
      activity_details: null,
      states: [],
    });
  /*   const openPopup = (value) => {
    console.log("Open popup for:", value);
  }; */

  /* let userData = Helper.auth?.user; */

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleSelectChangeM = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = selectedOptionsM.filter((v) => v.isFixed);
        break;
    }
    setSelectedOptionsM(newValue);
  };

  useEffect(() => {
    api.post("api/prabandh/schemes", {}, (res) => {
      setSchemes(res?.data?.map((d) => ({ id: d.id, name: d.scheme_name })));
    });
    api.get("api/states/list", null, (res) => {
      const state_list_data = res?.data.map((r) => ({
        value: r.id,
        label: r.name,
        isFixed: false,
      }));
      setStateList(state_list_data);
      setStateListM(state_list_data);
    });
    api.post(
      "api/prabandh/interventions-list",
      { state_specfic: stateSpecfic },
      (res) => {
        setPRBMasterData(res.data);
      }
    );
  }, [refresh]);

  const handleChange = (e) => {
    const val = +e.target.value;
    const name = e.target.name;
    if (name === "schemes") {
      if (val > 0) {
        api.post("api/prabandh/major-components", { schemeid: val }, (res) => {
          setMajorComponents(
            res?.data?.map((d) => ({
              id: d.prb_major_component_id,
              name: d.title,
            }))
          );
        });
      }
    } else if (name === "major_components") {
      const schemeID = schemesRef?.current?.value;
      if (schemeID && val > 0) {
        api.post(
          "api/prabandh/sub-components-list",
          { schemeid: schemeID, major_component_id: val },
          (res) => {
            setSubComponents(
              res?.data?.rows?.map((d) => ({
                id: d.sub_component_id,
                name: d.title,
              }))
            );
          }
        );
      }
    } else if (name === "sub_components") {
      const schemeID = schemesRef?.current?.value;
      const majorComponentID = majorComponentsRef?.current?.value;
      api.post(
        "api/prabandh/active-master-list",
        {
          schemeid: schemeID,
          major_component_id: majorComponentID,
          sub_component_id: val,
        },
        (res) => {
          setActivities(
            res?.data?.map((d) => ({
              id: d.id,
              name: d.title,
            }))
          );
        }
      );
    }
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      // width:250,
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const handleSubmit = () => {
    const validationMessages = [];
    const payload = [];
    if (+schemesRef.current.value === 0) {
      validationMessages.push("Schemes is required");
    } else {
      payload.push({ key: "scheme_id", value: schemesRef.current.value });
      payload.push({
        key: "scheme_name",
        value: schemesRef.current.selectedOptions[0].label,
      });
    }

    if (+majorComponentsRef.current.value === 0) {
      validationMessages.push("Major Components is required");
    } else {
      payload.push({
        key: "major_component_id",
        value: majorComponentsRef.current.value,
      });
      payload.push({
        key: "major_component_name",
        value: majorComponentsRef.current.selectedOptions[0].label,
      });
    }

    if (+subComponentsRef.current.value === 0) {
      validationMessages.push("Sub Components is required");
    } else {
      payload.push({
        key: "sub_component_id",
        value: subComponentsRef.current.value,
      });
      payload.push({
        key: "sub_component_name",
        value: subComponentsRef.current.selectedOptions[0].label,
      });
    }

    if (+activityRef.current.value === 0) {
      validationMessages.push("Activity is required");
    } else {
      payload.push({
        key: "activity_master_id",
        value: activityRef.current.value,
      });
      payload.push({
        key: "activity_master_name",
        value: activityRef.current.selectedOptions[0].label,
      });
    }

    if (+recurringRef.current.value === 0) {
      validationMessages.push("Recurring is required");
    } else {
      payload.push({
        key: "recuring_nonrecuring",
        value: recurringRef.current.value,
      });
    }

    if (+componentRef.current.value === 0) {
      //validationMessages.push("Component is required");
    } else {
      payload.push({
        key: "component_type",
        value: componentRef.current.value,
      });
    }

    payload.push({
      key: "state_specfic_yn",
      value: stateRef.current.props.value.length === 0 ? 0 : 1,
    });

    payload.push({
      key: "states_list",
      value: stateRef.current.props.value,
    });

    payload.push({
      key: "school",
      value: schoolRef.current.value,
    });

    if (interventionRef.current.value.trim() === "") {
      validationMessages.push("Intervention is required");
    } else {
      payload.push({
        key: "activity_master_details_name",
        value: interventionRef.current.value,
      });
    }

    if (validationMessages.length > 0) {
      sweetAlert.warning(
        `Validation failed. Please check the following:\n ${validationMessages.join(
          ", "
        )}`
      );
    } else {
      api.post(
        "api/prabandh/save-new-intervention",
        {
          data: payload,
        },
        (res) => {
          handleReset();
          sweetAlert.done({ msg: `Data saved successfully.` });
          setRefresh(new Date().getMilliseconds());
        }
      );
    }
  };

  const handleReset = () => {
    schemesRef.current.value = 0;
    majorComponentsRef.current.value = 0;
    subComponentsRef.current.value = 0;
    activityRef.current.value = 0;
    recurringRef.current.value = 0;
    componentRef.current.value = 0;
    stateRef.current.value = 0;
    schoolRef.current.value = 0;
    interventionRef.current.value = "";
    setSelectedOptions(0);
  };

  const handleInterventionList = () => {
    if (stateSpecfic === 1) {
      setStateSpecfic(0);
    } else {
      setStateSpecfic(1);
    }
    setRefresh(new Date().getMilliseconds());
  };

  const openAssignStateModel = (e, prm) => {
    api.post(
      "api/prabandh/intervention-details",
      {
        id: prm?.data?.id || 0,
        mode: "get_information",
        states: [],
      },
      (res) => {
        setSelectedActivityFullDetails({
          activity_details: res.data.activity_details,
          states: res.data.states,
        });
        const ff = res.data.states.map((s) => ({ ...s, isFixed: true }));
        setSelectedOptionsM(
          res.data.states.map((s) => ({ ...s, isFixed: true }))
        );
        setStateListM(
          stateListM.filter(
            (item1) => !ff.some((item2) => item1.value === item2.state_id)
          )
        );
      }
    );

    dispatch(Features.showModal({ title: "Assign States", size: "sm" }));
  };

  const updateStateAssignment = () => {
    const newStatesList = stateRefM.current.props.value;
    if (newStatesList.length > 0) {
      api.post(
        "api/prabandh/intervention-details",
        {
          id: 0,
          mode: "update_state",
          states: newStatesList,
        },
        (res) => {
          sweetAlert.done({ msg: `State Assigned Successfully.` });
          setRefresh(new Date().getMilliseconds());
        }
      );
    } else {
      sweetAlert.warning(`Kindly Select Any State`);
    }
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>State Activity <span className="braket_text">(Intervention Attributes) </span></h1>
      </div>
      <div className="dashboard-main-content-info mb-3">
        <div className="row">
          <div className="mb-2 col-md-2 mb-2">
            <Form.Select
              options={schemes}
              attr={{
                ref: schemesRef,
                id: "schemes",
                name: "schemes",
                onChange: handleChange,
              }}
              label="Scheme"
              /* error={errors.file_type} */
              mandatory={true}
              default="Scheme"
            />
          </div>
          <div className="mb-2 col-md-3 mb-2">
            <Form.Select
              options={majorComponents}
              attr={{
                ref: majorComponentsRef,
                id: "major_components",
                name: "major_components",
                onChange: handleChange,
              }}
              label="Major Component"
              /* error={errors.document_type} */
              mandatory={true}
              default="Major Component"
            />
          </div>
          <div className="mb-2 col-md-3 mb-2">
            <Form.Select
              options={subComponents}
              attr={{
                ref: subComponentsRef,
                id: "sub_components",
                name: "sub_components",
                onChange: handleChange,
              }}
              label="Sub Component"
              mandatory={true}
              default="Sub Component"
            />
          </div>
          <div className="mb-2 col-md-4 mb-2">
            <Form.Select
              options={activities}
              attr={{
                ref: activityRef,
                id: "activity",
                name: "activity",
                onChange: handleChange,
              }}
              label="Activity"
              mandatory={true}
              default="Activity"
            />
          </div>
        </div>
        <div className="row">
          <div className="mb-2 col-md-2 mb-2">
            <Form.Select
              options={[
                { id: 1, name: "Recurring" },
                { id: 2, name: "Non Recurring" },
              ]}
              attr={{
                ref: recurringRef,
                id: "recurring_type",
                name: "recurring_type",
                onChange: handleChange,
              }}
              label="Recurring Type"
              mandatory={false}
              default="Recurring Type"
            />
          </div>
          <div className="mb-2 col-md-3 mb-2">
            <Form.Select
              options={[
                { id: 2, name: "State" },
                { id: 3, name: "District" },
              ]}
              attr={{
                ref: componentRef,
                id: "component_type",
                name: "component_type",
                onChange: handleChange,
              }}
              label="Component Type"
              mandatory={false}
              default="Component Type"
            />
          </div>
          <div className="mb-2 col-md-3 mb-2">
            <Form.Select
              options={[
                { id: 0, name: "No" },
                { id: 1, name: "Yes" },
              ]}
              attr={{
                ref: schoolRef,
                id: "component_type",
                name: "component_type",
                onChange: handleChange,
              }}
              label="Select School"
              mandatory={false}
            />
          </div>
          <div className="mb-2 col-md-4 mb-2">
            <Form.Text
              attr={{
                ref: interventionRef,
                id: "intervention",
                name: "intervention",
                onChange: handleChange,
                onFocus: handleChange,
                maxLength: 200,
              }}
              label="Intervention"
              mandatory="true"
            />
          </div>

          
          <div className="mb-2 col-md-4 mb-2">
            <label>Select State(s) </label>
            <Select
              id="state"
              name="state"
              value={selectedOptions}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  fontSize: "14px",
                }),
                option: (baseStyles, { isFocused }) => ({
                  ...baseStyles,
                  fontSize: "14px",
                  color: isFocused ? "white" : "black",
                }),
              }}
              theme={(theme) => ({
                ...theme,
                fontSize: "14px",
                colors: {
                  ...theme.colors,
                  primary25: "#1967D2",
                },
              })}
              ref={stateRef}
              onChange={handleSelectChange}
              closeMenuOnSelect={false}
              isMulti
              options={stateList}
            />
          </div>
        </div>
      </div>

      <div style={{ cursor: "pointer" }} className="upload_submit_button">
        <Form.Button
          button={{
            type: "submit",
            onClick: handleSubmit,
          }}
          className="btn btn-success"
        >
          Submit
        </Form.Button>
        <Form.Button
          button={{
            type: "submit",
            className: "btn btn-danger",
            onClick: handleReset,
          }}
          style={{}}
          className="btn btn-danger"
        >
          Reset
        </Form.Button>
      </div>
      <div className="dashboard-main-content-info">
        <div className="dashboard-main-content__header mb-3">
          <h1>
            Current Activity Master Preview
            <button
              className="btn btn-primary"
              style={{ float: "right" }}
              onClick={handleInterventionList}
            >
              {stateSpecfic === 1 ? "Show All" : "Show State Specific"}
            </button>
          </h1>
        </div>
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          <div style={gridStyle} className={"ag-theme-alpine AS"}>
            <AgGridReact
              ref={gridRef}
              columnDefs={[
                {
                  headerName: "ID",
                  field: "id",
                  maxWidth: 91,
                },
                {
                  headerName: "Scheme Name",
                  field: "scheme_name",
                  filter: "agMultiColumnFilter",
                  tooltipValueGetter: (params) => params.data.scheme_name
                },
                {
                  headerName: "Major Component",
                  field: "major_component_name",
                  filter: "agMultiColumnFilter",
                  tooltipValueGetter: (params) => params.data.major_component_name
                },
                {
                  headerName: "Sub Component",
                  field: "sub_component_name",
                  filter: "agMultiColumnFilter",
                  tooltipValueGetter: (params) => params.data.sub_component_name
                },
                {
                  headerName: "Activity Master",
                  field: "activity_master_name",
                  filter: "agMultiColumnFilter",
                  tooltipValueGetter: (params) => params.data.activity_master_name
                },
                {
                  headerName: "Intervention",
                  field: "activity_master_details_name",
                  filter: "agMultiColumnFilter",
                  flex: 1,
                  tooltipValueGetter: (params) => params.data.activity_master_name
                },
                {
                  headerName: "Recurring/NR",
                  field: "recuring_nonrecuring",
                  filter: "agMultiColumnFilter",
                  flex: 1,
                  tooltipValueGetter: (params) => params.data.recuring_nonrecuring
                },
                {
                  headerName: "Component Type",
                  field: "component_type",
                  filter: "agMultiColumnFilter",
                  flex: 1,
                  tooltipValueGetter: (params) => params.data.component_type
                },
                {
                  headerName: "State Name",
                  field: "state_name",
                  filter: "agMultiColumnFilter",
                  flex: 1,
                  tooltipValueGetter: (params) => params.data.state_name
                },
                {
                  headerName: "Action",
                  field: "action",
                  width: 120,
                  sortable: false,
                  cellRenderer: function AssignmentRenderer(params) {
                    if (params.data.state_id) {
                      return (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: "5px", marginBottom: "6px" }}
                          onClick={(e) => openAssignStateModel(e, params)}
                        >
                          Assign State
                        </button>
                      );
                    } else {
                      return "";
                    }
                  },
                },
              ]}
              rowData={prbMasterData}
              defaultColDef={defaultColDef}
              loadingOverlayComponent={loadingOverlayComponent}
              pagination={true}
              animateRows={true}
              paginationPageSize={pagesize}
              paginationAutoPageSize={true}
            />
          </div>
        </div>
      </div>
      {selectedOptionsM?.length > 0 && <Modal
        close={() => {
          setSelectedOptionsM(0);
          dispatch(Features.hideModal());
        }}
      >
        <table width="100%" style={{ height: "400px" }}>
          <tbody>
            <tr>
              <td width="50%" style={{ verticalAlign: "top" }}>
                <Select
                  id="state"
                  name="state"
                  value={selectedOptionsM}
                  /* isClearable={selectedOptionsM.some((v) => !v.isFixed)} */
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: "14px",
                    }),
                    option: (baseStyles, { isFocused }) => ({
                      ...baseStyles,
                      fontSize: "14px",
                      color: isFocused ? "white" : "black",
                    }),
                    multiValue: (base, state) => {
                      return state.data.isFixed
                        ? { ...base, backgroundColor: "gray" }
                        : base;
                    },
                    multiValueLabel: (base, state) => {
                      return state.data.isFixed
                        ? {
                          ...base,
                          fontWeight: "bold",
                          color: "white",
                          paddingRight: 6,
                        }
                        : base;
                    },
                    multiValueRemove: (base, state) => {
                      return state.data.isFixed
                        ? { ...base, display: "none" }
                        : base;
                    },
                  }}
                  theme={(theme) => ({
                    ...theme,
                    fontSize: "14px",
                    colors: {
                      ...theme.colors,
                      primary25: "#1967D2",
                    },
                  })}
                  ref={stateRefM}
                  onChange={handleSelectChangeM}
                  closeMenuOnSelect={false}
                  isMulti
                  options={stateListM}
                />
              </td>
              <td width="50%" style={{ verticalAlign: "top" }}>
                <button
                  className="btn btn-success"
                  onClick={updateStateAssignment}
                >
                  ASSIGN
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ verticalAlign: "top" }}>
                {selectedActivityFullDetails?.activity_details?.id && (
                  <Fragment>
                    <h6
                      style={{
                        background: "yellow",
                        padding: "5px",
                        fontWeight: "bolder",
                      }}
                    >
                      Summary
                    </h6>
                    <table className="table table-bordered" width="100%">
                      <tr>
                        <td>SCHEME NAME</td>
                        <td>
                          <strong>
                            <em>
                              {
                                selectedActivityFullDetails?.activity_details
                                  .scheme_name
                              }
                            </em>
                          </strong>
                        </td>
                        <td>MAJOR COMPONENT NAME</td>
                        <td>
                          <strong>
                            <em>
                              {
                                selectedActivityFullDetails?.activity_details
                                  .major_component_name
                              }
                            </em>
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td>SUB COMPONENT NAME</td>
                        <td>
                          <strong>
                            <em>
                              {
                                selectedActivityFullDetails?.activity_details
                                  .sub_component_name
                              }
                            </em>
                          </strong>
                        </td>
                        <td>ACTIVITY NAME</td>
                        <td>
                          <strong>
                            <em>
                              {
                                selectedActivityFullDetails?.activity_details
                                  .activity_master_name
                              }
                            </em>
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td>ACTIVITY MASTER DETAIL</td>
                        <td>
                          <strong>
                            <em>
                              {
                                selectedActivityFullDetails?.activity_details
                                  .activity_master_details_name
                              }
                            </em>
                          </strong>
                        </td>
                        <td>COMPONENT TYPE</td>
                        <td>
                          <strong>
                            <em>
                              {+selectedActivityFullDetails?.activity_details
                                .component_type === 2
                                ? "STATE"
                                : "DISTRICT"}
                            </em>
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td>RECURING/NONRECURING</td>
                        <td>
                          <strong>
                            <em>
                              {+selectedActivityFullDetails?.activity_details
                                .recuring_nonrecuring === 1
                                ? "Recuring"
                                : "Non Recuring"}
                            </em>
                          </strong>
                        </td>
                        <td>STATE SPECIFIC</td>
                        <td>
                          <strong>
                            <em>
                              {+selectedActivityFullDetails?.activity_details
                                .state_specfic_yn === 1
                                ? "YES"
                                : "NO"}
                            </em>
                          </strong>
                        </td>
                      </tr>
                    </table>
                  </Fragment>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>}
    </div>
  );
};

export default MasterActivityDetails;
