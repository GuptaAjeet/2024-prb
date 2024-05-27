import React, { useEffect, useState } from "react";
import { API, Helper, Column } from "../../../../../../apps";
import ModalMSTPEdit from "./Modals/ModalMSTPEdit";

const MasterStatesTentativeProposed = () => {
    const [mspt, setMSTP] = useState([]);
    const [refresh, setRefresh] = useState(Date.now());

    useEffect(() => {
        const user = Helper.auth.user;
        API.post(
            "api/master-settings/get-mstp",
            { id: user?.user_role_id },
            (result) => {
                if (result.status) {
                    setMSTP(result?.data);
                }
            }
        );
    }, [refresh]);

    const reloadPage = (refreshData) => {
        setRefresh(refreshData);
    }

    return (
        <>
        <h2 className="master_settings_heading">Master State Tentative Proposal</h2>
            {(mspt && mspt.length > 0) &&
                <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                    
                    <table className="table-scroll">
                        <thead>
                            <tr>
                                {Column.masterStateTentativeProposal().map((itm, idx) => {
                                    let data = Object.values(itm)
                                    return (<th width={data[1]} className={data[2]} key={idx}> {data[0]} </th>)
                                })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {mspt?.map((itm, idx) =>
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{itm.state_id}</td>
                                    <td>{itm.state_name}</td>
                                    <td className="text-end">{itm.center_share_percent}%</td>
                                    <td className="text-end">{100 - (+itm.center_share_percent)}%</td>
                                    <td className="text-end">{Helper.accountFormat(itm.tentative_central_share)}</td>
                                    <td className="text-end">{Helper.accountFormat(itm.tentative_state_share)}</td>
                                    <td className="text-end">{Helper.accountFormat(itm.tentative_total_estimates)}</td>
                                    {/* <td>{+itm.state_status !== 1 && <ModalMSTPEdit
                                        tentative_total_estimates={itm.tentative_total_estimates}
                                        tentative_state_share={itm.tentative_state_share}
                                        tentative_central_share={itm.tentative_central_share}
                                        id={itm.id}
                                        reloadPage={reloadPage} />}
                                    </td> */}
                                </tr>
                            )}
                            <tr>
                                <td style={{ textAlign: "right",fontWeight:700}} colSpan={5}>Total</td>
                                <td style={{ textAlign: "right",fontWeight:700 }}>{Helper.accountFormat(mspt.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue["tentative_central_share"]), 0).toFixed(5))}</td>
                                <td style={{ textAlign: "right",fontWeight:700 }}>{Helper.accountFormat(mspt.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue["tentative_state_share"]), 0).toFixed(5))}</td>
                                <td style={{ textAlign: "right",fontWeight:700 }} >{Helper.accountFormat(mspt.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue["tentative_total_estimates"]), 0).toFixed(5))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>}
        </>
    );
};

export default MasterStatesTentativeProposed;