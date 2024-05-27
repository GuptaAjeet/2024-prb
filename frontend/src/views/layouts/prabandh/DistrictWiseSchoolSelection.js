import { useEffect, useRef, useState, Fragment } from "react";
import { Hook} from "../../../apps";
import Features from "../../../redux/features";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../apps/utilities/api";

const DistrictWiseSchoolSelection = (props) => {
  const dispatch = useDispatch();
  const handler = useSelector((state) => state.handler);
  const [ setSchoolObject] = useState({ row: [], count: 0 });
  const [block, setBlock] = useState();
  const selsch = useRef();
  const [finalArray, setFinalArray] = useState([]);
  const [ setCheckboxes] = useState({});

  const object = Hook.usePost({
    url: `api/schools/paged`,
    data: {
      block_id: selsch?.current?.value,
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
    },
  });
  let rows = [];

  useEffect(() => {
    dispatch(
      Features.makeHandler({
        page: 1,
        limit: 2000,
        reload: 1,
      })
    );
  }, []);

  const getSchools = (e) => {
    setBlock(e.target.value);

    api.post(
      `api/schools/paged`,
      {
        block_id: e.target.value,
        page: handler.page,
        limit: handler.limit,
        reload: handler.reload,
      },
      (res) => {
        setSchoolObject({ row: res.data.data, count: res.data.count });
      }
    );
  };

  const handleCheckboxChange = (e, val) => {
    const checkboxId = e.target.getAttribute("data-id");
    const isChecked = e.target.checked;

    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [checkboxId]: isChecked,
    }));

    if (isChecked) {
      setFinalArray((prevArray) => [
        ...prevArray,
        { id: checkboxId, action: "Add" },
      ]);
    } else {
      setFinalArray((prevArray) => [
        ...prevArray,
        { id: checkboxId, action: "Del" },
      ]);
    }
  };

  if (object !== null && object.data !== undefined) {
    object.data.data.map((row, i) => {
      return (rows[i] = {
        row_number: row.row_number,
        id: row.id,
        name: row.name,
        action: (
          <div className="text-center">

            <input
              className="form-check-input"
              type="checkbox"
              defaultChecked={row.applicable_yn === 1 ? true : false}
              data-id={row.id}
              id={`chk_${row.id}`}
              onClick={handleCheckboxChange}
            />
          </div>
        ),
      });
    });
  }

  const handleSave = () => {
    api.post(
      `api/schools/bdgt_selected_schools`,
      {
        block_id: block,
        params: props.initParms,
        schools_list: finalArray,
        activityMasterDetail: props.activityMasterDetail,
        user_data: props.userData,
      },
      (res) => {
        //console.log("RES:", res);
      }
    );
  };

  return (
    <div className="dashboard-main-content-no-padding">
      <div className="dashboard-main-content__header mb-3">
        <h1>Blocks / Schools Selection</h1>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <select
            className="form-select"
            name="blocks-list"
            onChange={getSchools}
            ref={selsch}
          >
            <option value={null}>Select Block</option>
            {props?.blocks?.map((b, idx) => {
              return (
                <option key={`bl_${idx}`} value={b.id}>
                  {b.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-md-10">
          {object && (
            <Fragment>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr style={{ width: "100%", display: "inline-table" }}>
                    <th style={{ width: "5%" }}>S.NO</th>
                    <th style={{ width: "25%" }}>UDISE CODE</th>
                    <th style={{ width: "65%" }}>SCHOOL NAME</th>
                    <th style={{ width: "5%" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {object?.data?.data.map((row, idx) => {
                    return (
                      <tr style={{ width: "100%", display: "inline-table" }}>
                        <td style={{ width: "5%" }}>{row.row_number}</td>
                        <td style={{ width: "25%" }}>{row.id}</td>
                        <td style={{ width: "65%" }}>{row.name}</td>
                        <td style={{ width: "5%" }}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultChecked={
                              row.applicable_yn === 1 ? true : false
                            }
                            data-id={row.id}
                            id={`chk_${row.id}`}
                            onClick={handleCheckboxChange}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Fragment>
          )}
        </div>
        <div className="col-md-2">
          {object && (
            <Fragment>
              <table className="table table-bordered table-striped modal-table">
                <thead>
                  <tr>
                    <th>Filters</th>
                  </tr>
                </thead>
                <tbody>
                  {object?.data?.data.map((row, idx) => {
                    if (idx < 10) {
                      return <tr></tr>;
                    }
                  })}
                </tbody>
              </table>
            </Fragment>
          )}
        </div>
      </div>
      <div className="row p-3 cfr">
        <button className="btn btn-success" onClick={handleSave}>
          <i className="bi bi-save"></i> Save
        </button>
      </div>
    </div>
  );
};

export default DistrictWiseSchoolSelection;
