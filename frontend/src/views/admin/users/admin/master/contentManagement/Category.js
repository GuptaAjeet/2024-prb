// Find what you need faster … Home is your new landing page and surfaces your most relevant files and folders
import React, { useState } from "react";
import { Error } from "../../../../../../apps/components/elements";
import { API, Column, Helper, Hook, Table } from "../../../../../../apps";
import { useDispatch, useSelector } from "react-redux";
import Features from "../../../../../../redux/features";
import axios from "axios";
import { REACT_APP_URL } from "../../../../../../env";
import api from "../../../../../../apps/utilities/api";

export default function Category() {
  const user_role_id = JSON.parse(localStorage.getItem("userData"));
  // user_role_id.user.user_role_id
  const [errors, setErrors] = useState([]);
  // const [edit]
  const [data, setData] = useState({ status: "0" });
  const [edit, setEdit] = useState(false);

  const handler = useSelector((state) => state.handler);

  const objects = Hook.usePost({
    url: "api/cms/find",
    data: {
      cid: user_role_id.user.user_role_id,
      page: handler.page,
      limit: handler.limit,
      reload: handler.reload,
      where: handler?.where,
    },
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleFocus = (e) => {
    const { name } = e.target;
    const er = [...errors];
    const index = errors && errors.indexOf(name);
    if (index === -1) {
      er.push(name);
      setErrors(er);
    }
  };
  const handleUploadfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, file: file, img_icon: undefined });
    } else {
      setData({ ...data, file: "" });
    }
  };
  const hanldeSubmitCategory = async () => {
    const formbodyData = new FormData();
    let slug = data?.title?.replace(/\s+/g, "-");
    formbodyData.append("title", data.title);
    formbodyData.append("description", data.description);
    formbodyData.append("status", 0);
    data?.file && formbodyData.append("file", data.file);
    formbodyData.append("slug", slug.toLowerCase());
    data?.img_icon && formbodyData.append("img_icon", data.img_icon);
    formbodyData.append("created_by", user_role_id.user.user_role_id);
    try {
      const response = await axios.post(
        `${REACT_APP_URL}api/cms/category/create`,
        formbodyData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Helper.token()}`
          },
        }
      );
      if (response.status === 200) {
        dispatch(
          Features.makeHandler({
            reload: new Date().getTime(),
            where: Helper.whereCategorySelector(),
          })
        );
        dispatch(
          Features.showToast({ message: "Category Created Successfully" })
        );
        setData({
          status: "0",
          title: "",
          description: "",
          img_icon: "",
          file: "",
        });
        setErrors([]);
      } else {
        console.error("Error sending form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
    }
  };
  const statusHandler = (status, id) => {
    // axios
    //   .post(`${REACT_APP_URL}api/prabandh/mastertype/update`, {
    //     data: {
    //       status: status ? 0 : 1,
    //       id: id,
    //     },
    //   })
    //   .then(function (response) {
    //     dispatch(Features.showToast({ message: response.data.message }));
    //     dispatch(
    //       Features.makeHandler({
    //         reload: new Date().getTime(),
    //         where: Helper.whereMasterTypeObjSelector(),
    //       })
    //     );
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };
  const handleEdit = (row) => {
    setData(row);
    setEdit(true);
  };
  const handleCancel = () => {
    setData({
      status: "0",
      title: "",
      description: "",
      img_icon: undefined,
      file: undefined,
    });
    setErrors([]);
    setEdit(false);
  };
  const handleDelete = (id) => {
    api.delete(
      "api/cms/deleteBYId",
      { id: user_role_id?.user?.user_role_id },
      (data) => {
        if (data.status) {
          dispatch(
            Features.showToast({ message: "File Deleted Successfully" })
          );
          dispatch(
            Features.makeHandler({
              reload: new Date().getTime(),
              where: Helper.whereMasterUploadSelector(),
            })
          );
        }
      }
    );
  };
  const handleUpdateStatus = (slug, status) => {
    api.post(
      "api/cms/categoryupdatestatus",
      { data: { status: status ? 0 : 1, slug: slug } },
      (data) => {
        if (data.status) {
          dispatch(Features.showToast({ message: "Category Status Updated" }));
          dispatch(
            Features.makeHandler({
              reload: new Date().getTime(),
              where: Helper.whereMasterUploadSelector(),
            })
          );
        }
      }
    );
  };
  const rows = [];

  if (objects?.TimelineImage !== null && objects?.TimelineImage !== undefined) {
    objects &&
      objects.TimelineImage &&
      objects.TimelineImage.map((row, i) => {
        return (rows[i] = {
          srl: i + 1,
          title: row.title,
          img_icon: (
            <div className="category_img_div">
              <img src={`http://localhost:4000/${row.img_icon}`} />
            </div>
          ),
          description: row.description,
          status: (
            <div className="text-center">
              <i
                className={`fa-regular fa-square-check ${
                  row.status === 1 ? "text-success" : "text-danger"
                }`}
                onClick={(e) => handleUpdateStatus(row.slug, row.status)}
                key={i}
                data-id={row.id}
              ></i>
            </div>
          ),
          action: (
            <div
              className="text-center"
              style={{
                display: "flex",
                justifyContent: "center",
                columnGap: "1rem",
              }}
            >
              <i
                className={`fa-solid fa-pen text-warning`}
                style={{ fontSize: "1.2rem", color: "green" }}
                onClick={() => handleEdit(row)}
              ></i>
              <i
                key={i}
                onClick={() => handleDelete(row.id)}
                className="bi bi-trash3 text-danger"
                style={{ fontSize: "1.2rem" }}
                data-id={row.id}
              ></i>
            </div>
          ),
        });
      });
  }
  function isEmpty(data) {
    for (let prop in data) {
      //console.log(data.hasOwnProperty(prop));
      if (data.hasOwnProperty(prop))
        //console.log(data.hasOwnProperty(prop));
        return false;
    }
    return true;
  }
  const options = [{ id: "1", name: "Active" }];
  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>Categorey</h1>
      </div>
      <div className="dashboard-main-content-info mb-3">
        <div className="row">
          <div className="col-md-4 mb-4">
            <label htmlFor="">
              Title
              {errors.includes("title") &&
                (data?.title === undefined || data?.title.length === 0) && (
                  <Error> Please Enter Title</Error>
                )}
            </label>
            <input
              onChange={handleChange}
              value={data?.title}
              onFocus={handleFocus}
              name="title"
              id="title"
              autoComplete="off"
              className={`form-control `}
            />
          </div>
          {/* <div className="col-md-4 mb-4">
                        <label >
                            Slug
                            {(errors.includes("slug") && (data?.slug === undefined || data?.slug.length === 0)) && <Error> Please Enter Slug</Error>}
                        </label>
                        <input onChange={handleChange} value={data?.slug} name='slug' id='slug' onFocus={handleFocus} autoComplete="off" className={`form-control `} />
                    </div> */}
          <div className="col-md-4 mb-4">
            <label>
              Status
              {/* {(errors.includes("title") && (data?.st === undefined || data?.slug.length === 0)) && <Error> Please Select Status</Error>} */}
            </label>
            <select
              className={`form-select`}
              value={data?.status}
              name="status"
              id="status"
              onChange={handleChange}
              onFocus={handleFocus}
            >
              (<option value="0">Inactive</option>)
              {options !== null &&
                options.map((row, i) => {
                  return (
                    <option key={row.id + row.name} value={row.id}>
                      {" "}
                      {row.name}{" "}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="col-md-4 mb-4">
            <label>
              Description
              {errors.includes("description") &&
                (data?.description === undefined ||
                  data?.description.length === 0) && (
                  <Error> Please Enter Description</Error>
                )}
            </label>
            <textarea
              onChange={handleChange}
              value={data?.description}
              onFocus={handleFocus}
              autoComplete="off"
              name="description"
              id="description"
              className={`form-control-textarea `}
            ></textarea>
          </div>
          <div className="col-md-4 mb-4">
            <label>
              Icon
              {errors.includes("file") &&
                (data?.file === undefined || data?.file.length === 0) && (
                  <Error> Please Enter Image Icon</Error>
                )}
            </label>
            {/* <br /> */}
            <div
              style={{
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                border: "1px solid #dbdbdb",
              }}
            >
              <label htmlFor="upload-2" style={{ fontSize: "1rem" }}>
                <i
                  className="bi bi-upload"
                  style={{ fontSize: "1.5rem", marginRight: "0.8rem" }}
                ></i>
                {(data?.file?.name === undefined ||
                  data?.file?.name?.length === 0) &&
                (data?.img_icon === undefined || data?.img_icon?.length === 0)
                  ? "Choose a File"
                  : data?.file?.name === undefined
                  ? data?.img_icon?.split("\\")[
                      data?.img_icon?.split("\\").length - 1
                    ]
                  : data?.file?.name}
                {/* {data?.file?.name === undefined
                  ? "Choose a File"
                  : data?.file?.name} */}
              </label>
              <input
                type="file"
                hidden
                onChange={handleUploadfile}
                onFocus={handleFocus}
                id="upload-2"
                accept="image/png, image/gif, image/jpeg"
              />
            </div>
            {/* 
                        <input onChange={handleChange} value={data?.file} name='file' id='file' onFocus={handleFocus} autoComplete="off" className={`form-control `} /> */}
          </div>

          <div className="col-md-4 " style={{ marginTop: "1.2rem" }}>
            {/* <button disabled className={buttonClass}> <i className="fas fa-circle-notch fa-spin"></i>  Please Wait ... </button> */}
            <button
              className="btn btn-success"
              disabled={
                data?.title?.length > 0 &&
                (data?.img_icon
                  ? data?.img_icon.length > 0
                  : data?.file?.name?.length > 0) &&
                data?.description?.length > 0
                  ? false
                  : true
              }
              onClick={hanldeSubmitCategory}
            >
              Save{" "}
            </button>
            {edit && (
              <button
                style={{ marginLeft: "10px" }}
                className="btn btn-secondary ml-3"
                disabled={
                  data?.title?.length > 0 &&
                  (data?.img_icon
                    ? data?.img_icon.length > 0
                    : data?.file?.name?.length > 0) &&
                  data?.description?.length > 0
                    ? false
                    : true
                }
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      {objects && objects.TimelineImage.length !== 0 && (
        <div className="dashboard-main-content-info">
          <div className="col-xl-12 col-lg-12 col-sm-12">
            {objects && objects.TimelineImage.length !== 0 && (
              <Table
                object={{
                  columns: Column.cmsCategory(),
                  data: rows,
                  count: objects.TimelineImage.length,
                  create: false,
                  search: true,
                  // handleChange: searchData,
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
