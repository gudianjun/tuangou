import React,{Component} from "react"
import {MainContext} from "../ObjContext"
import { Icon, Label, Menu, Select, Table,Button, Dropdown , Input} from 'semantic-ui-react'
import PropTypes, { element, array, checkPropTypes } from 'prop-types';
import Common from '../../../common/common'
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
        console.log('this.context.shoppingItems');
        console.log(this.context.shoppingItems);
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
                <Button  icon onClick={()=>this.minusClick()}><Icon name='minus' style={{width:"20px" }}/></Button>
                
                <Input value={this.props.itemvalue} onChange={(e,f)=>this.numberChange(e,f)}  as='a'  size="mini" basic="true" pointing='left' style={{width:"45px" }} inverted  placeholder="数量"/>
                
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
            text: "零",
            value: shoppingItems[index].PRICE_ARR[0].toLocaleString('zh')},
            {key: "1",
            text: "会",
            value: shoppingItems[index].PRICE_ARR[1].toLocaleString('zh')},
            {key: "2",
            text: "团",
            value: shoppingItems[index].PRICE_ARR[2].toLocaleString('zh')},
            {key: "3",
            text: "处",
            value: shoppingItems[index].PRICE_ARR[3].toLocaleString('zh')}
        ]
        
        // onChange={(e, f)=>{this.setState({selectShop:this.state.shopList.find(element=>element.value === f.value)})}}
        return (
            <Input type='text' placeholder='P' action>
                    <Select onChange={(e,f)=>{this.priceSelect(e,f)}} style={{width:"50px" }} compact options={priceTypes} defaultValue={priceTypes[shoppingItems[index].PRICE_SELECT].value} />
                        <Label as='a' style={{fontSize:"16px" }} >
                        {priceTypes[shoppingItems[index].PRICE_SELECT].value.toLocaleString('zh')}
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
                {shoppingItems[index].PRICE_SUBTOTAL.toLocaleString('zh')}
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
      return true
    }
    static propTypes = {
       
    }
    static contextType = MainContext;
    sumTotelPrice

    jiezhangClick(){
         // 检查数据，如果订单为空，则不允许提交
         var {shoppingItems} = this.context;
         if(shoppingItems!==null && shoppingItems !== undefined && shoppingItems.length > 0){        
            var {confirmInfo} = this.context;
            const {setMainContext} = this.context;
            confirmInfo.open=true
            confirmInfo.content = '点击【确定】后，提交订单！'

            this.OrderInfo=[];
            console.log('jiezhangClick')
            console.log(shoppingItems)
            shoppingItems.forEach(element=>{
                this.OrderInfo.push(
                    {
                        ITEM_ID:element.ITEM_ID,
                        COM_TYPE_ID:element.COM_TYPE_ID,
                        PRICE_SELECT:element.PRICE_SELECT,
                        ITEM_NUMBER:element.ITEM_NUMBER
                    }
                )
            })
            console.log('点击【确定】后，提交订单！')
            console.log(this.OrderInfo)

            // this.OrderInfo.push(
            //     {
            //         itemid:element.ITEM_ID,
            //         comtypeid:element.COM_TYPE_ID,
            //         priceselect:element.PRICE_SELECT,
            //         itemnumber:element.ITEM_NUMBER
            //     }
            // )
            confirmInfo.onConfirm = ()=>{
                console.log('confirmInfo.onConfirm')
                confirmInfo.open = false
                setMainContext({
                    confirmInfo:confirmInfo
                })
                var sendobj = {
                    ordertype:0,
                    orderinfo:this.OrderInfo
                 }
                 console.log('sendobj')
                 console.log(sendobj)
                // 在这里提交数据
                Common.sendMessage(Common.baseUrl + "/xiaoshou/orderdisp",
                 'POST', 
                 null, 
                 sendobj, 
                 null, 
                (e)=>{
                    // 成功    
                }
                ,(e)=>{
                    console.log("login 报错了")
                }, 
                 this.content)
            }
            confirmInfo.onCancel = ()=>{
                console.log('confirmInfo.onCancel')
                confirmInfo.open = false
                setMainContext({
                    confirmInfo:confirmInfo
                })
            }
            setMainContext({
                confirmInfo:confirmInfo
            })
        }
    }

    render(){
        var rows = [];
        var yuanjia = 0
        var shoujia = 0
        var jianshu = 0
        var youhui = yuanjia-shoujia
        
        if (this.context.shoppingItems !=null ) {
            this.context.shoppingItems.forEach(element=>{
                yuanjia += element.ITEM_NUMBER * element.PRICE_ARR[0]
                shoujia += element.ITEM_NUMBER * element.PRICE_ARR[element.PRICE_SELECT]
                jianshu += element.ITEM_NUMBER
                rows.push(
                    <Table.Row itemkey={element.key}>
                                <Table.Cell collapsing >{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                                <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                                <Table.Cell collapsing >
                                    <SelectPrice itemkey={element.key}></SelectPrice>
                                </Table.Cell>
                                <Table.Cell collapsing >
                                    <NumberButton itemkey={element.key} itemvalue={element.ITEM_NUMBER}></NumberButton>
                                </Table.Cell>
                                <Table.Cell collapsing >
                                    <LablePriceSubTotal itemkey={element.key}></LablePriceSubTotal>
                                    </Table.Cell>
                                <Table.Cell><DelButton itemkey={element.key} iconN={'trash alternate outline'}></DelButton></Table.Cell>
                            </Table.Row>
                )
                }
            )
            youhui = yuanjia-shoujia
            console.log('----------------youhui-------shoujia-------jianshu-------render')
        }
        
        
        return(
            
            <div>
                    <Table celled selectable>
                        
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>编号</Table.HeaderCell>
                                <Table.HeaderCell>名称</Table.HeaderCell>
                                <Table.HeaderCell>单价</Table.HeaderCell>
                                <Table.HeaderCell>数量</Table.HeaderCell>
                                <Table.HeaderCell>小计</Table.HeaderCell>
                                <Table.HeaderCell>操作</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                            
                        <Table.Body>
                            {rows}
                        </Table.Body>
                        <Table.Footer fullWidth>
                            <Table.Row>
                                <Table.HeaderCell />
                                <Table.HeaderCell colSpan='6'>
                                <Button onClick={this.jiezhangClick.bind(this)}
                                    floated='right'
                                    icon
                                    labelPosition='left'
                                    
                                    size='massive'
                                    color='red'
                                >
                                    <Icon name='yen sign' />合计【{shoujia.toLocaleString('zh')}】元
                                </Button>
                                <Label.Group tag size='large'>
                                    <Label as='a'>原价:￥{yuanjia.toLocaleString('zh')}</Label>
                                    <Label as='a' color='red'>优惠:￥{youhui.toLocaleString('zh')}</Label>
                                    <Label as='a'>件数:{jianshu}</Label>
                                </Label.Group>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                   
            </div>
        )
    }
}
