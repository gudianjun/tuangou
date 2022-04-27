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
    SegmentGroup, GridColumn, GridRow, Icon
} from 'semantic-ui-react'
import ItemChangeTypeSub from "./ItemChangeTypeSub";
import Common from "../../../common/common";
import {MainContext} from "../../../component/ChilentPage/ObjContext";
import {element} from "prop-types";

const ItemWhAll = () => {
    const {_currentValue} = MainContext;
    const [sourceItem, setSourceItem] = useState({COM_TYPE_ID:"",ITEM_ID:-1})
    const [targetItem, setTargetItem] = useState({COM_TYPE_ID:"",ITEM_ID:-1})

    const [sourceItemNames, setSourceItemNames] = useState([])
    const [sourceItemWHs, setSourceItemWHs] = useState([])

    const [targetItemNames, setTargetItemNames] = useState([])
    const [targetItemWHs, setTargetItemWHs] = useState([])

    const initFlg = useRef(false);



    useEffect(()=>{
        if(sourceItem.COM_TYPE_ID.length>0 && sourceItem.ITEM_ID !== -1){
            getItemWHs(sourceItem.COM_TYPE_ID, sourceItem.ITEM_ID,0)
        }
        else if(sourceItem.COM_TYPE_ID.length>0 ){
            getItemsForComType(sourceItem.COM_TYPE_ID ,0)
        }
    }, [sourceItem])

    useEffect(()=>{
        if(targetItem.COM_TYPE_ID.length>0 && targetItem.ITEM_ID !== -1){
            getItemWHs(targetItem.COM_TYPE_ID, targetItem.ITEM_ID,1)
        }
        else if(targetItem.COM_TYPE_ID.length>0 ){
            getItemsForComType(targetItem.COM_TYPE_ID, 1)
        }
    }, [targetItem])
    function getItemsForComType(comId, type){
        Common.sendMessage(Common.baseUrl + "/item/getitemsforcom"
            , "POST"
            , null
            , {COM_TYPE_ID:comId}
            , null
            , (e)=>{
                let options=[]
                e.data.forEach(element => {
                    options.push({
                        key: element.COM_TYPE_ID + element.ITEM_ID ,
                        text: element.COM_TYPE_ID + element.ITEM_ID + element.ITEM_NAME,
                        value: element.ITEM_ID
                    })
                });
               if(type ===0 ){
                   setSourceItemNames(options)
               }
               else{
                   setTargetItemNames(options)
               }
            },null,
            null)
    }

    function getItemWHs(comId, itemId ,type){
        Common.sendMessage(Common.baseUrl + "/item/getitemsforwh"
            , "POST"
            , null
            , {COM_TYPE_ID:comId, ITEM_ID:itemId}
            , null
            , (e)=>{
                console.log("getItemWhs")
                let options=[]
                e.data.forEach(element => {
                    options.push({
                        SHOP_NAME: element.SHOP_NAME  ,
                        SHOP_TYPE_NAME: element.SHOP_TYPE_NAME,
                        ITEM_COUNT: element.ITEM_COUNT
                    })
                });
                if(type ===0 ){
                    setSourceItemWHs(options)
                }
                else{
                    setTargetItemWHs(options)
                }
            },null,
            null)
    }

    function onStart(){
        let {confirmInfo} = _currentValue;
        const {setMainContext} = _currentValue
        confirmInfo.onConfirm = ()=>{
            console.log('confirmInfo.onConfirm')
            confirmInfo.open = false
            setMainContext({
                confirmInfo:confirmInfo
            })

        }
        confirmInfo.onCancel = ()=>{
            console.log('confirmInfo.onCancel')
            confirmInfo.open = false
            setMainContext({
                confirmInfo:confirmInfo
            })
        }

        if(sourceItemWHs.length === 0) {
            confirmInfo.open=true
            confirmInfo.content = "请选择一个原始商品"
            setMainContext({
                confirmInfo:confirmInfo
            })
            return
        }
        if(targetItemWHs.length === 0) {
            confirmInfo.open=true
            confirmInfo.content = "请选择一个目标商品"

            setMainContext({
                confirmInfo:confirmInfo
            })
            return
        }

        if(targetItemWHs.findIndex(element=>element.ITEM_COUNT !== 0) >= 0){

            confirmInfo.open=true
            confirmInfo.content = "目标商品已经有库存，无法进行移动！"

            setMainContext({
                confirmInfo:confirmInfo
            })
            return
        }
        if(initFlg.current === false) {
            initFlg.current = true
            Common.sendMessage(Common.baseUrl + "/item/itemsourcetotarget"
                , "POST"
                , null
                , {S_COM_TYPE_ID:sourceItem.COM_TYPE_ID, S_ITEM_ID:sourceItem.ITEM_ID,
                    T_COM_TYPE_ID:targetItem.COM_TYPE_ID, T_ITEM_ID:targetItem.ITEM_ID}
                , null
                , (e)=>{
                    console.log("itemsourcetotarget")
                    getItemWHs(sourceItem.COM_TYPE_ID, sourceItem.ITEM_ID,0)
                    getItemWHs(targetItem.COM_TYPE_ID, targetItem.ITEM_ID,1)
                    initFlg.current = false
                },(e)=>{
                    initFlg.current = false
                },
                null)
        }
    }

    return (
        <div style={{ minHeight:800}}>
            <Grid verticalAlign='middle' >
                <GridRow>
                    <GridColumn width={7}>
                        原始商品
                    </GridColumn>
                    <GridColumn width={2}>

                    </GridColumn>
                    <GridColumn width={7}>
                        目标商品
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn width={7}>
                        <ItemChangeTypeSub itemInfo={sourceItem} setItemInfo={setSourceItem} itemNames={sourceItemNames} itemsWh={sourceItemWHs}></ItemChangeTypeSub>
                    </GridColumn>
                    <GridColumn width={2}>
                        <Button.Group attached='top'>
                            <Button color='twitter'  negative onClick={onStart} >
                                <Icon name={'angle double right'}></Icon>
                                转移
                            </Button>
                        </Button.Group>

                    </GridColumn>
                    <GridColumn width={7}>
                        <ItemChangeTypeSub itemInfo={targetItem} setItemInfo={setTargetItem} itemNames={targetItemNames} itemsWh={targetItemWHs}></ItemChangeTypeSub>
                    </GridColumn>
                </GridRow>
            </Grid>
        </div>
    )
}
export default ItemWhAll;