import React,{Component} from "react"
import {MainContext} from "../ObjContext"
import { Icon, Label, Menu, Select, Table,Button, Dropdown , Input, Visibility} from 'semantic-ui-react'
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
        var index = sp.findIndex(e=>e.key === this.props.itemkey)
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
        itemkey:PropTypes.string,
        ITEMS:PropTypes.array,
        opetype:PropTypes.number
    }
    static defaultProps={
        ITEMS:[],
        opetype:0
    }
    handleInput(e){
        console.log(e.target.value)
    }

    static contextType = MainContext;

    numberChange = (e,f) => {
        
        var { value } = f;
        const reg = /^\d*?$/;		// 以数字1开头，任意数字结尾，且中间出现零个或多个数字
        if ((reg.test(value) && value.length < 4) || value === '') {
          value = parseInt(value)
          const {shoppingItems} = this.context;
          var index = shoppingItems.findIndex(e=>e.key === this.props.itemkey)
          if(value===''){
            shoppingItems[index].ITEM_NUMBER = 1
          }
          else{
            if(this.props.opetype === 9)    // 会员提货
            {
                
                var oldindex = this.props.ITEMS.findIndex(element=>{return element.ITEM_ID === shoppingItems[index].ITEM_ID &&  element.COM_TYPE_ID === shoppingItems[index].COM_TYPE_ID })
                if(oldindex >=0 && this.props.ITEMS[oldindex].ITEM_NUMBER - value >= 0){
                    shoppingItems[index].ITEM_NUMBER = value
                }
            }
            else{
                shoppingItems[index].ITEM_NUMBER = parseInt(value)
            }
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

        if(this.props.opetype === 9)    // 会员提货
        {
            var oldindex = this.props.ITEMS.findIndex(element=>{return element.ITEM_ID === shoppingItems[index].ITEM_ID &&  element.COM_TYPE_ID === shoppingItems[index].COM_TYPE_ID })
            if(oldindex >=0 && this.props.ITEMS[oldindex].ITEM_NUMBER - shoppingItems[index].ITEM_NUMBER > 0){
                if(shoppingItems[index].ITEM_NUMBER < 999){
                    shoppingItems[index].ITEM_NUMBER++;
                    shoppingItems[index].PRICE_SUBTOTAL = shoppingItems[index].PRICE_ARR[shoppingItems[index].PRICE_SELECT] * shoppingItems[index].ITEM_NUMBER
                    setMainContext({
                        shoppingItems:shoppingItems
                    })
                }
            }
        }
        else
        {
            if(shoppingItems[index].ITEM_NUMBER < 999){
                shoppingItems[index].ITEM_NUMBER++;
                shoppingItems[index].PRICE_SUBTOTAL = shoppingItems[index].PRICE_ARR[shoppingItems[index].PRICE_SELECT] * shoppingItems[index].ITEM_NUMBER
                setMainContext({
                    shoppingItems:shoppingItems
                })
            }
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
        var priceIndex = shoppingItems[index].PRICE_ARR.findIndex(e=>e.toLocaleString('zh') === value)
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
        
        // onChange={(e, f)=>{this.setState({selectShop:this.state.shopList.find(element=>element.value === f.value)})}}value
        return (
            <Input type='text' placeholder='P' action>
                    <Select onChange={(e,f)=>{this.priceSelect(e,f)}} style={{width:"50px" }} compact options={priceTypes} 
                    value={priceTypes[shoppingItems[index].PRICE_SELECT].value.toLocaleString('zh')} />
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
    componentWillUnmount(){
        console.log(this.context)
        const {setMainContext} = this.context;
        setMainContext({
            shoppingItems : []
        })
    }
    shouldComponentUpdate(nexProps, prevState)    {
      return true
    }
    
    static propTypes = {
        opetype:PropTypes.number,
        ordertype:PropTypes.number
    }
    static defaultProps ={
        ordertype:-1
    }
    static contextType = MainContext;
    sumTotelPrice

    onShopChange(shopid){
        // 请求商品数据
        const {setMainContext} = this.context;
        //shopItems:[], // 仓库商品信息
        //selectedShopid:0 // 当前选择
        // f.value
        // 请求登录检查，如果失败了，则跳转到login画面
        Common.sendMessage(Common.baseUrl + "/cangku/getishoptems"
        , "POST"
        , null
        , {shopid:shopid}
        , null
        , (e)=>{
        if(e.error_code === 0){
            const {cangkuInfo} = this.context
            
            cangkuInfo.shopItems = e.data

            setMainContext({
                cangkuInfo:cangkuInfo
            })
        }
        else{
            this.props.history.push("/login")
        }
        // 跳转到主画面
        }
        ,(e)=>{
            console.log("login 报错了")
        },
        this.context)
    }

    jiezhangClick(){
         // 检查数据，如果订单为空，则不允许提交
        var {shoppingItems} = this.context;
        const {setMainContext} = this.context;
        const {cangkuInfo} = this.context;

        if(shoppingItems.length > 0){    
            if(this.props.opetype === 3 || this.props.opetype === 4 || this.props.opetype === 5 || this.props.opetype === 6){
                // 判断仓库是否选择了
                if(cangkuInfo.selectedShopid === -1){
                    // 显示消息
                    setMainContext({errorMessage:"需要选择一个仓库！"})
                    return
                }
                if(this.props.opetype === 4 && cangkuInfo.selectedShopid2 === -1){
                    // 显示消息
                    setMainContext({errorMessage:"需要选择一个目标仓库！"})
                    return
                }
            }
            
            var {confirmInfo} = this.context;
            
            confirmInfo.open=true
            if(this.props.opetype === 0){
                confirmInfo.content = '点击确定后，提交销售订单！'
            } else if(this.props.opetype === 1){
                confirmInfo.content = '退货处理，确定后提交！'
            }
            else if(this.props.opetype === 2){
                confirmInfo.content = '你确定要销毁这些商品吗？'
            }
            else if(this.props.opetype === 3){
                if(this.props.ordertype === 0){// 入库
                    confirmInfo.content = '确定要入库吗？'
                }
                else if(this.props.ordertype === 1){
                    confirmInfo.content = '确定要出库吗？'
                }
            }
            else if(this.props.opetype === 4){
                confirmInfo.content = '确定要移库吗？'
            }
            else if(this.props.opetype === 5){
                if(this.props.ordertype === 0){// 入库
                    confirmInfo.content = '确定要存货吗？'
                }
                else if(this.props.ordertype === 1){
                    confirmInfo.content = '确定要取货吗？'
                }
            }
            else if(this.props.opetype === 6){
                confirmInfo.content = '点击确定后，进货物品会自动进入仓库？'
            }
            else if(this.props.opetype === 7){
                confirmInfo.content = '确定要修改该套装吗？'
            }
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

            confirmInfo.onConfirm = ()=>{
                console.log('confirmInfo.onConfirm')
                confirmInfo.open = false
                setMainContext({
                    confirmInfo:confirmInfo
                })
                var sendobj = {
                    ordertype:this.props.ordertype,
                    orderinfo:this.OrderInfo,
                    opetype:this.props.opetype,
                    shopidto:cangkuInfo.selectedShopid2,
                    shopidfrom:cangkuInfo.selectedShopid
                 }
                 console.log('sendobj')
                 console.log(sendobj)
                // 在这里提交数据
                Common.sendMessage(Common.baseUrl + "/xiaoshou/orderdisp",
                 'POST', 
                 null, 
                 sendobj, 
                 null, 
                (e, con)=>{
                    // 成功  
                    const {setMainContext} = con;
                    setMainContext({shoppingItems:[]})
                    // 如果是仓库操作，则需要刷一下当前选中的仓库
                    if(this.props.opetype === 3 || this.props.opetype === 4){
                        this.onShopChange(cangkuInfo.selectedShopid)
                    }
                }
                ,(e)=>{
                    console.log("login 报错了")
                    setMainContext({errorMessage:e})
                }, 
                this.context)
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
        else{
            setMainContext({errorMessage:"没有选择任何商品，无法提交！"})
        }
    }

    getDanJia(){
        if (this.props.opetype!==2 && this.props.opetype!==3  && this.props.opetype!==4  && this.props.opetype!== 7  && this.props.opetype!== 8 && this.props.opetype!== 9){
            return <Table.HeaderCell>单价</Table.HeaderCell>
        }
    }
    getXiaoJi(){
        if (this.props.opetype!==2 && this.props.opetype!==3  && this.props.opetype!==4  && this.props.opetype!== 7 && this.props.opetype!== 8 && this.props.opetype!== 9){
            return <Table.HeaderCell>小计</Table.HeaderCell>
        }
    }
    getDanJiaRow(element){
        if (this.props.opetype!==2 && this.props.opetype!==3  && this.props.opetype!==4  && this.props.opetype!== 7 && this.props.opetype!== 8 && this.props.opetype!== 9){
            return <Table.Cell collapsing >
                    <SelectPrice itemkey={element.key}></SelectPrice>
                    </Table.Cell>
        }
    }
    getXiaoJiRow(element){
        if (this.props.opetype!==2 && this.props.opetype!==3  && this.props.opetype!==4  && this.props.opetype!== 7 && this.props.opetype!== 8 && this.props.opetype!== 9){
            return <Table.Cell collapsing >
                <LablePriceSubTotal itemkey={element.key}></LablePriceSubTotal>
                </Table.Cell>
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
                    <Table.Row key={element.key} itemkey={element.key}>
                                <Table.Cell collapsing >{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                                <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                                {this.getDanJiaRow(element)}
                                <Table.Cell collapsing >
                                    <NumberButton ITEMS={this.props.ITEMS} opetype={this.props.opetype} itemkey={element.key} itemvalue={element.ITEM_NUMBER}></NumberButton>
                                </Table.Cell>
                                {this.getXiaoJiRow(element)}
                                <Table.Cell><DelButton itemkey={element.key} iconN={'trash alternate outline'}></DelButton></Table.Cell>
                            </Table.Row>
                )
                }
            )
            youhui = yuanjia-shoujia
        }
        var buttonTitle = '销售'
        var jiesuancolor = "red"    // 结算按钮颜色
        var jiesuanicon = 'cart'
        if(this.props.opetype === 0){
            jiesuancolor = "red" 
            jiesuanicon = 'cart'
            buttonTitle = '合计【' + shoujia.toLocaleString('zh') + '】元'
        } else if(this.props.opetype === 1){
            jiesuancolor = "blue" 
            jiesuanicon = 'undo'
            buttonTitle = '退还【' + shoujia.toLocaleString('zh') + '】元'
        }
        else if(this.props.opetype === 2){
            jiesuancolor = "orange" 
            jiesuanicon = 'delete'
            buttonTitle = '销毁'
        }
        else if(this.props.opetype === 3){  // 直接仓库操作
            if(this.props.ordertype === 0) // 入库
            {
                jiesuancolor = "yellow" 
                jiesuanicon = 'dolly flatbed'
                buttonTitle = '直接入库'
            }
            else if(this.props.ordertype === 1){   // 出库
                jiesuancolor = "olive" 
                jiesuanicon = 'dolly'
                buttonTitle = '直接出库'
            }   
        }
        else if(this.props.opetype === 4){  // 流转
            jiesuancolor = "green" 
            jiesuanicon = 'boxes'
            buttonTitle = '移库'
        }
        else if(this.props.opetype === 5){  // 会员存取
            if(this.props.ordertype === 0) // 入库
            {
                jiesuancolor = "teal" 
                jiesuanicon = 'cart arrow down'
                buttonTitle = '存货'
            }
            else if(this.props.ordertype === 1){   // 出库
                jiesuancolor = "violet" 
                jiesuanicon = 'shopping basket'
                buttonTitle = '提货'
            }   
        }
        else if(this.props.opetype === 6){  // 采购到货
            jiesuancolor = "brown" 
            jiesuanicon = 'shipping fast'
            buttonTitle = '到货'
        }
        else if(this.props.opetype === 7){  // 套装编辑
            jiesuancolor = "grey" 
            jiesuanicon = 'settings'
            buttonTitle = '设定套装'
        }
        console.log("jianshu" + jianshu)
        
        return(
            
            <div>
                    <Table celled selectable >
                        
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>编号</Table.HeaderCell>
                                <Table.HeaderCell>名称</Table.HeaderCell>
                                {this.getDanJia()}
                                <Table.HeaderCell>数量</Table.HeaderCell>
                                {this.getXiaoJi()}
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
                                    style={{display:this.props.opetype===7  || this.props.opetype=== 8 || this.props.opetype=== 9?'none':''}}
                                    size='massive'
                                    color={jiesuancolor}
                                >
                                    <Icon name={jiesuanicon} />
                                    {buttonTitle}
                                </Button>
                                <Label.Group tag size='large'>
                                {this.props.opetype!==2  && this.props.opetype!==3  && this.props.opetype!==4 && this.props.opetype!==7  && this.props.opetype!== 8 && this.props.opetype!== 9? <Label as='a'>原价:￥{yuanjia.toLocaleString('zh')}</Label>:<div></div>}
                                {this.props.opetype!==2  && this.props.opetype!==3  && this.props.opetype!==4 && this.props.opetype!==7  && this.props.opetype!== 8 && this.props.opetype!== 9? <Label as='a' color='red'>优惠:￥{youhui.toLocaleString('zh')}</Label>:<div></div>}
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
