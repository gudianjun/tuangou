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
    SegmentGroup, GridColumn, Radio, Checkbox
} from 'semantic-ui-react'
import {element} from "prop-types";

const ItemWHGrid = ({itemInfo, setItemInfo, itemsWh}) => {

    const initFlg = useRef(false);
    if(initFlg.current === false) {
        initFlg.current = true
    }

    return (
        <div style={{height: '70vh', overflowY:'scroll'}}>
            <Table celled selectable fixed >
                <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >店铺名称</Table.HeaderCell>
                        <Table.HeaderCell >店铺类型</Table.HeaderCell>
                        <Table.HeaderCell >商品数量</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body >
                    {
                        itemsWh.map(element=>{
                            console.log("ItemWHGrid")
                            return (<Table.Row key={element.SHOP_NAME}>
                                <Table.Cell collapsing>{element.SHOP_NAME}</Table.Cell>
                                <Table.Cell collapsing>{element.SHOP_TYPE_NAME}</Table.Cell>
                                <Table.Cell collapsing>{element.ITEM_COUNT}</Table.Cell>
                            </Table.Row>)
                        })
                    }
                </Table.Body>
            </Table>
        </div>
    )
}
export default ItemWHGrid;