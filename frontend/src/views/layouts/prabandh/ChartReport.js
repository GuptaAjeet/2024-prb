import React, {useState} from "react";
import { Hook, Helper } from "../../../apps";
import { Charts } from "../../../apps/components/elements";

const ChartReport = () => {
    const SOption = Hook.useStates();
    const DOption = Hook.useDistricts();

    const [data, setData] = useState({});
    const [options, setOptions] = useState({});

    const getChartData = async () => {
        if (SOption != null) {

            let finalData = {
                "name": "India",
                "children": []
            }
            SOption.forEach((state, index) => {
                let data = {
                    "name": state.name,
                    "children": getDistricts(state.id)
                }

                finalData.children.push(data);
            })

            return finalData;
        }
    }

    const getDistricts = (state_id) => {
        let districtData = Helper.districtFilter(DOption, state_id);

        let districtDataForChildren = []

        districtData.forEach((district, index) => {
            let data = {
                "name": district.name,
             //   "children": getBlocks(state_id, district.id)
                "value": district?.id

            }

            districtDataForChildren.push(data)
        })


        return districtDataForChildren;
    }

    setTimeout(async () => {
        setData(await getChartData());

        if (data?.children?.length > 0) {
            data.children.forEach(function (datum, index) {
                datum.name !== 'Bihar' && (datum.collapsed = true);
            });
        }

        setOptions({
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    data: [data],
                    top: '1%',
                    left: '7%',
                    bottom: '1%',
                    right: '20%',
                    symbolSize: 7,
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 9
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }
            ]
        }) 
    }, 10)

    return (
        <div className="dashboard-main-content">
            <div className="dashboard-main-content__header mb-3">
                <h1>Chart Report</h1>
            </div>
            {(data == null || data.length == 0) 
            ? <div className="dashboard-main-content-info"></div> 
            : <div className="dashboard-main-content-info">
                <div className="col-xl-12 col-lg-12 col-sm-12">
                    {(data) && <Charts object={{ 'data':  data ? data : [], 'options': options, 'height': 730 }} />}
                </div>
            </div>}
        </div>

    );
};
export default ChartReport;
