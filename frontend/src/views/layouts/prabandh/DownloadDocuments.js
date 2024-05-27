import { useEffect, useState,  useMemo } from "react";
import { Column, Helper, Table } from "../../../apps";
import { useSelector } from "react-redux";
import axios from "axios";
import { REACT_APP_URL } from "../../../env";
import api from "../../../apps/utilities/api";

const DownloadDocuments = () => {

  let [docList, setDocLict] = useState([
    {
      id: 1,
      document_type: "Samagra Siksha Norms",
      description: "Report For Samagra Siksha Norms In Elementary, Secondary and Teachers' Education.",
      file_path: "/",
      file_name: "Samagra Siksha Norms Elementary Secondary and Teacher Education for NIC.xls",
      local_file: true
    },
    {
      id: 2,
      document_type: "Annexure-I",
      description: "Tentative Project Approval Board Schedule For Year 2024-2025.",
      file_path: "/",
      file_name: "Annexure-I (Tentative PAB Schedule 2024-25).docx",
      local_file: true
    }
  ])

  const handleDownload = (fileObj) => {
    if (fileObj?.local_file && fileObj?.local_file == true) {
      handleLocalDownload(fileObj);
    }else{
      handlePublicFileDownload(fileObj.id, fileObj.file_name)
    }
  };

  const handleLocalDownload = (fileObj) => {

    // Create an anchor element
    const anchor = document.createElement('a');

    // Set the href attribute to the file path
    anchor.href = fileObj.file_path + fileObj.file_name;

    // Set the download attribute with the desired file name
    anchor.download = fileObj.file_name;

    // Append the anchor to the document body
    document.body.appendChild(anchor);

    // Trigger a click on the anchor to start the download
    anchor.click();

    // Remove the anchor from the document body
    document.body.removeChild(anchor);
  }

  const handlePublicFileDownload = async (id, name) => {
    const pdfUrl = `${REACT_APP_URL}api/prabandh/file/downloadfile/${id}`;

    try {
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf/xlsx",
          Authorization: `Bearer ${Helper.token()}`
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

  // const dispatch = useDispatch();
  const handler = useSelector((state) => state.handler);

  let userData = Helper.auth?.user;

  useEffect(() => {
    // dispatch(
    //   Features.makeHandler({
    //     page: 1,
    //     limit: 10,
    //     reload: 0,
    //     where: {},
    //   })
    // );

    getuploaddata();
  }, [handler]);

  // const gridStyle = useMemo(() => ({ height: "600px", width: "100%" }), []);
  // const gridRef = useRef();

  const getuploaddata = () =>{
    api.post("api/prabandh/getuploaddata", {
      page: handler.page,
      limit: handler.limit, 
      reload: handler.reload,
      where: handler?.where,
      role_id: +userData?.user_role_id,
      district_id: +userData?.user_district_id,
      state_id: +userData?.user_state_id,
      user_id: +userData?.id,
    },(res=>{
      if(res.status){
        setDocLict(prevState=>{
          return [...prevState, ...res.data];
        })
      }
    }))
  }
  let rows = [];
  if (docList !== null && docList !== undefined) {
    docList &&
    docList?.map((row, i) => {
        return (rows[i] = {
          srl: i + 1,
          file_name: row.document_type,
          description: row.description,
          state_name: row.state_name || '----',
          action: (
            
            <div className="text-left pb-2 text-center">
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleDownload(row)}
            >
              <i
                className="bi bi-download "
                style={{ fontSize: "1rem", color: "white" }}
              ></i>
            </button>
          </div>
          ),
        });
      });
  }

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3">
        <h1>Download Documents</h1>
      </div>

      {/* <div className="dashboard-main-content-info">
        <div className="row">
          {docList.length > 0 && (
            <div style={gridStyle} className={"ag-theme-alpine AS"}>
              <AgGridReact
                ref={gridRef}
                columnDefs={[
                  {
                    headerName: "S. No.",
                    width: 91,
                    valueGetter: params => {
                      return params.node.rowIndex + 1;
                    }
                  },
                  {
                    headerName: "File Name",
                    field: "document_type",
                    type: "leftAligned",
                    width: 357,
                    cellStyle: params => {
                      return { textAlign: 'left' };
                    },
                  },
                  {
                    headerName: "Description",
                    field: "description",
                    type: "leftAligned",
                    width: 700,
                    cellStyle: params => {
                      return { textAlign: 'left' };
                    },
                  },
                  {
                    headerName: "State",
                    field: "state_name",
                    type: "leftAligned",
                    cellStyle: params => {
                      return { textAlign: 'left' };
                    },
                  },
                  {
                    headerName: "Action",
                    sortable: false,
                    width: 170,
                    cellRenderer: function StatusRenderer(params) {
                      return (
                        <div className="text-left pb-2 text-center">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleDownload(params.data)}
                          >
                            <i
                              className="bi bi-download "
                              style={{ fontSize: "1rem", color: "white" }}
                            ></i>
                          </button>
                        </div>
                      );
                    },
                  }
                ]}
                rowData={docList}
                animateRows={true}
                defaultColDef={defaultColDef}
                checkboxSelection={false}
                rowSelection={'single'}
                pagination={true}
                paginationPageSize={10}
                paginationAutoPageSize={false}
              />
            </div>
          )}
          
        </div>
      </div> */}
      <div className="dashboard-main-content-info">
          <div className="col-xl-12 col-lg-12 col-sm-12 ">
            {docList && (
              <Table
                object={{
                  columns: Column.downloadDataColumn(),
                  data: rows,
                  count: docList.length,
                  create: false,
                  search: false,
                }}
                height="auto"
                preference={1}
              />
            )}
          </div>
        </div>
    </div>
  );
};

export default DownloadDocuments;
