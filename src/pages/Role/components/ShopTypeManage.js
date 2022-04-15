import React,{useState, useEffect, useRef } from "react"
import {Table, Grid, Input, TextArea, Label, Radio} from 'semantic-ui-react'

const ShopTypeManage = () =>{
    const [showall, setShowall] = useState(false)

    useEffect(()=>{

    }, [showall])

    return (
        <div>

            <Table celled selectable>
                <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >店铺类型编号</Table.HeaderCell>
                        <Table.HeaderCell >店铺类型</Table.HeaderCell>
                        <Table.HeaderCell >登录密码</Table.HeaderCell>
                        <Table.HeaderCell width={3} >
                            <Radio toggle label='显示全部' checked={showall}
                                   onChange={(e,f)=>setShowall(f.checked)}>
                            </Radio>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body >

                </Table.Body>
            </Table>

        </div>
    );

}
export default ShopTypeManage;