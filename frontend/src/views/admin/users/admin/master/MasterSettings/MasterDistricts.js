import React, { useEffect, useMemo, useRef, Fragment, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { MasterDistrictsGrid } from "../../../../../../apps/utilities/GridHeaderColumns";

const MasterDistricts = (props) => {

    const SOption = props?.object?.SOption;
    const DOption = props?.object?.DOption;
    const selectedState = +props?.object?.selectedState;
    const [listToDisplay, setListToDisplay] = useState([]);
    const [gridHeaders, setGridHeaders] = useState([]);

    const gridStyle = useMemo(() => ({ height: "600px" }), []);
    const gridRef = useRef();

    useEffect(() => {
        if (DOption && DOption.length > 0) {
            if (+selectedState !== 0) {
                setListToDisplay(DOption.filter(x => +x.district_state_id === +selectedState))
            }
            else {
                setListToDisplay(DOption)
            }

            MasterDistrictsGrid.headers(SOption, +selectedState).then((res) => setGridHeaders(res));
        }
    }, [selectedState, DOption, SOption])

    return (
        <>
        <h2 className="master_settings_heading">Master Districts</h2>
            {(listToDisplay && listToDisplay.length > 0) &&
                <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                    <Fragment>
                        <div style={gridStyle} className={"ag-theme-alpine AS"}>
                            <AgGridReact 
                                onGridReady={(params)=>{
                                    setTimeout(()=>{
                                      params.api.sizeColumnsToFit();
                                    },300)
                                }}
                                ref={gridRef} columnDefs={gridHeaders} rowData={listToDisplay} animateRows={true} pagination={false} paginationAutoPageSize={false} />
                        </div>
                    </Fragment>
                </div>}
        </>
    );
};

export default MasterDistricts;
