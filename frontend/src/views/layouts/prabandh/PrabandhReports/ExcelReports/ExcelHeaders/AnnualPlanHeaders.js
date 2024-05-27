const headers = () => {
    return [
        {
            id: "cell",
            alignment: {
                vertical: "Center",
                horizontal: "Left",
            },
            borders: {
                borderBottom: {
                    color: "#ffab00",
                    lineStyle: "Continuous",
                    weight: 6,
                },
            },
            font: {
                size: 10,
            },
        },
        {
            id: "main_header",
            alignment: {
                vertical: "Center",
                horizontal: "Center",
            },
            interior: {
                color: "#64e359",
                pattern: "Solid",
                patternColor: undefined,
            },
            borders: {
                borderBottom: {
                    color: "#ffab00",
                    lineStyle: "Continuous",
                    weight: 6,
                },
            },
            font: {
                color: "#ffffff",
                size: 28,
                weight: 6,
            },
        },
        {
            id: "subheader",
            alignment: {
                vertical: "Center",
                horizontal: "Center",
            },
            interior: {
                color: "#8edfe8",
                pattern: "None",
                patternColor: "#000000",
                width: 500,
            },
            font: {
                color: "#0059ff",
                size: 20,
            },
        },
        {
            id: "report_header",
            alignment: {
                vertical: "Center",
                horizontal: "Center",
            },
            font: {
                color: "#000000",
                bold: true,
                size: 16,
            },
            interior: {
                color: "#ffffff",
                pattern: "None",
                patternColor: "#000000",
            },
        },
    ]
}

export default {
    headers
}