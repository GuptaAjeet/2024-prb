import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Helper, Hook } from "../../../apps";
import api from "../../../apps/utilities/api";
import Features from "../../../redux/features";
import NumberInput from "../../../apps/components/form/NumberInput";
import MultiSelect from "../../../apps/components/form/MultiSelect";
import { REACT_APP_URL } from "../../../env";
import axios from "axios";
import $ from "jquery";
import exportToExcel from "./PrabandhReports/ExcelReports";

const Hostel = (props) => {
  const user = Helper.auth.user;
  
  const stateList = Hook.useStates();
  const [hostelList, setHostelList] = useState([]);

  const [districtsList, setDistrictsList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [schoolsList, setSchoolsList] = useState([]);
  
  const dispatch = useDispatch();

  const [hostel, setHostel] = useState({
    state_id: user.user_state_id,
    district_id: user.user_district_id,
    udise_block_code: 0,
    hostel_code: ""
  });

  const file = useRef();

  const getHostelList = () =>{
    api.post(
      `api/hostel/find`,
      {state_id: user.user_state_id},
      (res) => {
        setHostelList(res.data);
      }
    );
  }


  const getDistrictsList = (state_id) => {
    api.post(
      `api/districts/find`,
      {district_state_id: state_id},
      (res) => {
        setDistrictsList(res.data);
      }
    );
  };

  const getBlockList = (dist_id) => {
    api.post(
      `api/blocks/find`,
      {block_district_id: dist_id},
      (res) => {
        setBlockList(res.data);
      }
    );
  };

  const getSchoolsList = (udise_block_code) => {
    api.post(
      `api/proposal-after-approval/school-list-of-block`,
      { block_cd: udise_block_code, state_id: hostel.state_id, diet: true },
      (res) => {
        setSchoolsList(
          res.data?.map((v) => ({
            name: `${v?.school_name} (${v?.udise_sch_code})`,
            id: v.udise_sch_code,
          }))
        );
      }
    );
  };

  useEffect(() => {
    if (props.stateRowsParent) {
      props.stateRowsParent([]);
    }
    getHostelList();
  }, []);

  useEffect(()=>{
      getDistrictsList(hostel.state_id)
  }, [hostel.state_id])

  useEffect(()=>{
    if(hostel.district_id){
      getBlockList(hostel.district_id)
    }
  }, [hostel.district_id])
  
  useEffect(()=>{
    getSchoolsList(hostel.udise_block_code)
  }, [hostel.udise_block_code])

  const handelInputChange = (e, name) =>{
    setHostel(prevState=>{
      if(name){
        prevState[name] = e.map(el=>el.id);
      }else{
        prevState[e.target.name] = (e.target.value || null);
      }
      return {...prevState};
    })
  }

  const getRowSpanCount = (data, field, rowIndex) => {
    const johnIndex = data.indexOf(data.find((item) => item[field] === data[rowIndex][field]));

    if (johnIndex < rowIndex) {
        return 0;
    }

    let rowSpanCount = 1;
    rowSpanCount = data.filter((item) => item[field] === data[rowIndex][field])?.length;
    return rowSpanCount;
  };

  const onFormSubmit = () =>{
    const selected = file?.current?.files[0];
    // if(!hostel.hostel_id && file?.current?.files.length===0){
    //   dispatch(Features.showToast({ message: "Please fill all mandatory fields.", flag: "bg-danger" }));
    // }else 
    if(
      !hostel?.state_id ||
      !hostel?.district_id ||
      !hostel?.udise_block_code ||
      !hostel?.address || 
      !hostel?.habitation || 
      !hostel?.population || 
      !hostel?.hostel_type || 
      !hostel?.capacity || 
      !hostel?.school?.length ||
      (
        (hostel?.longitude || hostel?.latitude) && 
        (!hostel?.longitude || !hostel?.latitude || !hostel?.survey_number || file?.current?.files.length===0 || !hostel?.area_of_land || !hostel?.nature_of_land) 
      )
    ){
      dispatch(Features.showToast({ message: "Please fill all mandatory fields.", flag: "bg-danger" }));
    }else{
      api.upload("api/hostel/create", selected, {...hostel}, (res)=>{
        if (res.status) {
          getHostelList();
          dispatch(Features.showToast({ message: res.message }));
          setHostel({
            state_id : "",
            district_id : "",
            udise_block_code : "",
            hostel_name : "",
            hostel_code : "",
            address : "",
            habitation : "",
            population : "",
            capacity : "",
            hostel_type : "",
            longitude : "",
            latitude : "",
            survey_number : "",
            survey_doc : "",
            area_of_land : "",
            nature_of_land : "",
            sanction_amount : "",
            tender_floated : "",
            construction_agency : "",
            hostel_construction_agency: ""
          })
          
        } else {
          dispatch(Features.showToast({ message: res.message, flag: "bg-danger" }));
        }
      })
    }
  }

  const handleDownloadFile = async (currentItem) => {
    const name = currentItem.survey_doc;
    const pdfUrl = `${REACT_APP_URL}api/hostel/downloadfile/${currentItem?.hostel_id}`;

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

  const exportTableToExcel = async () => {
    exportToExcel("byTableHtml", {
        skipColumn: [],
        reportData: hostelList,
        table: $(".table-scroll"),
        fileName: `Configure_DIET_Plan`,
        sheetName: "Sheet 1",
        report_header: `Configure DIET Plan, State: ${$("select[name='state-list']").find("option:selected").text()},  Diet: ${$("select[name='diet-list']").find("option:selected").text()}`,
    });
  };
  
  return (
    <div className="dashboard-main-content">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></div>
      <div className="dashboard-main-content__header d-flex justify-content-between">
        <h1 className="mb-2">PM Janman Hostel</h1>
        {/* <div>
          <button
              type="button"
              className="btn btn-success float-end mb-2"
              onClick={exportTableToExcel}
              disabled={!hostelList?.length}
              >
              <i className="bi bi-file-earmark-excel"></i>{" "}
              <span className="mobile-hide">Export To</span> Excel
          </button>
        </div> */}
      </div>

      {!!user.user_state_id && <div className="dashboard-main-content-info mb-3 p-3 accordions">

        <div className="accordion contribute-page" id="accordionExample">
          <div className="accordion-item">
            <h6 className="accordion-header">
              <button className="accordion-button collapsed p-2 ps-3 pe-3" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne`}
                aria-expanded="true" aria-controls={`collapseOne`}>
                Identification of Location
              </button>
            </h6>

            <div
              id={`collapseOne`}
              className={`accordion-collapse collapse show`}
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body p-3 pt-1">
                <div className="card p-3 pt-2 pb-2 mb-3 mt-2 b-shadow">
                <div className="row">

                  <div className="form-group col-sm-3 mb-2">
                    <label htmlFor="exampleInputEmail1 ">State <span className="text-danger">*</span></label>
                    <select className="form-control"
                      disabled={user.user_state_id}
                      onChange={(e)=>{
                        getDistrictsList(e.target.value);
                        handelInputChange(e);
                      }}
                      name="state_id"
                      value={hostel.state_id}
                    >
                      <option>--State--</option>
                      {stateList?.map((st, stidx) => (
                        <option key={`st_${stidx}`} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-sm-3 mb-2">
                    <label htmlFor="exampleInputEmail1">District <span className="text-danger">*</span></label>
                    <select className="form-control"
                      disabled={user.user_district_id}
                      onChange={(e)=>{
                        getBlockList(e.target.value);
                        handelInputChange(e);
                      }}
                      name="district_id"
                      value={hostel.district_id}
                    >
                      <option>--District--</option>
                      {districtsList?.map((dst, dstidx) => (
                        <option key={`dst_${dstidx}`} value={dst.id}>
                          {dst.district_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-sm-3 mb-2">
                    <label htmlFor="exampleInputEmail1">Block <span className="text-danger">*</span></label>
                    <select className="form-control" 
                      onChange={(e)=>{
                        getSchoolsList(e.target.value);
                        handelInputChange(e);
                      }}
                      name="udise_block_code"
                      value={hostel.udise_block_code}
                    >
                      <option>--Block--</option>
                      {blockList?.map((dst, dstidx) => (
                        <option key={`dst_${dstidx}`} value={dst.udise_block_code}>
                          {dst.name}
                        </option>
                      ))}
                    </select>
                  </div>
             
                  <div className="form-group col-sm-3 mb-2">
                    <label htmlFor="Address">Location of Hostel <span className="text-danger">*</span></label>
                    <input type="text" name="address" value={hostel?.address} onChange={handelInputChange} className="form-control" id="Address" placeholder="Enter Location of Hostel" />
                  </div>
                  </div>
   </div>
                  <div className="row">

                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="Habitation" className="label ">No of Habitation to be covered by sanctioned PVTG Hostel <span className="text-danger">*</span></label>
                    <NumberInput type="text" name="habitation" decimal={false} value={hostel?.habitation} currentValue={hostel?.habitation} onChange={handelInputChange} className="form-control" id="Habitation" placeholder="Enter Habitation" />
                  </div>
                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="Population" className="label ">No of Population to be covered by sanctioned PVTG Hostel <span className="text-danger">*</span></label>
                    <NumberInput type="text" name="population" decimal={false} value={hostel?.population} currentValue={hostel?.population} onChange={handelInputChange} className="form-control" id="Population" placeholder="Enter Population" />
                  </div>

                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="exampleInputEmail1" className="label ">Hostel Type <span className="text-danger">*</span></label>
                    <select name="hostel_type" value={hostel?.hostel_type} onChange={handelInputChange} className="form-control">
                      <option value="">--Hostel Type--</option>
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                    </select>
                  </div>
                  
                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="Capacity" className="label">Capacity of Hostel <span className="text-danger">*</span></label>
                    <NumberInput type="text" name="capacity" decimal={false} value={hostel?.capacity} currentValue={hostel?.capacity} onChange={handelInputChange} className="form-control" id="Capacity" placeholder="Enter Capacity" />
                  </div>

                  <div className="form-group col-sm-4 mb-2">
                    <label htmlFor="exampleInputEmail1" className="label">School <span className="text-danger">*</span></label>
                    <MultiSelect 
                      options={
                        schoolsList
                      } 
                      displayValues="name"
                      selectedValues={ schoolsList.filter(sl=> hostel?.school?.indexOf(sl.id)>-1) } 
                      attr={{
                          id: `select-school-list`, name: `school`,
                          onSelect: (e) => handelInputChange(e, "school"),
                          onRemove: (e) => handelInputChange(e, "school"),
                      }}
                      // label="Select Activity Group's Scheme" default="Select Activity Group's Scheme" mandatory="true" disable={props?.object?.readOnly} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion contribute-page" id="accordionExample2">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed p-2 ps-3 pe-3" type="button" data-bs-toggle="collapse" data-bs-target={`#collapsetwo`}
                aria-expanded="true" aria-controls={`collapsetwo`}
                
              >
                Land Availability and Approvals
              </button>
            </h2>

            <div
              id={`collapsetwo`}
              className={`accordion-collapse collapse ${0 && "show"
                }`}
              data-bs-parent="#accordionExample2"
            >
              <div className="accordion-body p-2 pt-1">
                <div className="row">

                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="Longitude">Longitude {(hostel?.longitude || hostel?.latitude) && <span className="text-danger">*</span>}</label>
                    <NumberInput type="text" name="longitude" decimal={6} value={hostel?.longitude} currentValue={hostel?.longitude} onChange={handelInputChange} className="form-control" id="Longitude" placeholder="Enter Longitude" />
                  </div>
                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="Latitude">Latitude {(hostel?.longitude || hostel?.latitude) && <span className="text-danger">*</span>}</label>
                    <NumberInput type="text" name="latitude"  decimal={6} value={hostel?.latitude} currentValue={hostel?.latitude} onChange={handelInputChange} className="form-control" id="Latitude" placeholder="Enter Latitude" />
                  </div>
                  <div className="form-group col-sm-3 mb-2">
                    <label htmlFor="survey_no">Survey No/ Khasra No {(hostel?.longitude || hostel?.latitude) && <span className="text-danger">*</span>}</label>
                    <input type="text" name="survey_number" value={hostel?.survey_number} onChange={handelInputChange} className="form-control" id="survey_no" placeholder="Enter Survey No/ Khasra No" />
                  </div>
                  <div className="form-group col-sm-3 mb-2">
                    <label>Survey/Khasra Document {(hostel?.longitude || hostel?.latitude) && <span className="text-danger">*</span>}</label>
                    {/* <label htmlFor="survey_doc" className="btn btn-primary" style={{display: "block", width: "fit-content"}}>
                      <i className="bi bi-file-earmark-arrow-up"/> Selected
                    </label> */}
                      <input type="file" ref={file} accept="application/pdf"
                        onChange={(e)=>{
                          if(e.target.files[0].type !== "application/pdf"){
                            dispatch(Features.showToast({ message: "Please select a valid file. Only PDF files are allowed.", flag: "bg-danger" }));
                            file.current.value = '';
                          }
                        }} 
                        name="survey_doc" className="form-control" id="survey_doc" placeholder="Survey/Khasra Document" 
                        style={{width: hostel?.survey_doc ? "88%" : "100%", display: "inline-block"}}
                      />
                      {hostel?.survey_doc && 
                      <button type="button" 
                        title={hostel?.survey_doc} 
                        className="btn btn-success btn-sm" 
                        onClick={()=>handleDownloadFile(hostel)}
                        style={{width: "12%", display: "inline-block", padding: "9px", marginBottom: "3px"}} >
                          <i className="bi bi-file-earmark-arrow-down" />
                      </button>}
                    
                  </div>
                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="area_of_land">Area of Land in Sq.Mtr {(hostel?.longitude || hostel?.latitude) && <span className="text-danger">*</span>}</label>
                    <NumberInput type="text" name="area_of_land"  decimal={5} value={hostel?.area_of_land} currentValue={hostel?.area_of_land} onChange={handelInputChange} className="form-control" id="area_of_land" placeholder="Enter Area of Land in Sq.Mtr" />
                  </div>
                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="nature_of_land">Nature of Land {(hostel?.longitude || hostel?.latitude) && <span className="text-danger">*</span>}</label>
                    <select name="nature_of_land" value={hostel?.nature_of_land} onChange={handelInputChange} className="form-control" id="nature_of_land">
                      <option>--Nature of Land--</option>
                      <option>(FRA392) Land</option>
                      <option>Govt. Land</option>
                      <option>Any other</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion contribute-page" id="accordionExample3">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed p-2 ps-3 pe-3" type="button" data-bs-toggle="collapse" data-bs-target={`#collapsethree`}
                aria-expanded="true" aria-controls={`collapsethree`}
              
              >
                Construction of Hostel
              </button>
            </h2>

            <div
              id={`collapsethree`}
              className={`accordion-collapse collapse ${0 && "show"
                }`}
              data-bs-parent="#accordionExample3"
            >
              <div className="accordion-body p-2 pt-1">
                <div className="row">

                  <div className="form-group col-sm-4 mb-2">
                    <label htmlFor="sanction_amount">Total Amount Sanction for Hostel Construction (In Lakhs)</label>
                    <NumberInput type="text" name="sanction_amount" value={hostel?.sanction_amount} currentValue={hostel?.sanction_amount} onChange={handelInputChange} className="form-control" id="sanction_amount" placeholder="Enter Sanction Amount" />
                  </div>
                  
                  <div className="form-group col-sm-2 mb-2">
                    <label htmlFor="tender_floated">Tender Floated</label>
                    <select name="tender_floated" value={hostel?.tender_floated} onChange={handelInputChange} className="form-control" id="tender_floated">
                      <option value="0">--Tender Floated--</option>
                      <option value="1">Yes</option>
                      <option value="2">No</option>
                    </select>
                  </div>

                  <div className="form-group col-sm-3 mb-2">
                    <label htmlFor="hostel_construction_agency">Agency selected for Hostel Construction</label>
                    <select name="hostel_construction_agency" disabled={+hostel?.tender_floated===2} value={hostel?.hostel_construction_agency} onChange={handelInputChange} className="form-control" id="hostel_construction_agency">
                      <option value="0">--Agency selected for Hostel Construction--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Yet to be decided">Yet to be decided</option>
                    </select>
                  </div>
                  
                  <div className="form-group col-sm-3 mb-2">
                    <label htmlFor="construction_agency">Construction Agency</label>
                    <input type="text" name="construction_agency" disabled={+hostel?.tender_floated===2} value={hostel?.construction_agency} onChange={handelInputChange} className="form-control" id="construction_agency" placeholder="Enter Construction Agency" />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <input type="button" className="form-control btn btn-primary w-auto pe-3 ps-3" id="save-btn" 
            onClick={()=>{
              onFormSubmit();
            }} 
            value={"Save"} 
          />
        </div>

      </div>}

      <div className="dashboard-main-content-info">
        
        {hostelList?.length === 0 ? 
          <h3 className="text-center">No Data Found</h3> : 
          <div>
            <div className="text-end">
              <button type="button" className={`btn btn-primary ${!user.user_state_id ? "d-none" : ""}`} 
                onClick={()=>
                  setHostel({
                    state_id : "",
                    district_id : "",
                    udise_block_code : "",
                    hostel_name : "",
                    hostel_code : "",
                    address : "",
                    habitation : "",
                    population : "",
                    capacity : "",
                    hostel_type : "",
                    longitude : "",
                    latitude : "",
                    survey_number : "",
                    survey_doc : "",
                    asdas : "",
                    nature_of_land : "",
                    sanction_amount : "",
                    tender_floated : "",
                    construction_agency : "",
                    hostel_construction_agency: ""
                  })
                }
              >Add</button>
            </div>
            <div className="table-scroll-section">
              <table className="table-scroll">
                <thead>
                  <tr>
                    <th>S.no.</th>
                    <th>State</th>
                    <th>District</th>
                    <th>Block</th>
                    <th>Schools</th>
                    <th>Location of Hostel</th>
                    <th>Area of Land <br/>in Sq.Mtr</th>
                    <th>Capacity of <br/>Students</th>
                    <th>Amount in <br/>lakhs</th>
                    {user.user_state_id && <th style={{width: "80px"}}>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {hostelList?.map((host, hIndex)=>{
                    const rowSpanState = getRowSpanCount(hostelList, "state_name", hIndex)
                    const rowSpanDist = getRowSpanCount(hostelList, "district_name", hIndex)
                    const rowSpanBlock = getRowSpanCount(hostelList, "block_name", hIndex)
                    return <tr>
                      <td>{hIndex+1}</td>
                      {rowSpanState > 0 ? <td rowSpan={rowSpanState}>{host.state_name}</td> : []}
                      {rowSpanDist > 0 ? <td rowSpan={rowSpanDist}>{host.district_name}</td> : []}
                      {/* {rowSpanBlock > 0 ? <td rowSpan={rowSpanDist}>{host.block_name}</td> : []} */}
                      {/* <td>{host.state_name}</td>
                      <td>{host.district_name}</td>*/}
                      <td>{host.block_name}</td> 
                      <td dangerouslySetInnerHTML={{__html:host.school_names}}></td>
                      <td>{host.address}</td>
                      <td className="text-end">{host.area_of_land}</td>
                      <td className="text-end">{host.capacity}</td>
                      <td className="text-end">{host.sanction_amount}</td>
                      {user.user_state_id && <td>
                        <button type="button" className="btn btn-primary" 
                          onClick={()=>{
                            setHostel(()=>{
                              return {...host, school: host?.school?.split(',') || []}
                            })
                          }}
                        ><i className="fa fa-pencil"></i></button>
                      </td>}
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Hostel;
