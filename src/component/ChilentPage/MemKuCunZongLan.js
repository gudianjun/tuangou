import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button , Grid, Segment} from 'semantic-ui-react'
import PropTypes, { element } from 'prop-types';
import {ShoppingItem, MainContext} from './ObjContext'
import Common from "../../common/common"
// 定制一个添加按钮

// 会员的库存总览
export default class MemKuCunZongLan extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            data:[]
        }

        Common.sendMessage(Common.baseUrl + "/statistics/cangkumemzonglan"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                this.setState({
                    data:e.data
                })
                console.log(e)
            },null,
            this.context)
    }

    render(){
        var nkey = 1
        var rows=[]
        var shopclms=[]
        if (this.state.data.shopname !== undefined){
            this.state.data.shopname.forEach(shop => {
            shopclms.push(<Table.HeaderCell  key={ (nkey++).toString()}>{shop.SHOP_NAME}</Table.HeaderCell>)
            })
            
            this.state.data.items.forEach(element => {
                var colms = []
                nkey++
                rows.push(
                <Table.Row key = {element.COM_TYPE_ID + '_' + element.ITEM_ID + nkey.toString()}>
                    <Table.Cell key={ (nkey++).toString()}>{element.COM_TYPE_ID + element.ITEM_ID}</Table.Cell>
                    <Table.Cell key={ (nkey++).toString()}>{element.ITEM_NAME}</Table.Cell>
                    {this.state.data.shopname.forEach(shop => {
                            colms.push(<Table.Cell key={ (nkey++).toString()}  textAlign='right'>{element['SHOP_NAME_' + shop.SHOP_ID]}</Table.Cell>)
                    })}
                    {colms}
                    <Table.Cell key={ (nkey++).toString()} textAlign='right'>{element.TOTLE_NUMBER}</Table.Cell>
                </Table.Row>
                    )
            });
            
        }
        return(
            <div>
                <Grid columns='equal'>
                    <Grid.Row  key={ (nkey++).toString()}>
                    <Grid.Column>
                        <Table celled selectable>
                            <Table.Header  >
                                <Table.Row key={ (nkey++).toString()}>
                                    <Table.HeaderCell key={ (nkey++).toString()}>商品编号</Table.HeaderCell>
                                    <Table.HeaderCell key={ (nkey++).toString()}>商品名称</Table.HeaderCell>
                                    {shopclms}
                                    <Table.HeaderCell key={ (nkey++).toString()}>合计</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                               {rows}
                            </Table.Body>
                            <Table.Footer fullWidth>
                             
                            </Table.Footer>
                        </Table>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
