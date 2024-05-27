import React, { useEffect, useState, useMemo, useRef, Fragment } from "react";
import { AgGridReact } from "ag-grid-react";
import { MasterBlocksGrid } from "../../../../../../apps/utilities/GridHeaderColumns";
import { Hook } from "../../../../../../apps";

const MasterBlocks = (props) => {
    const BOption = Hook.useBlocks();
    const SOption = props?.object?.SOption;
    const DOption = props?.object?.DOption;
    const selectedState = +props?.object?.selectedState;
    const selectedDistrict = +props?.object?.selectedDistrict;
    const [listToDisplay, setListToDisplay] = useState([]);
    const [gridHeaders, setGridHeaders] = useState([]);

    const gridStyle = useMemo(() => ({ height: "600px" }), []);
    const gridRef = useRef();

    useEffect(() => {
        if (BOption && BOption.length > 0) {
            if (+selectedState !== 0) {
                if (+selectedDistrict !== 0) {
                    setListToDisplay(BOption.filter(x => +x.block_district_id === +selectedDistrict))
                }
                else {
                    setListToDisplay(BOption.filter(x => +x.block_state_id === +selectedState))
                }
            }
            else {
                setListToDisplay(BOption)
            }

            MasterBlocksGrid.headers(DOption, SOption, +selectedDistrict, +selectedState).then((res) => setGridHeaders(res));
        }
    }, [selectedState, selectedDistrict, BOption])

    return (
        <>
            <h2 className="master_settings_heading">Master Blocks</h2>
            {(listToDisplay && listToDisplay.length > 0) &&
                <div className="col-xl-12 col-lg-12 col-sm-12 table-scroll-section">
                    <Fragment>
                        <div style={gridStyle} className={"ag-theme-alpine AS"}>
                            <AgGridReact
                                onGridReady={(params) => {
                                    setTimeout(() => {
                                        params.api.sizeColumnsToFit();
                                    }, 300)
                                }}
                                ref={gridRef} columnDefs={gridHeaders} rowData={listToDisplay} animateRows={true} pagination={false} paginationAutoPageSize={false} />
                        </div>
                    </Fragment>
                </div>}
        </>
    );
};

export default MasterBlocks;
