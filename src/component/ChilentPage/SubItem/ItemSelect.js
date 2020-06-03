import React,{Component} from "react"
import { Icon, Label, Table,Button, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types';
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
            , searchtext:'' // 搜索文本
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
                var index = (element.COM_TYPE_ID.toUpperCase() + element.ITEM_ID.toString() + element.ITEM_NAME).indexOf(this.state.searchtext.toUpperCase())
                if( index>= 0){
                    if(this.props.seltype === 0){
                        rows.push(
                            <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                                <Table.Cell>{this.getDelFlg(element)}{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                                <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                                <Table.Cell>{Common.formatCurrency(element.ITEM_PRICE)}</Table.Cell>
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
                                    <Table.Cell textAlign='right' >{Common.formatCurrency(element.ITEM_PRICE)}</Table.Cell>
                                    <Table.Cell><AddButton itemKey = {element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()} 
                                    ></AddButton></Table.Cell>
                                </Table.Row>
                            )
                        }
                        else{

                        }
                    }
                }
            }
            )
        }
        return(
            <div>
                <Input icon='search' size='small' placeholder='Search...' fluid onChange={(e,f)=>{this.setState({searchtext:f.value})}} />
                <div  style={{height:  '75vh' , overflowY:'scroll' }}>
                    <Table size='small' celled >
                        <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell>编号</Table.HeaderCell>
                            <Table.HeaderCell>商品名</Table.HeaderCell>
                            <Table.HeaderCell>单价</Table.HeaderCell>
                            <Table.HeaderCell><Button icon onClick={()=>{this.onClick()}}> <Icon  name='refresh'></Icon></Button> </Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {rows}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        )
    }
}

export {AddButton}