import React,{useState, useEffect, useRef } from "react"
import { Table, Grid, Input, TextArea, Label, Divider, Icon, Header} from 'semantic-ui-react'
import ComTypeManage from "./components/ComTypeManage";
import RolManage from "./components/RoleManage";
import ShopTypeManage from "./components/ShopTypeManage";
import Common from "../../common/common";
const Role = () =>{
    const initFlg = useRef(false);
    const [refRole, setRefRole] = useState(false)
    const [roles, setRoles] = useState([])
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

    if(initFlg.current === false) {
        initFlg.current = true
        getAllRoles()
    }

    return (
        <div>
            <Divider horizontal>
            <Header as='h4'>
                <Icon name='tag' />
                商品类型编辑
            </Header>
        </Divider>
            <ComTypeManage getAllRoles={getAllRoles} roles={roles} setRoles={setRoles}></ComTypeManage>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='tag' />
                    用户角色编辑
                </Header>
            </Divider>
            <ShopTypeManage getAllRoles={getAllRoles} roles={roles} setRoles={setRoles}></ShopTypeManage>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='tag' />
                    角色认证编辑
                </Header>
            </Divider>
            <RolManage roles={roles} getAllRoles={getAllRoles}></RolManage>
        </div>
    );

}
export default Role;