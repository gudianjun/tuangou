import React,{Component} from "react"
import { Icon, Label, Table,Button } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
// 仓库物品选择

export default class MemShopItemSel extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            items:[]
        }
    }

    shouldComponentUpdate(nexProps, prevState)    {
        return true;
    }
    static propTypes = {
        MEM_ID:PropTypes.number,
        ORDER_TYPE:PropTypes.number,
        ITEMS:PropTypes.array
    }
    
    getDelFlg(item){
        if (item.DEL_FLG === 1)
            return (<Label color='red' ribbon>DEL</Label>)
    }
    getNumber(item){
        if (item.ITEM_NUMBER !== 0){
            return (
                <Label as='a' color='violet' content={item.ITEM_NUMBER}>
                    
                </Label>
            )
        }
        else{
            return item.ITEM_NUMBER
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
    render(){
        var rows = [];
       
        this.props.ITEMS.forEach(element=>{

            rows.push(
                <Table.Row key={element.key}>
                    <Table.Cell>{this.getDelFlg(element)}{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                    <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                    <Table.Cell>{this.getNumber(element)}</Table.Cell>
                    <Table.Cell>
                        <Button icon onClick={()=>{this.onClickHandler(element)}}><Icon name='shopping cart'/></Button>
                    </Table.Cell>
                </Table.Row>
            )
        }
        )
        
        return(
            
            <div>
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
        )
    }
}
