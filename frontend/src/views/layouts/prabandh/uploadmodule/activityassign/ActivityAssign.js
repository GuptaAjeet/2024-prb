import React, { useState, useEffect } from "react";
 import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../../../apps/utilities/api";
import Spinner from "../../../../../apps/components/elements/Spinner";
import features from "../../../../../redux/features";
import { Column, Helper, Hook, Table } from "../../../../../apps";

export default function ActivityAssign() {
  // const [stateID, setStateID] = useState(0);
  const [scheme_id, setScheme_id] = useState(1);
  const [schemes, setSchemes] = useState([]);
  // const [actMasterDetailList, setActMasterDetailList] = useState([]);
  const [error, ] = useState({});
  // const [files, setFiles] = useState("");
  const [deletes, setDeletes] = useState([]);
  // const [checked, setChecked] = useState([]);
  // const [proposedDetail, setProposedDetail] = useState(null);
  // const [btnLoader, setBtnLoader] = useState(false);
  const [status, ] = useState(0);
  // const [uploaded_by_state, setUploaded_by_state] = useState(false);
  const [loading, ] = useState(false);
  // const [alldata, setAlldata] = useState(null)
  // const [filter, setFilter] = useState({
  //   state: "0",
  //   district: "0",
  //   scheme_id: "0",
  //   major_component_id: "0",
  //   sub_component_id: "0",
  //   activity_master_id: "0",
  //   activity_master_details_id: "0",
  //   allDistricts: false,
  // });

  // let userData = helper.auth?.user;
  const handler = useSelector((state) => state.handler);

  const dispatch = useDispatch();
  // const location = useLocation();

  useEffect(() => {
    $(".need_hide_footer").hide();
    api.post("api/prabandh/schemes", {}, (res) => {
      setSchemes(res.data);
    });
  }, []);
  // const generateCSV = () => {
  //     const data = [
  //         { "UDISE": 1, "PHYSICAL QUANTITY": 45, "FINANCIAL AMOUNT": 125 },
  //     ];
  //     const header = Object.keys(data[0]).join(',');
  //     const csvContent = `${header}\n${data.map(row => Object.values(row).join(',')).join('\n')}`;
  //     const blob = new Blob([csvContent], { type: 'text/csv' });
  //     const link = document.createElement('a');
  //     link.href = window.URL.createObjectURL(blob);
  //     link.download = 'upload_school_list_sample_template.csv';
  //     link.click();
  // };
  // const handleUpdateStatus = (id, status) => {
  //   api.post(
  //     "api/prabandh/update-approved-plan-asset-selection",
  //     {
  //       id,
  //       status: +status === 1 ? 0 : 1,
  //     },
  //     (data) => {
  //       if (data.status) {
  //         dispatch(features.showToast({ message: data.message }));
  //         dispatch(
  //           features.makeHandler({
  //             reload: new Date().getTime(),
  //             where: "",
  //           })
  //         );
  //       } else {
  //         dispatch(features.showToast({ message: data.message }));
  //       }
  //     }
  //   );
  // };
  const alldata = Hook.usePost({
    url: "api/prabandh/get-approved-plan-asset-selection",
    data: { scheme_id: scheme_id, where: handler?.where },
  });
  let rows = [];
  const handleCheckbox = (e, id) => {
    if (e.target.checked) {
      setDeletes((prevState) => {
        return [...prevState, id];
      });
    } else {
      setDeletes((prevState) => {
        return prevState.filter((p) => p !== id);
      });
    }
  };
  useEffect(() => {
    $(".need_hide_footer").hide();
    if (alldata) {
      const ids =
        alldata &&
        alldata?.data &&
        alldata?.data?.filter((c) => +c?.approved_plan_asset_selection === 1);
      const id = ids?.map((c) => c.id);
      setDeletes(id);
    }
  }, [alldata]);
  if (alldata) {
    rows =
      alldata &&
      alldata?.data &&
      alldata?.data?.map((row, i) => {
        return {
          srl: Helper.counter(++i, handler.limit, handler.page),
          // scheme_name: row.scheme_name,
          school_name: row.major_component_name,
          district_name: row.sub_component_name,
          physical_quantity: row.activity_master_name,
          financial_amount: row.activity_master_details_name,
          action: (
            <div className="text-center">
              <div className="text-center">
                <input
                  className="form-check-input"
                  disabled={+status === 6}
                  checked={deletes?.includes(row.id)}
                  style={{ border: "1px solid black" }}
                  type="checkbox"
                  value=""
                  id="flexCheckChecked"
                  onChange={(e) => handleCheckbox(e, row.id)}
                />
              </div>
            </div>
          ),
        };
      });
  }
  if (alldata===null) {
    dispatch(features.hideLoader());
   }
  const handleChange = (e) => {
    const { value } = e.target;
    setScheme_id(value);
  };
  // const handleSubmit = () => {};
  const handleCheckboxAll = (e) => {
    if (e.target.checked) {
      const ids = alldata?.data.map((c) => c.id);
      setDeletes(ids);
    } else {
      setDeletes([]);
    }
  };
  const handleSave = () => {
    api.post(
      "api/prabandh/bulkupdate-approved-plan-asset-selection",
      { scheme_id: scheme_id, update: deletes },
      (data) => {
        if (data.status) {
          dispatch(features.showToast({ message: data.message }));
        }
        dispatch(
          features.makeHandler({
            reload: new Date().getTime(),
            where: "",
          })
        );
      }
    );
  };
  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3 d-flex justify-content-between">
        <h1>List of Activities School is holdings</h1>
        {/* <Link to="/auth/prabandh/uploadeddoclist"
                    state={{
                        stateid: location.state?.stateid,
                        type: location.state?.type,
                        year: location.state.year
                    }}>  <button className='btn btn-primary'><i className="bi bi-arrow-left" /> Back</button></Link> */}
      </div>
      <div className="dashboard-main-content-info mb-3">
        <div className="row ">
          <div className="col-md-3">
            <label>Select Scheme</label>
            <select
              className="form-select"
              name="activity_master_details_id"
              value={scheme_id}
              onChange={(e) => {
                handleChange(e);
              }}
            >
              {schemes?.map((m, idx) => (
                <option key={`mc_${idx + 1}`} value={m.id}>
                  {m.scheme_name}
                </option>
              ))}
            </select>
            <label className="upload_add_label_font_size">
              {" "}
              {error?.activity_master_details_id}
            </label>
          </div>
          {/* <div className="col-md-3 flex-end"><button className='btn btn-success' onClick={handleSave}>Submit</button></div> */}
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        alldata && (
          <div className="dashboard-main-content-info w-100 float-start">
            {/* <button className='btn btn-danger float-end' onClick={handleSave}>Finalize</button> */}

            <div className="col-xl-12 col-lg-12 col-sm-12 ">
              {rows && (
                <Table
                  object={{
                    columns: Column.activityListforUpdateholding(),
                    data: rows,
                    count: alldata?.data?.length,
                    create: false,
                    search: false,
                    handleCheckboxAll: handleCheckboxAll,
                    checkbox_action: true,
                    deletes: deletes,
                    status: status,
                  }}
                />
              )}
            </div>
            <button
              className="btn btn-success float-end mt-3"
              onClick={handleSave}
              style={{ marginRight: "5px" }}
              disabled={!alldata?.data?.length}
            >
              Submit
            </button>
          </div>
        )
      )}
    </div>
  );
}
