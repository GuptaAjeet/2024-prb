import React from "react";
import { Column } from "../../../../../../apps";
import ModalEdit from "./Modals/ModalEdit";
import ModalAdd from "./Modals/ModalAdd";

const ActivitiesMaster = (props) => {
  const act = props.object?.act || [];
  const selectedScheme = props.object?.selectedScheme || [];
  const selectedMajorComponent = props.object?.selectedMajorComponent || [];
  const selectedSubComponent = props.object?.selectedSubComponent || [];

  const reloadPage = (refreshData) => {
    props?.reloadPage(refreshData, 'Activities Master');
  }

  return (
    <div className="dashboard-main-content">
      <div className='d-flex justify-content-between'>
        <h2 className="master_settings_heading">Activity Master</h2>
        <ModalAdd object={{ act: act, selectedScheme: selectedScheme, selectedMajorComponent: selectedMajorComponent, selectedSubComponent: selectedSubComponent }}
          reloadPage={reloadPage} />
      </div>
      <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
        <table className="table-scroll">
          <thead>
            <tr>
              {Column.activityMaster().map((itm, idx) => {
                let data = Object.values(itm)
                return (<th width={data[1]} className={data[2]} key={idx}> {data[0]} </th>)
              })
              }
            </tr>
          </thead>
          <tbody>
            {act.map((itm, idx) => {
              return (<>
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{itm.id}</td>
                  <td>{itm.name}</td>
                  <td className="text-center">
                    <ModalEdit object={{
                      id: itm.id, itm: itm, selectedScheme: selectedScheme, selectedMajorComponent: selectedMajorComponent,
                      selectedSubComponent: selectedSubComponent
                    }} url={"api/master-settings/update-activity"} title={itm.name} reloadPage={reloadPage} />
                  </td>
                </tr>
              </>)
            }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivitiesMaster;
