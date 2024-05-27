import React, { useEffect, useState } from 'react'
import { API, Column } from "../../../../../../apps";
//import ModalEditYear from './Modals/ModalEditYear';
import ModalYearAdd from './Modals/ModalYearAdd';

const MasterYear = () => {
    const [years, setYears] = useState([])
    const [refresh, setRefresh] = useState(Date.now());

    useEffect(() => {
        const url = "api/years/list";

        API.get(url, null, (response) => {
            if (response.data !== undefined && response.data !== null) {
                setYears(response.data);
            }
        });
    }, [refresh]);

    const reloadPage = (refreshData) => {
        setRefresh(refreshData);
    }

    return (
        <>
            <div className='d-flex justify-content-between'>
                <h2 className="master_settings_heading">Master Blocks</h2>
                <div className="float-end mb-2"><ModalYearAdd reloadPage={reloadPage} years={years} /></div>
            </div>
            <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">

                <table className="table-scroll">
                    <thead>
                        <tr>
                            {Column.masterYear().map((itm, idx) => {
                                let data = Object.values(itm)
                                return (<th width={data[1]} className={data[2]} key={idx} > {data[0]} </th>)
                            })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {years?.map((itm, idx) =>
                            <tr>
                                <td>{idx + 1}</td>
                                <td>{itm.year_name}</td>
                                <td>{itm.year_code}</td>
                                <td>Active</td>
                                {/* <td className="text-center"><ModalEditYear year_code={itm.year_code}
                                    year_name={itm.year_name}
                                    id={itm.id}
                                    url={"api/master-settings/update-master-year"}
                                    title={"year"}
                                    reloadPage={reloadPage} /></td> */}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div></>
    )
}

export default MasterYear