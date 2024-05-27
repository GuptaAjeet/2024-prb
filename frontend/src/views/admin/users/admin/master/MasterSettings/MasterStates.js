import React from "react";
import { Column } from "../../../../../../apps";

const MasterStates = (props) => {

    return (
        <>
        <h2 className="master_settings_heading">Master States</h2>
            {(props?.object?.SOption && props?.object?.SOption.length > 0) &&
                <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                    <table className="table-scroll">
                        <thead>
                            <tr>
                                {Column.state().map((itm) => {
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
                            {props?.object?.SOption.map((itm, idx) =>
                                <tr>
                                    <td>{idx + 1}</td>
                                    <td>{itm?.id}</td>
                                    <td>{itm?.name}</td>
                                    <td>Active</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>}
        </>
    );
};

export default MasterStates;
