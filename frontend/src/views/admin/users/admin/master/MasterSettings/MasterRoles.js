import React from "react";
import { Column, Hook } from "../../../../../../apps";

const MasterRoles = () => {
    const ROptions = Hook.useRoles()

    return (
        <>
        <h2 className="master_settings_heading">Master Roles</h2>
            {(ROptions && ROptions.length > 0) &&
                <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                    <table className="table-scroll">
                        <thead>
                            <tr>
                                {Column.role().map((itm) => {
                                    let data = Object.values(itm)
                                    return (<th width={data[1]} className={data[2]}> {data[0]} </th>)
                                })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {ROptions.map((itm, idx) =>
                                <tr>
                                    <td>{idx + 1}</td>
                                    <td>{itm.name}</td>
                                    <td>{itm.id}</td>
                                    <td>Active</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>}
        </>
    );
};

export default MasterRoles;
