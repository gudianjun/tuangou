import React,{Component} from "react"
import { Icon, Label, Table,Button, Radio, ButtonGroup, Input, Dropdown } from 'semantic-ui-react'
import { MainContext} from '../ObjContext'
import Common from "../../../common/common"
import DatePicker, { setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
setDefaultLocale('zhCN');
// 员工管理
export default class EmpEdit extends Component{
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
            jobs:[], // 工作列表
            shops:[]    // 商店列表，可以为-1，表示不隶属于任何店铺
        }
        this.getItems() // 获得编辑列表
    }
    // static getDerivedStateFromProps(nexProps, prevState){
        
    // } 

    getItems()
    {
        var arrayObj = []
        var shopArr = []
        var jobArr = []
        Common.sendMessage(Common.baseUrl + "/staff/getstaffs"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                // 读取员工清单
                
                e.data.items.forEach(element => {
                    arrayObj.push({...element, key:element.EMP_ID })
                });
                // 读取店铺清单
                shopArr.push({
                    key:-1,
                    text:'没有店铺',
                    value:-1
                })
                e.data.shops.forEach(element => {
                    shopArr.push({
                        key:element.SHOP_ID,
                        text:element.SHOP_NAME,
                        value:element.SHOP_ID,
                        type:element.SHOP_TYPE
                    })
                });
                // 读取岗位清单
                e.data.jobs.forEach(element => {
                    jobArr.push({
                        key:element.JOB_ID,
                        text:element.JOB_NAME,
                        value:element.JOB_ID
                    })
                });

                this.setState({
                    editstate:0,
                    editobject:[],
                    baseitems:arrayObj,
                    shops:shopArr,
                    jobs:jobArr
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
                        && prevState.editobject.EMP_ID === element.EMP_ID){
                        items.push({...element, DISP_FLG: 1})
                    }
                    else if(prevState.editstate === 2
                        && prevState.editobject.EMP_ID === element.EMP_ID){
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
                            && prevState.editobject.EMP_ID === element.EMP_ID){
                            items.push({...element, DISP_FLG: 2})
                        }
                        else if(prevState.editstate === 2
                            && prevState.editobject.EMP_ID === element.EMP_ID){
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
        Common.sendMessage(Common.baseUrl + "/staff/huifu"
            , "POST"
            , null
            , {EMP_ID:id}
            , null
            , (e)=>{
                // 更新状态,找到那个状态并且更新
                const {baseitems} = this.state
                var index = baseitems.findIndex((e)=>{return e.EMP_ID===id})
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
        Common.sendMessage(Common.baseUrl + "/staff/delitem"
            , "POST"
            , null
            , {EMP_ID:id}
            , null
            , (e)=>{
                // 更新状态,找到那个状态并且更新
                const {baseitems} = this.state
                var index = baseitems.findIndex((e)=>{return e.EMP_ID===id})
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
            EMP_ID:999999,
            EMP_NAME:'',
            EMP_PHONE:'', 
            EMP_SEX:0, 
            EMP_BIRTHDAY: new Date('2000-01-01'), 
            EMP_CODE:'', 
            SHOP_ID: -1, 
            //EMP_STATE: 0, 
            //EMP_START:new Date('2000-01-01'), 
            //EMP_END:new Date('2000-01-01'), 
            EMP_JOB_ID:-1,
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
        var index = baseitems.findIndex((element)=>{return element.EMP_ID===id})
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

        if(item.EMP_NAME === null || item.EMP_NAME.length <= 0){
            setMainContext({
                errorMessage:'姓名必须填写。'
            })
            return
        }
        if(item.EMP_PHONE === null || item.EMP_PHONE.length <= 0){
            setMainContext({
                errorMessage:'电话必须填写。'
            })
            return
        }
        if(item.EMP_SEX === null || (item.EMP_SEX !== 0 && item.EMP_SEX !== 1)){
            setMainContext({
                errorMessage:'必须选择性别。'
            })
            return
        }
        if(this.state.jobs.indexOf(element=>element.EMP_JOB_ID === item.EMP_JOB_ID) >= 0){
            setMainContext({
                errorMessage:'必须选择一个职位。'
            })
            return
        }
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/staff/edititem"
        , "POST"
        , null
        , {
            'edittype':ope,
            'EMP_ID': item.EMP_ID,// # 
            'EMP_NAME': item.EMP_NAME,// 
            'EMP_PHONE':item.EMP_PHONE,// 
            'EMP_SEX': item.EMP_SEX,//  
            'EMP_BIRTHDAY': new Date(item.EMP_BIRTHDAY),//  
            'EMP_CODE' : item.EMP_CODE,// #
            'SHOP_ID' : item.SHOP_ID,//  
            'EMP_JOB_ID' : item.EMP_JOB_ID
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
                        <Button onClick={(e)=>this.onEditClick(e, item.EMP_ID)} >编辑</Button>
                        <Button onClick={(e)=>this.onDelClick(e, item.EMP_ID)}>删除</Button>
                    </ButtonGroup>
                )
            }
            else{
                return (
                    <ButtonGroup>
                        <Button onClick={(e)=>this.onHuiFuClick(e, item.EMP_ID)}>恢复</Button>
                    </ButtonGroup>
                )
            }
        }
        else if (item.DISP_FLG === 1){  // 编辑
            return (
       
                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 1)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.EMP_ID)}>取消</Button>
                </ButtonGroup>
            )
        }
        else if (item.DISP_FLG === 2){  // 添加
            return (
                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 2)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.EMP_ID)}>放弃</Button>
                </ButtonGroup>
            )
        }
    }
    getShopName(item){
        var index = this.state.shops.findIndex(e=>e.value === item.SHOP_ID)
        if(index >=0 ){
            return  this.state.shops[index].text
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
            <Table.Row key={element.EMP_ID}>
                            <Table.Cell collapsing>{element.EMP_NAME}</Table.Cell>
                            <Table.Cell collapsing>{element.EMP_PHONE}</Table.Cell>
                            <Table.Cell collapsing>{element.EMP_SEX === 0 ? '女' : '男'}</Table.Cell>
                            <Table.Cell collapsing>{element.EMP_BIRTHDAY}</Table.Cell>
                            <Table.Cell collapsing>{element.EMP_CODE}</Table.Cell>
                            <Table.Cell collapsing>{this.getShopName(element)}</Table.Cell>
                            <Table.Cell collapsing>{this.getJobName(element)}</Table.Cell>
                            <Table.Cell collapsing>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    // 编辑项目
    onEditItem(itemname, item, value){
        if(itemname === 'EMP_NAME'){
            // 控制长度
            if (value.length <= 10){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else if(itemname === 'EMP_PHONE'){
            if (value.length <= 13){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else if(itemname === 'EMP_CODE'){
            if (value.length <= 18){
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
        editobject.EMP_SEX = f.value

        this.setState({
            editobject:editobject,
        })
     
    }
    // 更改添加商品的类型选择
    shopSelectChange(e,f){
        
        // 取得
        // 修改基础列表，结尾追加一条
        var {editobject} = this.state
        editobject.SHOP_ID = f.value

        this.setState({
            editobject:editobject,
        })
     
    }
    // 更改添加商品的类型选择
    jobSelectChange(e,f){
        
        // 取得
        // 修改基础列表，结尾追加一条
        var {editobject} = this.state
        editobject.EMP_JOB_ID = f.value

        this.setState({
            editobject:editobject,
        })
     
    }
    dateChange = date => {
        var {editobject} = this.state
        editobject.EMP_BIRTHDAY = date

        this.setState({
            editobject:editobject
        });
      };

    addEditRow(element){
        element = {...element, DISP_FLG:1} // 补充一个编辑标记
        return (
            <Table.Row key={element.EMP_ID}>
                            <Table.Cell><Input value={element.EMP_NAME} onChange={(e, f)=>this.onEditItem('EMP_NAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input value={element.EMP_PHONE} onChange={(e, f)=>this.onEditItem('EMP_PHONE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Dropdown options={this.sexoption} value={element.EMP_SEX} onChange={(e, f)=>this.sexSelectChange(e, f)}></Dropdown></Table.Cell>
                            <Table.Cell>
                                <DatePicker dateFormat="yyyy-MM-dd"
                                    value={new Date(element.EMP_BIRTHDAY)}
                                    selected={new Date(element.EMP_BIRTHDAY)}
                                    onChange={(e)=>this.dateChange(e)}
                                    placeholder='Enter date'   showYearDropdown
                                /> 
                            </Table.Cell>
                            <Table.Cell><Input value={element.EMP_CODE} onChange={(e, f)=>this.onEditItem('EMP_CODE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Dropdown options={this.state.shops} value={element.SHOP_ID} onChange={(e, f)=>this.shopSelectChange(e, f)}></Dropdown></Table.Cell>
                            <Table.Cell><Dropdown options={this.state.jobs} value={element.EMP_JOB_ID} onChange={(e, f)=>this.jobSelectChange(e, f)}></Dropdown></Table.Cell>
                            <Table.Cell>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    
    addAddRow(element){
        element = {...element, DISP_FLG:2} // 补充一个添加标记
        return (
            <Table.Row key={element.EMP_ID}>
                            <Table.Cell><Input value={element.EMP_NAME} onChange={(e, f)=>this.onEditItem('EMP_NAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input value={element.EMP_PHONE} onChange={(e, f)=>this.onEditItem('EMP_PHONE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Dropdown options={this.sexoption} value={element.EMP_SEX} onChange={(e, f)=>this.sexSelectChange(e, f)}></Dropdown></Table.Cell>
                            <Table.Cell>
                                <DatePicker dateFormat="yyyy-MM-dd"
                                    value={new Date(element.EMP_BIRTHDAY)}
                                    selected={new Date(element.EMP_BIRTHDAY)}
                                    onChange={(e)=>this.dateChange(e)}
                                    placeholder='Enter date'   showYearDropdown
                                /> 
                            </Table.Cell>
                            <Table.Cell><Input value={element.EMP_CODE} onChange={(e, f)=>this.onEditItem('EMP_CODE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Dropdown options={this.state.shops} value={element.SHOP_ID} onChange={(e, f)=>this.shopSelectChange(e, f)}></Dropdown></Table.Cell>
                            <Table.Cell><Dropdown options={this.state.jobs} value={element.EMP_JOB_ID} onChange={(e, f)=>this.jobSelectChange(e, f)}></Dropdown></Table.Cell>
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
                    if(element.EMP_ID === this.state.editobject.EMP_ID){
                        rows.push(this.addEditRow(this.state.editobject))
                    }
                    else{
                        rows.push(this.addNormolRow(element))
                    }
                }
                if(this.state.editstate === 2){ // 编辑模式
                    if(element.EMP_ID === this.state.editobject.EMP_ID){
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
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>
                                <Button onClick={()=>this.onAddNewClick()}>添加</Button>
                            </Table.Cell>
                        </Table.Row>)
        }
        return(
            
            <div style={{ minHeight:800}}> 
           
                <Table celled selectable style={{minHeight:'100%', height:'100%'}}>
                    <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >姓名</Table.HeaderCell>
                        <Table.HeaderCell >电话</Table.HeaderCell>
                        <Table.HeaderCell >性别</Table.HeaderCell>
                        <Table.HeaderCell >生日</Table.HeaderCell>
                        <Table.HeaderCell >身份证号码</Table.HeaderCell>
                        <Table.HeaderCell width={1}>所属店铺</Table.HeaderCell>
                        <Table.HeaderCell width={1}>职务名称</Table.HeaderCell>
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

