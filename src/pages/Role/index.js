import React,{useState, useEffect, useRef } from "react"
import { Table, Grid, Input, TextArea, Label} from 'semantic-ui-react'

import RolManage from "./components/RoleManage";
import ShopTypeManage from "./components/ShopTypeManage";
const Role = () =>{

    return (
        <div>
            <ShopTypeManage></ShopTypeManage>
            <RolManage></RolManage>
        </div>
    );

}
export default Role;