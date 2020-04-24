import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button } from 'semantic-ui-react'
import PropTypes, { element } from 'prop-types';

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
        onAddshopping:PropTypes.func
    }
    static defaultProps = {
        iconN:'shopping cart'
    }
    onClickHandler(){
        console.log(this)
        this.props.onAddshopping(this.props.itemKey)
    }
    render(){
        return (
            <Button icon onClick={()=>{this.onClickHandler()}}><Icon name={this.state.iconN}/></Button>
        )
    }
}


export default class ItemSelect extends Component{
    constructor(props){
        super(props)
        this.state = {
            items : props.items,
        }
        console.log("ItemSelect")
        console.log(props)
    }
    static getDerivedStateFromProps(nexProps, prevState){
        return {
            items:nexProps.items
        }
      } 

    shouldComponentUpdate(nexProps, prevState)    {
        if(nexProps.items == null)
            {return false}
            else{return true}
    }
    static propTypes = {
        items:PropTypes.array,
        onAddshopping:PropTypes.func
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
                        onAddshopping={this.props.onAddshopping} ></AddButton></Table.Cell>
                    </Table.Row>
                )
            }
            )
        }
        return(
            
            <div>
                <Table celled selectable   >
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