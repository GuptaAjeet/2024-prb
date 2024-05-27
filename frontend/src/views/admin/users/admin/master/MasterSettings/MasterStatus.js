import React from "react";
import { Column, Hook } from "../../../../../../apps";

const MasterStatus = () => {
    const SOption = Hook.useStatus();

    return (
        <>
            <h2 className="master_settings_heading">Master Status</h2>
            {(SOption && SOption.length > 0) &&
                <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                    <table className="table-scroll">
                        <thead>
                            <tr>
                                {Column.status().map((itm) => {
                                    let data = Object.values(itm)
                                    return (
                                        <th
                                            width={data[1]}
                                            className={data[2]}
                                        >
                                            {data[0]}
                                        </th>
                                    )
                                })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {SOption.map((itm, idx) =>
                                <tr>
                                    <td>{idx + 1}</td>
                                    <td>{itm.status_name}</td>
                                    <td>{itm.id}</td>
                                    <td>{+itm.status === 0 ? 'Active' : 'Inactive'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>}
        </>
    );
};

export default MasterStatus;
