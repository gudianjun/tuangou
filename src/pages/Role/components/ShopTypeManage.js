import React,{useState, useEffect, useRef } from "react"
import {Table, Grid, Input, TextArea, Label, Radio, Checkbox, ButtonGroup, Button} from 'semantic-ui-react'
import {element, func} from "prop-types";
import Common from "../../../common/common";
import {MainContext} from "../../../component/ChilentPage/ObjContext";

const ShopTypeManage = ({getAllRoles}) =>{
    const {_currentValue} = MainContext;
    const [showall, setShowall] = useState(false)
    const [shoptypes, setShoptypes] = useState([])
    const [editstate, setEditstate] = useState(0) // 0:初始状态，1:编辑现存状态，2:添加状态
    const initFlg = useRef(false);
    const [editObj, setEditObj] = useState({shoptype:'',shoptypename:'', shoptypehaswarehouse:0})
    useEffect(()=>{

    }, [showall])
    function getAllTypes(){
        Common.sendMessage(Common.baseUrl + "/rolemanage/getallshoptype"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                console.log(e)
                getAllRoles()
                setShoptypes(e.data)
            },null,
            null)
    }
    function onEditItem(flg, value){
        if(flg === "shoptype") {
            const reg = /^\d+$/;
            if (reg.test(value) || value === '') {
                setEditObj({shoptype: value, shoptypename: editObj.shoptypename, shoptypehaswarehouse:editObj.shoptypehaswarehouse})
            }
        }
        else{
            setEditObj({shoptype:editObj.shoptype,shoptypename:value, shoptypehaswarehouse:editObj.shoptypehaswarehouse })
        }
    }
    function onSaveAddStop(){
        if(editObj.shoptype.length > 0 && editObj.shoptypename.length > 0){
            Common.sendMessage(Common.baseUrl + "/rolemanage/addshoptype"
                , "POST"
                , null
                , {SHOP_TYPE:editObj.shoptype, SHOP_TYPE_NAME:editObj.shoptypename, SHOP_TYPE_HAS_WAREHOUSE:editObj.shoptypehaswarehouse}
                , null
                , (e)=>{
                    initFlg.current = false
                    setEditstate(0)
                    setEditObj({shoptype:'',shoptypename:'', shoptypehaswarehouse: 0})
                },(err)=>{

                    const {setMainContext} = _currentValue
                     setMainContext({
                         errorMessage: err
                     })
                },
                null)
        }
    }
    function addAddRow(){
        if(editstate === 0) {
            return (
                <Table.Row key={"aaaa"}>
                    <Table.Cell collapsing></Table.Cell>
                    <Table.Cell collapsing></Table.Cell>
                    <Table.Cell collapsing></Table.Cell>
                    <Table.Cell collapsing>
                        {
                            (<Button primary onClick={(e) => onAddStop(element)}>添加</Button>)
                        }

                    </Table.Cell>
                </Table.Row>
            )
        }
        else if(editstate === 1){

        }
        else{
            return (
                <Table.Row key={99999}>
                    <Table.Cell collapsing>
                        <Input fluid value={editObj.shoptype} onChange={(e, f)=>onEditItem('shoptype', f.value)}></Input>
                    </Table.Cell>
                    <Table.Cell collapsing>
                        <Input fluid value={editObj.shoptypename} onChange={(e, f)=>onEditItem('shoptypename', f.value)}></Input>
                    </Table.Cell>
                    <Table.Cell collapsing>
                        <Checkbox label={editObj.shoptypehaswarehouse === 1 ? '有仓库' : '无'} checked={editObj.shoptypehaswarehouse === 1 ? true : false}
                                  onChange={(e,f)=>{
                                      let value = f.checked ? 1 : 0
                                      setEditObj({shoptype:editObj.shoptype,shoptypename:editObj.shoptypename, shoptypehaswarehouse:value })
                                  }}></Checkbox>
                    </Table.Cell>
                    <Table.Cell collapsing>
                        {
                            (<Button primary onClick={(e) => onSaveAddStop()}>添加</Button>)
                        }
                        {
                            (<Button primary onClick={(e) => onEditShop()}>取消</Button>)
                        }
                    </Table.Cell>
                </Table.Row>
            )
        }

    }
    function addNormolRow(element){
        if(showall || element.DEL_FLG === 0){
            return (
                <Table.Row key={element.SHOP_TYPE}>
                    <Table.Cell collapsing>{element.SHOP_TYPE}</Table.Cell>
                    {
                        (editstate === 1 && element.SHOP_TYPE === editObj.shoptype)?
                            (<Table.Cell collapsing>
                                <Input fluid value={editObj.shoptypename}
                                       onChange={(e, f)=>
                                           onEditItem('shoptypename', f.value)}>
                                </Input></Table.Cell>)
                            :(<Table.Cell collapsing>{element.SHOP_TYPE_NAME}</Table.Cell>)

                    }
                    {
                        (editstate === 1 && element.SHOP_TYPE === editObj.shoptype)?
                            (<Table.Cell collapsing>
                                <Checkbox label={(editObj.shoptypehaswarehouse === 1) ? '有仓库' : '无'} checked={(editObj.shoptypehaswarehouse === 1) ? true : false}
                                          onChange={(e,f)=>{
                                              let value = f.checked ? 1 : 0
                                              setEditObj({shoptype:editObj.shoptype,shoptypename:editObj.shoptypename, shoptypehaswarehouse:value })
                                          }}></Checkbox>
                            </Table.Cell>)
                            :(<Table.Cell collapsing>{element.SHOP_TYPE_HAS_WAREHOUSE === 1 ? '有仓库' : '无'}</Table.Cell>)


                    }
                    <Table.Cell collapsing>
                        {
                            element.DEL_FLG === 0?
                            (
                                <ButtonGroup>
                                    {(element.SHOP_TYPE !== 99 && element.SHOP_TYPE !== 0) ?
                                        (<Button primary onClick={(e) => onDeleteStop(element)}>{
                                            editstate===1 && editObj.shoptype === element.SHOP_TYPE? "提交" : "删除"}</Button>):null }
                                    {(element.SHOP_TYPE !== 99 && element.SHOP_TYPE !== 0) ? (<Button.Or/>) : null }
                                    {(element.SHOP_TYPE !== 99 && element.SHOP_TYPE !== 0) ?
                                        (<Button secondary onClick={(e) => onEditShop(element)}>{
                                        editstate===1 && editObj.shoptype === element.SHOP_TYPE? "取消" : "编辑"}</Button>):null}
                                </ButtonGroup>
                            )
                            :(<Button secondary onClick={(e) => onRecoverStop(element)}>恢复</Button>)
                        }
                    </Table.Cell>
                </Table.Row>
            )
        }
    }

    function onDeleteStop(element){
        if(editstate === 0) {
            Common.sendMessage(Common.baseUrl + "/rolemanage/delteshoptype"
                , "POST"
                , null
                , {SHOP_TYPE: element.SHOP_TYPE}
                , null
                , (e) => {
                    initFlg.current = false

                    setEditstate(0)
                    setEditObj({shoptype: '', shoptypename: ''})
                }, (err) => {

                    const {setMainContext} = _currentValue
                    setMainContext({
                        errorMessage: err
                    })
                },
                null)
        }
        else if(editstate === 1 && element.SHOP_TYPE === editObj.shoptype) { // 编辑状态
            Common.sendMessage(Common.baseUrl + "/rolemanage/editshoptypename"
                , "POST"
                , null
                , {SHOP_TYPE: element.SHOP_TYPE, SHOP_TYPE_NAME: editObj.shoptypename,
                    SHOP_TYPE_HAS_WAREHOUSE:editObj.shoptypehaswarehouse}
                , null
                , (e) => {
                    initFlg.current = false
                    setEditstate(0)
                    setEditObj({shoptype: '', shoptypename: '', shoptypehaswarehouse: 0})
                }, (err) => {

                    const {setMainContext} = _currentValue
                    setMainContext({
                        errorMessage: err
                    })
                },
                null)
        }

    }
    function onEditShop(element){
        if(editstate === 0) {
            setEditstate(1)
            setEditObj({shoptype: element.SHOP_TYPE, shoptypename: element.SHOP_TYPE_NAME, shoptypehaswarehouse: element.SHOP_TYPE_HAS_WAREHOUSE})
        }
        else if(editstate === 1 && element.SHOP_TYPE === editObj.shoptype) {
            setEditstate(0)
            setEditObj({shoptype: '', shoptypename: '', shoptypehaswarehouse: 0})
        }
        else if(editstate === 2) {
            setEditstate(0)
            setEditObj({shoptype: '', shoptypename: '', shoptypehaswarehouse: 0})
        }
    }
    function onRecoverStop(element){
        Common.sendMessage(Common.baseUrl + "/rolemanage/delteshoptype"
            , "POST"
            , null
            , {SHOP_TYPE:element.SHOP_TYPE, DEL_FLG:0}
            , null
            , (e)=>{
                initFlg.current = false
                setEditstate(0)
                setEditObj({shoptype:'',shoptypename:'', shoptypehaswarehouse: 0})
            },(err)=>{

                const {setMainContext} = _currentValue
                setMainContext({
                    errorMessage: err
                })
            },
            null)
    }
    function onAddStop(){
        setEditstate(2)
    }
    if(initFlg.current === false) {
        initFlg.current = true
        getAllTypes()
    }

    return (
        <div>

            <Table celled selectable fixed>
                <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >店铺类型编号</Table.HeaderCell>
                        <Table.HeaderCell >类型名称</Table.HeaderCell>
                        <Table.HeaderCell >是否允许仓储</Table.HeaderCell>
                        <Table.HeaderCell width={3} >
                            <Radio toggle label='显示全部' checked={showall}
                                   onChange={(e,f)=>setShowall(f.checked)}>
                            </Radio>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body >
                    {
                        shoptypes.map(element=>{
                            return addNormolRow(element)
                        })
                    }
                    {
                        addAddRow()
                    }
                </Table.Body>
            </Table>

        </div>
    );

}
export default ShopTypeManage;