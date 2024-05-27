import React, { useEffect, useMemo, useRef, useState } from "react";
import { Hook, Helper, API } from "../../../../apps";
import Features from "../../../../redux/features";
import { useSelector, useDispatch } from "react-redux";
import "../../../../App.css";
import axios from "axios";
import { REACT_APP_URL } from "../../../../env";
import Btnloader from "../../../../apps/components/elements/Btnloader";
import ConfirmationDialog from "../../../../apps/components/form/ConfirmationDialog";
import { AgGridReact } from "ag-grid-react";
import sweetAlert from "../../../../apps/utilities/sweetalert";
import customNoRowsOverlay from "./master/reports/childrens/customNoRowsOverlay";
import { UserManagementGrid } from "../../../../apps/utilities/GridHeaderColumns";
import { useNavigate, useLocation } from "react-router-dom";
import store from "../../../../redux/app/store";

//const View = lazy(() => import("./operate"));
// const SelectActivity = lazy(() => import("./selectActivity"));

const Users = () => {
  const [, setId] = useState(null);
  const [, setUserRoleId] = useState();
  const dispatch = useDispatch();
  const handler = useSelector((state) => state.handler);
  //  const model = useSelector((state) => state.modal);
  // const reduxObj = useSelector((state) => state.modal);
  // const [, setSearchQuery] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [submitData, setSubmitData] = useState({ user_status: "", id: "" });
  const [pagesize, setpagesize] = useState(10);
  const [s, setS] = useState(true);
  const [reloadPage, setReloadPage] = useState(Date.now());
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //  const [selectActivity, setSelectActivity] = useState(false);

  const gridStyle = useMemo(() => ({ height: "70vh", width: "100%" }), []);
  const gridRef = useRef();

  let userData = Helper.auth?.user;
  const navigate = useNavigate();
  const location = useLocation();

  const onGridReady = (params) => {
    setTimeout(() => {
      params.api.sizeColumnsToFit();
      const calRowPerPage = parseInt(params.api.gridBodyCtrl.eBodyViewport.offsetHeight / 41) //clientHeight;
      setpagesize(calRowPerPage);
      setRowsPerPage(calRowPerPage);
    }, 300)
  };

  useEffect(() => {
    dispatch(
      Features.makeHandler({
        page: 1,
        limit: 10000000,
        reload: Date.now(),
        where: Helper.whereObjSelector(userData),
      })
    );
  }, [reloadPage]);

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const object = Hook.usePost({
    url: "api/admin-users",
    data: {
      page: handler.page,
      limit: 10000000,
      reload: handler.reload,
      where: {
        user_district_id: userData?.user_district_id || 0,
        user_state_id: userData?.user_state_id || 0,
        user_role_id: userData?.user_role_id || 0,
      },
    },
  });


  if (object === null) {
    dispatch(Features.hideLoader());
  }

  let rows = [];

  const editHandler = (e) => {
    // let roleId = e.currentTarget.getAttribute("user_role_id");
    setS(false);
    setId(e.currentTarget.getAttribute("data-id"));
    setUserRoleId(e.currentTarget.getAttribute("user_role_id"));
    // setTimeout(() => {
    //   if (roleId === "3" || roleId === "2") {
    //     dispatch(Features.showModal({ title: "Update User" }));
    //   } else {
    //     dispatch(Features.showModal({ title: "Update User" }));
    //   }
    //   setS(true);
    // }, 200);

    navigate('/auth/admin/users', { state: { id: e.currentTarget.getAttribute("data-id"), userRoleId: e.currentTarget.getAttribute("user_role_id"), prevPath: location.pathname } });
  };

  const addHandler = (e) => {
    setS(false);
    setId(0);
    setUserRoleId();
    // setTimeout(() => {
    //   dispatch(Features.showModal({ title: "Add User", btntext: "Add User" }));
    //   setS(true);
    // }, 200);
    navigate('/auth/admin/users', { state: { id: 0, userRoleId: null, prevPath: location.pathname } });
  };

  const statusHandler = (status, id) => {
    sweetAlert.confirmation({
      title: "Are you sure?",
      msg: `You want to ${status === 1 ? "Inactive" : "Active"} this User.`,
      yesBtnText: "Yes",
      noBtnText: "No",
      url: "",
      callback: () => handleOnConfirm(status, id),
      redirect: "",
    });
  };

  const handleOnConfirm = (status, id) => {
    dispatch(Features.showLoader());
    API.post(
      "api/admin-users/update-status",
      { id: id, data: { user_status: status === 1 ? 0 : 1 } },
      (response) => {
        setIsOpen(false);
        dispatch(
          Features.makeHandler({
            page: 1,
            limit: 10000000,
            reload: 0,
            where: Helper.whereObjSelector(userData),
          })
        );
        dispatch(Features.showToast({ message: response.message }));
        dispatch(Features.hideLoader());
        setReloadPage(Date.now())
      }
    );
  };

  // const searchData = (e) => {
  //   setSearchQuery(e.target.value);

  //   dispatch(Features.showLoader());
  //   setTimeout(() => {
  //     dispatch(
  //       Features.makeHandler({
  //         page: 1,
  //         limit: 10000000,
  //         reload: 0,
  //         where: Helper.whereObjSelector(userData),
  //       })
  //     );
  //   }, 1000);
  // };
  
  const [pdfbtnStatus, setPdfbtnStatus] = useState(false);

  const handleGeneratePdf = async () => {
    const pdfUrl = `${REACT_APP_URL}api/download/pdf/allusers`;
    try {
      setPdfbtnStatus(true);
      const response = await axios.post(
        pdfUrl,
        {
          where: { ...handler.where, user_role_id: userData?.user_role_id },
          report_type: "All Users Data",
        },
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
            Authorization: `Bearer ${Helper.token()}`
          },
        }
      );
      if (response) {
        setPdfbtnStatus(false);
      }
      const apiYear = store.getState().year.year;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      var currentdate = new Date();
      var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + "_" + currentdate.getHours() +
        ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
      link.setAttribute("download", `${+userData?.user_role_id === 1 ? "National_" : `${userData?.state_name}_`}AllUserData_${apiYear}_${datetime}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  if (object !== null && object.data !== undefined) {
    object.data.map((row, i) => {
      return (rows[i] = {
        srl: i + 1,
        user_name: Helper.ucfirst(row.user_name ? row.user_name : ""),
        user_mobile: row.user_mobile,
        user_email: row.user_email,
        user_role: row.role_name,
        district_name: row.district_name,
        state_name: row.state_name,
        user_status: row.user_status,
        action: row.id,
        id: row.id,
        user_role_id: row.user_role_id,
      });
    });
  }

  const noRowsOverlayComponent = useMemo(() => {
    return customNoRowsOverlay;
  }, []);

  const onRowResized = (e) => {
    const a = gridRef?.current;
    if (a?.api?.getDisplayedRowCount() === 0) {
      return gridRef.current.api.showNoRowsOverlay();
    }
    if (a?.api?.getDisplayedRowCount() !== 0) {
      gridRef.current.api.hideOverlay();

      a?.api?.forEachNode((rowNode, index) => {
        if (rowNode?.data?.srl !== null) {
          const updated = rowNode?.data;
          updated.srl = index + 1;
          rowNode.updateData(updated);
        }
      });
    }
  };

  return (
    <div className="dashboard-main-content">
      {isOpen && (
        <ConfirmationDialog onConfirm={handleOnConfirm} isOpen={isOpen} setIsOpen={setIsOpen}
          title={"Confirmation"} text={`Are you sure?, <br/> you want to ${submitData.user_status ? "Inactive" : "Active"} this User.`} />
      )}
      <div className="dashboard-main-content__header mb-2" style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>User Management</h1>
        <div>
          <button type="button" className="btn btn-danger float-end ms-2" disabled={object && object.count > 0 ? (pdfbtnStatus ? true : false) : true}
            onClick={handleGeneratePdf}> {pdfbtnStatus ? <Btnloader /> : ""}{" "}
            <i className="bi bi-file-earmark-pdf"></i>{" "}
            <span className="mobile-hide">Export To</span> PDF
          </button>
          <button type="button" className="btn btn-primary mb-1 float-end" onClick={addHandler}>
            <i className={`fa-solid fa-plus text-white mt-1`}></i> Add
          </button>
        </div>
      </div>
      <div className="dashboard-main-content-info">
        <div className="col-xl-12 col-lg-12 col-sm-12 ">
          <>
            {s && (
              <div style={gridStyle} className={"ag-theme-alpine AS"} >
                <AgGridReact columnDefs={UserManagementGrid.headers(setSubmitData, statusHandler, editHandler, userData)}
                  ref={gridRef}
                  rowData={rows}
                  onGridReady={(onGridReady)}
                  animateRows={true}
                  defaultColDef={defaultColDef}
                  rowSelection="multiple"
                  checkboxSelection={true}
                  suppressRowClickSelection={true}
                  overlayLoadingTemplate={gridRef.current?.api?.showNoRowsOverlay()}
                  overlayNoRowsTemplate={gridRef.current?.api?.showNoRowsOverlay()}
                  pagination={true}
                  paginationPageSize={pagesize}
                  onFilterChanged={onRowResized}
                  noRowsOverlayComponent={noRowsOverlayComponent}
                />
              </div>
            )}
          </>
        </div>
        <div className="mx-2" style={{ position: "absolute", marginTop: "-33px", width: "200px", height: "50px" }}>
          Page Size :
          <select name="pagination" id="pet-select" className="mx-2" style={{ position: "absolute", marginTop: "-3px", width: "130px", height: "25px" }}
            onClick={(e) => setpagesize(e.target.value)}>
            <option value={rowsPerPage}>{rowsPerPage}</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value={rows ? rows.length : null}>All</option>
          </select>
        </div>

        {/* {reduxObj.view && (id !== null || id === 0) && (
          <View
            btntext={model.btntext}
            role={userRoleId}
            id={id}
            close={() => {
              setId(null);
            }}
          />
        )} */}
      </div>
    </div>
  );
};

export default Users;
