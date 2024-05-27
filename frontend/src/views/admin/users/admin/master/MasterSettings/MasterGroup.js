import React, { useEffect, useState } from 'react'
import { API, Column } from "../../../../../../apps";
import ModalGroupAdd from './Modals/ModalGroupAdd';

const MasterGroup = () => {
    const [groups, setGroups] = useState([])
    const [refresh, setRefresh] = useState(Date.now());

    useEffect(() => {
        const url = "api/group/list";

        API.get(url, null, (response) => {
            if (response.data !== undefined && response.data !== null) {
                setGroups(response.data);
            }
        });
    }, [refresh]);

    const reloadPage = (refreshData) => {
        setRefresh(refreshData);
    }

    return (
        <>
            <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
            <div className='d-flex justify-content-between'>
                <h2 className="master_settings_heading">Group Master</h2>
                    <ModalGroupAdd reloadPage={reloadPage} group={groups} /></div>

                <table className="table-scroll">
                    <thead>
                        <tr>
                            {Column.masterGroup().map((itm, idx) => {
                                let data = Object.values(itm)
                                return (
                                    <th width={data[1]} className={data[2]} key={idx}>{data[0]}</th>
                                )
                            })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {groups?.map((itm, idx) =>
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{itm.group_code}</td>
                                <td>{itm.group_name}</td>
                                <td>{+itm.group_type === 1 ? "Activity" : +itm.group_type === 2 ? "Location" : "Not Specified"}</td>
                                <td>{itm.group_description}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div></>
    )
}

export default MasterGroup