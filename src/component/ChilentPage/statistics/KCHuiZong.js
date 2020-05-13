import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button , Grid, Segment} from 'semantic-ui-react'
import PropTypes, { element } from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from "../../../common/common"
// 定制一个添加按钮

// 库存汇总
export default class KCHuiZong extends Component{
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
                                    <Table.HeaderCell>商品ID</Table.HeaderCell>
                                    <Table.HeaderCell>商品名称</Table.HeaderCell>
                                    <Table.HeaderCell>入库数量</Table.HeaderCell>
                                    <Table.HeaderCell>出库数量</Table.HeaderCell>
                                    <Table.HeaderCell>销售数量</Table.HeaderCell>
                                    <Table.HeaderCell>销毁数量</Table.HeaderCell>
                                    <Table.HeaderCell>退货数量</Table.HeaderCell>
                                    <Table.HeaderCell>出库-入库</Table.HeaderCell>
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
