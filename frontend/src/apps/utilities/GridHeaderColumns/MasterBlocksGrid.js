const headers = async (DOption, SOption, selectedDistrict, selectedState) => {
    return [
        {
            headerName: "S. No.",
            width: 100,
            valueGetter: (params) => params?.node?.rowIndex + 1,
            cellStyle: (params) => {
                return { textAlign: "left" };
            },
        },
        {
            headerName: "Block Code",
            field: "id",
            filter: "agMultiColumnFilter",
            width: 150,
            cellStyle: (params) => {
                return { textAlign: "center" };
            },
        },
        {
            headerName: "Block Name",
            field: "name",
            filter: "agMultiColumnFilter",
            width: 300,
            cellStyle: (params) => {
                return { textAlign: "center" };
            },
        },
        {
            headerName: "District Name",
            filter: "agMultiColumnFilter",
            width: 300,
            cellStyle: (params) => {
                return { textAlign: "center" };
            },
            valueGetter: (params) => DOption.filter(x => +x?.district_id === (+selectedDistrict === 0 ? +params?.data?.block_district_id : +selectedDistrict))[0]?.district_name
        },
        {
            headerName: "State Name",
            filter: "agMultiColumnFilter",
            width: 300,
            cellStyle: (params) => {
                return { textAlign: "center" };
            },
            valueGetter: (params) => SOption.filter(x => +x?.id === (+selectedState === 0 ? +params?.data?.block_state_id : +selectedState))[0]?.name,
        },
        {
            headerName: "Status",
            filter: "agMultiColumnFilter",
            width: 200,
            cellStyle: (params) => {
                return { textAlign: "center" };
            },
            valueGetter: (params) => 'Active'
        }
    ]
};

export default {
    headers
}