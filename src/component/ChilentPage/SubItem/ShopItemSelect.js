import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button } from 'semantic-ui-react'
import PropTypes, { element } from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from "../../../common/common"

// 仓库物品选择

// 定制一个添加按钮
class AddButton extends Component{
    constructor(props){
        super(props)
        this.state={
            itemkey:props.itemkey
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
        if(items.length > 0){
            const {shoppingItems} = this.context;
            const {setMainContext} = this.context;
            var sii = new ShoppingItem()
            var fi = items.find(element=>element.key === this.props.itemkey)
            
            sii.InitShoppingItem(fi, shoppingItems.length)
            shoppingItems.push(sii)
            console.log(this.context)
            setMainContext({shoppingItems:shoppingItems})
            this.setState({
                shoppingItems:shoppingItems
            })
        }
    }
    render(){
        return (
            <Button icon onClick={()=>{this.onClickHandler()}}><Icon name={this.state.iconN}/></Button>
        )
    }
}


export default class ShopItemSelect extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)

        const {cangkuInfo} = context
        this.state = {
            items : cangkuInfo.shopItems
        }

    }
    // static getDerivedStateFromProps(nexProps, prevState){
    //    return null
    // } 

    shouldComponentUpdate(nexProps, prevState)    {
        return true;
    }
    static propTypes = {
    }
    
    // UNSAFE_componentWillUpdate(){
    //     const {cangkuInfo} = this.context
    //     this.setState( {
    //         items : cangkuInfo.shopItems
    //     })
    // }
    onRefClick(){
        
    }
    render(){
        const {cangkuInfo} = this.context
        var rows = [];
       
        cangkuInfo.shopItems.forEach(element=>{
            console.log('cangkuInfo.shopItems : ' ,element)
            rows.push(
                <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                    <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                    <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                    <Table.Cell>{element.ITEM_COUNT}</Table.Cell>
                    <Table.Cell><AddButton itemkey = {element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()} 
                    ></AddButton></Table.Cell>
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
                        <Table.HeaderCell><Button icon onClick={()=>{this.onRefClick()}}> <Icon  name='refresh'></Icon>操作</Button> </Table.HeaderCell>
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
