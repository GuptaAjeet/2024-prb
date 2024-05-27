import axios from "axios";
import React from "react";
import { useDispatch} from "react-redux";
import Features from "../../../redux/features";
import helper from "../../../apps/utilities/helper";
import { useRef, useMemo } from "react";
import { API, Hook } from "../../../apps";
import { useState, useEffect } from "react";
import Form from "../../../apps/components/form";
import { REACT_APP_URL } from "../../../env";
// import Mobile from "../../../apps/components/form/Mobile";
import TextEditor from "../../../apps/components/form/TextEditor";
import { AgGridReact } from "ag-grid-react";
import { Modal } from "../../../apps/components/elements";
// import { helper } from "echarts";

export default function TicketSystem() {
  const dispatch = useDispatch();

  let subjectRef = useRef();
  let descRef = useRef();
  let screenshotRef = useRef();
  let moduleRef = useRef();
  const gridStyle = useMemo(() => ({ height: "400px", width: "100%" }), []);
  const gridRef = useRef();
  const [editData, setEditData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(false);
  const [replyTextAra, setReplyTextAra] = useState("");
  const [rows, setRows] = useState("");

  const { handleChange, values} = Hook.useForm([
    subjectRef,
    descRef,
    screenshotRef,
    moduleRef,
  ]);

  let userData = helper.auth?.user;

  const getTicketList = () => {

    API.post("api/support/ticket-list", { id: userData.user_role_id, }, (data) => {
      setRows(data);
    });

    // axios
    //   .post(`${REACT_APP_URL}api/support/ticket-list`, {
    //     id: userData.user_role_id,
    //   })
    //   .then((res) => {
    //   setRows(res.data);
    //   });
  };

  useEffect(() => {
    getTicketList();
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      sortable: true,
      resizable: true,
    };
  }, []);

  const handleSubmit = () => {
    if (
      values.subject &&
      values.screenshot &&
      values.description &&
      values.module
    ) {
      const formData = new FormData();

      formData.append("user_id", userData.id);

      for (const key in values) {
        if (
          values.hasOwnProperty(key) &&
          values.hasOwnProperty(key) !== "screenshot"
        ) {
          formData.append(key, values[key]);
        } else if (
          values.hasOwnProperty(key) &&
          values.hasOwnProperty(key) === "screenshot"
        ) {
          formData.append(key, values[key]);
        }
      }

      axios
        .post(`${REACT_APP_URL}api/support/ticket`, formData, {
          headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${helper.token()}` },
        })
        .then(function (response) {
          if (response?.status === 200) {
            dispatch(
              Features.showToast({ message: "data saved successfully" })
            );
            getTicketList();
            if (screenshotRef.current) {
              screenshotRef.current.value = "";
              subjectRef.current.value = "";
              descRef.current.value = "";
            }
          }
        })
        .catch(function (error) {});
    } else {
      dispatch(
        Features.showToast({ message: "Please fill all mandatory fields" })
      );
    }
  };

  const openSchoolModal = (tr) => {
    API.post("api/support/ticket-detail", { id: tr.id }, (data) => {
      setEditData(data);
    });

    setSelectedRow(tr);
    dispatch(
      Features.showModal({
        title: "Ticket",
        btntext: "GO",
      })
    );
  };

  const handleDownloadfile = async (tr) => {
    const name = tr.file.split("/").pop();
    const pdfUrl = `${REACT_APP_URL}api/prabandh/file/downloadfile/ticket/${tr?.id}`;

    try {
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf/xlsx",
          Authorization: `Bearer ${helper.token()}`
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>Create Ticket</h1>
      </div>

      <div className="dashboard-main-content-info mb-3">
        <div className="row ">
          <div className="col-md-12 mb-2">
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Subject
              </label>
              <input
                ref={subjectRef}
                name="subject"
                type="text"
                className="form-control"
                onChange={(e) => {
                  handleChange(e);
                }}
                mandatory="true"
              />
            </div>
          </div>

          <div className="col-md-12 mb-2">
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Module
              </label>
              <input
                ref={subjectRef}
                name="module"
                type="text"
                className="form-control"
                onChange={(e) => {
                  handleChange(e);
                }}
                mandatory="true"
              />
            </div>
          </div>

          <div className="col-md-12 mb-2">
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Description
              </label>
              <TextEditor
                ref={descRef}
                name="description"
                onChange={(value) => {
                  handleChange(value, "description");
                }}
                onChangeText={(text) => {
                  handleChange(text, "description");
                }}
                value={descRef?.current?.value}
              />
            </div>
          </div>

          <div className="col-md-4 mb-2">
            <div className="mb-3">
              <label for="formFile" className="form-label">
                Screenshot
              </label>
              <input
                ref={screenshotRef}
                name="screenshot"
                className="form-control"
                type="file"
                id="formFile"
                onChange={(e) => {
                  handleChange(e);
                }}
                mandatory="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ cursor: "pointer" }} className="upload_submit_button">
        <Form.Button
          button={{ type: "submit", onClick: handleSubmit }}
          className="btn btn-success"
        >
          {" "}
          Submit{" "}
        </Form.Button>
      </div>

      <div style={gridStyle} className={"ag-theme-alpine AS"}>
        <AgGridReact
          ref={gridRef}
          columnDefs={[
            {
              headerName: "S. No.",
              valueGetter: (params) => {
                return params.node.rowIndex + 1;
              },
              width: 91,
            },
            {
              headerName: "Subject",
              field: "subject",
              filter: "agMultiColumnFilter",
              width: 300,
            },
            {
              headerName: "Description",
              field: "description",
              filter: "agMultiColumnFilter",
              cellRenderer: function StatusRenderer(params) {
                return (
                  <div
                    onClick={() => openSchoolModal(params.data)}
                    dangerouslySetInnerHTML={{
                      __html: params?.data?.description,
                    }}
                  ></div>
                );
              },
              width: 700,
            },
            {
              headerName: "Status",
              field: "user_status",
              width: 100,
              cellRenderer: function StatusRenderer(params) {
                return (
                  <div className="text-left edit_hover">
                    {params.data.id !== userData?.id && (
                      <i
                        className={`fa-regular fa-square-check ${
                          params.data.user_status === 1
                            ? "text-success"
                            : "text-danger"
                        }`}
                        data-id={params.data.id}
                      ></i>
                    )}
                    &nbsp;
                    {params.data.user_status === 1 ? "Resolved" : "Pending"}
                  </div>
                );
              },
            },
            {
              headerName: "File",
              field: "user_status",
              width: 100,
              cellRenderer: function StatusRenderer(params) {
                return (
                  <i
                    className="bi bi-download "
                    style={{ fontSize: "1.2rem", color: "green" }}
                    onClick={() => handleDownloadfile(params.data)}
                  ></i>
                );
              },
            },
          ]}
          rowData={rows}
          onGridReady={(params)=>{
            setTimeout(()=>{
              params.api.sizeColumnsToFit();
            },300)
          }}
          animateRows={true}
          rowSelection="multiple"
          checkboxSelection={true}
          suppressRowClickSelection={true}
          pagination={true}
          defaultColDef={defaultColDef}

          // onSelectionChanged={handleSelectionChanged}
          // loadingOverlayComponent={loadingOverlayComponent}
          // paginationPageSize={pagesize}
          // paginationAutoPageSize={true}
          // getRowNodeId={(data) => data.udise_sch_code}
        />
      </div>
      {selectedRow && (
        <Modal close={() => setSelectedRow(null)}>
          <div
            className="row"
            style={{
              maxHeight: "400px",
              "--bs-gutter-x": "unset",
              overflow: "auto",
            }}
          >
            <div className="col-4 mb-3">
              <label>Subject </label>
              <div dangerouslySetInnerHTML={{ __html: selectedRow.subject }} />
            </div>
            <div className="col-6 mb-3">
              <label>Description </label>
              <div
                dangerouslySetInnerHTML={{ __html: selectedRow.description }}
              />
            </div>

            <div className="col-1 mb-3">
              <div className="text-left">
                <label className="d-block">Status </label>
                <input
                  type="checkbox"
                  id="status"
                  className="d-none"
                  checked={selectedRow.status}
                />
                <label
                  htmlFor="#status"
                  onClick={(e) => {
                    let status = document.getElementById("status").checked;
                    axios
                      .post(
                        `${REACT_APP_URL}api/support/ticket`,
                        { status: !status, id: selectedRow.id },
                        {
                          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${helper.token()}` },
                        }
                      )
                      .then(function (response) {
                        if (response?.status === 200) {
                          dispatch(
                            Features.showToast({
                              message: "Data saved successfully",
                            })
                          );
                          setSelectedRow((prevState) => {
                            prevState.status = !status;
                            return { ...prevState };
                          });
                          getTicketList();
                        }
                      })
                      .catch(function (error) {});
                  }}
                >
                  {" "}
                  <i
                    className={`fa-regular fa-square-check ${
                      selectedRow.status ? "text-success" : "text-danger"
                    } `}
                    style={{ fontSize: "20px" }}
                    title={selectedRow.status ? "Resolved" : "Pending"}
                  />{" "}
                </label>
              </div>
            </div>

            <div className="col-1 mb-3">
              <i
                className="bi bi-download "
                style={{ fontSize: "1.2rem", color: "green" }}
                onClick={() => handleDownloadfile(selectedRow)}
              ></i>
            </div>

            <div className="col-12 mb-3">
              {editData.map((item) => {
                if (item.description) {
                  return (
                    <div
                      className={`${
                        userData.id === item.user_id
                          ? "border border-success"
                          : "border border-info"
                      } rounded p-2 mb-2`}
                    >
                      <div
                        className={`${
                          userData.id === item.user_id
                            ? "text-end"
                            : "text-start"
                        }`}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                      {item.file && (
                        <i
                          className="bi bi-download text-end"
                          style={{ fontSize: "1.2rem", color: "green" }}
                          onClick={() => handleDownloadfile(item)}
                        ></i>
                      )}
                      {userData.id !== item.user_id && !!item.addedby && (
                        <div style={{ fontSize: "7px" }}>{item.addedby}</div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="row">
            <div className="col-12 mb-2 mt-3">
              <TextEditor
                ref={descRef}
                name="description"
                onChange={(value) => {
                  setReplyTextAra(value);
                }}
                onChangeText={(text) => {
                  setReplyTextAra(text);
                }}
                // clearEditor={replyTextAra}
              />
            </div>

            <div className="col-12 d-flex">
              <input
                ref={screenshotRef}
                className="form-control"
                type="file"
                id="replyFile"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={() => {
                  if (!replyTextAra) {
                    dispatch(
                      Features.showToast({
                        message: "Please fill all mandatory fields",
                      })
                    );
                  } else {
                    const formData = new FormData();
                    formData.append("user_id", userData.id);
                    formData.append("parent_id", selectedRow.id);
                    formData.append("description", replyTextAra);
                    const replyFiles =
                      document.getElementById("replyFile").files;

                    if (replyFiles && replyFiles.length) {
                      formData.append("screenshot", replyFiles[0]);
                    }
                    axios
                      .post(`${REACT_APP_URL}api/support/ticket`, formData, {
                        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${helper.token()}` },
                      })
                      .then(function (response) {
                        if (response?.status === 200) {
                          document.getElementById("replyFile").value = "";
                          dispatch(
                            Features.showToast({
                              message: "data saved successfully",
                            })
                          );

                          API.post(
                            "api/support/ticket-detail",
                            { id: selectedRow.id },
                            (data) => {
                              setEditData(data);
                            }
                          );
                        }
                      })
                      .catch(function (error) {});
                  }
                }}
              >
                Reply
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
