import React, { useEffect, Fragment, useState } from "react";
import api from "../../../../apps/utilities/api";
import { useSelector, useDispatch } from "react-redux";
import { Hook, Table, Helper, Column, Settings } from "../../../../apps";
import Features from "../../../../redux/features";
import { Modal } from "../../../../apps/components/elements";
import { useLocation } from "react-router-dom";
import Spinner from "../../../../apps/components/elements/Spinner";

const SchoolConfigurator = () => {
  const user = Helper.auth.user;
  const dispatch = useDispatch();
  const location = useLocation();
  const [parentPage, setParentPage] = useState("");
  const handler = useSelector((state) => state.handler);
  const [activeSchool, setActiveSchool] = useState({});
  const [formFieldsList, setFormFieldsList] = useState({});
  const [finalData, setFinalData] = useState([]);
  const [spin, setSpin] = useState(false);

  const object = Hook.usePost({
    url: "api/schools/paged",
    data: {
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      district_id: user.user_district_id,
      year: new Date().getFullYear(),
      state_id: user.user_state_id,
      get:
        location.search === "?p=1"
          ? "Major Component"
          : location.search === "?p=2"
          ? "KGBV"
          : location.search === "?p=3"
          ? "Netaji Shubhash"
          : null,
      where: handler?.where,
    },
  });
  let rows = [];

  useEffect(() => {
    let pg = "";
    if (location.search === "?p=1") {
      setParentPage("Major Component");
      pg = "Major Component";
    } else if (location.search === "?p=2") {
      setParentPage("KGBV");
      pg = "KGBV";
    } else if (location.search === "?p=3") {
      setParentPage("Netaji Shubhash");
      pg = "Netaji Shubhash";
    }
    dispatch(
      Features.makeHandler({
        page: 1,
        limit: 10,
        reload: new Date().getTime(),
        district_id: user.user_district_id,
        year: new Date().getFullYear(),
        state_id: user.user_state_id,
        get: pg,
        where: "",
      })
    );
  }, [location.search]);

  const buildInputFormFields = (data) => {
    if (parentPage === "KGBV") {
      let kgbvObj = data;
      [
        "ele_additional_class_room",
        "ele_boys_toilet",
        "ele_girls_toilet",
        "ele_drinking_water",
        "ele_boundary_wall",
        "ele_electrification",
        "ele_handrails",
        "ele_cwsn_toilet",
        "ele_major_repair",
        "ele_furniture",
        "ele_ramps_handrails",
        "ele_solar_panel",
        "ele_incinerator_machine",
        "c_ele_upgradation_ps_ups",
        "c_ele_buildingless",
        "c_ele_dilapidated_building",
        "c_ele_smart_class_room",
        "c_additional_ict_lab",
        "c_ele_digital_hardware_software",
        "c_ele_child_friendly_furniture",
        "c_ele_bala_feature",
        "c_ele_outdoor_play_material",
      ].forEach((r) => {
        delete kgbvObj[r];
      });
      setFormFieldsList(kgbvObj);
    } else if (parentPage === "Major Component") {
      let mjcObj = data;
      [
        "ele_kgbv_construction_building",
        "ele_kgbv_boundary_wall",
        "ele_kgbv_boring_handpump",
        "ele_kgbv_furniture_equip_kitchen",
        "ele_kgbv_tlm_library_books",
        "ele_kgbv_bedding",
        "ele_kgbv_incinerator",
        "ele_kgbv_replace_bedding",
        "ele_kgbv_vending_machine",
      ].forEach((r) => {
        delete mjcObj[r];
      });
      setFormFieldsList(mjcObj);
    } else if (parentPage === "Netaji Shubhash") {
      let nsObj = data;
      [
        "ele_kgbv_construction_building",
        "ele_kgbv_boundary_wall",
        "ele_kgbv_boring_handpump",
        "ele_kgbv_furniture_equip_kitchen",
        "ele_kgbv_tlm_library_books",
        "ele_kgbv_bedding",
        "ele_kgbv_incinerator",
        "ele_kgbv_replace_bedding",
        "ele_kgbv_vending_machine",
      ].forEach((r) => {
        delete nsObj[r];
      });
      setFormFieldsList(nsObj);
    }
  };

  const getActivityData = (aSchool) => {
    setActiveSchool({});
    setFormFieldsList({});
    setSpin(true);
    setTimeout(() => {
      setActiveSchool(aSchool);
      buildInputFormFields(aSchool);
      setSpin(false);
    }, 500);
    if (aSchool) {
      dispatch(
        Features.showModal({
          title: "Activity-Schools Selection",
          size: "fullscreen",
        })
      );
    }
  };
  const openModel = (event, data) => {
    getActivityData(data);
  };

  const checkObjectProperties = (obj) => {
    const propertiesToCheck = Object.keys(obj).filter(
      (key) => Settings.isDataNotExistsInArray(["row_number", "id", "name"], key)
    );
    const isFilled = propertiesToCheck.some((key) => obj[key] !== null);
    return isFilled ? (
      <button className="t-status-btn waiting">FINALIZED</button>
    ) : (
      <button className="t-status-btn not-initiated">NOT INITIATED</button>
    );
  };

  object?.data?.data.map((row, i) => {
    return (rows[i] = {
      row_number: row.row_number,
      id: row.id,
      name: row.name,
      state: user.state_name?.toUpperCase(),
      district: user.district_name?.toUpperCase(),
      summary: checkObjectProperties(row),
      action: (
        <div className="text-center" key={`configure_${i + 1}`}>
          <button
            className="btn btn-sm btn-success"
            onClick={(e) => openModel(e, row)}
            data-id={row.id}
          >
            CONFIGURE
          </button>
        </div>
      ),
    });
  });

  const handleChange = (e, data) => {
    if (e.target.checked) {
      setFinalData({ ...finalData, [data]: 1 });
    } else {
      delete finalData[data];
      setFinalData({ ...finalData });
    }
  };

  const handleInput = (e, data) => {
    if (e.target.value !== "") {
      const prevData = finalData;
      prevData[data] = e.target.value;
      setFinalData({ ...prevData });
    }
  };

  const filterThis = (e) => {
    dispatch(
      Features.makeHandler({
        reload: new Date().getTime(),
        where: [
          {
            condition: "like",
            columns: ["school_name", "udise_sch_code"],
            value: e.target.value,
          },
        ],
      })
    );
  };

  const saveSchoolAssignment = () => {
    api.post(
      "api/prabandh/school-activity",
      {
        state_id: user.user_state_id,
        district_id: user.user_district_id,
        form_data: finalData,
        school_data: activeSchool,
      },
      (res) => {
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
          })
        );
        dispatch(
          Features.showToast({
            message: "Data saved successfully.",
            flag: "success",
          })
        );
      }
    );
  };

  const generateLabel = (str = "") => {
    const labelMap = {
      ele_additional_class_room: "Additional Class Room",
      ele_boys_toilet: "Boys Toilet",
      ele_girls_toilet: "Girls Toilet",
      ele_drinking_water: "Drinking Water",
      ele_boundary_wall: "Boundary Wall",
      ele_electrification: "Electrification",
      ele_handrails: "Handrails",
      ele_cwsn_toilet: "CWSN Toilet",
      ele_major_repair: "Major Repair",
      ele_furniture: "Furniture",
      ele_ramps_handrails: "Ramps Handrails",
      ele_solar_panel: "Solar Panel",
      ele_incinerator_machine: "Incinerator Machine",
      ele_vending_machine: "Vending Machine",
      c_ele_upgradation_ps_ups: "Upgradation PS UPS",
      c_ele_buildingless: "Buildingless",
      c_ele_dilapidated_building: "Dilapidated Building",
      c_ele_smart_class_room: "Smart Class Room",
      c_additional_ict_lab: "ICT Lab",
      c_ele_digital_hardware_software: "Hardware Software",
      c_ele_child_friendly_furniture: "Child Friendly Furniture",
      c_ele_bala_feature: "Bala Feature",
      c_ele_outdoor_play_material: "Outdoor Play Material",
      ele_kgbv_construction_building: "Construction Building",
      ele_kgbv_boundary_wall: "Boundary Wall",
      ele_kgbv_boring_handpump: "Boring Handpump",
      ele_kgbv_furniture_equip_kitchen: "Furniture Equip Kitchen",
      ele_kgbv_tlm_library_books: "TLM Library Books",
      ele_kgbv_bedding: "Bedding",
      ele_kgbv_incinerator: "Incinerator",
      ele_kgbv_replace_bedding: "Replace Bedding",
      ele_kgbv_vending_machine: "Vending Machine",
    };

    return labelMap[str] || str;
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3 w-100 float-start">
        <h1 className="float-start">Select Schools: {parentPage}</h1>
      </div>

      <div className="col-md-12 pb-2">
        <div className="dashboard-main-content-info clear">
          <div className="row p-3">
            {object && (
              <Fragment>
                <Table
                  object={{
                    columns: Column.schoolsConfiguratorList(),
                    data: rows,
                    count: object?.data?.count || 0,
                    search: true,
                    handleChange: filterThis,
                  }}
                />
              </Fragment>
            )}
          </div>
        </div>
      </div>
      <Modal>
        <div className="row p-1">
          {spin ? (
            <Spinner />
          ) : (
            activeSchool && (
              <Fragment>
                <h6
                  style={{
                    background: "#042a61",
                    color: "#fff",
                    padding: "10px",
                  }}
                >{`SCHOOL: ${activeSchool.name} | UDISE CODE: ${activeSchool.id}`}</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th colSpan={3} width="50%">
                        INPUT FIELDS
                      </th>
                      <th colSpan={3} width="50%">
                        CHECKBOX FIELDS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={3} style={{ verticalAlign: "top" }}>
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>S.NO</th>
                              <th>Activity</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              let rowCounter = 1;
                              return Object.keys(formFieldsList).map(
                                (as, idx) =>
                                  Settings.isDataNotExistsInArray([
                                    "row_number",
                                    "id",
                                    "name",
                                    "applicable_yn",
                                  ], as) &&
                                  as.split("_")[0] !== "c" && (
                                    <tr key={`i_${as}`}>
                                      <td>{rowCounter++}</td>
                                      <td>{generateLabel(as)}</td>
                                      <td>
                                        <input
                                          className="form-control"
                                          type="number"
                                          name={`txt_${as}`}
                                          id={`txt_${as}`}
                                          onInput={(e) => handleInput(e, as)}
                                          defaultValue={formFieldsList[as]}
                                        />
                                      </td>
                                    </tr>
                                  )
                              );
                            })()}
                          </tbody>
                        </table>
                      </td>
                      <td colSpan={3} style={{ verticalAlign: "top" }}>
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>S.NO</th>
                              <th>Activity</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              let rowCountero = 1;
                              return Object.keys(formFieldsList).map(
                                (as, idx) =>
                                  Settings.isDataNotExistsInArray([
                                    "row_number",
                                    "id",
                                    "name",
                                    "applicable_yn",
                                  ], as) &&
                                  as.split("_")[0] === "c" && (
                                    <tr key={`c_${as}`}>
                                      <td>{rowCountero++}</td>
                                      <td>{generateLabel(as)}</td>
                                      <td>
                                        <div className="form-check form-switch">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`flexSwitchCheckDefault_${as}`}
                                            onChange={(e) =>
                                              handleChange(e, as)
                                            }
                                            defaultChecked={
                                              formFieldsList[as] === "1"
                                                ? true
                                                : false
                                            }
                                          />
                                        </div>
                                        {/* <input
                                          type="checkbox"
                                          name={`chk_${as}`}
                                          id={`chk_${as}`}
                                          onChange={(e) => handleChange(e, as)}
                                          defaultChecked={
                                            formFieldsList[as] === "1"
                                              ? true
                                              : false
                                          }
                                        /> */}
                                      </td>
                                    </tr>
                                  )
                              );
                            })()}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="row">
                  <div className="col-lg-11"></div>
                  <div className="col-lg-1">
                    <button
                      className="btn btn-success"
                      onClick={saveSchoolAssignment}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Fragment>
            )
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SchoolConfigurator;
