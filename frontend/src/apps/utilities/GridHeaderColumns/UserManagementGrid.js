const headers = (setSubmitData, statusHandler, editHandler, userData) => {
   return [
        {
            headerName: "S. No.",
            field: "srl",
            width: 92,
            valueGetter: (params) => {
                return params.node.rowIndex + 1;
            },
        },
        {
            headerName: "Name",
            field: "user_name",
            filter: "agMultiColumnFilter",
        },
        {
            headerName: "Mobile",
            field: "user_mobile",
            filter: "agMultiColumnFilter",
            width: 150,
        },
        {
            headerName: "Email",
            field: "user_email",
            filter: "agMultiColumnFilter",
        },
        {
            headerName: "Role",
            field: "user_role",
            filter: "agMultiColumnFilter",
        },
        {
            headerName: "District name",
            field: "district_name",
            filter: "agMultiColumnFilter",
        },
        {
            headerName: "State name",
            field: "state_name",
            filter: "agMultiColumnFilter",
        },
        {
            headerName: "Status",
            field: "user_status",
            width: 100,
            cellRenderer: function StatusRenderer(params) {
                return (
                    <div
                        className="text-left edit_hover"
                        onClick={(e) => {
                            setSubmitData((prevState) => {
                                return {
                                    user_status: params.data.user_status,
                                    id: params.data.id,
                                };
                            });
                            statusHandler(
                                params.data.user_status,
                                params.data.id
                            );
                        }}
                    >
                        {params.data.id !== userData?.id && (
                            <i
                                className={`fa-regular fa-square-check ${params.data.user_status === 1
                                    ? "text-success"
                                    : "text-danger"
                                    }`}
                                data-id={params.data.id}
                            ></i>
                        )}
                        &nbsp;
                        {params.data.user_status === 1
                            ? " Active"
                            : " Inactive"}
                    </div>
                );
            },
        },
        {
            headerName: "Action",
            field: "action",
            width: 100,
            sortable: false,
            cellRenderer: function StatusRenderer(params) {
                return (
                    <div
                        className="text-left edit_hover"
                        onClick={editHandler}
                        user_role_id={params.data.user_role_id}
                        data-id={params.data.action}
                    >
                        <i className="fa-solid fa-pen text-warning"></i>
                        &nbsp; Edit
                    </div>
                );
            },
        },
    ]
}

export default {
    headers
}