import React, { useState, useEffect } from "react";
import { Hook, API, Model } from "../../../../../../apps";
import MasterBlocks from "./MasterBlocks";
import MasterDistricts from "./MasterDistricts";
import MasterStates from "./MasterStates";
import MasterRoles from "./MasterRoles";
import MasterStatus from "./MasterStatus";
import ActivitiesMaster from "./ActivitiesMaster";
import MasterYear from "./MasterYear";
import MasterMenus from "./MasterMenus";
import MasterStatesTentativeProposed from "./MasterStatesTentativeProposed";
import SubComponentMaster from "./SubComponentMaster";
import SystemPermissionsMaster from "./SystemPermissionsMaster";
import NotificationsMaster from "./NotificationsMaster";
import SubActivitiesMaster from "./SubActivitiesMaster";
import ActivitiesGroupMapping from "./ActivitiesGroupMapping";
import MasterGroup from "./MasterGroup";
import LocationsGroupMapping from "./LocationsGroupMapping";
import SelectedYear from "../../../../../layouts/Fund/SelectedYear";
import ReportsMaster from "./ReportsMaster";
import ReportPermissionsMaster from "./ReportPermissionsMaster";

const MasterSettings = () => {
  const SOption = Hook.useStates();
  const DOption = Hook.useDistricts();
  const years = Hook.useYears();
  const settingsValues = Model.settingsValue();

  const [selectedSettingValue, setSelectedSettingValue] = useState(1);
  const [selectedState, setSelectedState] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState(0);
  const [schemes, setSchemes] = useState([]);
  const [majorComponents, setMajorComponents] = useState([]);
  const [subComponents, setSubComponents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [subActivities, setSubActivities] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(0);
  const [selectedMajorComponent, setSelectedMajorComponent] = useState(0);
  const [selectedSubComponent, setSelectedSubComponent] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(0);
  const [refreshAM, setRefreshAM] = useState(new Date().getMilliseconds());
  const [refreshSCM, setRefreshSCM] = useState(new Date().getMilliseconds());
  const [refreshSAM, setRefreshSAM] = useState(new Date().getMilliseconds());

  const reloadPage = (refreshData, page) => {
    if (page === "Activities Master") {
      setRefreshAM(refreshData);
    }

    if (page === "Sub Components Master") {
      setRefreshSCM(refreshData);
    }

    if (page === "Sub Activities Master") {
      setRefreshSAM(refreshData);
    }
  };

  useEffect(() => {
    API.post("api/prabandh/schemes", {}, (res) => {
      setSchemes(res?.data?.map((d) => ({ id: d.id, name: d.scheme_name })));
    });
  }, []);

  useEffect(() => {
    if (+selectedScheme > 0) {
      API.post("api/prabandh/major-components", { schemeid: +selectedScheme },
        (res) => { setMajorComponents(res?.data?.map((d) => ({ id: d.prb_major_component_id, name: d.title }))) }
      );
    }
    setSelectedMajorComponent(0);
  }, [selectedScheme]);

  useEffect(() => {
    if (+selectedMajorComponent > 0) {
      API.post("api/master-settings/sub-components-list", { schemeid: +selectedScheme, major_component_id: +selectedMajorComponent },
        (res) => {
          setSubComponents(
            res?.data?.rows?.map((d) => ({
              id: d.sub_component_id,
              name: d.title,
              scheme_id: +selectedScheme,
              major_component_id: +selectedMajorComponent,
              serial_order: d.serial_order,
            }))
          );
        }
      );
    }
    setSelectedSubComponent(0);
  }, [selectedMajorComponent, refreshSCM]);

  useEffect(() => {
    if (+selectedSubComponent > 0) {
      API.post("api/master-settings/activity-master-list", { schemeid: +selectedScheme, major_component_id: +selectedMajorComponent, sub_component_id: +selectedSubComponent },
        (res) => { setActivities(res?.data?.map((d) => ({ id: d.id, name: d.title, serial_number: d.serial_number }))) }
      );
    }
  }, [selectedSubComponent, refreshAM]);

  useEffect(() => {
    if (+selectedActivity > 0) {
      API.post("api/prabandh/active-master-detail-list", { schemeid: +selectedScheme, major_component_id: +selectedMajorComponent, sub_component_id: +selectedSubComponent, activity_master_id: +selectedActivity },
        (res) => { setSubActivities(res?.data) }
      );
    }
  }, [selectedActivity, refreshSAM]);

  useEffect(() => {
    if (selectedSettingValue <= 2) {
      setSelectedState(0);
      setSelectedDistrict(0);
    }

    if (selectedSettingValue >= 11 && selectedSettingValue <= 13) {
      setSelectedScheme(0);
      setSelectedMajorComponent(0);
      setSelectedSubComponent(0);
      setSelectedActivity(0);
    }
  }, [selectedSettingValue]);

  return (
    <div className="dashboard-main-content">
      <div className="dashboard-main-content__header mb-3 d-flex">
        <h1>Master Settings</h1>
        <SelectedYear />
      </div>

      <div className="dashboard-main-content-info mb-3 mt-3" id="search" style={{ backgroundColor: "rgb(43 74 145)" }}>
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-12">
            <h6 className="text-white">SETTINGS FILTER</h6>
          </div>

          <div className="row">
            <div className="col-md-3">
              <select className="form-select" name="settings" value={selectedSettingValue} onChange={(e) => setSelectedSettingValue(e.target.value)}>
                {settingsValues && settingsValues.map((itm, idx) => (<option key={idx} value={itm.id}>{itm.name}</option>))}
              </select>
            </div>
          </div>

          {+selectedSettingValue === 1 && (
            <div className="row mt-3">
              <div className="col-md-3">
                <select className="form-select" name="state-list" value={selectedState} onChange={(e) => { setSelectedState(+e.target.value); }}>
                  <option value={0}>All States</option>
                  {SOption && SOption.length > 0 && SOption.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" name="state-list" value={selectedDistrict} onChange={(e) => { setSelectedDistrict(+e.target.value); }}>
                  <option value={0}>All Districts</option>
                  {DOption && DOption.length > 0 && DOption.filter((itm) => +itm.district_state_id === +selectedState)
                    .map((itm, idx) => (<option key={idx} value={+itm?.district_id}>{itm?.district_name}</option>))}
                </select>
              </div>
            </div>
          )}

          {+selectedSettingValue === 2 && (
            <div className="row mt-3">
              <div className="col-md-3">
                <select className="form-select" name="state-list" value={selectedState} onChange={(e) => { setSelectedState(+e.target.value); }}>
                  <option value={0}>All States</option>
                  {SOption && SOption.length > 0 && SOption.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>
            </div>
          )}

          {+selectedSettingValue === 11 && (
            <div className="row mt-3">
              <div className="col-md-3">
                <select className="form-select" name="scheme-list" value={selectedScheme} onChange={(e) => setSelectedScheme(+e.target.value)}>
                  <option value={0}>Select Scheme</option>
                  {schemes && schemes.length > 0 && schemes.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" name="major-component-list" value={selectedMajorComponent} onChange={(e) => setSelectedMajorComponent(+e.target.value)}>
                  <option value={0}>Select Major Component</option>
                  {majorComponents && majorComponents.length > 0 && majorComponents.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>
            </div>
          )}

          {+selectedSettingValue === 12 && (
            <div className="row mt-3">
              <div className="col-md-3">
                <select className="form-select" name="scheme-list" value={selectedScheme} onChange={(e) => setSelectedScheme(+e.target.value)}>
                  <option value={0}>Select Scheme</option>
                  {schemes && schemes.length > 0 && schemes.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" name="major-component-list" value={selectedMajorComponent} onChange={(e) => setSelectedMajorComponent(+e.target.value)}>
                  <option value={0}>Select Major Component</option>
                  {majorComponents && majorComponents.length > 0 && majorComponents.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" name="major-component-list" value={selectedSubComponent} onChange={(e) => setSelectedSubComponent(+e.target.value)}>
                  <option value={0}>Select Sub Component</option>
                  {subComponents && subComponents.length > 0 && subComponents.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>
            </div>
          )}

          {+selectedSettingValue === 13 && (
            <div className="row mt-3">
              <div className="col-md-3">
                <select className="form-select" name="scheme-list" value={selectedScheme} onChange={(e) => setSelectedScheme(+e.target.value)}>
                  <option value={0}>Select Scheme</option>
                  {schemes && schemes.length > 0 && schemes.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" name="major-component-list" value={selectedMajorComponent} onChange={(e) => setSelectedMajorComponent(+e.target.value)}>
                  <option value={0}>Select Major Component</option>
                  {majorComponents && majorComponents.length > 0 && majorComponents.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" name="sub-component-list" value={selectedSubComponent} onChange={(e) => setSelectedSubComponent(+e.target.value)}>
                  <option value={0}>Select Sub Component</option>
                  {subComponents && subComponents.length > 0 && subComponents.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" name="activities-component-list" value={selectedActivity} onChange={(e) => setSelectedActivity(+e.target.value)}>
                  <option value={0}>Select Activity</option>
                  {activities && activities.length > 0 && activities.map((itm, idx) => (<option key={idx} value={+itm.id}>{itm.name}</option>))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-main-content-info mt-4">
        {+selectedSettingValue === 1 && (
          <MasterBlocks object={{ selectedState: +selectedState, selectedDistrict: +selectedDistrict, SOption: SOption, DOption: DOption }} />)}

        {+selectedSettingValue === 2 && (
          <MasterDistricts object={{ selectedState: +selectedState, selectedDistrict: +selectedDistrict, SOption: SOption, DOption: DOption }} />)}

        {+selectedSettingValue === 3 && <MasterRoles />}

        {+selectedSettingValue === 4 && (<MasterStates object={{ SOption: SOption }} />)}

        {+selectedSettingValue === 5 && <MasterStatesTentativeProposed />}

        {+selectedSettingValue === 6 && <MasterStatus />}

        {+selectedSettingValue === 7 && <MasterYear />}

        {+selectedSettingValue === 8 && <NotificationsMaster />}

        {+selectedSettingValue === 9 && <MasterMenus years={years} />}

        {+selectedSettingValue === 10 && <SystemPermissionsMaster />}

        {+selectedSettingValue === 11 && (<SubComponentMaster object={{
          selectedScheme: schemes.filter((x) => +x.id === +selectedScheme),
          selectedMajorComponent: majorComponents.filter((x) => +x.id === +selectedMajorComponent), subComponent: subComponents
        }} reloadPage={reloadPage} />)}

        {+selectedSettingValue === 12 && (<ActivitiesMaster object={{
          act: activities, selectedScheme: schemes.filter((x) => +x.id === +selectedScheme),
          selectedMajorComponent: majorComponents.filter((x) => +x.id === +selectedMajorComponent),
          selectedSubComponent: subComponents.filter((x) => +x.id === +selectedSubComponent)
        }} reloadPage={reloadPage} />)}

        {+selectedSettingValue === 13 && (<SubActivitiesMaster object={{
          selectedScheme: schemes.filter((x) => +x.id === +selectedScheme),
          subActivities: subActivities, selectedActivity: activities.filter((x) => +x.id === +selectedActivity),
          selectedMajorComponent: majorComponents.filter((x) => +x.id === +selectedMajorComponent),
          selectedSubComponent: subComponents.filter((x) => +x.id === +selectedSubComponent)
        }} reloadPage={reloadPage} />)}

        {+selectedSettingValue === 14 && <MasterGroup />}

        {+selectedSettingValue === 15 && <LocationsGroupMapping object={{ SOption: SOption, DOption: DOption }} />}

        {+selectedSettingValue === 16 && <ActivitiesGroupMapping object={{ schemes: schemes, SOption: SOption, DOption: DOption }} />}

        {+selectedSettingValue === 17 && <ReportsMaster />}

        {+selectedSettingValue === 18 && <ReportPermissionsMaster />}
      </div>
    </div>
  );
};

export default MasterSettings;