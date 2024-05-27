import axios from "axios";
import React, { Fragment } from "react";
import Helper from "../../../../../apps/utilities/helper";
import api from "../../../../../apps/utilities/api";
import { useRef } from "react";
import { useState, useMemo } from "react";
import Form from "../../../../../apps/components/form";
import { useEffect } from "react";
import sweetAlert from "../../../../../apps/utilities/sweetalert";
import { Link } from "react-router-dom";

const AdditionalStateProposal = () => {
  const schemesRef = useRef(0);
  const majorComponentsRef = useRef(0);
  const subComponentsRef = useRef(0);
  const activityRef = useRef(0);
  const recurringRef = useRef(0);
  const componentRef = useRef(0);
  const activityDetailsRef = useRef(0);
  const physicalQuantityRef = useRef(0);
  const unitCostRef = useRef(0);
  const financialAmountRef = useRef(0);
  const stateRef = useRef(0);
  const interventionRef = useRef("");

  const [schemes, setSchemes] = useState([]);
  const [majorComponents, setMajorComponents] = useState([]);
  const [subComponents, setSubComponents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activitiesDetails, setActivitiesDetails] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [refresh, setRefresh] = useState(new Date().getMilliseconds());

  let userData = Helper.auth?.user;

  useEffect(() => {
    api.get("api/states/list", null, (res) => {
      setStateList(res?.data);
    });
  }, [refresh]);

  const handleChange = (e) => {
    const val = +e.target.value;
    const name = e.target.name;
    const state_id = stateRef?.current?.value || 0;
    const scheme_id = schemesRef?.current?.value || 0;
    const major_component_id = majorComponentsRef?.current?.value || 0;
    const sub_component_id = subComponentsRef?.current?.value || 0;
    const activity_master_id = activityRef?.current?.value || 0;
    const activity_master_detail_id = activityDetailsRef?.current?.value || 0;

    if (name === "state") {
      api.post(
        "api/prabandh/additional-state-proposal-filter",
        { get: "schemes", state_id: state_id },
        (res) => {
          setSchemes(res?.data);
        }
      );
    } else if (name === "schemes") {
      api.post(
        "api/prabandh/additional-state-proposal-filter",
        { get: "major_component", state_id: state_id, scheme_id: scheme_id },
        (res) => {
          setMajorComponents(res?.data);
        }
      );
    } else if (name === "major_components") {
      api.post(
        "api/prabandh/additional-state-proposal-filter",
        {
          get: "sub_component",
          state_id: state_id,
          scheme_id: scheme_id,
          major_component_id: major_component_id,
        },
        (res) => {
          setSubComponents(res?.data);
        }
      );
    } else if (name === "sub_components") {
      api.post(
        "api/prabandh/additional-state-proposal-filter",
        {
          get: "activity",
          state_id: state_id,
          scheme_id: scheme_id,
          major_component_id: major_component_id,
          sub_component_id: sub_component_id,
        },
        (res) => {
          setActivities(res?.data);
        }
      );
    } else if (name === "activity") {
      api.post(
        "api/prabandh/additional-state-proposal-filter",
        {
          get: "activity_details",
          state_id: state_id,
          scheme_id: scheme_id,
          major_component_id: major_component_id,
          sub_component_id: sub_component_id,
          activity_master_id: activity_master_id,
        },
        (res) => {
          setActivitiesDetails(res?.data);
        }
      );
    } else if (name === "activity_details") {
      api.post(
        "api/prabandh/additional-state-proposal-filter",
        {
          get: "saved_budget_data",
          state_id: state_id,
          scheme_id: scheme_id,
          major_component_id: major_component_id,
          sub_component_id: sub_component_id,
          activity_master_id: activity_master_id,
          pawpbd_id: activity_master_detail_id,
          user: userData,
        },
        (res) => {
          if (res?.data[0]) {
            physicalQuantityRef.current.value = 0;
            unitCostRef.current.value = 0;
            financialAmountRef.current.value = 0;
          }
        }
      );
    } else if (name === "physical_quantity") {
      const pq = physicalQuantityRef?.current?.value || 0;
      const uq = unitCostRef?.current?.value || 0;
      const fq = Helper.numberFormatter(pq * uq, 5);
      financialAmountRef.current.value = fq;
    } else if (name === "unit_cost") {
      const pq = physicalQuantityRef?.current?.value || 0;
      const uq = unitCostRef?.current?.value || 0;
      const fq = Helper.numberFormatter(pq * uq, 5);
      financialAmountRef.current.value = fq;
    }
  };

  const handleSubmit = () => {
    const pawpbd_id = activityDetailsRef?.current?.value || 0;
    const physical_quantity = physicalQuantityRef.current.value || 0;
    const unit_cost = unitCostRef.current.value || 0;
    const financial_amount = financialAmountRef.current.value || 0;
    const activity_master_detail_id = activityDetailsRef?.current?.value || 0;
    const state_id = stateRef?.current?.value || 0;
    if (pawpbd_id !== 0) {
      if (
        physical_quantity !== 0 &&
        unit_cost !== 0 &&
        financial_amount !== 0
      ) {
        api.post(
          "api/prabandh/additional-state-proposal-filter",
          {
            get: "update_budget_data",
            state_id: state_id,
            pawpbd_id: pawpbd_id,
            physical_quantity: physical_quantity,
            unit_cost: unit_cost,
            financial_amount: financial_amount,
            user: userData,
          },
          (res) => {
            sweetAlert.done({ msg: `Data saved successfully.` });
            schemesRef.current.value = 0;
            majorComponentsRef.current.value = 0;
            subComponentsRef.current.value = 0;
            activityRef.current.value = 0;
            stateRef.current.value = 0;
            activityDetailsRef.current.value = 0;
            physicalQuantityRef.current.value = "";
            unitCostRef.current.value = "";
            financialAmountRef.current.value = "";
          }
        );
      } else {
        sweetAlert.warning(`Kindly Enter Valid Data`);
      }
    }
  };

  const handleReset = () => {
    schemesRef.current.value = 0;
    majorComponentsRef.current.value = 0;
    subComponentsRef.current.value = 0;
    activityRef.current.value = 0;
    stateRef.current.value = 0;
    activityDetailsRef.current.value = 0;
    physicalQuantityRef.current.value = "";
    unitCostRef.current.value = "";
    financialAmountRef.current.value = "";
  };

  const tempStateConfig = () => {
    if (+stateRef.current.value !== 0) {
      api.post(
        "api/prabandh/tempconfig",
        {
          districtid: 0,
          stateid: stateRef.current.value,
          type: "state",
        },
        (res) => {
          sweetAlert.done({ msg: `State Configured Successfully.` });
        }
      );
    } else {
      sweetAlert.warning(`Kindly select state`);
    }
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>Additional State Proposal</h1>
      </div>
      <div className="dashboard-main-content-info mb-3">
        <div className="row">
          <div className="mb-2 col-md-4 mb-2">
            <Form.Select
              options={stateList}
              attr={{
                ref: stateRef,
                id: "state",
                name: "state",
                onChange: handleChange,
              }}
              label="State"
              mandatory={true}
              default="Select State"
            />
          </div>
          <div className="mb-2 col-md-4 mb-2">
            <Form.Select
              options={schemes}
              attr={{
                ref: schemesRef,
                id: "schemes",
                name: "schemes",
                onChange: handleChange,
              }}
              label="Scheme"
              mandatory={true}
              default="Scheme"
            />
          </div>
          <div className="mb-2 col-md-4 mb-2">
            <Form.Select
              options={majorComponents}
              attr={{
                ref: majorComponentsRef,
                id: "major_components",
                name: "major_components",
                onChange: handleChange,
              }}
              label="Major Component"
              mandatory={true}
              default="Major Component"
            />
          </div>
          <div className="mb-2 col-md-4 mb-2">
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
          <div className="mb-2 col-md-4 mb-2">
            <Form.Select
              options={activitiesDetails}
              attr={{
                ref: activityDetailsRef,
                id: "activity_details",
                name: "activity_details",
                onChange: handleChange,
              }}
              label="Activity Details"
              mandatory={true}
              default="Activity Details"
            />
          </div>
   
          <div className="mb-2 col-md-4 mb-2">
            <Form.Number
              attr={{
                ref: physicalQuantityRef,
                id: "physical_quantity",
                name: "physical_quantity",
                onChange: handleChange,

                maxLength: 10,
              }}
              label="Physical Quantity"
              mandatory={true}
            />
          </div>
          <div className="mb-2 col-md-4 ">
            <Form.Number
              attr={{
                ref: unitCostRef,
                id: "unit_cost",
                name: "unit_cost",
                onChange: handleChange,
                onKeyDown: (e) => {
                  Helper.validateNumberInput(e, 5, 0);
                },
                maxLength: 10,
              }}
              label="Unit Cost"
              mandatory={true}
            />
          </div>
          <div className="mb-2 col-md-4">
            <Form.Number
              attr={{
                ref: financialAmountRef,
                id: "financial_amount",
                name: "financial_amount",
                onChange: handleChange,
                maxLength: 20,
                disabled: "true",
              }}
              label="Financial Amount"
              mandatory={true}
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
          Save
        </Form.Button>
        <Form.Button
          button={{
            type: "submit",
            className: "btn btn-secondary reset bg-danger",
            onClick: handleReset,
          }}
          style={{}}
          className="btn btn-secondary reset bg-danger"
        >
          Reset
        </Form.Button>
      </div>

      <div className="row">
        <p className="text-black" style={{ fontSize: "16px" }}>
          👉 If Intervention not found then{" "}
          <Link to="/auth/prabandh/master/activity" className="text-primary">
            <em>
              <u>add intervention</u>
            </em>{" "}
          </Link>
          <span className="text-danger" style={{ fontSize: "small" }}>
            (select component type state there)
          </span>{" "}
          in master data after that{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={tempStateConfig}
          >
            <em>
              <u>click here</u>
            </em>
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default AdditionalStateProposal;
