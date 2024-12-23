import React,{Component} from "react"
import { Icon, Label, Table,Button, Radio, ButtonGroup, Modal, Grid,Input, Dropdown, Form, Segment, ButtonOr } from 'semantic-ui-react'
import {MainContext} from '../ObjContext'
import Common from "../../../common/common"
import DatePicker, { setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemOrder from './ItemOrder'
import MemShopItemSel from './MemShopItemSel'
import PropTypes from "prop-types";
setDefaultLocale('zhCN');
// 会员编辑
export default class MemberEdit extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            editstate:0,    // 0 普通；1：编辑，2添加
            showall:false,
            items:[],
            baseitems:[],
            showset:false,   // 是否显示套装编辑画面
            showmem:false,  // 显示会员存取款履历
            showaddmoney:false,     // 显示添加moeny画面
            addmoneyobj:{}, // 添加钱对象
            moneyhistory:{},    // 会员的存取款履历
            addmoney:0,
            editobject:{},   //进行编辑的对象
            comtypes:[], // 商品类别列表
            whmeminfo:{},    // 会员仓储信息
            whordertype:0,   // 0:存货，1：提货
            whitems:[],  // 会员存储信息
            memmoenyitems:{},   // 会员存取款历史信息
            searchtext:'',
            Shops:context.shops,
            shoptype:context.shoptype,
            modelinfo:[],    // 选择用户的存取货履历
            showmemWH:false, // 显示用户存取货对话框
            memWHName:"",   // 会员名称
            orderSearchText:"", //　会员详细订单搜索文本
        }
        this.SHOP_ID = -1;
        this.getItems() // 获得编辑列表
    }
    // static getDerivedStateFromProps(nexProps, prevState){
        
    // } 

    getItems()
    {
        var arrayObj = []
        if(this.state.shoptype === 0) {

            Common.sendMessage(Common.baseUrl + "/member/getmembers"
                , "POST"
                , null
                , null
                , null
                , (e) => {
                    e.data.forEach(element => {
                        arrayObj.push({...element, key: element.MEM_ID})
                    });
                    // 写入缓存
                    this.setState({
                        editstate: 0,
                        editobject: [],
                        baseitems: arrayObj
                    })
                }, null,
                this.context)
        }
        else {
            if(this.SHOP_ID!==-1) {
                Common.sendMessage(Common.baseUrl + "/member/getmembers2"
                    , "POST"
                    , null
                    , {
                        'SHOP_ID': this.SHOP_ID
                    }
                    , null
                    , (e) => {
                        e.data.forEach(element => {
                            arrayObj.push({...element, key: element.MEM_ID})
                        });
                        // 写入缓存
                        this.setState({
                            editstate: 0,
                            editobject: [],
                            baseitems: arrayObj
                        })
                    }, null,
                    this.context)
            }
        }
    }
    static getDerivedStateFromProps(nexProps, prevState){
        var items = []
        prevState.baseitems.forEach(
            (element)=>{
                if(prevState.showall){
                    if(prevState.editstate === 1 
                        && prevState.editobject.MEM_ID === element.MEM_ID){
                        items.push({...element, DISP_FLG: 1})
                    }
                    else if(prevState.editstate === 2
                        && prevState.editobject.MEM_ID === element.MEM_ID){
                        items.push({...element, DISP_FLG: 2})
                    }
                    else{
                        items.push({...element, DISP_FLG: 0})
                    }
                }
                else{
                    if(element.DEL_FLG === 0){
                        // 0：普通，1：追加；2：编辑
                        if(prevState.editstate === 1 
                            && prevState.editobject.MEM_ID === element.MEM_ID){
                            items.push({...element, DISP_FLG: 2})
                        }
                        else if(prevState.editstate === 2
                            && prevState.editobject.MEM_ID === element.MEM_ID){
                            items.push({...element, DISP_FLG: 1})
                        }
                        else{
                            items.push({...element, DISP_FLG: 0})
                        }
                    }
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
        SHOP_ID:PropTypes.number
    }
    static defaultProps = {
        SHOP_ID:-1
    }
    // 是否显示全部
    onShowChange(){
        this.setState(
        {
            showall: !this.state.showall 
        })
    }
    sexoption = [
        {
            key:0,
            text:'女',
            value:0
        },
        {
            key:1,
            text:'男',
            value:1}
    ]
    getDelFlg(item){
        if (item.DEL_FLG === 1)
            return (<Label ribbon><Icon name='delete' /> </Label>)
    }
    getAddFlg(item){
        if (item.DISP_FLG === 2)
            return (<Label color='red' ribbon><Icon name='add circle' /> </Label>)
    }

    // 恢复选中的商品
    onHuiFuClick(e, id){
        console.log(e, id)
        // 发送恢复删除请求
        Common.sendMessage(Common.baseUrl + "/member/huifu"
            , "POST"
            , null
            , {MEM_ID:id}
            , null
            , (e)=>{
                // 更新状态,找到那个状态并且更新
                const {baseitems} = this.state
                var index = baseitems.findIndex((e)=>{return e.MEM_ID===id})
                baseitems[index].DEL_FLG = 0
                this.setState({
                    baseitems:baseitems
                })
            },null,
            this.context)
    }
    // 提货详细
    onTihuoXiangXi(e, id) {
        Common.sendMessage(Common.baseUrl + "/member/memhistory"
            , "POST"
            , null
            , {MEM_ID: id, SHOP_ID:this.SHOP_ID}
            , null
            , (e) => {
                let memindex = this.state.baseitems.findIndex(t=>t.MEM_ID === id)
                this.setState(
                    {
                        showmemWH:true,
                        memWHName:'('+this.state.baseitems[memindex].MEM_CODE+')' + this.state.baseitems[memindex].MEM_LASTNAME+ this.state.baseitems[memindex].MEM_FIRSTNAME ,
                        modelinfo: e.data
                    }
                )
                console.log(e)
            }, null,
            this.context)
    }
    // 删除选中的商品
    onDelClick(e, id){
        console.log(e, id)
        // 发送恢复删除请求
        Common.sendMessage(Common.baseUrl + "/member/delitem"
            , "POST"
            , null
            , {MEM_ID:id}
            , null
            , (e)=>{
                // 更新状态,找到那个状态并且更新
                const {baseitems} = this.state
                var index = baseitems.findIndex((e)=>{return e.MEM_ID===id})
                baseitems[index].DEL_FLG = 1
                this.setState({
                    baseitems:baseitems
                })
            },(e)=>{
                const {setMainContext} = this.context
                setMainContext({
                    errorMessage: e
                })
            },
            this.context)
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
            MEM_ID:999999,
            MEM_LASTNAME:'', 
            MEM_FIRSTNAME:'', 
            MEM_BIRTHDAY: new Date('2000-01-01'), 
            MEM_SEX:0, 
            MEM_CODE:'', 
            MEM_PHONE:'', 
            MEM_ZIP:'', 
            MEM_ADDRESS:'', 
            DEL_FLG:0
        }
        baseitems.push(addobj)

        this.setState({
            editstate:2,    // 添加新商品
            editobject:addobj,
        })
    }
    // 编辑选中的商品
    onEditClick(e, id){
        console.log(e, id)
        // 发送恢复删除请求
        // 存在添加行时，先删除
        
        const {baseitems} = this.state
        var indexAdd = baseitems.findIndex((element)=>{return element.key===999999})
        if(indexAdd>=0){
            baseitems.splice(indexAdd, 1);
        }

        var index = baseitems.findIndex((element)=>{return element.MEM_ID===id})
        var editobject = {}
        editobject = {...baseitems[index]}
        this.setState({
            editstate:1, // 编辑状态
            editobject:editobject   
        })
    }
    // 编辑会员的存取货品
    onWHClick(item, ordertype){
        // 获得会员仓库商品信息
        var arrayObj = []

        Common.sendMessage(Common.baseUrl + "/member/getmemwh"
            , "POST"
            , null
            , {MEM_ID:item.MEM_ID}
            , null
            , (e)=>{
                e.data.forEach(element => {
                    arrayObj.push({...element, key:element.COM_TYPE_ID + '_' +element.ITEM_ID.toString()})
                });
                // 写入缓存
                this.setState({
                    whitems:arrayObj,
                    showset:true,
                    whmeminfo:item,
                    whordertype:ordertype
                })
            },null,
            this.context)
        
    }
    onAddMoneyClick(item){
        this.setState({showaddmoney:true, addmoneyobj:item, addmoney:0})
    }
    // 编辑会员的存取货品
    onCunKuanClick(item){
        // 获得会员仓库商品信息
        var arrayObj = []

        Common.sendMessage(Common.baseUrl + "/member/getmemwh"
            , "POST"
            , null
            , {MEM_ID:item.MEM_ID}
            , null
            , (e)=>{
                e.data.forEach(element => {
                    arrayObj.push({...element, key:element.COM_TYPE_ID + '_' +element.ITEM_ID.toString()})
                });
                // 写入缓存
                this.setState({
                    whitems:arrayObj,
                    showset:true,
                    whmeminfo:item,
                })
            },null,
            this.context)
        
    }
    onSubmitEditClick(item, ope=1){
        // 编辑下面的提交按钮
        // 如果是套餐，则，子清单不能为空。
        const {setMainContext} = this.context

        if(item.MEM_CODE.length <= 0){
            setMainContext({
                errorMessage:'会员号必须填写'
            })
            return
        }
        
        if(item.MEM_FIRSTNAME.length <= 0 || item.MEM_LASTNAME.length <= 0){
            setMainContext({
                errorMessage:'会员姓名必须填写。'
            })
            return
        }
      
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/member/edititem"
        , "POST"
        , null
        , {
            'edittype':ope,
            'MEM_ID': item.MEM_ID,// # 员编号
            'MEM_LASTNAME': item.MEM_LASTNAME,//  # 姓
            'MEM_FIRSTNAME':item.MEM_FIRSTNAME,//  # 名
            'MEM_BIRTHDAY': item.MEM_BIRTHDAY,//  # 生日
            'MEM_SEX': parseInt(item.MEM_SEX),//  # 性别
            'MEM_CODE' : item.MEM_CODE,// # 身份证号码
            'MEM_PHONE' : item.MEM_PHONE,//  # 电话号码
            'MEM_ZIP' : item.MEM_ZIP,//  # 邮政编码
            'MEM_ADDRESS' : item.MEM_ADDRESS,// # 家庭住址
            'DEL_FLG' :0
            }
        , null
        , (e)=>{
            // 更新数据
            this.getItems()
            
        },(e)=>{
            const {setMainContext} = this.context
            setMainContext({
                errorMessage: e
            })
        },
        this.context)
    }
    getButtonGroup(item){
        if(this.state.shoptype === 0) {
            if (item.DISP_FLG === 0) { // 通常状态
                if (item.DEL_FLG === 0) {
                    return (
                        <ButtonGroup>
                            <Button primary onClick={(e) => this.onEditClick(e, item.MEM_ID)}>编辑</Button>
                            <Button secondary onClick={(e) => this.onWHClick(item, 0)}>存货</Button>
                            <Button.Or/>
                            <Button secondary onClick={(e) => this.onWHClick(item, 1)}>提货</Button>
                            {/*<Button.Or/>*/}
                            {/*<Button color='orange' onClick={(e) => this.onAddMoneyClick(item)}>存款</Button>*/}
                            <Button onClick={(e) => this.onDelClick(e, item.MEM_ID)}>删除</Button>
                        </ButtonGroup>
                    )
                } else {
                    return (
                        <ButtonGroup>
                            <Button onClick={(e) => this.onHuiFuClick(e, item.MEM_ID)}>恢复</Button>
                        </ButtonGroup>
                    )
                }
            } else if (item.DISP_FLG === 1) {  // 编辑
                return (
                    <ButtonGroup>
                        <Button primary onClick={(e) => this.onSubmitEditClick(item, 1)}>提交</Button>
                        <Button secondary onClick={(e) => this.onCancelClick(e, item.MEM_ID)}>取消</Button>
                    </ButtonGroup>
                )
            } else if (item.DISP_FLG === 2) {  // 添加
                return (
                    <ButtonGroup>
                        <Button primary onClick={(e) => this.onSubmitEditClick(item, 2)}>提交</Button>
                        <Button secondary onClick={(e) => this.onCancelClick(e, item.MEM_ID)}>放弃</Button>
                    </ButtonGroup>
                )
            }
        }
        else
        {
            return (
                <ButtonGroup>
                    <Button onClick={(e) => this.onTihuoXiangXi(e, item.MEM_ID)}>提货详细</Button>
                </ButtonGroup>
            )
        }
    }
    // 显示存取款履历
    showAddMoneyHistory(element){
        Common.sendMessage(Common.baseUrl + "/member/getmemitems"
            , "POST"
            , null
            , {
                MEM_ID:element.MEM_ID,
                SHOP_ID:this.SHOP_ID
            }
            , null
            , (e)=>{
                // 写入缓存
                this.setState({moneyhistory:e.data,showmem:true})
            },null,
            this.context)        
    }
    // 添加普通的行
    addNormolRow(element){
        return (
            <Table.Row key={element.MEM_ID}>
                            <Table.Cell collapsing>{element.MEM_CODE}</Table.Cell>
                            <Table.Cell collapsing textAlign='right'>
                            <Label as='a' onClick={()=>this.showAddMoneyHistory(element)}  
                            color={element.MEM_MONEY>0?'blue' :'green'}>
                                查看
                            </Label>
                                </Table.Cell>
                            <Table.Cell collapsing>{element.MEM_LASTNAME}</Table.Cell>
                            <Table.Cell collapsing>{element.MEM_FIRSTNAME}</Table.Cell>
                            <Table.Cell collapsing>{element.MEM_BIRTHDAY}</Table.Cell>
                            <Table.Cell collapsing>{element.MEM_SEX === 0 ? '女' : '男'}</Table.Cell>
                            
                            <Table.Cell collapsing>{element.MEM_PHONE}</Table.Cell>
                            <Table.Cell collapsing>{element.MEM_ZIP}</Table.Cell>
                            <Table.Cell collapsing>{element.MEM_ADDRESS}</Table.Cell>
                            <Table.Cell collapsing>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    // 编辑项目
    onEditItem(itemname, item, value){
        if(itemname === 'MEM_LASTNAME'){
            // 控制长度
            if (value.length <= 10){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else if(itemname === 'MEM_FIRSTNAME'){
            if (value.length <= 10){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else if(itemname === 'MEM_CODE'){
            if (value.length <= 18){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else if(itemname === 'MEM_PHONE'){
            if (value.length <= 13){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else if(itemname === 'MEM_ZIP'){
            if (value.length <= 6
                ){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else if(itemname === 'MEM_ADDRESS'){
            if (value.length <= 40
                ){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
 

       

    }
    // 更改添加商品的类型选择
    sexSelectChange(e,f){
        
        // 取得
        // 修改基础列表，结尾追加一条
        var {editobject} = this.state
        editobject.MEM_SEX = f.value

        this.setState({
            editobject:editobject,
        })
     
    }
    dateChange = date => {
        var {editobject} = this.state
        editobject.MEM_BIRTHDAY = date

        this.setState({
            editobject:editobject
        });
      };

    addEditRow(element){
        element = {...element, DISP_FLG:1} // 补充一个编辑标记
        return (
            <Table.Row key={element.MEM_ID}>
                            <Table.Cell><Input style={{ minWidth: '100px'}}  fluid value={element.MEM_CODE} onChange={(e, f)=>this.onEditItem('MEM_CODE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Label style={{ minWidth: '100px'}} >-</Label></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '50px'}} fluid value={element.MEM_LASTNAME} onChange={(e, f)=>this.onEditItem('MEM_LASTNAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '70px'}} fluid value={element.MEM_FIRSTNAME} onChange={(e, f)=>this.onEditItem('MEM_FIRSTNAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell>
                                <DatePicker dateFormat="yyyy-MM-dd"
                                    value={new Date(element.MEM_BIRTHDAY)}
                                    selected={new Date(element.MEM_BIRTHDAY)}
                                    onChange={(e)=>this.dateChange(e)}
                                    placeholder='Enter date'   showYearDropdown
                                /> 
                            </Table.Cell>
                            <Table.Cell><Dropdown options={this.sexoption} fluid value={element.MEM_SEX} onChange={(e, f)=>this.sexSelectChange(e, f)}></Dropdown></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '100px'}} fluid value={element.MEM_PHONE} onChange={(e, f)=>this.onEditItem('MEM_PHONE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '80px'}} fluid value={element.MEM_ZIP} onChange={(e, f)=>this.onEditItem('MEM_ZIP', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '50px'}} fluid value={element.MEM_ADDRESS} onChange={(e, f)=>this.onEditItem('MEM_ADDRESS', element, f.value)}></Input></Table.Cell>
                            <Table.Cell>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    
    addAddRow(element){
        element = {...element, DISP_FLG:2} // 补充一个添加标记
        return (
            <Table.Row key={element.MEM_ID}>
                            <Table.Cell><Input  style={{ minWidth: '100px'}}  fluid value={element.MEM_CODE} onChange={(e, f)=>this.onEditItem('MEM_CODE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Label style={{ minWidth: '100px'}} >-</Label></Table.Cell>
                            <Table.Cell><Input  style={{ minWidth: '70px'}} fluid value={element.MEM_LASTNAME} onChange={(e, f)=>this.onEditItem('MEM_LASTNAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input  style={{ minWidth: '70px'}} fluid value={element.MEM_FIRSTNAME} onChange={(e, f)=>this.onEditItem('MEM_FIRSTNAME', element, f.value)}></Input></Table.Cell>
                          
                            <Table.Cell>
                                <DatePicker dateFormat="yyyy-MM-dd"
                                    value={element.MEM_BIRTHDAY}
                                    selected={element.MEM_BIRTHDAY}
                                    onChange={(e)=>this.dateChange(e)}
                                    placeholder='Enter date'   showYearDropdown
                                /> 
                            </Table.Cell>
                        
                            <Table.Cell><Dropdown options={this.sexoption}  value={element.MEM_SEX} onChange={(e, f)=>this.sexSelectChange(e, f)}></Dropdown></Table.Cell>
                            
                            <Table.Cell><Input  style={{ minWidth: '100px'}} fluid value={element.MEM_PHONE} onChange={(e, f)=>this.onEditItem('MEM_PHONE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input  style={{ minWidth: '80px'}} fluid value={element.MEM_ZIP} onChange={(e, f)=>this.onEditItem('MEM_ZIP', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input  style={{ minWidth: '50px'}} fluid value={element.MEM_ADDRESS} onChange={(e, f)=>this.onEditItem('MEM_ADDRESS', element, f.value)}></Input></Table.Cell>
                            <Table.Cell>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }

    // 会员存取货操作
    onSetSave(){
        const {shoppingItems} = this.context
        if(shoppingItems.length > 0){
            // 发送恢复删除请求

            var {editobject} = this.state

            var subitem = []
            shoppingItems.forEach(element => {
                subitem.push({
                    ITEM_ID:element.ITEM_ID,
                    COM_TYPE_ID:element.COM_TYPE_ID,
                    ITEM_NUMBER:parseFloat(element.ITEM_NUMBER)
                })
            });
            var itemstr = JSON.stringify(subitem)
            var memid = this.state.whmeminfo.MEM_ID
            
            // 提交编辑
            Common.sendMessage(Common.baseUrl + "/member/meminorout"
            , "POST"
            , null
            , {
                MEM_ID:memid,
                WH_INFO:itemstr,
                ORDER_TYPE:this.state.whordertype
            }
            , null
            , (e)=>{
                // 更新数据
                this.getItems()
                
            },(e)=>{
                const {setMainContext} = this.context
                setMainContext({
                    errorMessage: e
                })
            },
            this.context)
                this.setState({
                    editobject:editobject,
                    showset:false
                })
        }
    }
    // 会员添加存款按钮按下
    onAddMoneyButton(){
        const {setMainContext} = this.context

        if(this.state.addmoney<=0){
            setMainContext({
                errorMessage:'存入金额必须大于0！'
            })
            return
        }
        var {baseitems} = this.state
        Common.sendMessage(Common.baseUrl + "/member/addmoney"
            , "POST"
            , null
            , {MEM_ID:this.state.addmoneyobj.MEM_ID,
                MEM_MONEY:this.state.addmoney}
            , null
            , (e)=>{
                // 写入缓存
                var index = baseitems.findIndex((ele)=>{return ele.MEM_ID===e.data.MEM_ID})
                if(index>=0){
                    baseitems[index].MEM_MONEY = e.data.MEM_MONEY
                }
                this.setState({showaddmoney:false})
            },null,
            this.context)        
    }
    numberChange = (e,f) => {
        var {addmoney} = this.state;
        var { value } = f;
        const reg = /^\d*?$/;		// 以数字1开头，任意数字结尾，且中间出现零个或多个数字
        if ((reg.test(value) && value.length < 5) || value === '') {
            if(value===''){
                addmoney = 1
            }
            else{
                addmoney = parseInt(value)
            }
            this.setState({
                addmoney:addmoney
            })
        }
        
      }
    shopSelectChange(e, f){
        this.SHOP_ID = f.value
        this.getItems();

    }
    render(){
        var rows = [];
        if ( this.state.items.length > 0 ) {
            this.state.items.forEach(element=>{
                var index = 0
                if(this.state.searchtext !== undefined){
                    index = (element.MEM_CODE.toUpperCase() + element.MEM_FIRSTNAME + element.MEM_LASTNAME).indexOf(this.state.searchtext.toUpperCase())
                }
                if(this.state.editstate === 0){ // 普通模式
                    if( index>= 0){
                        rows.push(this.addNormolRow(element))
                    }
                }
                if(this.state.editstate === 1){ // 编辑模式
                    if(element.MEM_ID === this.state.editobject.MEM_ID){
                        rows.push(this.addEditRow(this.state.editobject))
                    }
                    else{
                        if( index>= 0){
                            rows.push(this.addNormolRow(element))
                        }
                    }
                }
                if(this.state.editstate === 2){ // 编辑模式
                    if(element.MEM_ID === this.state.editobject.MEM_ID){
                        rows.push(this.addAddRow(this.state.editobject))
                    }
                    else{
                        if( index>= 0){
                            rows.push(this.addNormolRow(element))
                        }
                    }
                }
            }
            )
        }
        if(this.state.editstate === 0 && this.state.shoptype === 0){
        // 添加空行
            rows.push(<Table.Row key={'new'}>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>
                                <Button onClick={()=>this.onAddNewClick()}>添加</Button>
                            </Table.Cell>
                        </Table.Row>)
        }
        var mhrows = []
        if(this.state.showmem){
            var key=0
            this.state.moneyhistory.items.forEach(element => {
                mhrows.push(<Table.Row key={key++}>
                    <Table.Cell>{key}</Table.Cell>
                    <Table.Cell>{element.ITEM_ID.toString() + element.COM_TYPE_ID}</Table.Cell>
                    <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                    <Table.Cell>{element.ITEM_COUNT}</Table.Cell>
                    </Table.Row>)
            });
        }

        var memrows=[]
        var totel = 0
        if(this.state.showmemWH){
            this.state.modelinfo.items.forEach(element => {
                if(element.ORDER_TYPE === 0){
                    totel+=element.ITEM_NUMBER
                }
                else if(element.ORDER_TYPE === 1){
                    totel-=element.ITEM_NUMBER
                }
                let index = -1
                if(this.state.searchtext !== undefined){
                    index = (element.COM_TYPE_ID.toUpperCase() + element.ITEM_ID.toString() + element.ITEM_NAME).indexOf(this.state.orderSearchText.toUpperCase())
                }
                if(index>=0) {
                    memrows.push(
                        <Table.Row key={element.ORDER_ID + element.COM_TYPE_ID + element.ITEM_ID.toString()}>
                            <Table.Cell>{element.ORDER_ID}</Table.Cell>
                            <Table.Cell>{element.ORDER_TIME}</Table.Cell>
                            <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                            <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                            <Table.Cell>{element.ORDER_TYPE === 0 ? '存入' : '提出'}</Table.Cell>
                            <Table.Cell>{element.ITEM_NUMBER}</Table.Cell>
                        </Table.Row>
                    )
                }
            })


        }
        return(
            <div >
                <Input icon='search' size='small' placeholder='Search...'  onChange={(e,f)=>{this.setState({searchtext:f.value})}} />

                {
                    this.state.shoptype === 0 ? null:(
                    <Dropdown visible={"false"} options={this.state.Shops} search
                              onChange={(e, f) => this.shopSelectChange(e, f)} placeholder='请选择一个店铺'></Dropdown>)
                }
                 <div style={{ height:  '85vh' , overflowY:'scroll' }}>
                <Table celled selectable >
                    <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >会员号</Table.HeaderCell>
                        <Table.HeaderCell >存货量</Table.HeaderCell>
                        <Table.HeaderCell >姓氏</Table.HeaderCell>
                        <Table.HeaderCell >名字</Table.HeaderCell>
                        <Table.HeaderCell >生日</Table.HeaderCell>
                        <Table.HeaderCell >性别</Table.HeaderCell>
                        <Table.HeaderCell >电话号码</Table.HeaderCell>
                        <Table.HeaderCell >邮编</Table.HeaderCell>
                        <Table.HeaderCell width={3} >住址</Table.HeaderCell>
                        <Table.HeaderCell width={4} ><Radio toggle label='显示全部' checked={this.state.showall} onChange={()=>this.onShowChange()}></Radio></Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body >
                        {rows}
                    </Table.Body>
                </Table>
                <Modal open={this.state.showset}>   
                    <Modal.Header>会员【{this.state.whmeminfo.MEM_LASTNAME + ' ' + this.state.whmeminfo.MEM_FIRSTNAME}】的{this.state.whordertype ===0 ? '存货':'提货'}
                      <ButtonGroup style={{position:'absolute',right:60}}>
                        <Button  onClick={()=>this.onSetSave()} primary >
                             保存
                        </Button>
                        <Button.Or />
                        <Button onClick={()=>this.setState({showset:false})} >
                            取消
                        </Button>
                        </ButtonGroup>
                    </Modal.Header>
                    <Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Column width={"6"}> 
                                <MemShopItemSel ITEMS={this.state.whitems} ORDER_TYPE={this.state.whordertype} MEM_ID={this.state.whmeminfo.MEM_ID}></MemShopItemSel>
                            </Grid.Column>
                            <Grid.Column>
                               
                                <ItemOrder ITEMS={this.state.whitems} opetype={this.state.whordertype === 0 ? 8 : 9}></ItemOrder>
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        
                    </Modal.Actions>
                </Modal>

                <Modal open={this.state.showmem}>   
                    <Modal.Header>{'会员【' + this.state.moneyhistory.MEM_NAME + '】'}
                        <ButtonGroup style={{position:'absolute',right:60}}>
                            <Button onClick={()=>this.setState({showmem:false})} >
                                关闭
                            </Button>
                        </ButtonGroup>
                    </Modal.Header>
                    <Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Column>
                                <Table celled selectable sortable>
                                    <Table.Header  >
                                        <Table.Row key={ 1}>
                                            <Table.HeaderCell >序号</Table.HeaderCell>
                                            <Table.HeaderCell >商品编号</Table.HeaderCell>
                                            <Table.HeaderCell >商品名称</Table.HeaderCell>
                                            <Table.HeaderCell >会员持有数量</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body >
                                            {mhrows}
                                    </Table.Body>
                                    <Table.Footer fullWidth>
                                    </Table.Footer>
                                </Table>
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        用户商品存货数量
                    </Modal.Actions>
                </Modal>  

                <Modal open={this.state.showaddmoney}>   
                    <Modal.Header>会员【{this.state.addmoneyobj.MEM_LASTNAME + this.state.addmoneyobj.MEM_FIRSTNAME}】的存款
                        <ButtonGroup style={{position:'absolute',right:60}}>
                            <Button primary onClick={()=>this.onAddMoneyButton()} >
                                添加
                            </Button>
                            <Button.Or />
                            <Button onClick={()=>this.setState({showaddmoney:false})} >
                                关闭
                            </Button>
                        </ButtonGroup>
                    </Modal.Header>
                    <Modal.Content>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column textAlign='right'>
                                    <Input type='text' placeholder='存入金额' >
                                        <Label basic size='massive'>¥</Label>
                                        <Input placeholder='存入金额'  
                                        onChange={(e,f)=>this.numberChange(e,f)} 
                                        size='massive'
                                        style={{fontSize:'24px'}}
                                        value={this.state.addmoney}
                                        />
                                        <Label  size='massive'>.00</Label>
                                    </Input>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column  textAlign='right'>
                                    <ButtonGroup>
                                        <Button onClick={()=>this.setState({addmoney:10})}>10</Button>
                                        <Button.Or />
                                        <Button onClick={()=>this.setState({addmoney:20})}>20</Button>
                                        <Button.Or />
                                        <Button onClick={()=>this.setState({addmoney:50})}>50</Button>
                                        <Button.Or />
                                        <Button onClick={()=>this.setState({addmoney:100})}>100</Button>
                                        <Button.Or />
                                        <Button onClick={()=>this.setState({addmoney:200})}>200</Button>
                                        <Button.Or />
                                        <Button onClick={()=>this.setState({addmoney:500})}>500</Button>
                                        <Button.Or />
                                        <Button onClick={()=>this.setState({addmoney:1000})}>1000</Button>
                                    </ButtonGroup>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                       
                       
                    </Modal.Content>
                    <Modal.Actions>
                        
                    </Modal.Actions>
                </Modal>

                <Modal open={this.state.showmemWH}>
                         <Modal.Header> {'会员【' + this.state.memWHName + '】存取记录'  }
                             <ButtonGroup style={{position:'absolute',right:60}}>
                                 <Button onClick={()=>this.setState({showmemWH:false})} >
                                     关闭
                                 </Button>
                             </ButtonGroup>
                         </Modal.Header>
                         <Modal.Content>
                             <Grid columns='equal'>
                                 <Grid.Row>
                                     <Input icon='search' size='small' placeholder='Search...'  onChange={(e,f)=>{this.setState({orderSearchText:f.value})}} />
                                 </Grid.Row>
                                 <Grid.Row>
                                    <Grid.Column>
                                     <div  style={{height:  '75vh' , overflowY:'scroll' }}>
                                         <Table celled selectable>
                                             <Table.Header  >
                                                 <Table.Row >
                                                     <Table.HeaderCell>订单编号</Table.HeaderCell>
                                                     <Table.HeaderCell>订单时间</Table.HeaderCell>
                                                     <Table.HeaderCell>商品ID</Table.HeaderCell>
                                                     <Table.HeaderCell>商品名称</Table.HeaderCell>
                                                     <Table.HeaderCell>操作类型</Table.HeaderCell>
                                                     <Table.HeaderCell>数量</Table.HeaderCell>
                                                 </Table.Row>
                                             </Table.Header>
                                             <Table.Body >
                                                 {memrows}
                                             </Table.Body>
                                             <Table.Footer fullWidth>
                                             </Table.Footer>
                                         </Table></div>
                                 </Grid.Column>
                                 </Grid.Row>
                             </Grid>
                         </Modal.Content>
                         <Modal.Actions>
                             {'合计拥有数量：' + totel}
                         </Modal.Actions>
                     </Modal>

            </div>
            </div>
        )
    }
}

