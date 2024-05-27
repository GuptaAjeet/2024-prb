import React, { useEffect, useMemo, useRef, Fragment, useState } from "react";
import { Hook, Helper, Column } from "../../../../apps";
import Features from "../../../../redux/features";
import { useSelector, useDispatch } from "react-redux";
import "../../../../App.css";
import { format } from 'date-fns';
import { AgGridReact } from "ag-grid-react";
import exportToExcel from "../../../layouts/prabandh/PrabandhReports/ExcelReports";
import { LoggedUsersList as Grid } from "../../../../apps/utilities/GridHeaderColumns";
import printDoc from "../../../layouts/prabandh/PrabandhReports/PDFReports";

const LoggedUsersList = () => {
  const dispatch = useDispatch();
  const handler = useSelector((state) => state.handler);

  const [gridHeaders, setGridHeaders] = useState();

  let userData = Helper.auth?.user;

  useEffect(() => {
    dispatch(
      Features.makeHandler({
        page: 1,
        limit: 10,
        reload: 0,
        where: {},
      })
    );
  }, []);

  const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  const gridRef = useRef();

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const object = Hook.usePost({
    url: "api/admin-users/get-logged-users-data/",
    data: {
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      state_id: userData.user_role_id == 1 ? 0 : userData.user_state_id,
      district_id: userData.user_role_id === 1 || userData.user_role_id === 4 ? 0 : userData.user_district_id,
      role_id_1: userData.user_role_id,
      role_id_2: userData.user_role_id === 1 ? 12 : userData.user_role_id === 4 ? 7 : 11,
      where: { ...handler.where },
    },
  });
  if (object===null) {
setTimeout(()=>{
  dispatch(Features.showLoader());
},3700)

    dispatch(Features.hideLoader());
   }
  let rows = [];

  useEffect(() => {
    if (object?.data?.users && object?.data?.users.length > 0) {
      Grid.headers().then((res) => setGridHeaders(res));
    }
  }, [object]);

  const exportTableToExcel = async () => {
    exportToExcel("genericReport", {reportData: rows, headers: Column.loggedUsers(), sheeName: "Sheet 1", fileName: "User_log_data"})
  };

  if (object !== null && object?.data?.users !== undefined) {
    object?.data?.users.map((row, i) => {
      return (rows[i] = {
        srl: Helper.counter(++i, handler.limit, handler.page),
        user_name: Helper.ucfirst(row.user_name ? row.user_name : ""),
        user_mobile: row.user_mobile,
        user_email: row.user_email,
        user_role: row.role_name,
        designation: row.designation_title,
        district_name: row.district_name,
        state_name: row.state_name,
        logged_in: format(new Date(row.created_at), 'yyyy-MM-dd hh:mm a')
      });
    });
  }

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1 style={{display: 'inline-block'}}>User Logs</h1>

        <button
          type="button"
          className="btn btn-success float-end mx-2"
          onClick={exportTableToExcel}
        > <i className="bi bi-file-earmark-excel"></i> <span className="mobile-hide">Export To</span> Excel
        </button>

        <button
          type="button"
          className="btn btn-danger float-end mx-2"
          onClick={()=>printDoc(rows, 
            [
              {
                headerName: "Name",
                field: "user_name",
                filter: "agMultiColumnFilter",
                cellStyle: params => {
                  return { textAlign: 'left' };
                },
              },
              {
                headerName: "Mobile Number",
                field: "user_mobile",
                filter: "agMultiColumnFilter",
                width: 150,
                cellStyle: params => {
                  return { textAlign: 'left' };
                },
              },
              {
                headerName: "Email",
                field: "user_email",
                filter: "agMultiColumnFilter",
                cellStyle: params => {
                  return { textAlign: 'left' };
                },
              },
              {
                headerName: "Role",
                field: "user_role",
                filter: "agMultiColumnFilter",
                cellStyle: params => {
                  return { textAlign: 'left' };
                },
              },
              {
                headerName: "Designation",
                field: "designation",
                filter: "agMultiColumnFilter",
                cellStyle: params => {
                  return { textAlign: 'left' };
                },
              },
              {
                headerName: "District Name",
                field: "district_name",
                filter: "agMultiColumnFilter",
                cellStyle: params => {
                  return { textAlign: 'left' };
                }
              },
              {
                headerName: "State Name",
                field: "state_name",
                filter: "agMultiColumnFilter",
                cellStyle: params => {
                  return { textAlign: 'left' };
                }
              },
              {
                headerName: "Login Time",
                field: "logged_in",
                cellStyle: params => {
                  return { textAlign: 'left' };
                }
              }
            ], "UserLogs")}
        > <i className="bi bi-file-earmark-excel"></i> <span className="mobile-hide">Export To</span> PDF
        </button>

      </div>
      <div className="dashboard-main-content-info">
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          {object && (
            <Fragment>
              <div style={gridStyle} className={"ag-theme-alpine AS"}>
                <AgGridReact
                  ref={gridRef}
                  columnDefs={gridHeaders}
                  rowData={rows}
                  animateRows={true}
                  defaultColDef={defaultColDef}
                  checkboxSelection={false}
                  rowSelection={'single'}
                  pagination={true}
                  paginationPageSizeSelector={[10, 20, 50, 100]}
                  paginationPageSize={10}
                  paginationAutoPageSize={false}
                />
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoggedUsersList;
