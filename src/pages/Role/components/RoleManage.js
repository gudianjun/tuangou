import React,{useState, useEffect, useRef } from "react"
import {Table, Grid, Input, TextArea, Label, Radio, ButtonGroup, Button, Checkbox, Icon} from 'semantic-ui-react'
import Common from "../../../common/common";
import {element} from "prop-types";



const RolManage = ({roles,getAllRoles}) =>{

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

    function getModelTypeNmae(modelType){
        switch (modelType){
            case 0:
                return (<Icon name='linkify'>{"导航"}</Icon> )
            case 1:
                return (<Icon name='block layout'>{"按钮"}</Icon> )
            case 2:
                return (<Icon name='table'>{"表格列"}</Icon> )
        }
    }

    function addNormolRow(element){
        return (
            <Table.Row key={element.SHOP_TYPE + "_" + element.MODEL_ID}>
                <Table.Cell collapsing>{element.SHOP_TYPE}</Table.Cell>
                <Table.Cell collapsing>{element.SHOP_TYPE_NAME}</Table.Cell>
                <Table.Cell collapsing>{element.MODEL_ID}</Table.Cell>
                <Table.Cell collapsing>{getModelTypeNmae(element.MODEL_TYPE)}</Table.Cell>
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

    return (
        <div style={{ minHeight:800}}>

            <Table celled selectable fixed>
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