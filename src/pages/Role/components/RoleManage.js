import React,{useState, useEffect, useRef } from "react"
import {Table, Grid, Input, TextArea, Label, Radio, ButtonGroup, Button, Checkbox} from 'semantic-ui-react'
import Common from "../../../common/common";
import {element} from "prop-types";



const RolManage = () =>{


    const [showall, setShowall] = useState(false)
    const [roles, setRoles] = useState([])
    const initFlg = useRef(false);

    useEffect(()=>{

    }, [showall])
    function getAllRoles(){
        Common.sendMessage(Common.baseUrl + "/rolemanage/getallroles"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                console.log(e)
                setRoles(e.data)
            },null,
            null)
    }

    function setRole(modelid, shoptype, isallow){
        Common.sendMessage(Common.baseUrl + "/rolemanage/setmodelallow"
            , "POST"
            , null
            , {MODEL_ID:modelid,SHOP_TYPE:shoptype,IS_ALLOW:isallow}
            , null
            , (e)=>{
                console.log(e)
                getAllRoles()
            },null,
            null)
    }

    function getButtonGroup(item){
        if (item.DISP_FLG === 0){
            if(item.DEL_FLG === 0){
                return (
                    <ButtonGroup>
                        <Button onClick={(e)=>this.onEditClick(e, item.SHOP_ID)} >编辑</Button>
                        <Button onClick={(e)=>this.onDelClick(e, item.SHOP_ID)}>删除</Button>
                    </ButtonGroup>
                )
            }
            else{
                return (
                    <ButtonGroup>
                        <Button onClick={(e)=>this.onHuiFuClick(e, item.SHOP_ID)}>恢复</Button>
                    </ButtonGroup>
                )
            }
        }
        else if (item.DISP_FLG === 1){  // 编辑
            return (

                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 1)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.SHOP_ID)}>取消</Button>
                </ButtonGroup>
            )
        }
        else if (item.DISP_FLG === 2){  // 添加
            return (
                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 2)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.SHOP_ID)}>放弃</Button>
                </ButtonGroup>
            )
        }
    }

    function addNormolRow(element){
        return (
            <Table.Row key={element.SHOP_TYPE + "_" + element.MODEL_ID}>
                <Table.Cell collapsing>{element.SHOP_TYPE}</Table.Cell>
                <Table.Cell collapsing>{element.SHOP_TYPE_NAME}</Table.Cell>
                <Table.Cell collapsing>{element.MODEL_ID}</Table.Cell>
                <Table.Cell collapsing>{element.MODEL_TYPE}</Table.Cell>
                <Table.Cell collapsing>{element.MODEL_NAME}</Table.Cell>
                <Table.Cell collapsing>
                    <Checkbox label={element.ALLOW_FLG === 0 ? '不许可' : '许可'} checked={element.ALLOW_FLG === 0 ? false : true}
                              onChange={(e,f)=>{
                                  setRole(element.MODEL_ID, element.SHOP_TYPE, f.checked)
                              }} />
                </Table.Cell>
            </Table.Row>
        )
    }

    useEffect(()=>{
        roles.forEach(element=>{
            console.log(element)
            // addNormolRow(element)
        })
    }, [roles])


    if(initFlg.current === false) {
        initFlg.current = true
        getAllRoles()
    }


    return (



        <div style={{ minHeight:800}}>

            <Table celled selectable>
                <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >店铺类型</Table.HeaderCell>
                        <Table.HeaderCell >店铺名称</Table.HeaderCell>
                        <Table.HeaderCell >模块ID</Table.HeaderCell>
                        <Table.HeaderCell >模块类型</Table.HeaderCell>
                        <Table.HeaderCell >模块名称</Table.HeaderCell>
                        <Table.HeaderCell width={3} >

                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body >
                    {roles.map((item)=>{
                        return addNormolRow(item)
                    })}
                </Table.Body>
            </Table>

        </div>
    );

}
export default RolManage;