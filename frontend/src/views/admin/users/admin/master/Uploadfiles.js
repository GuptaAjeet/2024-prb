import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Features from "../../../../../redux/features";
import Helper from "../../../../../apps/utilities/helper";
import { useRef } from "react";
import { API, Column, Hook, Table, Settings } from "../../../../../apps";
import { useState } from "react";
import Form from "../../../../../apps/components/form";
import { useEffect } from "react";
// import $ from "jquery";
import { REACT_APP_URL } from "../../../../../env";

// 20mb
const fileUploadOptions = [
  // {
  //   id: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application/vnd.ms-excel",
  //   name: "Excel (XLS/XLSX)",
  // },
  // { id: "application/pdf", name: "PDF" },
  {
    id: "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed",
    name: "Zip",
  },

  /*   { id: "text/csv", name: "CSV" },
  { id: "image/png|image/jpeg", name: "Image (JPEG/JPG/PNG)" }, */
];
const pdf_data = [
  // {
  //   id: "List of Out of School Children",
  //   name: "List of Out of School Children",
  // },
  // { id: "List of Migrant Children", name: "List of Migrant Children" },
  // { id: "List of Religious Children", name: "List of Religious Children" },
  // { id: "Other", name: "Other" },

  { id: "Plan Document", name: "Plan Document" },
  { id: "Planning Table", name: "Planning Table" },
  { id: "Supplementary Document 1", name: "Supplementary Document 1" },
  { id: "Supplementary Document 2", name: "Supplementary Document 2" },
  { id: "Supplementary Document 3", name: "Supplementary Document 3" },
];
// const CSV_data = [
//   {
//     id: "List of Out of School Children",
//     name: "List of Out of School Children",
//   },
//   { id: "List of Migrant Children", name: "List of Migrant Children" },
//   { id: "List of Religious Children", name: "List of Religious Children" },
//   { id: "Other", name: "Other" },
// ];
// const excel_data = [
//   {
//     id: "List of Out of School Children",
//     name: "List of Out of School Children",
//   },
//   { id: "List of Migrant Children", name: "List of Migrant Children" },
//   { id: "List of Religious Children", name: "List of Religious Children" },
//   { id: "Other", name: "Other" },
// ];

export default function Uploadfiles({ hideUploaded, submit }) {
  const dispatch = useDispatch();
  var file_type = useRef(0);
  const is_private = useRef(1);
  const upload_year = useRef(0);
  var description = useRef();
  var document_type = useRef(0);
  const [fSubmit, setFSubmit] = useState(false);
  const [file_name, setFilename] = useState("");
  const [files, setFiles] = useState([]);
  const defaultValidationInputs = [
    file_type,
    document_type,
    description,
    upload_year,
  ];
  const [fInputs, SetFInputs] = useState(defaultValidationInputs);
  const { handleChange, values, errors, form } = Hook.useForm(fInputs);
  const handler = useSelector((state) => state.handler);
  const [showFileInput, setShowFileInput] = useState(false);
  const [d,setd] = useState(false);
  

  let userData = Helper.auth?.user;
  useEffect(() => {
    dispatch(
      Features.makeHandler({
        reload: new Date().getTime(),
        where: "",
      })
    );
  }, []);

  const objects = Hook.usePost({
    url: "api/prabandh/getuploaddata",
    data: {
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      where: handler?.where,
      role_id: +userData?.user_role_id,
      district_id: +userData?.user_district_id,
      state_id: +userData?.user_state_id,
      user_id: +userData?.id,
    },
  });
 
  const years = Hook.usePost({
    url: "api/prabandh/years",
  });

  const [object, setObject] = useState([]);
  console.log(objects);
  if (objects===null) {
    dispatch(Features.hideLoader());
   }
  useEffect(() => {
    if (Object.keys(values).length > 0 && values.file_type !== 0) {
      setShowFileInput(true);
      if (document.getElementById("upload-2") != null) {
        document.getElementById("upload-2").value = "";
      }
      setFilename("");
    } else {
      setShowFileInput(false);
    }
  }, [values?.file_type]);

  const handleUploadfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = fileUploadOptions.map((item) => {
        let newObj = {};
        newObj[item.id] = item.name;
        return newObj;
      });

      let mergedObj = allowedTypes.reduce(
        (acc, obj) => ({ ...acc, ...obj }),
        {}
      );

      if (Settings.isDataNotExistsInArray(values.file_type, file.type)) {
        alert(`Only ${mergedObj[values.file_type]} is allowed.`);
        setFilename("");
        return;
      } else if (!file?.name.match(/^[a-zA-Z0-9\- ]*\.[a-zA-Z0-9 ]*$/)) {
        alert(
          `Invalid file name. File name should not contain special characters and multiple extensions.`
        );
        setFilename("");
      } else setFilename(file);
    } else {
      setFilename("");
    }
  };
 
  // const handleGeneratePdf = async () => {
  //   const pdfUrl = `${REACT_APP_URL}api/download/pdf/mastercommondatapdf`;
  //   try {
  //     const response = await axios.get(pdfUrl, {
  //       responseType: "arraybuffer",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/pdf",
  //         Authorization: `Bearer ${helper.token()}`

  //       },
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "file.pdf"); //or any other extension
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //   }
  // };

  // function handleGenerateExcels() {
  //   axios
  //     .get(`${REACT_APP_URL}api/download/excel/downloadexcels`, {
  //       responseType: "arraybuffer",
  //     })
  //     .then((response) => {
  //       var blob = new Blob([response.data], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });

  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", "file.xlsx");
  //       document.body.appendChild(link);
  //       link.click();
  //     })
  //     .catch(function (error) {
  //       //console.log(error);
  //     });
  // }

  const handleDelete = (id) => {
    const data = [...object];
    data.splice(id, 1);
    setObject(data);
    const f = [...files];
    f.splice(id, 1);
    setFiles(f);
  };

  const handleDeleteById = (id) => {
    API.delete("api/prabandh/file/delete", id, (data) => {
      if (data.status) {
        dispatch(Features.showToast({ message: "File Deleted Successfully" }));
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
            where: Helper.whereMasterUploadSelector(),
          })
        );
      }
    });
  };

  // FOR DOWNLOAD FILE WHICH WE HAD UPLOADED
  const handleDownloadfile = async (id, name, state_id) => {
    setd(true)
    setTimeout(() => {
      setd(false)
    }, "2500");
  
    const n = name.split(".");
    const nm = n[n.length - 1];
    console.log(name, "name")
    const pdfUrl = `${REACT_APP_URL}api/prabandh/file/downloadfile/${id}/${state_id ? state_id : userData?.user_state_id}`;

    try {
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf/xlsx/zip/csv",
          Authorization: `Bearer ${Helper.token()}`
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      // nm === "pdf"
      //   ? link.setAttribute("download", "file.pdf")
      //   : nm === "xlsx"
      //   ? link.setAttribute("download", "file.xlsx")
      //   : link.setAttribute("download", "file.csv");
      // if (nm === "pdf") {
      //   link.setAttribute("download", name);
      // } else if (nm === "xlsx") {
      //   link.setAttribute("download", name);
      // } else if (nm === "csv") {
      //   link.setAttribute("download", name);
      // } else if (nm === "zip") {
      //   link.setAttribute("download", name);
      // }

      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
   
    } catch (error) {
      console.error("Error:", error.message);
     
    }
  };
  let rows = [];
  let rowss = [];
  if (object !== null && object !== undefined) {
    object &&
      object.map((row, i) => {
        return (rows[i] = {
          srl: i + 1,
          // file_type: row.file_type,
          document_type: row.document_type,
          file_name: row.file_name,
          description: row.description,
          action: (
            <div className="text-center">
              <i
                key={i}
                className="bi bi-trash3 text-warning"
                style={{ fontSize: "1.2rem" }}
                onClick={() => handleDelete(i)}
                data-id={row.id}
              ></i>
            </div>
          ),
        });
      });
  }

  if (objects !== null && objects !== undefined) {
    objects &&
      objects.data &&
      objects.data.map((row, i) => {
        return (rowss[i] = {
          srl: Helper.counter(++i, handler.limit, handler.page),
          document_type: row.document_type,
          file_name: row.file_name,
          state_name:
            row?.state_name === (undefined || null) ? "----" : row?.state_name,
          district_name:
            row?.district_name === (undefined || null)
              ? "----"
              : row?.district_name,
          description: row.description,
          action: (
            <div
              className="text-center"
              style={{
                display: "flex",
                justifyContent: "center",
                columnGap: "1rem",
              }}
            >
       { d? "":    <i
                className="bi bi-download " 
                style={{ fontSize: "1.2rem", color: "green", cursor: 'pointer' }}
                onClick={() => handleDownloadfile(row.id, row.file_name, row.state_id)}
              ></i>}
              {Settings.isNotViewer() && (
                <i
                  key={i}
                  className="bi bi-trash3 text-danger"
                  style={{ fontSize: "1.2rem", cursor: 'pointer' }}
                  onClick={() => handleDeleteById(row.id)}
                  data-id={row.id}
                ></i>
              )}
            </div>
          ),
        });
      });
  }

  const handleAdd = () => {
    const data = {
      id: object.length + 1,
      file_type: file_type.current.value,
      document_type: document_type.current.value,
      file_name: file_name.name,
      description: description.current.value,
      file_location: null,
      is_private: "0",
    };

    const obj = [...object];
    obj.push(data);
    setObject(obj);
    const f = [...files];
    f.push(file_name);
    setFiles(f);
    setFilename("");
    if (document.getElementById("upload-2") != null) {
      document.getElementById("upload-2").value = "";
    }
  };

  const handleFilesDetailSubmit = (dt) => {
    dt.forEach((v, i) => {
      object[i].file_name = v.filename;
    });
    const state_id = userData?.user_state_id;
    const district_id = userData?.user_district_id;
    const user_id = userData?.id;
    const data = object?.map((val) => ({
      file_type: val.file_type,
      file_name: val.file_name,
      document_type: val.document_type,
      description: val.description,
      file_location: val.destination,
      is_private: 1,
      state_id: state_id,
      district_id: district_id,
      role_id: userData?.user_role_id,
      user_id: userData?.id,
      upload_year: upload_year?.current?.value,
    }));
    API.post("api/prabandh/file/uploaddetails", data, (result) => {
      if (result.status) {
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
            where: Helper.whereMasterUploadSelector(),
          })
        );
        setFilename("");
        dispatch(Features.showToast({ message: result.message }));
        setObject([]);
        if (document.getElementById("upload-2") !== null) {
          document.getElementById("upload-2").value = "";
        }
        setFiles([]);
      }
    });
  };

  const handleSubmit = () => {
    if (files.length) {
      const formData = new FormData();
      formData.append("user_state_id", userData?.user_state_id);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      dispatch(Features.showLoader({ show: "show", display: "block" }));
      axios
        .post(`${REACT_APP_URL}api/prabandh/file/uploadfiles`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Helper.token()}`
          },
        })
        .then(function (response) {
          if (response?.status === 200) {
            // $(".pb-2").hide();
            dispatch(Features.hideLoader({ show: "", display: "none" }));
            handleFilesDetailSubmit(response?.data?.data);
          }
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
  };

  const handleReset = () => {
    setFilename("");
    setObject([]);
    if (document.getElementById("upload-2") !== null) {
      document.getElementById("upload-2").value = "";
    }
    setFiles([]);
  };

  // useEffect(() => {
  //   $(".pb-2").hide();
  // }, [object]);

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>
          {Settings.isNotViewer()
            ? "Upload Supporting Document"
            : "Uploaded Supporting Document"}
        </h1>
      </div>
      {Settings.isNotViewer() && (
        <div className="dashboard-main-content-info mb-3 border p-3">
          <div className="row ">
            <div className="mb-4 col-md-2 mb-2">
              <Form.Select
                options={fileUploadOptions}
                attr={{
                  ref: file_type,
                  id: "file_type",
                  name: "file_type",
                  onChange: handleChange,
                  onFocus: handleChange,
                }}
                label="Select File Type"
                error={errors.file_type}
                mandatory="true"
                default="Select File Type"
              />
            </div>
            <div className="mb-4 col-md-3 mb-2">
              <Form.Select
                options={pdf_data}
                attr={{
                  ref: document_type,
                  id: "document_type",
                  name: "document_type",
                  onChange: handleChange,
                  onFocus: handleChange,
                }}
                label="Select Document Type"
                error={errors.document_type}
                mandatory="true"
                default="Select Document Type"
              />
            </div>
            <div className="mb-4 col-md-2 mb-2">
              <Form.Text
                attr={{
                  ref: description,
                  id: "description_upload_document",
                  name: "description_upload_document",
                  onChange: handleChange,
                  onFocus: handleChange,
                  maxLength: 100,
                }}
                label="Description"
                error={errors.description_upload_document}
                mandatory="true"
              />
            </div>
            <div className="mb-4 col-md-2 mb-2 d-none">
              <Form.Select
                options={[{ id: "1", name: "Private" }]}
                attr={{
                  ref: is_private,
                  id: "is_private",
                  name: "is_private",
                  onChange: handleChange,
                  onFocus: handleChange,
                  disabled: true,
                }}
                label="Accessibility"
                mandatory="true"
                default="Private"
              />
            </div>
            <div className="mb-4 col-md-3 mb-2">
              <Form.Select
                options={
                  years === null || undefined
                    ? []
                    : years?.data?.map((v) => ({
                      id: v.year_code,
                      name: v.year_name,
                    }))
                }
                attr={{
                  ref: upload_year,
                  id: "upload_year",
                  name: "upload_year",
                  onChange: handleChange,
                  onFocus: handleChange,
                }}
                label="Select Year"
                error={errors.upload_year}
                mandatory="true"
                default="Select Year"
              />
            </div>
            {showFileInput && (
              <div
                className="mb-4 col-md-2"
                style={{
                  padding: "auto",
                  margin: "1.4rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #dbdbdb",
                }}
              >
                <label htmlFor="upload-2" style={{ fontSize: "1rem" }}>
                  <i
                    className="bi bi-upload"
                    style={{ fontSize: "1.5rem", marginRight: "0.8rem" }}
                  ></i>{" "}
                  {file_name.name === undefined
                    ? "Choose a File"
                    : file_name.name.length >= 5
                      ? `${file_name.name.substring(0, 15)}....`
                      : file_name.name}
                </label>
                <input
                  type="file"
                  hidden
                  onChange={handleUploadfile}
                  id="upload-2"
                  accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                />
              </div>
            )}
            <div className="col-md-2" style={{ marginTop: "1.3rem" }}>
              <Form.Button
                button={{
                  type: "submit",
                  disabled: file_name === "" ? true : form.disable,
                  onClick: handleAdd,
                }}
                style={{ marginTop: "1.5rem" }}
                className="btn btn-primary"
                fSubmit={fSubmit}
              >
                <i className="bi bi-plus-lg"></i> Add
              </Form.Button>
            </div>
          </div>
        </div>
      )}
      {rows.length > 0 && Settings.isNotViewer() && (
        <div className="dashboard-main-content-info">
          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            {object && (
              <Table
                object={{
                  columns: Column.masterUploadFileDumy(),
                  data: rows,
                  count: object.length,
                  create: false,
                  search: false,
                }}
                height="auto"
                preference={1}
              />
            )}
          </div>
        </div>
      )}
      {/* {Settings.isNotViewer() */}
      {rows.length > 0 && Settings.isNotViewer() && (
        <div style={{ cursor: "pointer" }} className="upload_submit_button">
          <Form.Button
            button={{
              type: "submit",
              disabled: hideUploaded ? false : (object.length === 0 ? true : false),
              onClick: () => {
                if (hideUploaded) {
                  if (submit) {
                    submit();
                    handleSubmit();
                  }
                } else {
                  handleSubmit();
                }
              },
            }}
            className="btn btn-success"
          >
            Submit
          </Form.Button>
          <Form.Button
            button={{
              type: "submit",
              className: "btn btn-danger",
              disabled: object.length === 0 ? true : false,
              onClick: handleReset,
            }}
            style={{}}
            className="btn btn-danger"
          >
            Reset
          </Form.Button>
        </div>
      )}
      {!hideUploaded &&
        <div className="dashboard-main-content-info">
          {Settings.isNotViewer() && (
            <div className="dashboard-main-content__header mb-3">
              <h4>Uploaded Document</h4>
            </div>
          )}
          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            {objects && (
              <Table
                object={{
                  columns: Column.masterUploadFile(),
                  data: rowss,
                  count: objects.count,
                  create: false,
                  search: false,
                }}
              // preference={1}
              />
            )}
          </div>
        </div>}
    </div>
  );
}
