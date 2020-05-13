import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button, Radio, ButtonGroup, Modal, Grid,Input, Segment, Dropdown } from 'semantic-ui-react'
import PropTypes, { element } from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from "../../../common/common"
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
setDefaultLocale('zhCN');
// 店铺管理
export default class ShopEdit extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            editstate:0,    // 0 普通；1：编辑，2添加
            showall:false,
            items:[],
            baseitems:[],
            showset:false,   // 是否显示套装编辑画面
            editobject:{},   //进行编辑的对象
            shoptype:[{
                key:99,
                text:'管理员',
                value:99
            },{
                key:0,
                text:'店铺',
                value:0
            },{
                key:1,
                text:'仓库',
                value:1
            }] // 商店类型
          
        }
        this.getItems() // 获得编辑列表
    }
    // static getDerivedStateFromProps(nexProps, prevState){
        
    // } 

    getItems()
    {
    
        var arrayObj = []

        Common.sendMessage(Common.baseUrl + "/shop/getshops"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                // 读取员工清单
                
                e.data.forEach(element => {
                    arrayObj.push({...element, key:element.SHOP_ID})
                });

                this.setState({
                    editstate:0,
                    editobject:[],
                    baseitems:arrayObj
                })
            },null,
            this.context)
    }
    static getDerivedStateFromProps(nexProps, prevState){
        var items = []
        prevState.baseitems.forEach(
            (element)=>{
                if(prevState.showall){
                    if(prevState.editstate === 1 
                        && prevState.editobject.SHOP_ID === element.SHOP_ID){
                        items.push({...element, DISP_FLG: 1})
                    }
                    else if(prevState.editstate === 2
                        && prevState.editobject.SHOP_ID === element.SHOP_ID){
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
                            && prevState.editobject.SHOP_ID === element.SHOP_ID){
                            items.push({...element, DISP_FLG: 2})
                        }
                        else if(prevState.editstate === 2
                            && prevState.editobject.SHOP_ID === element.SHOP_ID){
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

    // 恢复选中的商品
    onHuiFuClick(e, id){
        console.log(e, id)
        // 发送恢复删除请求
        Common.sendMessage(Common.baseUrl + "/shop/huifu"
            , "POST"
            , null
            , {SHOP_ID:id}
            , null
            , (e)=>{
                // 更新状态,找到那个状态并且更新
                const {baseitems} = this.state
                var index = baseitems.findIndex((e)=>{return e.SHOP_ID===id})
                baseitems[index].DEL_FLG = 0
                this.setState({
                    baseitems:baseitems
                })
            },null,
            this.context)
    }
    // 删除选中的商品
    onDelClick(e, id){
        console.log(e, id)
        // 发送恢复删除请求
        Common.sendMessage(Common.baseUrl + "/shop/delitem"
            , "POST"
            , null
            , {SHOP_ID:id}
            , null
            , (e)=>{
                // 更新状态,找到那个状态并且更新
                const {baseitems} = this.state
                var index = baseitems.findIndex((e)=>{return e.SHOP_ID===id})
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
            SHOP_ID:999999,
            SHOP_NAME:'',
            SHOP_TYPE:0, 
            SHOP_PWD:Common.createPassword(8, 8),
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
        const {baseitems} = this.state
        var index = baseitems.findIndex((element)=>{return element.SHOP_ID===id})
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

        if(item.SHOP_NAME === null || item.SHOP_NAME.length <= 0){
            setMainContext({
                errorMessage:'姓名必须填写。'
            })
            return
        }
        if(item.SHOP_TYPE === null || (item.SHOP_TYPE !== 0 && item.SHOP_TYPE !== 1 && item.SHOP_TYPE !== 99)){
            setMainContext({
                errorMessage:'必须选择一个种类'
            })
            return
        }
        if(item.SHOP_PWD === null || item.SHOP_PWD.length <= 0){
            setMainContext({
                errorMessage:'必须输入密码。'
            })
            return
        }
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/shop/edititem"
        , "POST"
        , null
        , {
            'edittype':ope,
            'SHOP_ID': item.SHOP_ID,// # 
            'SHOP_NAME': item.SHOP_NAME,// 
            'SHOP_TYPE':item.SHOP_TYPE,// 
            'SHOP_PWD': item.SHOP_PWD
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
        if (item.DISP_FLG === 0){
            if(item.DEL_FLG === 0){
                return (
                    <ButtonGroup>
                        <Button onClick={(e)=>this.onEditClick(e, item.SHOP_ID)} >编辑</Button>
                        <Button onClick={(e)=>this.onDelClick(e, item.SHOP_ID)}>删除</Button>
                    </ButtonGroup>
                )
            }
            else{
                return (
                    <ButtonGroup>
                        <Button onClick={(e)=>this.onHuiFuClick(e, item.SHOP_ID)}>恢复</Button>
                    </ButtonGroup>
                )
            }
        }
        else if (item.DISP_FLG === 1){  // 编辑
            return (
       
                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 1)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.SHOP_ID)}>取消</Button>
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
    addNormolRow(element){
        return (
            <Table.Row key={element.SHOP_ID}>
                            <Table.Cell collapsing>{element.SHOP_NAME}</Table.Cell>
                            <Table.Cell collapsing>{this.getShopType(element)}</Table.Cell>
                            <Table.Cell collapsing>{element.SHOP_PWD}</Table.Cell>
                            <Table.Cell collapsing>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    // 编辑项目
    onEditItem(itemname, item, value){
        if(itemname === 'SHOP_NAME'){
            // 控制长度
            if (value.length <= 20){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else if(itemname === 'SHOP_PWD'){
            if (value.length <= 20){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
    }
    onPwdClick(item){
        item.SHOP_PWD = Common.createPassword(8, 8)
        this.setState({
            editobject:item
        })
    }

    // 更改添加商品的类型选择
    shopTypeSelectChange(e,f){
        
        // 取得
        // 修改基础列表，结尾追加一条
        var {editobject} = this.state
        editobject.SHOP_TYPE = f.value

        this.setState({
            editobject:editobject,
        })
     
    }
  
    addEditRow(element){
        element = {...element, DISP_FLG:1} // 补充一个编辑标记
        return (
            <Table.Row key={element.SHOP_ID}>
                            <Table.Cell><Input value={element.SHOP_NAME} onChange={(e, f)=>this.onEditItem('SHOP_NAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Dropdown options={this.state.shoptype} value={element.SHOP_TYPE} onChange={(e, f)=>this.shopTypeSelectChange(e, f)}></Dropdown></Table.Cell>
                            <Table.Cell><Input action={{
                                    icon: 'random', onClick: (event,data)=>{this.onPwdClick(element)}
                                }}
                                value={element.SHOP_PWD} onChange={(e, f)=>this.onEditItem('SHOP_PWD', element, f.value)}></Input>
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
            <Table.Row key={element.SHOP_ID}>
                            <Table.Cell><Input value={element.SHOP_NAME} onChange={(e, f)=>this.onEditItem('SHOP_NAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Dropdown options={this.state.shoptype} value={element.SHOP_TYPE} onChange={(e, f)=>this.shopTypeSelectChange(e, f)}></Dropdown></Table.Cell>
                            <Table.Cell><Input action={{
                                    icon: 'random', onClick: (event,data)=>{this.onPwdClick(element)}
                                }}
                                value={element.SHOP_PWD} onChange={(e, f)=>this.onEditItem('SHOP_PWD', element, f.value)}></Input>
                            </Table.Cell>
                            <Table.Cell>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    render(){
        var rows = [];
        if ( this.state.items.length > 0 ) {
            this.state.items.forEach(element=>{
                if(this.state.editstate === 0){ // 普通模式
                    rows.push(this.addNormolRow(element))
                }
                if(this.state.editstate === 1){ // 编辑模式
                    if(element.SHOP_ID === this.state.editobject.SHOP_ID){
                        rows.push(this.addEditRow(this.state.editobject))
                    }
                    else{
                        rows.push(this.addNormolRow(element))
                    }
                }
                if(this.state.editstate === 2){ // 编辑模式
                    if(element.SHOP_ID === this.state.editobject.SHOP_ID){
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
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>
                                <Button onClick={()=>this.onAddNewClick()}>添加</Button>
                            </Table.Cell>
                        </Table.Row>)
        }
        return(
            
            <div style={{ minHeight:1024}}> 
           
                <Table celled selectable style={{minHeight:'100%', height:'100%'}}>
                    <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >店铺名称</Table.HeaderCell>
                        <Table.HeaderCell >店铺类型</Table.HeaderCell>
                        <Table.HeaderCell >登录密码</Table.HeaderCell>
                        <Table.HeaderCell width={3} ><Radio toggle label='显示全部' checked={this.state.showall} onChange={()=>this.onShowChange()}></Radio></Table.HeaderCell>
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

