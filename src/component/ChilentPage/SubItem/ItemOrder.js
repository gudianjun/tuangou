import React,{Component} from "react"
import {MainContext} from "../ObjContext"
import { Icon, Label, Menu, Select, Table,Button, Dropdown , Input} from 'semantic-ui-react'
import PropTypes, { element, array } from 'prop-types';

// 定制一个删除按钮
class DelButton extends Component{
    constructor(props){
        super(props)
        this.state={
            itemkey:props.itemkey
            , iconN:props.iconN
        };
        console.log("AddButton")
        console.log(props)
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
    static contextType = MainContext;

    onClickHandler(){
        console.log(this);
        var sp = this.context.shoppingItems
        console.log(sp);
        var index = sp.findIndex(e=>e.key === this.state.itemkey)
        console.log(index);
        sp.splice(index, 1)
        this.context.setMainContext({shoppingItems:sp})
    }
    render(){
        return (
            <Button icon onClick={()=>{this.onClickHandler()}}><Icon name={this.state.iconN}/></Button>
        )
    }
}

// 定制数字加减按钮
class NumberButton extends Component{
    constructor(props, context){
        super(props)
        this.state={itemkey:this.props.itemkey}
    }
    static propTypes = {
        itemkey:PropTypes.string
    }
    handleInput(e){
        console.log(e.target.value)
    }

    static contextType = MainContext;

    numberChange = (e,f) => {
        
        const { value } = f;
        const reg = /^\d*?$/;		// 以数字1开头，任意数字结尾，且中间出现零个或多个数字
        if ((reg.test(value) && value.length < 4) || value === '') {

          const {shoppingItems} = this.context;
          var index = shoppingItems.findIndex(e=>e.key === this.props.itemkey)
          if(value===''){
            shoppingItems[index].ITEM_NUMBER = 1
          }
          else{
            shoppingItems[index].ITEM_NUMBER = value
          }
          const {setMainContext} = this.context;
          shoppingItems[index].PRICE_SUBTOTAL = shoppingItems[index].PRICE_ARR[shoppingItems[index].PRICE_SELECT] * shoppingItems[index].ITEM_NUMBER
          setMainContext({
            shoppingItems:shoppingItems
          })
        }
      }
      plusClick(){
        const {shoppingItems} = this.context;
        const {setMainContext} = this.context;
        var index = shoppingItems.findIndex(e=>e.key === this.props.itemkey)
        if(shoppingItems[index].ITEM_NUMBER < 999){
            shoppingItems[index].ITEM_NUMBER++;
            shoppingItems[index].PRICE_SUBTOTAL = shoppingItems[index].PRICE_ARR[shoppingItems[index].PRICE_SELECT] * shoppingItems[index].ITEM_NUMBER
            setMainContext({
                shoppingItems:shoppingItems
              })
        }
      }
      minusClick(){
        const {shoppingItems} = this.context;
        const {setMainContext} = this.context;
        var index = shoppingItems.findIndex(e=>e.key === this.props.itemkey)
        if(shoppingItems[index].ITEM_NUMBER > 1){
            shoppingItems[index].ITEM_NUMBER--;
            shoppingItems[index].PRICE_SUBTOTAL = shoppingItems[index].PRICE_ARR[shoppingItems[index].PRICE_SELECT] * shoppingItems[index].ITEM_NUMBER
            setMainContext({
                shoppingItems:shoppingItems
              })
        }
      }
   
    render(){
        return (
            <div>
            <Button as='div' labelPosition='right'>
                <Button  icon onClick={()=>this.minusClick()}><Icon name='minus' /></Button>
                
                <Input value={this.props.itemvalue} onChange={(e,f)=>this.numberChange(e,f)}  as='a'  size="mini" basic="true" pointing='left' style={{width:"50px" }} inverted  placeholder="数量"/>
                
                <Button icon onClick={()=>this.plusClick()} ><Icon mini="true" name='plus'/></Button>
            </Button></div>
        )
    }
}

// 定制价格选择下拉框
class SelectPrice extends Component{
    constructor(props, context){
        super(props)
    }
    static propTypes = {
        itemkey:PropTypes.string
    }
   
    static contextType = MainContext;
    priceSelect(e,f){
        console.log(f)
        const {value} = f
        const {shoppingItems} = this.context;
        const {setMainContext} = this.context;
        var index = shoppingItems.findIndex(e=>e.key === this.props.itemkey)
        var priceIndex = shoppingItems[index].PRICE_ARR.findIndex(e=>e === value)
        shoppingItems[index].PRICE_SELECT = priceIndex
        shoppingItems[index].PRICE_SUBTOTAL = shoppingItems[index].PRICE_ARR[shoppingItems[index].PRICE_SELECT] * shoppingItems[index].ITEM_NUMBER
        setMainContext({
            shoppingItems:shoppingItems
          })
    }
    
    render(){
        const {shoppingItems} = this.context;
        var index = shoppingItems.findIndex(e=>e.key === this.props.itemkey)
        var priceTypes = [
            {key: "0",
            text: "单价",
            value: shoppingItems[index].PRICE_ARR[0]},
            {key: "1",
            text: "会员",
            value: shoppingItems[index].PRICE_ARR[1]},
            {key: "2",
            text: "团购",
            value: shoppingItems[index].PRICE_ARR[2]},
            {key: "3",
            text: "处理",
            value: shoppingItems[index].PRICE_ARR[3]}
        ]
        
        // onChange={(e, f)=>{this.setState({selectShop:this.state.shopList.find(element=>element.value === f.value)})}}
        return (
            <Input type='text' placeholder='价格' action>
                    <Select onChange={(e,f)=>{this.priceSelect(e,f)}} style={{width:"80px" }} compact options={priceTypes} defaultValue={priceTypes[shoppingItems[index].PRICE_SELECT].value} />
                        <Label as='a' style={{fontSize:"16px" }} >
                        {priceTypes[shoppingItems[index].PRICE_SELECT].value}
                                            </Label>
            </Input>
        )
    }
}

// 定制价格选择下拉框
class LablePriceSubTotal extends Component{
    constructor(props, context){
        super(props)
    }
    static propTypes = {
        itemkey:PropTypes.string
    }
   
    static contextType = MainContext;
    
    
    render(){
        const {shoppingItems} = this.context;
        var index = shoppingItems.findIndex(e=>e.key === this.props.itemkey)
        console.log("LablePriceSubTotal.............")
        console.log(shoppingItems)
        console.log(index)
        return (
            <Label color='red' style={{fontSize:"16px" }}>
                {shoppingItems[index].PRICE_SUBTOTAL}
            </Label>
        )
    }
}


export default class ItemOrder extends Component{
    

    constructor(props, context){
        super(props)
        this.state = {
            
        }
    }
    
    static getDerivedStateFromProps(nexProps, prevState){
        
        return {
            items:nexProps.items
        }
      } 

    shouldComponentUpdate(nexProps, prevState)    {
        console.log("this.context")
        console.log(this.context)
      return true
    }
    static propTypes = {
       
    }
    static contextType = MainContext;
    sumTotelPrice
    render(){
        var rows = [];
        if (this.context.shoppingItems !=null ) {
            this.context.shoppingItems.forEach(element=>{
               
                rows.push(
                    <Table.Row itemkey={element.key}>
                                <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                                <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                                <Table.Cell>
                                    <SelectPrice itemkey={element.key}></SelectPrice>
                                </Table.Cell>
                                <Table.Cell>
                                    <NumberButton itemkey={element.key} itemvalue={element.ITEM_NUMBER}></NumberButton>
                                </Table.Cell>
                                <Table.Cell>
                                    <LablePriceSubTotal itemkey={element.key}></LablePriceSubTotal>
                                    </Table.Cell>
                                <Table.Cell><DelButton itemkey={element.key} iconN={'trash alternate outline'}></DelButton></Table.Cell>
                            </Table.Row>
                )
                }
            )
        }
 
        return(
            
            <div>
                    <Table celled selectable>
                        
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>商品编号</Table.HeaderCell>
                                <Table.HeaderCell>商品名称</Table.HeaderCell>
                                <Table.HeaderCell>单价</Table.HeaderCell>
                                <Table.HeaderCell>数量</Table.HeaderCell>
                                <Table.HeaderCell>小计</Table.HeaderCell>
                                <Table.HeaderCell>操作</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                            
                        <Table.Body>
                            {rows}
                        </Table.Body>
                    </Table>
                   
            </div>
        )
    }
}
