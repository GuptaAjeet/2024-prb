import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Helper } from "../../../apps";
import api from "../../../apps/utilities/api";
import Features from "../../../redux/features";
import { AgGridReact } from "ag-grid-react";
import NumberInput from "../../../apps/components/form/NumberInput";

const DietStatusOfPreCredentials = (props) => {
  const user = Helper.auth.user;
  const dispatch = useDispatch();
  const gridRef = useRef();

  const [dataList, setDataList] = useState([]);
  const [dietPreCrede, setDietPreCrede] = useState({
    teaching_sanctioned_post: 0,
    teaching_filled: 0,
    teaching_vacant: 0,
    non_teaching_sanctiond_post: 0,
    non_teaching_filled: 0,
    non_teaching_vacant: 0,
    room_allocated_for_ball_vatica: false,
    room_allocated_for_skill_lab: false,
  });

  const getlist = () => {
    api.get("api/prabandh/diet-pre-credential-list", null, (res) => {
      if (res.status) {
        setDataList(res.data);
      }
    })
  }

  useEffect(() => {
    if (user.diet_id) {
      api.get("api/prabandh/diet-pre-credential", null, (res) => {
        if (res.status) {
          if (res.data) {
            setDietPreCrede(res.data);
          }
        }
      })
    }
    getlist();
  }, [])

  const onFormSubmit = () => {
    if (+dietPreCrede.non_teaching_sanctiond_post < +dietPreCrede.non_teaching_filled || +dietPreCrede.teaching_sanctioned_post < +dietPreCrede.teaching_filled) {
      dispatch(Features.showToast({ message: "Filled not be grater then Sanctioned Post.", flag: "bg-danger" }));
    } else {
      api.post("api/prabandh/save-diet-pre-credential", { ...dietPreCrede }, (res) => {
        if (res.status) {
          dispatch(Features.showToast({ message: res.message }));

        } else {
          dispatch(Features.showToast({ message: res.message, flag: "bg-danger" }));
        }
      })
    }
  }

  const inputHandel = (e) => {
    setDietPreCrede(prevState => {
      prevState[e.target.name] = (e.target.type === "checkbox" ? e.target.checked : e.target.value);
      console.log("prevState", prevState)
      return { ...prevState };
    })
  }

  const onBtExport = useCallback(() => {
    const fileName = `DIET_PreCredentials_Status_` + Date.now().toString();
    const sheetName = 'Sheet 1'
    gridRef.current.api.exportDataAsExcel({
      processCellCallback: function (params) {
        if (params.column.colDef.headerName === 'DIET') {
          const combinedValue = `${params.node.data.diet_name} (${params.node.data.diet_code})`;
          return combinedValue; // Return the combined value for 'DIET'
        } else if (params.column.colDef.headerName === 'One Room Allocated for Ball Vatika') {
          const originalValue = params.value;
          return +originalValue ? "Yes" : "No"
        } else if (params.column.colDef.headerName === 'One Room Allocated for Skill Lab') {
          const originalValue = params.value;
          return +originalValue ? "Yes" : "No"
        } else {
          return params.value;
        }
      },
      fileName, sheetName
    });
  }, []);

  const excelStyles = useMemo(() => {
    return [
      {
        id: "cell",
        alignment: {
          vertical: "Center",
          horizontal: "Left",
        },
        borders: {
          borderBottom: {
            color: "#ffab00",
            lineStyle: "Continuous",
            weight: 6,
          },
        },
        font: {
          size: 10,
        },
      },
      {
        id: "report_header",
        alignment: {
          vertical: "Center",
          horizontal: "Center",
        },
        font: {
          color: "#000000",
          bold: true,
          size: 16,
        },
        interior: {
          color: "#ffffff",
          pattern: "None",
          patternColor: "#000000",
        },
      },
    ];
  }, []);

  return (
    <div className="dashboard-main-content">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></div>
      <div className="row">
        <div className="dashboard-main-content__header d-flex justify-content-between col-md-10">
          <h1 className="mb-2">DIET - CoE - Status of Pre-Credentials</h1>
        </div>

        <div className="col-md-2 mb-2 text-end">
          <button type="button" className="btn btn-success float-end" disabled={dataList && dataList.length > 0 ? false : true} onClick={onBtExport} >
            <i className="bi bi-file-earmark-excel"></i>{" "}
            <span className="mobile-hide">Export To</span> Excel
          </button>
        </div>
      </div>

      <div>

        <div className="row ">

          {!!user.diet_id && <div className="col-sm-12 dashboard-main-content-info ">
            <div className="row p-2">
              {/* <h5>Vacant Position</h5> */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Category of Post</th>
                    <th>Sanctioned Post</th>
                    <th>Filled </th>
                    <th>Vacant </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Teaching Post</td>
                    <td><NumberInput decimal={false} name="teaching_sanctioned_post" currentValue={dietPreCrede?.teaching_sanctioned_post} onChange={inputHandel} /></td>
                    <td><NumberInput decimal={false} name="teaching_filled" currentValue={dietPreCrede?.teaching_filled} onChange={inputHandel} /></td>
                    <td><NumberInput disabled decimal={false} name="teaching_vacant" currentValue={dietPreCrede?.teaching_sanctioned_post - dietPreCrede?.teaching_filled} onChange={inputHandel} /></td>
                  </tr>
                  <tr>
                    <td>Non-Teaching Post</td>
                    <td><NumberInput decimal={false} name="non_teaching_sanctiond_post" currentValue={dietPreCrede?.non_teaching_sanctiond_post} onChange={inputHandel} /></td>
                    <td><NumberInput decimal={false} name="non_teaching_filled" currentValue={dietPreCrede?.non_teaching_filled} onChange={inputHandel} /></td>
                    <td><NumberInput disabled decimal={false} name="non_teaching_vacant" currentValue={dietPreCrede?.non_teaching_sanctiond_post - dietPreCrede?.non_teaching_filled} onChange={inputHandel} /></td>
                  </tr>
                  <tr style={{ lineHeight: "2px" }}>
                    <td colSpan={4}>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>One Room Allocated for Ball Vatika</td>
                    <td><input className="" type="checkbox" name="room_allocated_for_ball_vatica" checked={dietPreCrede?.room_allocated_for_ball_vatica} onChange={inputHandel} /></td>
                    <td>One Room Allocated for Skill Lab</td>
                    <td><input className="" type="checkbox" name="room_allocated_for_skill_lab" checked={dietPreCrede?.room_allocated_for_skill_lab} onChange={inputHandel} /></td>
                  </tr>
                </tbody>
              </table>

              <div className="text-end">
                <input type="button" className="form-control btn btn-primary w-auto pe-3 ps-3" id="save-btn"
                  onClick={() => {
                    onFormSubmit();
                  }}
                  value={"Save"}
                />
              </div>
            </div>
          </div>}

          {/* {!user.diet_id && <div className="col-sm-12 dashboard-main-content-info mt-3">
            <div className="">
              
                <div>
                  <div className="table-scroll-section">
                    <table className="table-scroll">
                      <thead>
                        <tr>
                          <th rowSpan={2}>S.no.</th>
                          <th rowSpan={2}>State</th>
                          <th rowSpan={2}>DIET</th>
                          <th colSpan={3}>Teaching Post</th>
                          <th colSpan={3}>Non-Teaching Post</th>
                          <th rowSpan={2}>One Room Allocated for Ball Vatika</th>
                          <th rowSpan={2}>One Room Allocated for Skill Lab</th>
                        </tr>
                        <tr>
                          <th>Sanctioned Post</th>
                          <th>Filled </th>
                          <th>Vacant </th>
                          <th>Sanctioned Post</th>
                          <th>Filled </th>
                          <th>Vacant </th>
                        </tr>
                      </thead>
                      <tbody>

                        
                        {dataList.length===0 ? <tr className="text-center">
                          <td colSpan={11} className="text-center">No data found</td>
                        </tr> : 
                        dataList.map((itm, i)=><tr key={i}>
                          <td>{i+1}</td>
                          <td>{itm.state_name}</td>
                          <td>{itm.diet_name} ({itm.diet_code})</td>
                          <td>{itm.teaching_sanctioned_post}</td>
                          <td>{itm.teaching_filled}</td>
                          <td>{itm.teaching_vacant}</td>
                          <td>{itm.non_teaching_sanctiond_post}</td>
                          <td>{itm.non_teaching_filled}</td>
                          <td>{itm.non_teaching_vacant}</td>
                          <td className="text-center">{itm.room_allocated_for_ball_vatica ? "Yes" : "No"}</td>
                          <td className="text-center">{itm.room_allocated_for_skill_lab ? "Yes" : "No"}</td>
                        </tr>)}
                        
                      </tbody>
                    </table>
                  </div>
                </div>

            </div>
          </div>}  */}

          {!user.diet_id && <div style={{ height: "70vh", width: "100%" }} className={"ag-theme-alpine AS"} >
            <AgGridReact
              columnDefs={[
                {
                  headerName: "S. No.",
                  width: 92,
                  valueGetter: (params) => {
                    return params.node.rowIndex + 1;
                  },
                  headerClass: "report_header",
                },
                {
                  headerName: "State",
                  field: "state_name",
                  filter: "agMultiColumnFilter",
                  headerClass: "report_header",
                },
                {
                  headerName: "DIET",
                  filter: "agMultiColumnFilter",
                  width: 250,
                  cellRenderer: function StatusRenderer(params) { return `${params.data.diet_name} (${params.data.diet_code})` },
                  headerClass: "report_header",
                },
                {
                  headerName: "Teaching Post",
                  field: "initiated",
                  filter: "agMultiColumnFilter",
                  headerClass: "report_header",
                  children: [
                    {
                      headerName: "Sanctioned Post",
                      field: "teaching_sanctioned_post",
                      filter: "agMultiColumnFilter",
                      headerClass: "report_header",
                    },
                    {
                      headerName: "Filled",
                      field: "teaching_filled",
                      filter: "agMultiColumnFilter",
                      headerClass: "report_header",
                    },
                    {
                      headerName: "Vacant",
                      field: "teaching_vacant",
                      filter: "agMultiColumnFilter",
                      headerClass: "report_header",
                    }
                  ]
                },
                {
                  headerName: "Non-Teaching Post",
                  field: "recomended",
                  filter: "agMultiColumnFilter",
                  headerClass: "report_header",
                  children: [
                    {
                      headerName: "Sanctioned Post",
                      field: "non_teaching_sanctiond_post",
                      filter: "agMultiColumnFilter",
                      headerClass: "report_header",
                    },
                    {
                      headerName: "Filled",
                      field: "non_teaching_filled",
                      filter: "agMultiColumnFilter",
                      headerClass: "report_header",
                    },
                    {
                      headerName: "Vacant",
                      field: "non_teaching_vacant",
                      filter: "agMultiColumnFilter",
                      headerClass: "report_header",
                    }
                  ]
                },
                {
                  headerName: "One Room Allocated for Ball Vatika",
                  field: "recomended",
                  filter: "agMultiColumnFilter",
                  cellRenderer: function StatusRenderer(params) { return +params.data.room_allocated_for_ball_vatica ? "Yes" : "No" },
                  headerClass: "report_header",
                },
                {
                  headerName: "One Room Allocated for Skill Lab",
                  field: "recomended",
                  filter: "agMultiColumnFilter",
                  cellRenderer: function StatusRenderer(params) { return +params.data.room_allocated_for_skill_lab ? "Yes" : "No" },
                  headerClass: "report_header",
                }]}
              defaultColDef={{
                floatingFilter: true,
                sortable: true,
                resizable: true,
              }}
              ref={gridRef}
              rowData={dataList}
              onGridReady={(params) => {
                setTimeout(() => {
                  params.api.sizeColumnsToFit();
                }, 500)
              }}
              animateRows={true}
              rowSelection="multiple"
              suppressRowClickSelection={true}
              excelStyles={excelStyles}
              pagination={false}
            />
          </div>}

        </div>



      </div>


    </div>
  );
};

export default DietStatusOfPreCredentials;
