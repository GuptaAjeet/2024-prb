import React, { useMemo, useEffect, useState, Fragment, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import api from "../../../../apps/utilities/api";
import sweetAlert from "../../../../apps/utilities/sweetalert";
import { Helper, Settings } from "../../../../apps";
import { useDispatch } from "react-redux";
import Features from "../../../../redux/features";
import CustomLoadingOverlay from "./customLoadingOverlay";
import CustomEditor from "./CustomEditor";
import CustomEditorWithDecimal from "./CustomEditorWithDecimal";
import Spinner from "../../../../apps/components/elements/Spinner";
import BulkUpload from "./BulkUpload";
import Papa from "papaparse";

const AGGridSchoolConfigurator = ({
  amdObj,
  district = 0,
  reloader,
  pg,
  district_setter,
  state_id
}) => {
  const user = Helper.auth.user;
  const dispatch = useDispatch();
  const [schoolData, setSchoolData] = useState([]);
  const [columnDefs, setColumnDefs] = useState();
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const gridRef = useRef();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const [refresh, setrefresh] = useState(new Date().getMilliseconds());
  const [file, setFile] = useState(null);
  const [processBTN, setProcessBTN] = useState(true);
  const [grower, setGrower] = useState(false);
  const loadingOverlayComponent = useMemo(() => CustomLoadingOverlay, []);
  const [successList, setSuccessList] = useState([]);
  const [failedList, setFailedList] = useState([]);
  const [schemeID, setSchemeID] = useState(amdObj.scheme_id);
  const [saveDisable, setSaveDisable] = useState(false);

  const generateDynamicHeader = (o) => {
    if (o?.finance_yn === "1") {
      setColumnDefs((prevState) => {
        return [
          ...prevState,
          {
            headerName: "FINANCIAL AMOUNT",
            field: "financial_quantity",
            valueFormatter: (params) => {
              return params.value || 0;
            },
            cellEditor: CustomEditorWithDecimal,
            singleClickEdit: true,
            cellEditorPopup: true,
            editable: true,
          },
        ];
      });
    }
  };

  useEffect(() => {
    setSavedData([]);
    setShowOnlySelected(false);
    setProcessBTN(true);
    setSelectedRows([]);
    setGrower(false);

    setColumnDefs([
      {
        headerName: "",
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: false,
        width: 50,
        cellRendererParams: {
          checkbox: true,
        },
        headerCheckboxSelection: true,
        headerCheckboxSelectionCurrentPageOnly: true,
      },
      {
        headerName: "UDISE",
        field: "udise_sch_code",
        filter: "agMultiColumnFilter",
      },
      {
        headerName: "SCHOOL NAME",
        field: "school_name",
        filter: "agMultiColumnFilter",
        flex: 1,
      },
      {
        headerName: "STATE",
        field: "state_name",
      },
      {
        headerName: "DISTRICT",
        filter: "agMultiColumnFilter",
        field: "district_name",
      },
      {
        headerName: "BLOCK",
        field: "block_name",
        filter: "agMultiColumnFilter",
      },
      {
        headerName:
          amdObj.activity_master_details_name &&
          amdObj.activity_master_details_name.toUpperCase(),
        field: "quantity",
        width: 300,
        valueFormatter: (params) => {
          return params.value || 1;
        },
        cellEditor: CustomEditor, //(props,ref)=><CustomEditor props={props} ref={ref} name="nitin" />,
        cellEditorParams: {
          saveDisable: saveDisable,
          setSaveDisable: setSaveDisable,
        },
        singleClickEdit: true,
        cellEditorPopup: true,
        editable: true,
      },
    ]);

    generateDynamicHeader(amdObj);

    const fetchData = async () => {
      onBtShowLoading();
      try {
        const schoolDataResponse = await new Promise((resolve, reject) => {
          setGrower(true);
          api.post(
            `api/schools/prabandh-school-find`,
            {
              activity_master_details: amdObj,
              join_type: "LEFT",
              where: {
                district_id: district !== 0 ? district : user?.user_district_id,
                state_id: state_id ? state_id : user?.user_state_id,
              },
            },
            (res) => {
              resolve(res);
              setGrower(false);
            },
            (error) => {
              reject(error);
              setGrower(false);
            }
          );
        });

        setSchoolData(schoolDataResponse.data);

        const configurationResponse = await new Promise((resolve, reject) => {
          api.post(
            `api/prabandh/get-school-configuration`,
            {
              district_id: district !== 0 ? district : user?.user_district_id,
              state_id: state_id ? state_id : user?.user_state_id,
              amd: amdObj,
            },
            (res) => {
              resolve(res);
            },
            (error) => {
              reject(error);
            }
          );
        });

        if (configurationResponse?.data.length > 0) {
          setSavedData(configurationResponse.data);
          const udiseArr = configurationResponse.data.map((r) => r.asset_code);
          /* teacher sheme specific conditon  start  distirctArr */
          const districtArr = configurationResponse.data.map((r) => r.district);

          if (gridRef.current) {
            gridRef.current.api.forEachNode((node) => {
              if (
                Settings.isDataExistsInArray(udiseArr, node.data.udise_sch_code)
              ) {
                if (+schemeID === 3) {
                  if (
                    Settings.isDataExistsInArray(
                      districtArr,
                      node.data.district_id
                    )
                  ) {
                    node.setSelected(true);
                  }
                } else {
                  node.setSelected(true);
                }
              }
            });
          }
        }
        onBtHide();
      } catch (error) {
        onBtHide();
      }
    };

    fetchData();
  }, [user, amdObj, refresh]);

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const handleSelectionChanged = (params) => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedRows = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedRows);
  };

  const saveData = () => {
    sweetAlert.confirmation({
      msg: "Your selected schools configuration is ready for saving.\nAre you sure you wish to proceed and finalize the submission?",
      yesBtnText: "Yes",
      noBtnText: "No",
      url: "",
      callback: () => {
        api.post(
          `api/prabandh/save-school-configuration`,
          {
            district_id: district !== 0 ? district : user?.user_district_id,
            state_id: state_id ? state_id : user?.user_state_id,
            process: false,
            data: { rows: selectedRows, amd: amdObj },
            pg: pg || "",
          },
          (res) => {
            if (res) {
              dispatch(Features.hideModal({}));
              dispatch(
                Features.showToast({
                  message: "Data saved successfully.",
                  flag: "bg-success",
                })
              );
              if (pg === "vieweditstate") {
                district_setter(district);
              }
              reloader(new Date().getMilliseconds());
            }
          }
        );
      },
      redirect: "",
    });
    return false;
  };

  const toggleShowOnlySelected = async () => {
    setShowOnlySelected(!showOnlySelected);
    setGrower(true);
    onBtShowLoading();
    try {
      const configResponse = await new Promise((resolve, reject) => {
        api.post(
          `api/prabandh/get-school-configuration`,
          {
            district_id: district !== 0 ? district : user?.user_district_id,
            state_id: state_id ? state_id : user?.user_state_id,
            amd: amdObj,
          },
          (res) => resolve(res),
          (error) => reject(error)
        );
      });

      if (configResponse?.data.length > 0) {
        const cond = !showOnlySelected ? "INNER" : "LEFT";
        const udise_sch_codes_arr = configResponse.data.map(
          (m) => m.asset_code
        );

        const schoolDataResponse = await new Promise((resolve, reject) => {
          setGrower(true);
          api.post(
            `api/schools/prabandh-school-find`,
            {
              activity_master_details: amdObj,
              join_type: cond,
              where: {
                district_id: district !== 0 ? district : user?.user_district_id,
                state_id: state_id ? state_id : user?.user_state_id,
              },
            },
            (res) => {
              resolve(res);
              setGrower(false);
            },
            (error) => {
              reject(error);
              setGrower(false);
            }
          );
        });

        setSchoolData(schoolDataResponse.data);

        if (schoolDataResponse?.data.length > 0 && gridRef.current) {
          setTimeout(() => {
            if (cond === "INNER") {
              gridRef.current.api.forEachNode((node) => {
                node.setSelected(true);
              });
            } else {
              gridRef.current.api.forEachNode((node) => {
                if (
                  Settings.isDataExistsInArray(
                    udise_sch_codes_arr,
                    node.data.udise_sch_code
                  )
                ) {
                  node.setSelected(true);
                }
              });
            }
          }, 750);
        }
      }

      setGrower(false);
      onBtHide();
    } catch (error) {
      console.error("Error fetching data:", error);
      setGrower(false);
      onBtHide();
    }
  };

  const handleFileChange = async (e) => {
    let flN = e.target.files[0].name.split(".");
    let data = ["csv", "CSV"];

    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: function (results) {
        const requiredFields = [
          "UDISE",
          "SCHOOL NAME",
          "STATE",
          "DISTRICT",
          "BLOCK",
        ];

        // Check if the CSV file contains the required fields
        const hasRequiredFields = requiredFields.every((field) => {
          return results.meta.fields.includes(field);
        });

        if (!hasRequiredFields) {
          sweetAlert.warning(
            "Error: CSV file is missing some required fields."
          );
        } else {
          if (Settings.isDataExistsInArray(data, flN.pop())) {
            const selectedFile = e.target.files[0];
            sweetAlert.confirmation({
              msg: "Are you sure you want to upload this file?",
              yesBtnText: "Yes",
              noBtnText: "No",
              url: "",
              callback: async () => {
                setFile(selectedFile);
                const url = "api/prabandh/upload";
                try {
                  await api.upload(
                    url,
                    selectedFile,
                    {
                      amd: amdObj,
                      district_id:
                        district !== 0 ? district : user?.user_district_id,
                      state_id: state_id ? state_id : user?.user_state_id,
                    },
                    (data) => {
                      if (data.status == 200) {
                        dispatch(
                          Features.showToast({
                            message: "File Uploaded Successfully.",
                            flag: "bg-success",
                          })
                        );
                      }
                      setProcessBTN(false);
                      if (data.status == 400) {
                        dispatch(
                          Features.showToast({
                            message: `Error: ${data.message}.`,
                            flag: "bg-danger",
                          })
                        );
                        setProcessBTN(false);
                      }
                    }
                  );
                } catch (error) {
                  dispatch(
                    Features.showToast({
                      message: "Error: File Not Uploaded.",
                      flag: "bg-danger",
                    })
                  );
                }
              },
              redirect: "",
            });
          } else {
            sweetAlert.warning(
              `Invalid File Format: The selected file does not adhere to the expected CSV format.`
            );
          }
        }
      },
      error: function (error) {
        alert("Error parsing CSV file.");
        console.error(error);
      },
    });
  };

  const processFileUpload = () => {
    setGrower(true);
    setProcessBTN(true);
    api.post(
      `api/prabandh/save-school-configuration`,
      {
        district_id: district !== 0 ? district : user?.user_district_id,
        state_id: state_id ? state_id : user?.user_state_id,
        process: true,
        data: { rows: [], amd: amdObj },
      },
      (res) => {
        if (res) {
          setSuccessList(res.success_udise_list);
          setFailedList(res.failed_udise_list);
          dispatch(
            Features.showToast({
              message: "Data Processed successfully.",
              flag: "bg-success",
            })
          );
          setGrower(false);
          setTimeout(() => {
            api.post(
              `api/prabandh/get-school-configuration`,
              {
                district_id: district !== 0 ? district : user?.user_district_id,
                state_id: state_id ? state_id : user?.user_state_id,
                amd: amdObj,
              },
              (res) => {
                if (res?.data.length > 0) {
                  setSavedData(res.data);
                  const udiseArr = res?.data.map((r) => r.asset_code);
                  if (gridRef.current) {
                    gridRef.current.api.forEachNode((node) => {
                      if (
                        Settings.isDataExistsInArray(
                          udiseArr,
                          node.data.udise_sch_code
                        )
                      ) {
                        node.setSelected(true);
                      }
                    });
                  }
                }
                setGrower(false);
                reloader(new Date().getMilliseconds());
                setrefresh(new Date().getMilliseconds());
              }
            );
          }, 500);
        }
      }
    );
  };

  const onBtShowLoading = () => {
    gridRef && gridRef.current && gridRef.current.api.showLoadingOverlay();
  };

  const onBtHide = () => {
    gridRef && gridRef.current && gridRef.current.api.hideOverlay();
  };

  const onBtnExport = () => {
    setGrower(true);
    setrefresh(new Date().getMilliseconds());
    setTimeout(() => {
      const sanitizedFilename = amdObj?.activity_master_details_name
        ? amdObj?.activity_master_details_name.replace(/[^\w\s.-]/g, "")
        : null;
      //const finalFilename = sanitizedFilename.replace(/\s+/g, "_");
      const finalFilename =
        sanitizedFilename != null && sanitizedFilename != undefined
          ? sanitizedFilename.replace(/[^\w\-\.]/g, "_")
          : Date.now().toString();

      gridRef &&
        gridRef.current &&
        gridRef.current.api.exportDataAsCsv({
          fileName: finalFilename,
          columnKeys: [
            "udise_sch_code",
            "school_name",
            "state_name",
            "district_name",
            "block_name",
            "quantity",
            "financial_quantity",
          ],
        });
      setGrower(false);
    }, 1000);
  };

  const NoSchoolFind = () => {
    return (
      <div className="container text-center">
        {grower && <Spinner />}
        <h4 className="mt-5">No School Found</h4>
      </div>
    );
  };

  return (
    <div className="dashboard-main-content" style={{ padding: "unset" }}>
      <div className="dashboard-main-content-info">
        <nav>
          <div
            className="nav nav-tabs"
            id="nav-tab"
            role="tablist"
            style={{ fontSize: "16px" }}
          >
            <button
              className="nav-link active"
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-manual"
              aria-selected="true"
            >
              Manual Choose School
            </button>
            {+schemeID !== 3 && (
              <button
                className="nav-link"
                id="nav-profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-profile"
                type="button"
                role="tab"
                aria-controls="nav-bulk"
                aria-selected="false"
              >
                Bulk Upload School List
              </button>
            )}
          </div>
        </nav>
        <div
          className="tab-content"
          id="nav-tabContent"
          style={{ padding: "20px" }}
        >
          <div
            className="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
            tabindex="0"
          >
            <div>
              <table className="mb-2" width="100%">
                <tr>
                  <td width="95%">
                    <button
                      className={`btn btn-info ${
                        savedData.length === 0 && "d-none"
                      }`}
                      onClick={toggleShowOnlySelected}
                    >
                      {showOnlySelected
                        ? "Showing Only Saved"
                        : `Showing All ${
                            savedData?.length > 0
                              ? "Including " + savedData.length + " Saved"
                              : ""
                          }`}
                    </button>
                    {grower && (
                      <span
                        className="spinner-grow text-dark"
                        role="status"
                        style={{ verticalAlign: "middle" }}
                      />
                    )}
                  </td>
                  <td width="5%" align="right">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={saveData}
                      style={{ float: "right" }}
                      disabled={saveDisable}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              </table>
            </div>

            {schoolData && schoolData?.length === 0 ? (
              <NoSchoolFind />
            ) : (
              <div
                className="ag-theme-alpine"
                style={{ height: "600px", width: "100%" }}
              >
                <Fragment>
                  <div style={gridStyle} className={"ag-theme-alpine"}>
                    <AgGridReact
                      ref={gridRef}
                      columnDefs={columnDefs}
                      rowData={schoolData}
                      animateRows={true}
                      defaultColDef={defaultColDef}
                      rowSelection="multiple"
                      checkboxSelection={true}
                      suppressRowClickSelection={true}
                      onSelectionChanged={handleSelectionChanged}
                      loadingOverlayComponent={loadingOverlayComponent}
                      pagination={true}
                      paginationAutoPageSize={true}
                      getRowNodeId={(data) => data.udise_sch_code}
                    />
                  </div>
                </Fragment>
              </div>
            )}
          </div>
          <div
            className="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
            tabindex="0"
          >
            <BulkUpload
              data={{
                grower,
                onBtnExport,
                handleFileChange,
                processFileUpload,
                processBTN,
                successList,
                failedList,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AGGridSchoolConfigurator;
