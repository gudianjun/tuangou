import React,{Component, Link} from "react"
import { Table, Grid, Label, Button, Modal, ButtonGroup} from 'semantic-ui-react'
import {MainContext} from './ObjContext'
import Common from "../../common/common"
// 定制一个添加按钮

// 会员的库存总览
export default class MemKuCunZongLan extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            data:[],
            showset:false,
            modelinfo:{}
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
    getMemShop(shopid, itemid, comtype){
        Common.sendMessage(Common.baseUrl + "/statistics/shopmemitems"
            , "POST"
            , null
            , {SHOP_ID:shopid, ITEM_ID:itemid, COM_TYPE_ID:comtype}
            , null
            , (e)=>{
                this.setState(
                    {
                        showset:true,
                        modelinfo:e.data
                    }
                )
                console.log(e)
            },null,
            this.context)

    }
    getNumber(element, shop){
        if(element['SHOP_NAME_' + shop.SHOP_ID]===0){
            return (element['SHOP_NAME_' + shop.SHOP_ID])
        }
        else{
            return ( 
                <Label as='a' onClick={()=>this.getMemShop(shop.SHOP_ID, element.ITEM_ID, element.COM_TYPE_ID)}  color='blue' >
                    {element['SHOP_NAME_' + shop.SHOP_ID]}
            </Label>
           )
        }
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
                            colms.push(<Table.Cell key={ (nkey++).toString()}  textAlign='right'>{this.getNumber(element, shop)}</Table.Cell>)
                    })}
                    {colms}
                    <Table.Cell key={ (nkey++).toString()} textAlign='right'>{element.TOTLE_NUMBER}</Table.Cell>
                </Table.Row>
                    )
            });
            
        }
        var memrows=[]
        if(this.state.showset){
            this.state.modelinfo.infos.forEach(element => {
                memrows.push(
                    <Table.Row key = {element.MEM_CODE}>
                        <Table.Cell>{element.MEM_CODE}</Table.Cell>
                        <Table.Cell>{element.MEM_NAME}</Table.Cell>
                        <Table.Cell textAlign='right'>{element.ITEM_NUMBER}</Table.Cell>
                    </Table.Row>
                        )
            })

           
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

                <Modal open={this.state.showset}>   
                    <Modal.Header>{'店铺【' + this.state.modelinfo.SHOP_NAME + '】中商品【' + this.state.modelinfo.ITEM_NAME + '】的会员存货：'}
                        <ButtonGroup style={{position:'absolute',right:60}}>
                            <Button onClick={()=>this.setState({showset:false})} >
                                关闭
                            </Button>
                        </ButtonGroup>
                    </Modal.Header>
                    <Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Column>
                                <Table celled selectable>
                                    <Table.Header  >
                                        <Table.Row key={ (nkey++).toString()}>
                                            <Table.HeaderCell>会员号</Table.HeaderCell>
                                            <Table.HeaderCell>会员姓名</Table.HeaderCell>
                                            <Table.HeaderCell>持有数量</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body >
                                            {memrows}
                                    </Table.Body>
                                    <Table.Footer fullWidth>
                                    </Table.Footer>
                                </Table>
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}
