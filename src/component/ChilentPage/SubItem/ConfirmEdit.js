import React,{Component} from "react"
import { Icon, Label, Table,Button, Step, ButtonGroup,Input, Dropdown, SegmentGroup, Modal, Form } from 'semantic-ui-react'
import { MainContext} from '../ObjContext'
import Common from "../../../common/common"
import { setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
setDefaultLocale('zhCN');
// 店铺管理
export default class ConfirmEdit extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        var temparr = []
        context.items.forEach(element=>{
            if(element.ITEM_TYPE === 0) // 单品
            {
                temparr.push({
                    key:element.COM_TYPE_ID +  element.ITEM_ID.toString(),
                    text: element.COM_TYPE_ID +  element.ITEM_ID.toString() + '_' + element.ITEM_NAME,
                    value:element.COM_TYPE_ID +  element.ITEM_ID.toString()
                })
            }
       })
       var shoparr = []
        context.allshops.forEach(element=>{
            if(element.SHOP_NAME !== Common._loadStorage('shopname') && element.SHOP_TYPE !== 99) // 单品
            {
                var icon = ''
                if(element.SHOP_TYPE === 0){icon='suitcase'}
                else if(element.SHOP_TYPE === 1){icon='shipping'}
                else{icon='settings'}
                shoparr.push({
                    key:element.SHOP_ID ,
                    text:element.SHOP_NAME,
                    value:element.SHOP_ID,
                    icon:icon
                })
            }
       })

        this.state = {
            editstate:0,    // 0 普通；1：编辑，2添加
            items:[],
            baseitems:[],
            editobject:{},   //进行编辑的对象
            shopoption:shoparr,  // 仓库选择列表
            itemoption:temparr,  // 商品选择列表
            showset:false,  // 是否显示入库数量
            inwhorder:{},   // 入库操作的订单信息
            inwhnumber:0,   // 本次入库数量
            timeinterval:setInterval(()=>{
                if(this.state.editstate === 0){
                    this.getItems(context)
                }
            }, 10000)
        }
        this.getItems(context) // 获得编辑列表

        


        // this.setState({
        //     itemoption:temparr,
        //     shopoption:shoparr
        // })
    }
    getItems(context)
    {
        var arrayObj = []

        Common.sendMessage(Common.baseUrl + "/confirm/get"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                // 读取确认信息列表
                
                e.data.forEach(element => {
                    var fromshopnameindex = context.allshops.findIndex(elm=>{return elm.SHOP_ID === element.FROM_SHOP_ID})
                    var fromshopname = '管理员'
                    if(fromshopnameindex >=0){
                        fromshopname = context.allshops[fromshopnameindex].SHOP_NAME
                    }
                    var inshopnameindex = context.allshops.findIndex(elm=>{return elm.SHOP_ID === element.TO_SHOP_ID})
                    var inshopname = '未知'
                    if(inshopnameindex >=0){
                        inshopname = context.allshops[inshopnameindex].SHOP_NAME
                    }
                    var itemnameindex = context.items.findIndex(elm=>{return elm.ITEM_ID === element.ITEM_ID && elm.COM_TYPE_ID === element.COM_TYPE_ID})
                    var itemname = '未知'
                    if(inshopnameindex >=0){
                        itemname = context.items[itemnameindex].ITEM_NAME
                    }
                    arrayObj.push({...element, key:element.ORDER_ID, FROM_SHOP_NAME: fromshopname, TO_SHOP_NAME: inshopname, ITEM_NAME:itemname})
                });

                this.setState({
                    editstate:0,
                    editobject:[],
                    baseitems:arrayObj,
                    showset:false
                })
            },null,
            this.context)
    }
    componentWillUnmount(){
        // 卸载
        clearInterval(this.state.timeinterval)
    }
    static getDerivedStateFromProps(nexProps, prevState){
        var items = []
        console.log(' ConfirmEdit getDerivedStateFromProps')
        prevState.baseitems.forEach(
            (element)=>{

                if(prevState.editstate === 1 
                    && prevState.editobject.ORDER_ID === element.ORDER_ID){
                    items.push({...element, DISP_FLG: 1})
                }
                else if(prevState.editstate === 2
                    && prevState.editobject.ORDER_ID === element.ORDER_ID){
                    items.push({...element, DISP_FLG: 2})
                }
                else{
                    items.push({...element, DISP_FLG: 0})
                }
            }
        )
        
        return {
            items : items,
        }
      } 
    shouldComponentUpdate(nexProps, prevState)    {
        return true;
    }
    static propTypes = {
    }
    // 是否显示全部
    onShowChange(){
        this.setState(
        {
            showall: !this.state.showall 
        })
    }

    getDelFlg(item){
        if (item.DEL_FLG === 1)
            return (<Label ribbon><Icon name='delete' /> </Label>)
    }
    getAddFlg(item){
        if (item.DISP_FLG === 2)
            return (<Label color='red' ribbon><Icon name='add circle' /> </Label>)
    }

   
    // 取消编辑操作的商品
    onCancelClick(e, id, tid){
        // 添加状态下，取消操作，删除最后一个商品
        var {baseitems} = this.state
        if(this.state.editstate === 2){
            baseitems.pop()
        }
        this.setState({
            editstate:0,
            editobject:[],
            baseitems:baseitems
        })
    }
    // 添加一个新的商品
    onAddNewClick(e, id, tid){
        // 取得
        // 修改基础列表，结尾追加一条
        var {baseitems} = this.state
        var addobj = {
            key:999999,
            ORDER_ID : '999999999',
            CONFIRM_TYPE : this.context.shoptype === 99 ? 0 : 1, // 管理员只能添加采购订单，其他则只能添加转库订单 
            FROM_SHOP_ID : -1, // 订单店铺ID
            TO_SHOP_ID : -1,    // 订单店铺ID
            ORDER_TIME : new Date(), // 订单时间
            OPE_FLG : 0,
            ORDER_STATE : 0, // 订单状态 "0：编辑；1：采购中；2：如果进行中（部分入库）；3：完全入库，4：强制结束（没有完全入库的订单被强制终结。）"
            ITEM_ID : -1, // 商品ID
            COM_TYPE_ID : '',    // 商品分类
            ITEM_NUMBER : 1,      // 订单商品数量
            ALREADY_IN_NUMBER : 0    //  已经入库数量
        }
        baseitems.push(addobj)

        this.setState({
            editstate:2,    // 添加新商品
            editobject:addobj,
        })
    }
    // 编辑选中的商品
    onEditClick(item){
        // 发送恢复删除请求
        const {baseitems} = this.state
        var index = baseitems.findIndex((element)=>{return element.ORDER_ID===item.ORDER_ID})
        var editobject = {}
        editobject = {...baseitems[index]}
        this.setState({
            editstate:1, // 编辑状态
            editobject:editobject   
        })
    }
    onSubmitEditClick(item, ope=1){
        // 编辑下面的提交按钮
        // 如果是套餐，则，子清单不能为空。
        const {setMainContext} = this.context

        if(item.ITEM_ID === -1){
            setMainContext({
                errorMessage:'必须选择一个商品'
            })
            return
        }
        if(item.TO_SHOP_ID === -1){
            setMainContext({
                errorMessage:'必须选择入库目的地（仓库或者店铺）'
            })
            return
        }
        var suburl = ''
        if(ope===1) // 编辑
        {
            suburl = '/modify'
        }
        else{
            suburl = '/add'
        }
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/confirm" + suburl
        , "POST"
        , null
        , {
            'ORDER_ID' : item.ORDER_ID,
            'TO_SHOP_ID': item.TO_SHOP_ID,// # 
            'ITEM_ID': item.ITEM_ID,// 
            'COM_TYPE_ID':item.COM_TYPE_ID,// 
            'ITEM_NUMBER': item.ITEM_NUMBER
            }
        , null
        , (e)=>{
            // 更新数据
            this.getItems(this.context)
        },(e)=>{
            const {setMainContext} = this.context
            setMainContext({
                errorMessage: e
            })
            
        },
        this.context)
    }
    onBackClick(item){
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/confirm/modifystate"
        , "POST"
        , null
        , {
            'ORDER_ID' : item.ORDER_ID,
            'ORDER_STATE' : 0
            }
        , null
        , (e)=>{
            // 更新数据
            this.getItems(this.context)
        },(e)=>{
            const {setMainContext} = this.context
            setMainContext({
                errorMessage: e
            })
            // 更新数据
            this.getItems(this.context)
        },
        this.context)
    }
    onNextClick(item){
         // 提交编辑
         Common.sendMessage(Common.baseUrl + "/confirm/modifystate"
         , "POST"
         , null
         , {
             'ORDER_ID' : item.ORDER_ID,
             'ORDER_STATE' : 1
             }
         , null
         , (e)=>{
             // 更新数据
             this.getItems(this.context)
         },(e)=>{
             const {setMainContext} = this.context
             setMainContext({
                 errorMessage: e
             })
         },
         this.context)
    }
    // 删除选中的商品
    onDelClick(item){
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/confirm/del"
        , "POST"
        , null
        , {
            'ORDER_ID' : item.ORDER_ID
            }
        , null
        , (e)=>{
            // 更新数据
            this.getItems(this.context)
        },(e)=>{
            const {setMainContext} = this.context
            setMainContext({
                errorMessage: e
            })
            // 更新数据
            this.getItems(this.context)
        },
        this.context)
    }
    onFinishClick(item){
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/confirm/modifystate"
        , "POST"
        , null
        , {
            'ORDER_ID' : item.ORDER_ID,
            'ORDER_STATE' : 4
            }
        , null
        , (e)=>{
            // 更新数据
            this.getItems(this.context)
        },(e)=>{
            const {setMainContext} = this.context
            setMainContext({
                errorMessage: e
            })
            // 更新数据
            this.getItems(this.context)
        },
        this.context)
    }
    onInwhClick(item){
        this.setState({
            inwhorder:item,
            showset:true,
            inwhnumber:item.ITEM_NUMBER-item.ALREADY_IN_NUMBER
        })
    }
    getButtonGroup(item){
        if (item.DISP_FLG === 0){
            if(this.state.editstate === 0 ){
                if(item.IS_FAQI){    // 发起人
                    if(item.ORDER_STATE === 0) // 编辑状态，只有自己可以看到，此时可以编辑数量以及下一步操作，删除。编辑只能编辑商品，数量，目标店铺，三个信息
                    {
                        return (
                            <ButtonGroup>
                                <Button onClick={(e)=>this.onEditClick(item)} >编辑</Button>    
                                <Button primary onClick={(e)=>this.onNextClick(item)} >下一步</Button>
                                <Button onClick={(e)=>this.onDelClick(item)}>删除</Button>
                            </ButtonGroup>
                        )
                    }
                    else if(item.ORDER_STATE === 1) // 已经提交，对方可以看到了
                    {
                        return (
                            <ButtonGroup>
                                <Button primary onClick={(e)=>this.onBackClick(item)} >回退</Button>
                                <Button onClick={(e)=>this.onDelClick(item)}>删除</Button>
                            </ButtonGroup>
                        )
                    }
                    else if(item.ORDER_STATE === 2) // 部分商品已经入库
                    {
                        return (
                            <ButtonGroup>
                                <Button onClick={(e)=>this.onFinishClick(item)}>强制结束</Button>
                            </ButtonGroup>
                        )
                    }
                }
                else{    // 入库操作者
                    if(item.ORDER_STATE === 1 || item.ORDER_STATE === 2) // 已经提交，对方可以看到了
                    {
                        return (
                            <ButtonGroup>
                                <Button primary onClick={(e)=>this.onInwhClick(item)} >入库</Button>
                            </ButtonGroup>
                        )
                    }
                }
            }
        }
        else if (item.DISP_FLG === 1){  // 编辑
            return (
                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 1)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.ORDER_ID)}>取消</Button>
                </ButtonGroup>
            )
        }
        else if (item.DISP_FLG === 2){  // 添加
            return (
                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 2)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.SHOP_ID)}>放弃</Button>
                </ButtonGroup>
            )
        }
    }
    getShopType(item){
        var index = this.state.shoptype.findIndex(e=>e.value === item.SHOP_TYPE)
        if(index >=0 ){
            return  this.state.shoptype[index].text
        } 
        return ''
    }
    getJobName(item){
        var index = this.state.jobs.findIndex(e=>e.value === item.EMP_JOB_ID)
        if(index >=0 ){
            return  this.state.jobs[index].text
        } 
        return ''
    }
    onNumberSave(item){
        // 进行入库操作
        const {setMainContext} = this.context
        if(this.state.inwhnumber > item.ITEM_NUMBER-item.ALREADY_IN_NUMBER) {
            // 数量不正确
            setMainContext({
                errorMessage:'数量不正确，入库的数量不能大于：' + (item.ITEM_NUMBER-item.ALREADY_IN_NUMBER).toString()
            })
            return
        }
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/confirm/in"
        , "POST"
        , null
        , {
            'ORDER_ID' : item.ORDER_ID,
            'ITEM_NUMBER' : this.state.inwhnumber
            }
        , null
        , (e)=>{
            // 更新数据
            this.getItems(this.context)
        },(e)=>{
            const {setMainContext} = this.context
            setMainContext({
                errorMessage: e
            })
            // 更新数据
            this.getItems(this.context)
        },
        this.context)

    }
    onINWHNumber(e, f, item){
        var value = f.value
        const reg = /^\d*?$/;		// 以数字1开头，任意数字结尾，且中间出现零个或多个数字
        var number = 0
        if ((reg.test(value) && value.length < 6) || value === '') {
          if(value===''){
            number = 1
          }
          else{
            number = parseInt(value)
          }
        }
        if(number > item.ITEM_NUMBER - item.ALREADY_IN_NUMBER){
            // 数量大于最大可能入库数量
            number = item.ITEM_NUMBER - item.ALREADY_IN_NUMBER
        }
        if(number === 0){
            number = 1
        }
        this.setState({
            inwhnumber:number
        })
    }
    // 编辑项目
    onEditItem(item, value){
            const reg = /^\d*?$/;		// 以数字1开头，任意数字结尾，且中间出现零个或多个数字
            if ((reg.test(value) && value.length < 6) || value === '') {
              if(value===''){
                    item.ITEM_NUMBER=1
                    this.setState({
                        editobject:item
                    })
              }
              else{
                item.ITEM_NUMBER= parseInt(value)
                this.setState({
                    editobject:item
                })
              }
            }
    }

    // 目标店铺选择变更
    shopSelectChange(e,f){
        // 取得
        // 修改基础列表，结尾追加一条
        var {editobject} = this.state
        editobject.TO_SHOP_ID = f.value
        editobject.TO_SHOP_NAME = f.text
        this.setState({
            editobject:editobject,
        })
    }
    // 商品选择变更
    itemSelectChange(e,f){
        // 取得
        // 修改基础列表，结尾追加一条
        var {editobject} = this.state

        var index = this.context.items.findIndex(element=>{ return (element.COM_TYPE_ID + element.ITEM_ID.toString()) === f.value})
        if(index>=0){
            editobject.ITEM_ID = this.context.items[index].ITEM_ID
            editobject.COM_TYPE_ID = this.context.items[index].COM_TYPE_ID
            editobject.ITEM_NAME = this.context.items[index].ITEM_NAME
            this.setState({
                editobject:editobject,
            })
        }
    }

    getOrderState(element){
       
            return (
                <Step.Group>
                <Step
                active={element.ORDER_STATE === 0}
                icon='truck'
                onClick={this.handleClick}
                title='商品'
                description= {element.ITEM_NAME}
                />
                <Step
                active={element.ORDER_STATE === 1}
                icon='credit card'
                onClick={this.handleClick}
                title='等待'
                description={element.CONFIRM_TYPE === 0?'采购中':'从【' + element.FROM_SHOP_NAME + '】'}
                />
                <Step
                active={element.ORDER_STATE === 2}
                icon='credit card'
                onClick={this.handleClick}
                title='入库'    // 根据状态判断
                description={'【'+ element.TO_SHOP_NAME +'】'+ element.ALREADY_IN_NUMBER.toString() + '/' + element.ITEM_NUMBER.toString()}
                ></Step>
                <Step
                active={element.ORDER_STATE === 3 || element.ORDER_STATE === 4}
                icon='credit card'
                onClick={this.handleClick}
                title='完成'
                description={element.CONFIRM_TYPE === 0?'采购完成':'转库完成'}
                />
            </Step.Group>
            )
      
        
 
    }
    addNormolRow(element){
        return (
            <Table.Row key={element.ORDER_ID}>
                            <Table.Cell collapsing>{element.ORDER_ID}</Table.Cell>
                            <Table.Cell collapsing>{element.ORDER_TIME}</Table.Cell>
                            <Table.Cell collapsing>{this.getOrderState(element)}</Table.Cell>
                            <Table.Cell collapsing>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    addEditRow(element){
        element = {...element, DISP_FLG:1} // 补充一个编辑标记
        return (
            <Table.Row key={element.ORDER_ID}>
                <Table.Cell  colSpan='3'>
                    <SegmentGroup>
                        <Label>将商品【</Label>
                        <Dropdown color='blue' placeholder='选择一个商品'  search selection value={element.COM_TYPE_ID + element.ITEM_ID.toString()} options={this.state.itemoption} onChange={(e, f)=>this.itemSelectChange(e, f)}/>
                        <Label>】</Label>
                        <Input label='数量' value={element.ITEM_NUMBER}  onChange={(e, f)=>this.onEditItem(element, f.value)} />
                        <Label>从</Label>
                        {element.CONFIRM_TYPE === 0 ? ( <Label color='blue'>采购</Label> ):( <Label color='blue'>{Common._loadStorage('shopname')}</Label> ) }
                        <Label>转移到【</Label>
                        <Dropdown placeholder='选择一个仓库' value={element.TO_SHOP_ID} selection options={this.state.shopoption} onChange={(e, f)=>this.shopSelectChange(e, f)}/>
                        <Label>】</Label>
                    </SegmentGroup>
                </Table.Cell>
                <Table.Cell>
                    {this.getButtonGroup(element)}
                </Table.Cell>
            </Table.Row>
        )
    }
    
    addAddRow(element){
        element = {...element, DISP_FLG:2} // 补充一个添加标记
        return (
            <Table.Row key={element.ORDER_ID}>
                <Table.Cell  colSpan='3'>
                <SegmentGroup>
                    <Label>将商品【</Label>
                    <Dropdown color='blue' placeholder='选择一个商品'  search selection value={element.COM_TYPE_ID + element.ITEM_ID.toString()} options={this.state.itemoption} onChange={(e, f)=>this.itemSelectChange(e, f)}/>
                    <Label>】</Label>
                    <Input label='数量' value={element.ITEM_NUMBER}  onChange={(e, f)=>this.onEditItem(element, f.value)} />
                    <Label>从</Label>
                    {element.CONFIRM_TYPE === 0 ? ( <Label color='blue'>采购</Label> ):( <Label color='blue'>{Common._loadStorage('shopname')}</Label> ) }
                    <Label>转移到【</Label>
                    <Dropdown placeholder='选择一个仓库' value={element.TO_SHOP_ID}  selection options={this.state.shopoption} onChange={(e, f)=>this.shopSelectChange(e, f)}/>
                    <Label>】</Label>
                </SegmentGroup>
                </Table.Cell>
                <Table.Cell>
                    {this.getButtonGroup(element)}
                </Table.Cell>
            </Table.Row>
            
        )
    }
    onRefClick(){
        this.getItems(this.context)
    }
    render(){
        var rows = [];
        if ( this.state.items.length > 0 ) {
            this.state.items.forEach(element=>{
                if(this.state.editstate === 0){ // 普通模式
                    rows.push(this.addNormolRow(element))
                }
                if(this.state.editstate === 1){ // 编辑模式
                    if(element.ORDER_ID === this.state.editobject.ORDER_ID){
                        rows.push(this.addEditRow(this.state.editobject))
                    }
                    else{
                        rows.push(this.addNormolRow(element))
                    }
                }
                if(this.state.editstate === 2){ // 编辑模式
                    if(element.ORDER_ID === this.state.editobject.ORDER_ID){
                        rows.push(this.addAddRow(this.state.editobject))
                    }
                    else{
                        rows.push(this.addNormolRow(element))
                    }
                }
            }
            )
        }
        if(this.state.editstate === 0){
        // 添加空行
            rows.push(<Table.Row key={'new'}>
                            <Table.Cell colSpan='3'></Table.Cell>
                            <Table.Cell>
                                <Button onClick={()=>this.onAddNewClick()}>添加</Button>
                            </Table.Cell>
                        </Table.Row>)
        }
        return(
            
            <div style={{ minHeight:800}}> 
           
                <Table celled selectable style={{minHeight:'100%', height:'100%'}}>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell >订单ID</Table.HeaderCell>
                        <Table.HeaderCell >创建时间</Table.HeaderCell>
                        <Table.HeaderCell >订单状态</Table.HeaderCell>
                        <Table.HeaderCell ><Button icon onClick={()=>{this.onRefClick()}}> <Icon  name='refresh'></Icon>操作</Button> </Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
                <Modal open={this.state.showset}>   
                        <Modal.Header>请输入本次{this.state.inwhorder.CONFIRM_TYPE === 0?'【采购】':'【转库】'}订单【{this.state.inwhorder.ORDER_ID}】的实际入库数量
                            <ButtonGroup style={{position:'absolute',right:60}}>
                            <Button  onClick={()=>this.onNumberSave(this.state.inwhorder)} primary >
                                 保存
                            </Button>
                            <Button.Or />
                            <Button onClick={()=>this.setState({showset:false})} >
                                取消
                            </Button>
                            </ButtonGroup>
                        </Modal.Header>
                        <Modal.Content>
                        <Form>
                            <Form.Field>
                            <label>商品名称：</label>
                            <label size={'big'}>{this.state.inwhorder.ITEM_NAME}</label>
                            </Form.Field>
                            <Form.Field>
                            <label>来源：</label>
                            <label size={'big'}>{this.state.inwhorder.FROM_SHOP_NAME}</label>
                            </Form.Field>
                            <Form.Field>
                            <label>本次入库数量：</label>
                            <Input placeholder='商品数量' disabled={this.state.inwhorder.CONFIRM_TYPE === 0?false:true} value={this.state.inwhnumber} onChange={(e, f)=>this.onINWHNumber(e, f, this.state.inwhorder)} />
                            </Form.Field>                           
                        </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            
                        </Modal.Actions>
                    </Modal>
            </div>
        )
    }
}

