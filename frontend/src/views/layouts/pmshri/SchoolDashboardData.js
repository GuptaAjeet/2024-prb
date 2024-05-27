import React, { Fragment, useEffect, useState } from "react";
import { Column, Helper, API } from "../../../apps";

const DynamicTable = ({ data, columns, handleInput }) => {
  const renderCell = (item, column, rowIndex) => {
    if (column.rowSpan) {
      const rowSpanCount = getRowSpanCount(data, column.field, rowIndex);
      return rowSpanCount > 1 ? (<td rowSpan={rowSpanCount}>{item[column.field]}</td>) : rowSpanCount === 0 ? ([]) : (<td>{item[column.field]}</td>);
    }
    return (
      <td className={column?.type === 'number' ? 'text-end' : 'text-start'}>{column.field === "index" ? (rowIndex + 1) : (item[column.field])}</td>
    );
  };

  const getRowSpanCount = (data, field, rowIndex) => {
    const johnIndex = data.indexOf(data.find((item) => item[field] === data[rowIndex][field]));

    if (johnIndex < rowIndex) {
      return 0;
    }

    let rowSpanCount = 1;
    rowSpanCount = data.filter((item) => item[field] === data[rowIndex][field])?.length;
    return rowSpanCount;
  };

  return (
    <table className="aaa table table-bordered text-start mb-4 progress-tracking">
      <thead>
        <tr>
          {Column.schoolProgressParentHeader().map((itm, idx) => {
            return (<th className={itm?.className} key={idx} rowSpan={itm?.rowSpan} colSpan={itm?.colSpan}> {itm?.name} </th>)
          })
          }
        </tr>
        <tr>
          {Column.schoolProgressChildHeader().map((itm, idx) => {
            return (<th className={itm?.className} key={idx} rowSpan={itm?.rowSpan} colSpan={itm?.colSpan}> {itm?.name} </th>)
          })
          }
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={item.id}>
            {columns.map((column) => renderCell(item, column, rowIndex))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SchoolDashboardData = () => {
  const user = Helper.auth.user;
  const selectMonth = localStorage.getItem("progress_month");
  const [activities, setActivities] = useState([]);
  const [, setNo_of_record] = useState(0);

  useEffect(() => {
    getActivityList();
  }, [])

  const getActivityList = () => {
    API.post(`api/proposal-after-approval/school-activity`,
      {
        district_id: user?.district_id,
        state_id: user?.state_id,
        asset_code: user?.udise_sch_code,
        month: selectMonth,
      },
      (res) => {
        setActivities(res.data);
        setNo_of_record(res.no_of_record);
      }
    );
  };
  return (
    <Fragment>
      {activities.length > 0 ? (
        <>
          <div className="accordion contribute-page" id="accordionExample">
            {Object?.entries(
              activities?.reduce((result, currentItem) => {
                const { scheme_name, ...rest } = currentItem;
                if (result[scheme_name]) {
                  result[scheme_name].push(rest);
                } else {
                  result[scheme_name] = [rest];
                }
                return result;
              }, {}) || {}
            ).map(([scheme, data]) => (
              <div className="accordion-item" key={scheme + "aaaa"}>
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target={`#collapseOne${scheme.replace(" ", "")}`} aria-expanded="true" aria-controls={`collapseOne${scheme.replace(" ", "")}`}
                  >
                    {scheme} ({data?.length} Activities)
                  </button>
                </h2>

                <div id={`collapseOne${scheme.replace(" ", "")}`} className={`accordion-collapse collapse ${activities.length === 1 ? "show" : ""}`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body" style={{ padding: "5px" }}>
                    <div className="table-responsive">
                      {data.length > 0 && (
                        <>
                          <DynamicTable data={data} columns={Column.schoolDashboardTableView()}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h4>No Data Found</h4>
        </div>
      )}
    </Fragment>
  )
}

export default SchoolDashboardData;