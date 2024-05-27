import { Settings } from "../..";

const headers = (rowData, state_name = "All State") => {
    if (rowData != undefined && rowData.length > 0) {
        const keysArray = rowData && rowData?.map((obj) => Object.keys(obj))[0];
        keysArray && keysArray.pop();

        const headers = keysArray && keysArray?.map((c) => c?.split("_"));

        let dt = keysArray &&
            keysArray?.map((v, i) => {
                if (i === 0) {
                    return {
                        headerName: "S. No.",
                        field: "serial_number",
                        headerClass: "report_header",
                        suppressSizeToFit: true,
                        valueGetter: (params) => {
                            return params.node.rowIndex + 1;
                        },
                        maxWidth: 100,
                        type: "rightAligned",
                    };
                } else {
                    return {
                        headerName: headers[i]?.join(" ")?.toUpperCase(),
                        field: v === "id" ? "S. No." : v,
                        headerClass: "report_header",
                        suppressSizeToFit: true,
                        valueGetter: (params) => {
                            return params.data[v] == null ? 0 : params.data[v];
                        },
                        type: ["amount", "cost", "quantity"]?.some((item) => {
                            return Settings.isDataExistsInArray(headers[i], item);
                        })
                            ? "rightAligned"
                            : "leftAligned",
                    };
                }
            });

        return [
            {
                headerName: `State Matrix Report (${state_name})`,
                headerClass: "main_header",
                resizable: true,
                children: dt,
            },
        ]
    }
}

const defaultCols = () => {
    return {
        flex: 1,
        editable: false,
        sortable: true,
        resizable: true,
        minWidth: 250,
        filter: true,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatingFilter: false,
        initialWidth: 250,
        wrapHeaderText: true,
        autoHeaderHeight: true,
    }
}

export default {
    headers, defaultCols
}