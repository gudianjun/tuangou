import React,{Component} from "react"
import { Table, Grid, Label, Button, Modal, ButtonGroup, Input} from 'semantic-ui-react'
import {MainContext} from './ObjContext'
import Common from "../../common/common"
import _ from 'lodash'
import  "../../App.css"
// 定制一个添加按钮

// 会员存款总览
export default class MemCunKuanZongLan extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            data:[],
            column:null,
            direction:null,
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
    handleSort = (clickedColumn) => () => {
        const { column, modelinfo, direction } = this.state
    
        if (column !== clickedColumn) {
            modelinfo.infos = _.sortBy(modelinfo.infos, [clickedColumn])
          this.setState({
            column: clickedColumn,
            modelinfo:modelinfo,
            direction: 'ascending',
          })
    
          return
        }
        modelinfo.infos = modelinfo.infos.reverse()
        this.setState({
            modelinfo: modelinfo,
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
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
                var index = 0
                if(this.state.searchtext !== undefined){
                    index = (element.COM_TYPE_ID.toUpperCase() + element.ITEM_ID.toString() + element.ITEM_NAME).indexOf(this.state.searchtext.toUpperCase())
                }
                if(index>=0){
                    var colms = []
                    nkey++
                    rows.push(
                    <Table.Row key = {element.COM_TYPE_ID + '_' + element.ITEM_ID + nkey.toString()}>
                        <Table.Cell key={ (nkey++).toString()}><span title={"aaaaaaaasdfasdfasdf"}>{element.COM_TYPE_ID + element.ITEM_ID}</span> </Table.Cell>
                        <Table.Cell key={ (nkey++).toString()}><span title={"aaaaaaaasdfasdfasdf"}>{element.ITEM_NAME}</span> </Table.Cell>
                        {this.state.data.shopname.forEach(shop => {
                                colms.push(<Table.Cell key={ (nkey++).toString()}  textAlign='right'>{this.getNumber(element, shop)}</Table.Cell>)
                        })}
                        {colms}
                        <Table.Cell key={ (nkey++).toString()} textAlign='right'>{element.TOTLE_NUMBER}</Table.Cell>
                    </Table.Row>
                        )
                }
            });
            
        }
        var memrows=[]
        if(this.state.showset){ 
            var seq = 1
            this.state.modelinfo.infos.forEach(element => {
               
                memrows.push(
                    <Table.Row key = {element.MEM_CODE}>
                        <Table.Cell>{seq++}</Table.Cell>
                        <Table.Cell>{element.MEM_CODE}</Table.Cell>
                        <Table.Cell>{element.MEM_NAME}</Table.Cell>
                        <Table.Cell textAlign='right'>{element.ITEM_NUMBER}</Table.Cell>
                    </Table.Row>
                        )
            })
        }
        const { column, direction } = this.state
        return(
            <div >
            <Input icon='search' size='small' placeholder='Search...'  onChange={(eX,f)=>{this.setState({searchtext:f.value})}} />
            <div style={{ height:  '85vh' , overflowY:'scroll', overflowX:'hidden' }} >
                <Grid columns='equal'>
                    <Grid.Row  key={ (nkey++).toString()}>
                    <Grid.Column>
                        <Table celled selectable>
                            <Table.Header >
                                <Table.Row key={ (nkey++).toString()}>
                                    <Table.HeaderCell key={ (nkey++).toString()}>商品编号</Table.HeaderCell>
                                    <Table.HeaderCell key={ (nkey++).toString()}>商品名称</Table.HeaderCell>
                                    {shopclms}
                                    <Table.HeaderCell key={ (nkey++).toString()}>合计</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body style={{ height:  '85vh' , overflowY:'scroll', overflowX:'hidden' }}>
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
                                <Table celled selectable sortable>
                                    <Table.Header  >
                                        <Table.Row key={ (nkey++).toString()}>
                                            <Table.HeaderCell  >序号</Table.HeaderCell>
                                            <Table.HeaderCell sorted={column === 'MEM_CODE' ? direction : null} onClick={this.handleSort('MEM_CODE')}>会员号</Table.HeaderCell>
                                            <Table.HeaderCell sorted={column === 'MEM_NAME' ? direction : null} onClick={this.handleSort('MEM_NAME')}>会员姓名</Table.HeaderCell>
                                            <Table.HeaderCell sorted={column === 'ITEM_NUMBER' ? direction : null} onClick={this.handleSort('ITEM_NUMBER')}>持有数量</Table.HeaderCell>
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
            </div></div>
        )
    }
}
