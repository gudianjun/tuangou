import React,{useState, useEffect, useRef } from "react"
import {
    Table,
    Grid,
    Input,
    TextArea,
    Label,
    Modal,
    ButtonGroup,
    Button,
    Dropdown,
    SegmentGroup, GridColumn
} from 'semantic-ui-react'

import {Chart, Interval, Tooltip} from "bizcharts";

const JingShouYi = ({datas}) => {

    const initFlg = useRef(false);

    if(initFlg.current === false) {
        initFlg.current = true
    }
    console.log('YingYee')
    const data  = []
    datas.forEach(element=>{

        data.push({
                month: element.TEDAY,
                sales: (element.TOTAL_XS - element.TOTAL_TH) - (element.TOTAL_XS_COST - element.TOTAL_TH_COST + element.TOTAL_XH_COST)
            }
        )
    })

    return (
        <Chart height={200} autoFit data={data} interactions={['active-region']} padding={[30, 30, 30, 50]} >
            <Interval position="month*sales" />
            <Tooltip shared />
        </Chart>
    )
}
export default JingShouYi;