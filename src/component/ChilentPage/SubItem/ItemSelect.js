import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button } from 'semantic-ui-react'
import PropTypes, { element } from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from "../../../common/common"
// 定制一个添加按钮
class AddButton extends Component{
    constructor(props){
        super(props)
        this.state={
            itemKey:props.itemKey
            , iconN:props.iconN
        };
    }
    static getDerivedStateFromProps(nexProps, prevState){
        return null
    }
    static propTypes = {
        itemkey:PropTypes.string,
        iconN:PropTypes.string,
    }
    static defaultProps = {
        iconN:'shopping cart'
    }
    static contextType = MainContext;
    onClickHandler(){
        //this.props.onAddshopping(this.props.itemKey)
        const {items} = this.context;
        const {shoppingItems} = this.context;
        const {setMainContext} = this.context;
        var sii = new ShoppingItem()
        var fi = items.find(element=>element.key === this.props.itemKey)
        
        sii.InitShoppingItem(fi, shoppingItems.length)
        shoppingItems.push(sii)
        console.log(this.context)
        setMainContext({shoppingItems:shoppingItems})
        this.setState({
            shoppingItems:shoppingItems
        })
    }
    render(){
        return (
            <Button icon onClick={()=>{this.onClickHandler()}}><Icon name={this.state.iconN}/></Button>
        )
    }
}


export default class ItemSelect extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            items:[]
        }        

        this.onClick()
    }
    // static getDerivedStateFromProps(nexProps, prevState){
    //     var itemstring = Common._loadStorage("itemsList")
    //     return {
    //         items : JSON.parse(itemstring),
    //     }
    //   } 

    shouldComponentUpdate(nexProps, prevState)    {
        return true;
    }
    static propTypes = {
        seltype:PropTypes.number
    }
    static defaultProps = {
        seltype:0
    }

    getDelFlg(item){
        if (item.ITEM_TYPE === 1)
            return (<Label color='red' ribbon>SET</Label>)
    }
    onClick(){
        Common.sendMessage(Common.baseUrl + "/xiaoshou/getitems"
            , "POST"
            , null
            , {seltype:0}
            , null
            , (e)=>{
                var arrayObj = []
                e.data.forEach(element => {
                    arrayObj.push({...element, key:element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()})
                });
                this.setState({items:arrayObj})
                this.context.items = arrayObj
            },null,
            this.context)
    }
    
    render(){
        var rows = [];
        if ( this.state.items !=null ) {
            this.state.items.forEach(element=>{
                if(this.props.seltype === 0){
                    rows.push(
                        <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                            <Table.Cell>{this.getDelFlg(element)}{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                            <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                            <Table.Cell>{element.ITEM_PRICE}</Table.Cell>
                            <Table.Cell><AddButton itemKey = {element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()} 
                            ></AddButton></Table.Cell>
                        </Table.Row>
                    )
                }
                else{
                    if(element.ITEM_TYPE === 0){
                        rows.push(
                            <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                                <Table.Cell>{this.getDelFlg(element)}{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                                <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                                <Table.Cell>{element.ITEM_PRICE}</Table.Cell>
                                <Table.Cell><AddButton itemKey = {element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()} 
                                ></AddButton></Table.Cell>
                            </Table.Row>
                        )
                    }
                    else{

                    }
                }
            }
            )
        }
        return(
            
            <div>
                <Table celled selectable>
                    <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >商品编号</Table.HeaderCell>
                        <Table.HeaderCell>商品名称</Table.HeaderCell>
                        <Table.HeaderCell>单价</Table.HeaderCell>
                        <Table.HeaderCell><Button icon onClick={()=>{this.onClick()}}> <Icon  name='refresh'></Icon>操作</Button> </Table.HeaderCell>
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

export {AddButton}