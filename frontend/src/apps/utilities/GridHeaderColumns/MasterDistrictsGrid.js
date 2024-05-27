const headers = async (SOption, selectedState) => {
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
            headerName: "District Code",
            field: "district_id",
            filter: "agMultiColumnFilter",
            width: 200,
            cellStyle: (params) => {
                return { textAlign: "center" };
            },
        },
        {
            headerName: "District Name",
            field: "district_name",
            filter: "agMultiColumnFilter",
            width: 350,
            cellStyle: (params) => {
                return { textAlign: "center" };
            },
        },
        {
            headerName: "State Name",
            filter: "agMultiColumnFilter",
            width: 350,
            cellStyle: (params) => {
                return { textAlign: "center" };
            },
            valueGetter: (params) => SOption.filter(x => +x?.id === (+selectedState === 0 ? +params?.data?.district_state_id : +selectedState))[0]?.name,
        },
        {
            headerName: "Status",
            filter: "agMultiColumnFilter",
            width: 250,
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