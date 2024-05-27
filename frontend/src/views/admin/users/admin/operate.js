import React, { lazy, useState, useRef, useEffect } from "react";
import { Hook, API, Form, Helper, Settings, Column, Model, sweetAlert, AlertMessages } from "../../../../apps";
import { useDispatch, useSelector } from "react-redux";
import Features from "../../../../redux/features";
import SelectActivity from "./selectActivity";
import { useNavigate, useLocation } from "react-router-dom";
const UpdatePass = lazy(() => import("./updatePass"));
const TwoFactorAuth = lazy(() => import("./twoFA"));
const UpdateEmailMobileNumber = lazy(() => import("./updateEmailMobileNumber"));

const Operate = () => {
  var name = useRef();
  var email = useRef();
  var role = useRef();
  var mobile = useRef();
  var state = useRef();
  var diet = useRef();
  var district = useRef();
  var designation = useRef();
  const actgrpref = useRef(null);
  const locgrpref = useRef(null);

  const [coordRef, setRef] = useState([{ detailsNumber: 1 }]);
  const [fincoordRef, setfinRef] = useState([{ detailsNumber: 1, actgrpref, locgrpref }]);
  const defaultValidationInputs = [name, email, role, mobile, designation];
  const [fInputs, SetFInputs] = useState(defaultValidationInputs);
  const [ROptions, setROption] = useState([]);
  const [DOptions, setDOptions] = useState([]);
  const [showSelectActivity, setShowSelectActivity] = useState(false);
  const [display, setDisplay] = useState({ state: "d-none", district: "d-none", block: "d-none" });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [activity_ids, setActivity_ids] = useState([]);
  const [oldModel, setOldModel] = useState([]);
  const [isEdit, setIsEdit] = useState(true);
  const [fSubmit, setFSubmit] = useState(false);
  const [selectedKey, setSelectedKey] = useState('')
  const [disabledFieldsList, setdisabledFields] = useState({ sc: true, nfc: true, nic: true })
  const [finalGroupVal, setFinalGroupVal] = useState([]);
  const [grpActData, setGrpActData] = useState([]);
  const [grpLocationData, setGrpLocationData] = useState([]);
  const [tblData, setTblData] = useState([]);
  const [changePass, setChangePass] = useState(false);
  const [allotedStates, setAllotedStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([])
  const [twoFA, setTwoFA] = useState(false);
  const [updateContact, setUpdateContact] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [selectActivities, setSelectActivities] = useState(false);
  const [fetchedActivities, setFetchedActivities] = useState([]);

  const model = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, userRoleId, prevPath } = location.state;
  const SOption = Hook.useStates();
  const DOption = Hook.useDistricts();
  const roles = Hook.useRoles();
  const reduxObj = useSelector((state) => state.modal);
  const { handleChange, values, errors, form } = Hook.useForm(fInputs);

  const object = Hook.usePost({ url: "api/admin-users/find-user", data: { id: id, role: +userRoleId } });

  let userData = Helper.auth?.user;

  const dietOptions = Hook.useDIETs(userData?.user_state_id);
  const eRole = +userRoleId;

  useEffect(() => {
    if (id > 0)
      updateHandler()
    else
      addHandler()
  }, [object, roles, values, id]);

  // useEffect(() => {
  //   API.get("api/group/dropdown", null, (response) => {
  //     if (response.data !== undefined && response.data !== null) {
  //       setGrpActData(response?.data);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   API.get("api/group/locations-dropdown", null, (response) => {
  //     if (response.data !== undefined && response.data !== null) {
  //       const arr = [];
  //       response?.data.filter((item) => {
  //         if (+item.location_type === 2) {
  //           arr.push({ id: item.group_code, name: item.group_name })
  //         }
  //       })
  //       setGrpLocationData(arr);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (+role?.current?.value === 23 || +role?.current?.value === 24 || +values?.role === 23 || +values?.role === 24) {
      API.post("api/consultant/get-alloted-states", { role_code: +role?.current?.value }, (response) => {
        if (response.data !== undefined && response.data !== null) {
          setAllotedStates(Array.from(new Set(response.data.map(x => x.state_ids).flat().map(JSON.stringify))).map(JSON.parse))
        }
      });
    }
  }, [values?.role, role?.current?.value]);

  useEffect(() => {
    if (SOption?.length > 0 && allotedStates.length > 0) {
      setFilteredStates(SOption.filter(state => {
        return !allotedStates.some(allotedState => +allotedState.id === +state.id);
      }))
    }

    if (allotedStates.length === 0) {
      setFilteredStates(SOption)
    }
  }, [allotedStates])

  useEffect(() => {
    let val;
    roles?.map((v) => {
      if (+v.id === +role?.current?.value || +v.id === +eRole) {
        val = v?.role_region_id;
      }
    })

    const arr = [];
    grpActData.filter((item) => {
      if (+item.region_type_id === +val) {
        arr.push({ id: item.group_code, name: item.group_name })
      }
    })

    setFinalGroupVal(arr);
  }, [role?.current?.value, grpActData])

  useEffect(() => {
    if (showSelectActivity === false) {
      if (+id > 0) {
        name.current.value = object?.data?.user_name || '';
        email.current.value = object?.data?.user_email || '';
        mobile.current.value = object?.data?.user_mobile || '';
        role.current.value = +userRoleId || 0;
        role.current.disabled = id > 0 ? true : false;
        designation.current.value = object?.data?.designation_code || '';
        if (+eRole === 16) {
          disabledFieldsList.sc = +values?.spcl_role_id_sc === 15 ? false : true;
          disabledFieldsList.nfc = +values?.spcl_role_id_nfc === 2 ? false : true;
          disabledFieldsList.nic = +values?.spcl_role_id_nic === 3 ? false : true;
        }
      } else {
        if (Object.keys(values).length > 0) {
          name.current.value = values?.name || '';
          email.current.value = values?.email || '';
          mobile.current.value = values?.mobile || '';
          role.current.value = values?.role || 0;
          role.current.disabled = id > 0 ? true : false;
          designation.current.value = values?.designation || '';
          if (+values?.role === 16) {
            disabledFieldsList.sc = +values?.spcl_role_id_sc === 15 ? false : true;
            disabledFieldsList.nfc = +values?.spcl_role_id_nfc === 2 ? false : true;
            disabledFieldsList.nic = +values?.spcl_role_id_nic === 3 ? false : true;
          }
        }
      }
    }
  }, [showSelectActivity])

  useEffect(() => {
    if (disabledFieldsList.sc === false) {
      values['spcl_role_id_sc'] = '15';
    } else {
      delete values['spcl_role_id_sc'];
    }

    if (disabledFieldsList.nfc === false) {
      values['spcl_role_id_nfc'] = '2';
    } else {
      delete values['spcl_role_id_nfc'];
    }

    if (disabledFieldsList.nic === false) {
      values['spcl_role_id_nic'] = '3';
    } else {
      delete values['spcl_role_id_nic'];
    }
  }, [disabledFieldsList])

  useEffect(() => {
    if (values.activity_group_code) {
      API.post("api/master-settings/get-activity-group-mapping-details", { group_code: values.activity_group_code },
        (result) => {
          if (result.data.length > 0) {
            setTblData(result.data)

            setSelectedActivities(result.data.map(x => x.id))
          }
        });
    }
  }, [values.activity_group_code])

  const changePassClick = () => {
    setChangePass(true);
    dispatch(Features.showModal({ title: "Change Password" }));
  }

  const handleClosePassword = () => {
    setChangePass(false);
  }

  const twoFactorAuthEnable = () => {
    setTwoFA(true);
    dispatch(Features.showModal({ title: "Re Scan 2FA QR Code" }));
  }

  const updateContactHandler = () => {
    setUpdateContact(true);
    dispatch(Features.showModal({ title: "Update Email & Mobile Number" }));
  }

  const handleCloseTwoFactorToggle = () => {
    setTwoFA(false);
  }

  const handleDisable2FA = () => {
    API.post("auth/two-factor-auth/disable", { id: +id },
      (response) => {
        sweetAlert.done({ msg: response.message })
        setTwoFAEnabled(false)
      }
    );
  }

  const twoFactorAuthDisable = () => {
    sweetAlert.confirmation({
      title: "Confirmation",
      msg: AlertMessages.disable2FAConfirmationMsg,
      noBtnText: "No",
      yesBtnText: "Yes",
      callback: () => handleDisable2FA(),
    });
  }

  const addHandler = () => {
    if (+userData?.user_role_id === 1) {
      if (roles !== null) {
        setROption(Helper.getRolesToAdd(+userData?.user_role_id, roles))
      }

      setDisplay({ ...display, state: "d-none" });

      if (+values.role === 4 || +values.role === 26 || +values.role === 27) {
        setDisplay({ ...display, state: "" });
        SetFInputs([...defaultValidationInputs, state]);
      }

      if (+values.role === 27) {
        SetFInputs([...defaultValidationInputs, diet]);
      }
    }

    if (roles !== null && +userData?.user_role_id === 4) {
      if (roles !== null) {
        setROption(Helper.getRolesToAdd(+userData?.user_role_id, roles))
        setDisplay({ ...display, state: "", district: "d-none" });
        SetFInputs([...defaultValidationInputs, state]);

        if (+userData.user_state_id > 0) {
          values.state = +userData.user_state_id;
          state.current.value = +userData.user_state_id;
          state.current.disabled = true;
        }

        if (+values.role === 8) {
          setDisplay({ ...display, district: "" });
          SetFInputs([...defaultValidationInputs, state, district]);
          setDOptions(Helper.districtFilter(DOption, values.state));
          district.current.disabled = false;
        } else {
          district.current.disabled = true;
        }
      }
    }

    if (roles !== null && +userData?.user_role_id === 8) {
      if (roles !== null) {
        setROption(Helper.getRolesToAdd(+userData?.user_role_id, roles))
        setTimeout(() => {
          state.current.value = userData.user_state_id;
          district.current.value = userData.user_district_id;
          state.current.disabled = true;
          district.current.disabled = true;
          values.state = userData.user_state_id;
          values.district = userData.user_district_id;
          setDisplay({ ...display, state: "", district: "" });
          SetFInputs([...defaultValidationInputs, state, district]);
        }, 10);
      }

      if (values.state > 0) {
        setDOptions(Helper.districtFilter(DOption, values.state));
      }
    }
  };

  const updateHandler = () => {
    if (object !== null && object.data !== undefined && roles !== null) {
      const data = object.data;
      setIsEdit(false);

      if (isEdit) {
        setROption(Helper.roleFilter(roles, [eRole]));
        setTimeout(() => {
          if (role.current !== null) {
            role.current.value = eRole;
            role.current.disabled = true;
            values.role = eRole;
            role.current.dispatchEvent(new Event("change", { bubbles: true }));
          }

          if ((eRole >= 4 && eRole <= 14) || +eRole === 27)
            setDisplay({ ...display, state: "" })
        }, 10);

        setTimeout(() => {
          if (name.current !== null) {
            name.current.value = Helper.ucfirst(data.user_name);
          }

          if (+eRole === 27) {
            diet.current.value = +data.diet_id;
          }
        }, 100);

        if (data.assigned_group_activity_id && data.assigned_group_activity_id.length > 0) {
          setSelectedActivities(data?.assigned_group_activity_id?.split(","))
          console.log("Datata", data?.assigned_group_activity_id?.split(","))
        }

        if (data.activity_details_data && data.activity_details_data.length > 0) {
          setFetchedActivities(data?.activity_details_data)
        }

        email.current.value = data.user_email;
        mobile.current.value = data.user_mobile;
        state.current.value = data.user_state_id;
        state.current.disabled = true;
        district.current.disabled = true;

        if (+data.two_fa_enabled === 1) {
          setTwoFAEnabled(true)
          console.log("Data", data.two_fa_enabled, twoFAEnabled)
        }

        if (eRole !== 16) {
          //  activity_group_code.current.value = data.activity_group_code || null;
          values['activity_group_code'] = data.activity_group_code || null
        }

        if (designation.current)
          setTimeout(() => { designation.current.value = data.designation_code; }, 100);

        values.role = eRole;

        if (data.consultantMappingData !== null && data.consultantMappingData !== undefined && roles !== null && +eRole === 16) {
          let newNFCValues = [];
          let newNICValues = [];
          setROption(Helper.roleFilter(roles, [eRole]));
          let user_role_ids = data?.user_roles?.split(",").map(itm => +itm.trim())

          if (data.consultantMappingData.length > 0) {
            data.consultantMappingData.forEach((item) => {
              if (+item.user_role_id === 2) {
                let detailsIndex = newNFCValues.length === 0 ? 1 : newNFCValues[newNFCValues.length - 1]?.detailsNumber + 1;

                newNFCValues.push({ detailsNumber: detailsIndex });
                values["consultantnfc" + detailsIndex + "id"] = item.id;

                if (Settings.isDataExistsInArray(user_role_ids, 2)) {
                  setdisabledFields(prevState => ({ ...prevState, nfc: false }));

                  values["nfclocgrpref" + detailsIndex] = item.location_group_code;
                  values["nfcactgrpref" + detailsIndex] = item.activity_group_code;
                }
              }

              if (+item.user_role_id === 3) {
                let detailsIndex = newNICValues.length === 0 ? 1 : newNICValues[newNICValues.length - 1]?.detailsNumber + 1;
                newNICValues.push({ detailsNumber: detailsIndex });
                values["consultantnic" + detailsIndex + "id"] = item.id;

                if (Settings.isDataExistsInArray(user_role_ids, 3)) {
                  setdisabledFields(prevState => ({ ...prevState, nic: false }));

                  values["niclocgrpref" + detailsIndex] = item.location_group_code;
                  values["nicactgrpref" + detailsIndex] = item.activity_group_code;
                }
              }

              if (Settings.isMultiStateUser(+item.user_role_id)) {
                values["consultantscid"] = item.id;

                setdisabledFields(prevState => ({ ...prevState, sc: false }));
                values["sclocgrpref"] = item.location_group_code;
                values["scactgrpref"] = item.activity_group_code;
              }
            });
          }

          if (newNFCValues.length > 0)
            setfinRef(newNFCValues);

          if (newNICValues.length > 0)
            setRef(newNICValues);
        }

        if (data.consultantMappingData !== null && data.consultantMappingData !== undefined && roles !== null && Settings.isMultiStateUserButNotCooridnator(+eRole)) {
          let newNFCValues = [];
          let newNICValues = [];
          setROption(Helper.roleFilter(roles, [eRole]));
          let user_role_ids = data?.user_roles?.split(",").map(itm => +itm.trim())

          if (data.consultantMappingData.length > 0) {
            data.consultantMappingData.forEach((item) => {
              if (+item.role_code === 2) {
                let detailsIndex = newNFCValues.length === 0 ? 1 : newNFCValues[newNFCValues.length - 1]?.detailsNumber + 1;
                newNFCValues.push({ detailsNumber: detailsIndex, });
                values["consultantnfc" + detailsIndex + "id"] = item.id;

                if (Settings.isDataExistsInArray(user_role_ids, 2)) {
                  setdisabledFields(prevState => ({ ...prevState, nfc: false }));

                  values["statenfc" + detailsIndex] = item.state_ids;
                  values["majorcomponentnfc" + detailsIndex] = item.major_component_ids;
                  values["subcomponentnfc" + detailsIndex] = item.sub_component_ids;
                  values["submajorcomponentnfc" + detailsIndex] = item.sub_component_ids;
                  values["componentnfc" + detailsIndex] = item.component;
                  values["activitynfc" + detailsIndex] = item.activity_ids;
                }
              }

              if (+item.role_code === 3) {
                let detailsIndex = newNICValues.length === 0 ? 1 : newNICValues[newNICValues.length - 1]?.detailsNumber + 1;
                newNICValues.push({ detailsNumber: detailsIndex });
                values["consultantnic" + detailsIndex + "id"] = item.id;

                if (Settings.isDataExistsInArray(user_role_ids, 3)) {
                  setdisabledFields(prevState => ({ ...prevState, nic: false }));

                  values["statenic" + detailsIndex] = item.state_ids;
                  values["majorcomponentnic" + detailsIndex] = item.major_component_ids;
                  values["subcomponentnic" + detailsIndex] = item.sub_component_ids;
                  values["submajorcomponentnic" + detailsIndex] = item.sub_component_ids;
                  values["componentnic" + detailsIndex] = item.component;
                  values["activitynic" + detailsIndex] = item.activity_ids;
                }
              }
              if (Settings.isMultiStateUser(+item.role_code)) {
                values["consultantscid"] = item.id;

                setdisabledFields(prevState => ({ ...prevState, sc: false }));
                values["statesc"] = item.state_ids;
              }
            });
          }

          if (newNFCValues.length > 0)
            setfinRef(newNFCValues);

          if (newNICValues.length > 0)
            setRef(newNICValues);
        }
      }

      if (Settings.isStateUser(+eRole)) {
        setDisplay({ ...display, state: "" });
        setTimeout(() => { state.current.value = data.user_state_id }, 10);
      }

      if (Settings.isDistrictUser(+eRole)) {
        setDOptions(Helper.districtFilter(DOption, data.user_state_id));
        setTimeout(() => { district.current.value = data.user_district_id; setDisplay({ ...display, state: "", district: "" }); }, 10);
        setDisplay({ ...display, state: "", district: "" });
      }
    }
  };

  const createHandler = (e) => {
    let url = '';
    let data;
    e.preventDefault();
    if (Settings.isMultiStateUserButNotCooridnator(+values?.role) && (values?.statesc === undefined || values?.statesc?.length === 0)) {
      return dispatch(Features.showToast({ message: "Please Select State", flag: "bg-danger" }));
    }
    if (+id === 0) {
      url = "create";
      data = values;

      let user_roles_data = [];
      if (+data?.role === 16) {
        Object.keys(disabledFieldsList).forEach((itm) => {
          if (!disabledFieldsList[itm])
            user_roles_data.push(itm === 'sc' ? '15' : itm === 'nfc' ? '2' : '3')
        })
      }

      if (+data?.role === 27) {
        let dietData = dietOptions.filter(x => +x.id === +data.diet)[0]
        data['state'] = dietData?.district_state_id
        data['district'] = dietData?.district_id
      }

      if (Settings.isMultiStateUserButNotCooridnator(+data?.role)) {
        Object.keys(disabledFieldsList).forEach((itm) => {
          if (!disabledFieldsList[itm])
            user_roles_data.push(data?.role)
        })
      }

      data.user_roles = +data?.role === 16 ? user_roles_data.join(",") : null;
      data.assigned_group_activity_id = selectedActivities.join(",");
    } else {
      url = "update";
      data = { id: id, data: values };
      data.data['email'] = data?.data?.email !== null && data?.data?.email !== undefined ? data?.data?.email : object?.data?.user_email;
      data.data['mobile'] = data?.data?.mobile !== null && data?.data?.mobile !== undefined ? data?.data?.mobile : object?.data?.user_mobile;

      let user_roles_data = [];

      if (+data?.data?.role === 27) {
        let dietData = dietOptions.filter(x => +x.id === +data?.data?.diet)[0]
        data.data.state = dietData?.district_state_id
        data.data.district = dietData?.district_id
      }

      if (+data?.data?.role === 16) {
        Object.keys(disabledFieldsList).forEach((itm) => {
          if (!disabledFieldsList[itm])
            user_roles_data.push(itm === 'sc' ? '15' : itm === 'nfc' ? '2' : '3')
        })
        data.data.user_roles = user_roles_data.join(",");
      }
      else {
        if (data?.data?.user_roles)
          data.data.user_roles = data?.data?.user_roles.map((role) => role.id).join(",");
      }

      data.data.assigned_group_activity_id = selectedActivities.join(",");
    }
    const isErrors = Object.keys(errors).some((key) => !errors[key].valid);

    if (data !== null && !isErrors) {
      setFSubmit(true);
      dispatch(Features.showLoader());

      API.post(`api/admin-users/${url}`, data, (response) => {
        setFSubmit(false);
        dispatch(Features.showToast({ message: response.message }));
        if (response.status) {
          navigate("/auth/admin/list")
          dispatch(Features.hideLoader());
          dispatch(Features.hideModal());
          dispatch(Features.makeHandler({ reload: new Date().getTime(), where: Helper.whereObjSelector(userData) }));
        } else {
          dispatch(Features.hideLoader());
        }
      });
    }
  };

  const addFieldsHandler = (ref) => {
    if (ref === 'nic') {
      setRef([...coordRef, { detailsNumber: coordRef[coordRef.length - 1].detailsNumber + 1, actgrpref: actgrpref, locgrpref: locgrpref }]);
    } else {
      setfinRef([...fincoordRef, { detailsNumber: fincoordRef[fincoordRef.length - 1].detailsNumber + 1, actgrpref: actgrpref, locgrpref: locgrpref }]);
    }
  };

  const isError = () => {
    if (values && values?.role && +values?.role === 2) {
      let tempErr = false;
      coordRef?.forEach((item, i) => {
        if ((values && values[`state${i + 1}`] === undefined) ||
          (values && values[`state${i + 1}`]?.length === 0) ||
          (values && values[`component${i + 1}`] === undefined) ||
          (values && values[`component${i + 1}`]?.length === 0) ||
          (values && values[`majorcomponent${i + 1}`] === undefined) ||
          (values && values[`majorcomponent${i + 1}`].length === 0) ||
          (values && values[`submajorcomponent${i + 1}`] === undefined) ||
          (values && values[`submajorcomponent${i + 1}`]?.length === 0) ||
          (values && values[`activity${i + 1}`] === undefined) ||
          (values && values[`activity${i + 1}`]?.length === 0)) {
          tempErr = true;
        }
      });
      return tempErr;
    }
    return false;
  }

  const returnDynamicNFCFields = (item, i) => {
    return (
      <>
        <div className="col-md-6 mb-3">
          <Form.Select options={grpLocationData} className={'ps-3'} attr={{ value: values[`nfclocgrpref${i + 1}`], id: `nfclocgrpref${i + 1}`, name: `nfclocgrpref${i + 1}`, onChange: handleChange, onFocus: handleChange, disabled: disabledFieldsList.nfc }}
            label="Select Location Group" default="Select Location Group" mandatory={false} />
        </div>

        <div className="col-md-6 mb-3">
          <Form.Select options={finalGroupVal} className={'ps-3'} attr={{ value: values[`nfcactgrpref${i + 1}`], id: `nfcactgrpref${i + 1}`, name: `nfcactgrpref${i + 1}`, onChange: handleChange, onFocus: handleChange, disabled: disabledFieldsList.nfc }}
            label="Select Activity Group" default="Select Activity Group" mandatory={false} />
        </div>
      </>
    );
  };

  const returnDynamicNICFields = (item, i) => {
    return (
      <>
        <div className="col-md-6 mb-3">
          <Form.Select options={grpLocationData} className={'ps-3'} attr={{ value: values[`niclocgrpref${i + 1}`], id: `niclocgrpref${i + 1}`, name: `niclocgrpref${i + 1}`, onChange: handleChange, onFocus: handleChange, disabled: disabledFieldsList.nic }}
            label="Select Location Group" default="Select Location Group" mandatory={false} />
        </div>

        <div className="col-md-6 mb-3">
          <Form.Select options={finalGroupVal} className={'ps-3'} attr={{ value: values[`nicactgrpref${i + 1}`], id: `nicactgrpref${i + 1}`, name: `nicactgrpref${i + 1}`, onChange: handleChange, onFocus: handleChange, disabled: disabledFieldsList.nic }}
            label="Select Activity Group" default="Select Activity Group" mandatory={false} />
        </div>
      </>
    );
  };

  const selectActivity = (e, row) => {
    if (e.target.checked === true) {
      if (selectedActivities.indexOf(row.id) === -1) {
        let newActivitiesData = selectedActivities;
        newActivitiesData.push(row.id)
        setSelectedActivities(newActivitiesData)
      }
    }
    else {
      let indexOfSelectedActivity = selectedActivities.indexOf(row.id);
      if (indexOfSelectedActivity > -1) {
        let newActivitiesData = selectedActivities.splice(indexOfSelectedActivity, 1);
        setSelectedActivities([...newActivitiesData])
      }
    }
  }

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-2 row">
        <div className="col-md-10">
          <h1>{id > 0 ? 'Edit Profile' : 'Add User'}</h1>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary me-1 cfr" onClick={(e) => navigate(prevPath)}><i className="bi bi-arrow-left">&nbsp;</i>Back</button>
        </div>
      </div>
      {!showSelectActivity && <div className="dashboard-main-content-info row px-1 py-3 popup-icon mb-3 edit-profile">
        <div className="col-md-4 mb-3 position-relative">
          <i className="bi bi-person"></i>
          <Form.Text attr={{ ref: name, id: "name", name: "name", onChange: handleChange, onFocus: handleChange, maxLength: 100 }}
            label="Name" error={errors.name} mandatory="true" />
        </div>

        <div className="col-md-4 mb-3 position-relative">
          <i className="bi bi-envelope-at"></i>
          <Form.Email attr={{ ref: email, id: "email", name: "email", onChange: (e) => handleChange(e), onFocus: handleChange, disabled: object?.data?.id === userData?.id }}
            label="Email Id" error={errors.email} mandatory="true" />
        </div>

        <div className="col-md-4 mb-3 position-relative">
          <i className="bi bi-phone"></i>
          <Form.Mobile attr={{ ref: mobile, id: "mobile", name: "mobile", onChange: handleChange, onFocus: handleChange, disabled: object?.data?.id === userData?.id }}
            label="Mobile Number" error={errors.mobile} mandatory="true" />
        </div>

        <div className="mb-4 col-md-4 position-relative">
          <i className="bi bi-person-vcard"></i>
          <Form.Select options={ROptions} attr={{ ref: role, id: "role", name: "role", onChange: handleChange, onFocus: handleChange }}
            label="Role" error={errors.role} mandatory="true" default="Select Role" />
        </div>

        <div className="mb-3 col-md-4 position-relative">
          <i className="bi bi-person-rolodex"></i>
          <Form.Text attr={{ ref: designation, id: "designation", name: "designation", onChange: handleChange, onFocus: handleChange, maxLength: 100 }}
            label="Designation" error={errors.designation} mandatory="false" />
        </div>

        {/* {(+values.role !== 16) && (
          <div className="col-md-4 mb-3 pt-4">

            <input type="checkbox" checked={selectActivities} onChange={(e) => { setSelectActivities(!selectActivities); dispatch(Features.showModal({ title: "Select Activities" })); }} />
            <label>&nbsp;Select Activity Group</label>
          </div>)} */}

        {(!Settings.isNationalUser(+values.role) || +values.role === 0 || isNaN(+values.role)) && (
          <div className={`mb-3 col-md-4 ${Settings.isMultiStateUserButNotCooridnator(+values.role) ? "d-none" : display.state}`}>
            <Form.Select options={SOption} className={'ps-3'} attr={{ ref: state, id: "state", name: "state", onChange: handleChange, onFocus: handleChange }}
              label="State" error={errors.state} default="Select State" mandatory="true" />
          </div>)}

        {(+values.role === 27) && (
          <div className={`mb-3 col-md-4`}>
            <Form.Select options={dietOptions} className={'ps-3'} attr={{ ref: diet, id: "diet", name: "diet", onChange: handleChange, onFocus: handleChange }}
              label="DIET" error={errors.diet} default="Select DIET" mandatory="true" />
          </div>)}

        <div className={`mb-3 col-md-4 ${display.district}`}>
          <Form.Select options={DOptions} attr={{ ref: district, id: "district", name: "district", onChange: handleChange, onFocus: handleChange }}
            label="District" error={errors.district} default="Select District" mandatory="true" />
        </div>

        {SOption && SOption?.length > 0 && (+values.role === 16 || Settings.isMultiStateUser(+values.role)) &&
          <div>
            <div className={`col-md-12 mt-3`}><input type="checkbox" checked={!disabledFieldsList.sc} onChange={(e) => { setdisabledFields({ ...disabledFieldsList, sc: !disabledFieldsList.sc }) }} />

              <label>&nbsp;{Settings.isMultiStateUserButNotCooridnator(+values.role) ? 'Select State(s)' : 'State Coordinator'}</label>
              {Settings.isMultiStateUserButNotCooridnator(+values.role) ?
                <div className={"col-md-12 mt-3"}>
                  <Form.MultiSelect options={filteredStates?.length > 0 ? filteredStates : SOption} selectedValues={values["statesc"]} displayValues="name"
                    attr={{
                      id: "statesc", name: "statesc",
                      onSelect: (e) => {
                        if (e.find(sta => sta.value === "*")) {
                          handleChange(SOption, "statesc")
                        } else {
                          handleChange(e, "statesc")
                        }
                      },
                      onRemove: (e) => handleChange(e, "statesc"),
                    }}
                    label={Settings.isMultiStateUserButNotCooridnator(+values.role) ? '' : 'State(s)'} default="Select State(s)" mandatory="true" disable={disabledFieldsList.sc} />
                </div>
                :
                <div className="row mt-2">
                  <div className="col-md-6 mb-3">
                    <Form.Select options={grpLocationData} className={'ps-3'} attr={{ value: values["sclocgrpref"], id: "sclocgrpref", name: "sclocgrpref", onChange: handleChange, onFocus: handleChange, disabled: disabledFieldsList.sc }}
                      label="Select Location Group" default="Select Group" mandatory={false} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Form.Select options={finalGroupVal} className={'ps-3'} attr={{ value: values["scactgrpref"], id: "scactgrpref", name: "scactgrpref", onChange: handleChange, onFocus: handleChange, disabled: disabledFieldsList.sc }}
                      label="Select Activity Group" default="Select Group" mandatory={false} />
                  </div>
                </div>}
            </div>

            {!(Settings.isMultiStateUserButNotCooridnator(+values.role)) && <div className={`col-md-12 mt-3`}><input type="checkbox" checked={!disabledFieldsList.nfc}
              onChange={(e) => { setdisabledFields({ ...disabledFieldsList, nfc: !disabledFieldsList.nfc }) }} />
              <label>&nbsp;National Financial Consultant</label>
              <div className="row mt-2">
                {(+values.role === 16) && fincoordRef.map((item, i) => { return returnDynamicNFCFields(item, i) })}

                <div className={`col-md-10 mt-1`}></div>

                <div className={`col-md-2 mt-1`}>
                  {(+values.role === 16) && (
                    <Form.Button button={{ type: "button", onClick: (e) => addFieldsHandler('nfc'), disabled: disabledFieldsList.nfc }} className="btn btn-link mb-1 float-end p-1">
                      <i className={`fa-solid fa-plus text-primary mt-1`}></i> Add more
                    </Form.Button>
                  )}
                </div>
              </div>
            </div>}

            {!(Settings.isMultiStateUserButNotCooridnator(+values.role)) && <div className={`col-md-12 mt-3`}>
              <input type="checkbox" checked={!disabledFieldsList.nic} onChange={(e) => { setdisabledFields({ ...disabledFieldsList, nic: !disabledFieldsList.nic }) }} />
              <label>&nbsp;National Intervention Consultant</label>

              <div className="row mt-2">
                {(+values.role === 16) && coordRef.map((item, i) => { return returnDynamicNICFields(item, i) })}

                <div className={`col-md-10 mt-1`}></div>

                <div className={`col-md-2 mt-1 mb-3`}>
                  {(+values.role === 16) && (
                    <Form.Button button={{ type: "button", onClick: (e) => addFieldsHandler('nic'), disabled: disabledFieldsList.nic }} className="btn btn-link mb-1 float-end p-1">
                      <i className={`fa-solid fa-plus text-primary mt-1`}></i> Add more
                    </Form.Button>
                  )}
                </div>
              </div>
            </div>}
          </div>}

        {(activity_ids.length > 0) && <div className='col-md-12 mt-2 mb-3' style={{ zIndex: 1 }}>
          <h6>Group Details</h6>
          <table className="table-scroll">
            <thead>
              <tr>
                {Column.groupActivityMappingView().map((itm, idx) => {
                  let data = Object.values(itm)
                  return (<th width={data[1]} className={data[2]} key={idx}>{data[0]}</th>)
                })}
              </tr>
            </thead>
            <tbody>
              {activity_ids.map((itm, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}. <input type="checkbox" className="d-none" defaultChecked={+selectedActivities.includes(+itm.id)} name={`select-activity-${idx}`} onChange={(e) => { selectActivity(e, itm) }} /></td>
                    {/* <td>{Model.activityLevel().find(x => +x.id === +itm.activity_level_id).name}</td> */}
                    <td>{itm.scheme_name}</td>
                    <td>{itm.major_component_name}</td>
                    <td>{itm.sub_component_name}</td>
                    <td>{itm.activity_master_name}</td>
                    <td>{itm.activity_master_details_name}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>}

        <div className="col-md-12 mt-2 mb-2">
          <Form.Button button={{ type: "submit", disabled: form.disable || isError(), onClick: createHandler }} className="btn btn-success float-end ms-2" fSubmit={fSubmit}>
            Save
          </Form.Button>

          {object?.data?.id === userData?.id ? (
            <>
              <Form.Button button={{ type: "button", onClick: changePassClick }} className="btn btn-primary float-end">Change Password</Form.Button>
              {/* {twoFAEnabled === false && <Form.Button button={{ type: "button", onClick: twoFactorAuthEnable }} className={"btn btn-primary float-end me-2"}>Enable 2FA</Form.Button>}
              {twoFAEnabled === true && <Form.Button button={{ type: "button", onClick: twoFactorAuthDisable }} className={"btn btn-danger float-end me-2"}>Disable 2FA</Form.Button>} */}
              <Form.Button button={{ type: "button", onClick: twoFactorAuthEnable }} className={"btn btn-primary float-end me-2"}>Re-Scan QR Code</Form.Button>
              <Form.Button button={{ type: "button", onClick: updateContactHandler }} className={"btn btn-primary float-end me-2"}>Update Email / Mobile Number</Form.Button>
            </>
          ) : ("")}
        </div>
      </div>}

      {reduxObj.view && selectActivities && (<SelectActivity btntext="Save" activity_ids={activity_ids} setActivity_ids={setActivity_ids} fetchedActivities={fetchedActivities}
        selectedIndex={selectedIndex} selectedKey={selectedKey} handleChange={handleChange} close={() => {
          setSelectActivities(false);
          dispatch(Features.showModal(oldModel));
        }} />)}

      {reduxObj.view && changePass && (<UpdatePass btntext={"Change Password"} role={+userRoleId} id={+id} close={handleClosePassword} />)}

      {reduxObj.view && twoFA && (<TwoFactorAuth role={+userData?.user_role_id} id={+userData?.id} username={userData?.user_name} dismissable="true" mobile={userData?.user_mobile} email={userData?.user_email} setTwoFAEnabled={setTwoFAEnabled} setTwoFA={setTwoFA} />)}

      {reduxObj.view && updateContact && (<UpdateEmailMobileNumber role={+userData?.user_role_id} id={+userData?.id} username={userData?.user_name} dismissable="true" mobile={userData?.user_mobile} email={userData?.user_email} setUpdateContact={setUpdateContact} />)}
    </div>
  );
};

export default Operate;