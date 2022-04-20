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

const ComTypeDropDown = ({itemInfo, setItemInfo, sourceItemInfo}) => {

    const initFlg = useRef(false);
    const [dropOptions, setDropOptions] = useState([])
    // const [selectOptions, setSelectOptions] = useState('')

    function getComTypes(){
        Common.sendMessage(Common.baseUrl + "/item/getcomtypes"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                let options=[]
                e.data.forEach(element => {
                    options.push({
                        key: element.COM_TYPE_ID,
                        text: element.COM_TYPE_ID,
                        value: element.COM_TYPE_ID
                    })
                });
                // 写入缓存
                setDropOptions(options)
            },null,
            null)
    }

    if(initFlg.current === false) {
        initFlg.current = true
        getComTypes()
    }

    return (
            <Dropdown options={dropOptions}
                      onChange={(e,f)=>{
                          console.log(f.value)
                          setItemInfo((prev)=>{
                              return {COM_TYPE_ID:f.value, ITEM_ID:-1}
                          })
                      }
            } placeholder='请选择一个商品类别'></Dropdown>
    )
}
export default ComTypeDropDown;