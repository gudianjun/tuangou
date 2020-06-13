import React,{Component} from "react"
import { Icon, Label, Table,Button , Input, Modal, ButtonGroup, Grid} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from "../../../common/common"
// 仓库物品选择

export default class MemShopItemSel extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            items:[],
            searchtext: ''
            
            , showset:false
            , modelinfo:{}
        }
    }

    shouldComponentUpdate(nexProps, prevState)    {
        return true;
    }
    static propTypes = {
        MEM_ID:PropTypes.number,
        ORDER_TYPE:PropTypes.number,
        ITEMS:PropTypes.array,
    }
    
    getDelFlg(item){
        if (item.DEL_FLG === 1)
            return (<Label color='red' ribbon>DEL</Label>)
    }
    getItemHistory(item){
        Common.sendMessage(Common.baseUrl + "/member/memhistory"
            , "POST"
            , null
            , {ITEM_ID:item.ITEM_ID, COM_TYPE_ID:item.COM_TYPE_ID, MEM_ID:this.props.MEM_ID}
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
    getNumber(item){
        if (item.ITEM_NUMBER !== 0){
            return (
                <Label as='a' color='violet' content={item.ITEM_NUMBER} onClick={()=>this.getItemHistory(item)}>
                    
                </Label>
            )
        }
        else{
            return (
                <Label as='a'  content={item.ITEM_NUMBER} onClick={()=>this.getItemHistory(item)}>
                    
                </Label>
            )
        }
    }
    // 添加商品到购物车中
    onClickHandler(item){
        const {shoppingItems} = this.context;
        const {setMainContext} = this.context;
        var sii = new ShoppingItem()
        var fi = this.props.ITEMS.find(element=>element.key === item.key)
        var index = shoppingItems.findIndex(element=>element.ITEM_ID === item.ITEM_ID && element.COM_TYPE_ID === item.COM_TYPE_ID)
        if (index >= 0){
            if(this.props.ORDER_TYPE === 1)
            {
                if(fi.ITEM_NUMBER - shoppingItems[index].ITEM_NUMBER > 0){
                    shoppingItems[index].ITEM_NUMBER++
                }
            }
            else{
                shoppingItems[index].ITEM_NUMBER++
            }
        }
        else{
            if(this.props.ORDER_TYPE === 1)
            {
                if(fi.ITEM_NUMBER > 0){
                    sii.InitShoppingItem(fi, shoppingItems.length)
                    shoppingItems.push(sii)
                }
            }
            else{
                sii.InitShoppingItem(fi, shoppingItems.length)
                shoppingItems.push(sii)
            }
        }
        console.log(this.context)
        setMainContext({shoppingItems:shoppingItems})
    }
    getSetFlg(item){
        if (item.ITEM_TYPE === 1){
            return (<Label color='green' ribbon>SET</Label>)
        }
        else if (item.ITEM_TYPE === 2){
            return (<Label color='blue' ribbon>散</Label>)
        }
    }
    render(){
        var rows = [];
       
        this.props.ITEMS.forEach(element=>{
            var index = 0
            if(this.state.searchtext !== undefined){
                index = (element.COM_TYPE_ID.toUpperCase() + element.ITEM_ID.toString() + element.ITEM_NAME).indexOf(this.state.searchtext.toUpperCase())
            }
            if( index>= 0){
                rows.push(
                    <Table.Row key={element.key}>
                        <Table.Cell>{this.getDelFlg(element)}{this.getSetFlg(element)}{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                        <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.getNumber(element)}</Table.Cell>
                        <Table.Cell>
                            <Button icon onClick={()=>{this.onClickHandler(element)}}><Icon name='shopping cart'/></Button>
                        </Table.Cell>
                    </Table.Row>
                )
            }
        }
        )
        

        var memrows=[]
        var totel = 0
        if(this.state.showset){
            this.state.modelinfo.items.forEach(element => {
                if(element.ORDER_TYPE === 0){
                    totel+=element.ITEM_NUMBER
                }
                else if(element.ORDER_TYPE === 1){
                    totel-=element.ITEM_NUMBER
                }
                memrows.push(
                    <Table.Row key = {element.ORDER_ID}>
                        <Table.Cell>{element.ORDER_ID}</Table.Cell>
                        <Table.Cell>{element.ORDER_TIME}</Table.Cell>
                        <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                        <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                        <Table.Cell>{element.ORDER_TYPE === 0 ? '存入': '提出'}</Table.Cell>
                        <Table.Cell>{element.ITEM_NUMBER}</Table.Cell>
                    </Table.Row>
                        )
            })

           
        }

        return(
            <div>

            <Input icon='search' size='small' placeholder='Search...' fluid onChange={(e,f)=>{this.setState({searchtext:f.value})}} />
            <div style={{height:'84vh', overflowY:'scroll'}}>
                <Table celled selectable>
                    <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >商品编号</Table.HeaderCell>
                        <Table.HeaderCell>商品名称</Table.HeaderCell>
                        <Table.HeaderCell>数量</Table.HeaderCell>
                        <Table.HeaderCell>操作</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body >
                        {rows}
                    </Table.Body>
                </Table>
            </div>
            
            <Modal open={this.state.showset}>   
                    <Modal.Header> {'会员【' + this.state.modelinfo.memname + '】存取记录'  }
                        <ButtonGroup style={{position:'absolute',right:60}}>
                            <Button onClick={()=>this.setState({showset:false})} >
                                关闭
                            </Button>
                        </ButtonGroup>
                    </Modal.Header>
                    <Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Column>
                            <div  style={{height:  '75vh' , overflowY:'scroll' }}>
                                <Table celled selectable>
                                    <Table.Header  >
                                        <Table.Row >
                                            <Table.HeaderCell>订单编号</Table.HeaderCell>
                                            <Table.HeaderCell>订单时间</Table.HeaderCell>
                                            <Table.HeaderCell>商品ID</Table.HeaderCell>
                                            <Table.HeaderCell>商品名称</Table.HeaderCell>
                                            <Table.HeaderCell>操作类型</Table.HeaderCell>
                                            <Table.HeaderCell>数量</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body >
                                           {memrows}
                                    </Table.Body>
                                    <Table.Footer fullWidth>
                                    </Table.Footer>
                                </Table></div>
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        {'合计拥有数量：' + totel}
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}
