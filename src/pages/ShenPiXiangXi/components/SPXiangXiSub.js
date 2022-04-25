import React,{useState, useEffect, useRef } from "react"
import {
    Tab,
    Table,
    Grid,
    Input,
    TextArea,
    Label,
    Modal,
    ButtonGroup,
    Button,
    Dropdown,
    SegmentGroup, GridColumn, Icon, GridRow, Form, Segment
} from 'semantic-ui-react'
import Common from "../../../common/common";
import {element} from "prop-types";
function addPrice(element){
    if(element.TOTAL_PRICE > 0){
        return (
            <Label>{Common.formatCurrency(element.TOTAL_PRICE)}</Label>
        )
    }
    else{
        return (
            <Label color='red'>{Common.formatCurrency(element.TOTAL_PRICE)}</Label>
        )
    }
}
const SPXiangXiSub = ({items, totel}) => {
    return (
        <Grid>
            <GridRow>
                <div >
                    <Table celled selectable sortable fixed={true} compact>
                    <Table.Header  >
                        <Table.Row>
                            <Table.HeaderCell >序号</Table.HeaderCell>
                            <Table.HeaderCell >代码</Table.HeaderCell>
                            <Table.HeaderCell >产品名称</Table.HeaderCell>
                            <Table.HeaderCell >销售数量</Table.HeaderCell>
                            <Table.HeaderCell >单价</Table.HeaderCell>
                            <Table.HeaderCell >金额</Table.HeaderCell>
                        </Table.Row>

                    </Table.Header>
                    <Table.Body >
                        {
                            items.map((element, index)=>{
                                {console.log(' items.map((element, index)=>{')}
                                return (
                                    <Table.Row key={index + 1}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                                        <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                                        <Table.Cell textAlign='right'>{element.ITEM_NUMBER}</Table.Cell>
                                        <Table.Cell textAlign='right'>{Common.formatCurrency(element.ITEM_PRICE)}</Table.Cell>
                                        <Table.Cell textAlign='right'>
                                            {addPrice(element)}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='6'>
                                <Button
                                    floated='right'
                                    icon
                                    labelPosition='left'
                                    primary
                                    size='small'
                                >
                                    <Icon name='yen' /> {Common.formatCurrency(totel)}
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                </div>
            </GridRow>

        </Grid>

    )
}
export default SPXiangXiSub;