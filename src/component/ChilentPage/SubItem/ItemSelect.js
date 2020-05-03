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

        var itemstring = Common._loadStorage("itemsList")
        if(itemstring === null) // 没有数据，跳转加载
        {
            this.props.history.push("/loading")
        }
        else{
            const {setMainContext} = context;
            setMainContext({items:JSON.parse(itemstring)})
        }
    }
    static getDerivedStateFromProps(nexProps, prevState){
        var itemstring = Common._loadStorage("itemsList")
        return {
            items : JSON.parse(itemstring),
        }
      } 

    shouldComponentUpdate(nexProps, prevState)    {
        return true;
    }
    static propTypes = {
    }
    
    render(){
        var rows = [];
        if ( this.state.items !=null ) {
            this.state.items.forEach(element=>{

                rows.push(
                    <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                        <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                        <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                        <Table.Cell>{element.ITEM_PRICE}</Table.Cell>
                        <Table.Cell><AddButton itemKey = {element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()} 
                        ></AddButton></Table.Cell>
                    </Table.Row>
                )
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

export {AddButton}