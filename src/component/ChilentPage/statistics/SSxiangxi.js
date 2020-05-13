import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button , Grid, Segment} from 'semantic-ui-react'
import PropTypes, { element } from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from "../../../common/common"
// 定制一个添加按钮

// 销售详细
export default class SSxiangxi extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            
        }
    }
   
    render(){
        return(
            
            <div>
                <Grid columns='equal'>
                    <Grid.Row>
                    <Grid.Column>
                        <Table celled selectable>
                            <Table.Header  >
                                <Table.Row>
                                    <Table.HeaderCell rowSpan='2'>商品编号</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>商品名称</Table.HeaderCell>
                                    <Table.HeaderCell colSpan='4'>销售</Table.HeaderCell>
                                    <Table.HeaderCell colSpan='4'>退货</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>销毁</Table.HeaderCell>
                                    <Table.HeaderCell rowSpan='2'>销售金额</Table.HeaderCell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.HeaderCell>零售价</Table.HeaderCell>
                                    <Table.HeaderCell>会员价</Table.HeaderCell>
                                    <Table.HeaderCell>团购价</Table.HeaderCell>
                                    <Table.HeaderCell>处理价</Table.HeaderCell>
                                    <Table.HeaderCell>零售价</Table.HeaderCell>
                                    <Table.HeaderCell>会员价</Table.HeaderCell>
                                    <Table.HeaderCell>团购价</Table.HeaderCell>
                                    <Table.HeaderCell>处理价</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                                <Table.Row>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                <Table.Cell >Beta Team</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
