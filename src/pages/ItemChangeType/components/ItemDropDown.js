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
import Common from "../../../common/common";

const ItemDropDown = ({itemInfo, setItemInfo, itemNames}) => {

    const initFlg = useRef(false);

    if(initFlg.current === false) {
        initFlg.current = true
    }

    return (
            <Dropdown placeholder='请选择一个商品' search options={itemNames} value={itemInfo.ITEM_ID===-1?null:itemInfo.ITEM_ID}  onChange={
                (e,f)=>{
                    setItemInfo((prev)=>{
                        return {...prev, ITEM_ID:f.value}
                    })
                }
            }></Dropdown>
    )
}
export default ItemDropDown;