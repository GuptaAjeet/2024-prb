import React from "react";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts';
import { TreeChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, TreeChart, CanvasRenderer]
);

const Charts = (props) => {

    const object    = props.object !== null ? props.object : null;
    const data      = object.data !== null ? object.data : {};
    const option    = object.options !== null ? object.options : {};
    const height    = object.height !== null ? object.height : 730;

    if(Object.keys(data).length > 0 && data?.children.length > 0){
        return (
            <ReactEChartsCore
            style={{ height: height }}
            echarts={echarts}
            option={option}
            notMerge={true}
            lazyUpdate={true}
            theme={"dark"}
            //onChartReady={this.onChartReadyCallback}
            //onEvents={EventsDict}
            //opts={}
            />    
        );
    }
    else{
        return(
            <></>
        )
    }
}

export default Charts;