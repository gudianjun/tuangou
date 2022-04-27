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
import Common from "../../common/common";

const XiaoSHouTicheng = ({datas}) => {

    const initFlg = useRef(false);

    if(initFlg.current === false) {
        initFlg.current = true
    }
    console.log('YingYee')
    const data  = []
    datas.forEach(element=>{

        data.push({
                month: element.TEDAY,
                name:"提成",
                sales: element.EMP_PRICE,
            }
        )
    })
    datas.forEach(element=>{

        data.push({
                month: element.TEDAY,
                name:"销售",
                sales: element.TOTAL_XS - element.TOTAL_TH,
            }
        )
    })
    return (
        <Chart height={200} padding="auto" data={data} autoFit>
            <Interval
                adjust={[
                    {
                        type: 'dodge',
                        marginRatio: 0,
                    },
                ]}
                color="name"
                position="month*sales"
            />
            <Tooltip shared />
        </Chart>
    )
}
export default XiaoSHouTicheng;