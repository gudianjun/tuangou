import React,{Component} from "react"
import {
    Icon,
    Label,
    Table,
    Button,
    Radio,
    ButtonGroup,
    Modal,
    Grid,
    Input,
    Dropdown,
    GridRow,
    GridColumn, Checkbox, Divider, Header
} from 'semantic-ui-react'
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from "../../../common/common"
import ItemOrder from './ItemOrder'
import ItemSelect from './ItemSelect'
import ItemChangeType from "../../../pages/ItemChangeType";
export default class ItemsEdit extends Component{
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
            comtypes:[], // 商品类别列表
            searchtext:'',
            showsetdlg:false,
            setinfo:[],
            setname:"",
            filterItemType:7, // 0，什么都不选，全部，7，单品，1，套装，2，散装，4
            showItemChangeType:false,
            setShowItemChangeType:this.setShowItemChangeType,
        }
        this.getItems() // 获得编辑列表
    }
    // static getDerivedStateFromProps(nexProps, prevState){
        
    // } 
    setShowItemChangeType(show){
        this.setState({showItemChangeType:show})
    }
    getItems()
    {
        var arrayObj = []
        Common.sendMessage(Common.baseUrl + "/xiaoshou/getitems2"
            , "POST"
            , null
            , {itemtype:1}
            , null
            , (e)=>{
                e.data.forEach(element => {
                    arrayObj.push({...element, key:element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()})
                });
                // 写入缓存
                this.setState({baseitems:arrayObj})
            },null,
            this.context)

        var comtypes = []
        Common.sendMessage(Common.baseUrl + "/item/getcomtypes"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                e.data.forEach(element => {
                    comtypes.push({
                        key: element.COM_TYPE_ID,
                        text: element.COM_TYPE_ID,
                        value: element.COM_TYPE_ID
                    })
                });
                // 写入缓存
                this.setState({comtypes:comtypes})
            },null,
            this.context)
    }
    static getDerivedStateFromProps(nexProps, prevState){
        var items = []
        prevState.baseitems.forEach(
            (element)=>{
                if(prevState.showall){
                    if(prevState.editstate === 1 
                        && prevState.editobject.ITEM_ID === element.ITEM_ID 
                        && prevState.editobject.COM_TYPE_ID === element.COM_TYPE_ID){
                        items.push({...element, DISP_FLG: 1})
                    }
                    else if(prevState.editstate === 2
                        && prevState.editobject.ITEM_ID === element.ITEM_ID 
                        && prevState.editobject.COM_TYPE_ID === element.COM_TYPE_ID){
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
                            && prevState.editobject.ITEM_ID === element.ITEM_ID 
                            && prevState.editobject.COM_TYPE_ID === element.COM_TYPE_ID){
                            items.push({...element, DISP_FLG: 2})
                        }
                        else if(prevState.editstate === 2
                            && prevState.editobject.ITEM_ID === element.ITEM_ID 
                            && prevState.editobject.COM_TYPE_ID === element.COM_TYPE_ID){
                            items.push({...element, DISP_FLG: 1})
                        }
                        else{
                            items.push({...element, DISP_FLG: 0})
                        }
                    }
                }
            }
        )
        // // 结尾添加一个空行
        // items.push({
        //     ITEM_ID : 0,
        //     COM_TYPE_ID : '', 
        //     ITEM_NAME  :'', 
        //     ITEM_COST  :0.0, 
        //     ITEM_PRICE  :0.0, 
        //     ITEM_MEM_PRICE :0.0,  
        //     ITEM_GROUP_PRICE :0.0, 
        //     ITEM_DEPOSIT_PRICE :0.0, 
        //     DEL_FLG : false,
        //     DISP_FLG: 2
        // })
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
    // 单品套装改变事件
    onEditSetChange(item, e,f){
        // 套装不能散装
        if(f.label === '单品'){
            item.ITEM_TYPE = f.checked?0:0
        }
        else if(f.label === '套装'){
            item.ITEM_TYPE = f.checked?1:0
        }
        else if(f.label === '散装'){
            item.ITEM_TYPE = f.checked?2:0
        }
        this.setState(
        {
            editobject: item
        })
    }
 
    getDelFlg(item){
        if (item.DEL_FLG === 1)
            return (<Label ribbon><Icon name='delete' /> </Label>)
    }
    getAddFlg(item){
        if (item.DISP_FLG === 2)
            return (<Label color='olive' ribbon>+</Label>)
    }
    getSetFlg(item){
        if (item.ITEM_TYPE === 1){
            return (<Label color='green' ribbon>SET</Label>)
        }
        else if (item.ITEM_TYPE === 2){
            return (<Label color='blue' ribbon>散</Label>)
        }
    }

    // 恢复选中的商品
    onHuiFuClick(e, id, tid){
        console.log(e, id, tid)
        // 发送恢复删除请求
        Common.sendMessage(Common.baseUrl + "/item/huifu"
            , "POST"
            , null
            , {ITEM_ID:id, COM_TYPE_ID:tid}
            , null
            , (e)=>{
                // 更新状态,找到那个状态并且更新
                const {baseitems} = this.state
                var index = baseitems.findIndex((e)=>{return e.ITEM_ID===id && e.COM_TYPE_ID === tid})
                baseitems[index].DEL_FLG = 0
                this.setState({
                    baseitems:baseitems
                })
            },null,
            this.context)
    }
    // 删除选中的商品
    onDelClick(e, id, tid){
        console.log(e, id, tid)
        // 发送恢复删除请求
        Common.sendMessage(Common.baseUrl + "/item/delitem"
            , "POST"
            , null
            , {ITEM_ID:id, COM_TYPE_ID:tid}
            , null
            , (e)=>{
                // 更新状态,找到那个状态并且更新
                const {baseitems} = this.state
                var index = baseitems.findIndex((e)=>{return e.ITEM_ID===id && e.COM_TYPE_ID === tid})
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
        Common.sendMessage(Common.baseUrl + "/item/getitemid"
            , "POST"
            , null
            , {COM_TYPE_ID:this.state.comtypes[0].value}
            , null
            , (e)=>{
                // 取得
                // 修改基础列表，结尾追加一条
                var {baseitems} = this.state
                var addobj = {
                    ITEM_ID:e.data,
                    COM_TYPE_ID:this.state.comtypes[0].value,
                    ITEM_NAME:'',
                    ITEM_COST:0.0,
                    ITEM_PRICE:0.0,
                    ITEM_MEM_PRICE:0.0,
                    ITEM_GROUP_PRICE:0.0,
                    ITEM_DEPOSIT_PRICE:0.0,
                    ITEM_TYPE:0,
                    DEL_FLG:0,
                    ITEM_UNIT_INFO:''
                }
                baseitems.push(addobj)

                this.setState({
                    editstate:2,    // 添加新商品
                    editobject:addobj,
                })
            },null,
            this.context)        
    }
    // 编辑选中的商品
    onEditClick(e, id, tid){
        console.log(e, id, tid)
        // 发送恢复删除请求
        const {baseitems} = this.state
        var index = baseitems.findIndex((e)=>{return e.ITEM_ID===id && e.COM_TYPE_ID === tid})
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
        if (item.ITEM_TYPE === 1){
            if(item.ITEM_UNIT_INFO.length <= 0){
                setMainContext({
                    errorMessage:'套装必须设定包含商品，请点击【套装】按钮进行编辑。'
                })
                return
            }
        }
        if (item.ITEM_NAME === ''){
            setMainContext({
                errorMessage:'必须填写商品名称。'
            })
            return
        }
        // 提交编辑
        Common.sendMessage(Common.baseUrl + "/item/edititem"
        , "POST"
        , null
        , {
            'edittype':ope,
            'ITEM_ID': parseInt(item.ITEM_ID),
            'COM_TYPE_ID': item.COM_TYPE_ID,
            'ITEM_NAME' : item.ITEM_NAME,
            'ITEM_COST' : parseFloat(item.ITEM_COST),
            'ITEM_PRICE' : parseFloat(item.ITEM_PRICE),
            'ITEM_MEM_PRICE' : parseFloat(item.ITEM_MEM_PRICE),
            'ITEM_GROUP_PRICE' : parseFloat(item.ITEM_GROUP_PRICE),
            'ITEM_DEPOSIT_PRICE' : parseFloat(item.ITEM_DEPOSIT_PRICE),
            'ITEM_TYPE' : parseInt(item.ITEM_TYPE),
            'ITEM_UNIT_INFO' : item.ITEM_UNIT_INFO,
            'DEL_FLG' : 0
            }
        , null
        , (e)=>{
            // 更新数据
            this.getItems()
            this.setState({
                editstate:0,
                editobject:[]
            })
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
                        <Button onClick={(e)=>this.onEditClick(e, item.ITEM_ID, item.COM_TYPE_ID)} >编辑</Button>
                        <Button onClick={(e)=>this.onDelClick(e, item.ITEM_ID, item.COM_TYPE_ID)}>删除</Button>
                    </ButtonGroup>
                )
            }
            else{
                return (
                    <ButtonGroup>
                        <Button onClick={(e)=>this.onHuiFuClick(e, item.ITEM_ID, item.COM_TYPE_ID)}>恢复</Button>
                    </ButtonGroup>
                )
            }
        }
        else if (item.DISP_FLG === 1){  // 编辑
            return (
       
                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 1)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.ITEM_ID, item.COM_TYPE_ID)}>取消</Button>
                    <Button onClick={()=>this.onSetEditClick(item)}
                        style={{display: item.ITEM_TYPE !== 1 ? 'none' : 'block'}}>套装
                </Button>
                </ButtonGroup>
            )
        }
        else if (item.DISP_FLG === 2){  // 添加
            return (
                <ButtonGroup>
                    <Button primary onClick={(e)=>this.onSubmitEditClick(item, 2)}>提交</Button>
                    <Button secondary onClick={(e)=>this.onCancelClick(e, item.ITEM_ID, item.COM_TYPE_ID)}>放弃</Button>
                    <Button onClick={()=>this.onSetEditClick(item)}
                        style={{display:item.ITEM_TYPE !== 1  ? 'none' : 'block'}}>套装
                </Button>
                </ButtonGroup>
            )
        }
    }

    onSetEditClick(item){
        // 设定套餐数据
        const {shoppingItems} = this.context
        const {setMainContext} = this.context
        const {items} = this.context;
        if(item.ITEM_UNIT_INFO.length > 0){
            var sublist = JSON.parse(item.ITEM_UNIT_INFO)
            sublist.forEach((subitem)=>{
                var sii = new ShoppingItem()
                    var fi = items.find(element=>element.key === (subitem.SUB_COM_TYPE_ID + "_" + subitem.SUB_ITEM_ID.toString()))
                    if (fi !== undefined){
                        sii.InitShoppingItem(fi, shoppingItems.length, subitem.ITEM_NUMBER)
                        shoppingItems.push(sii)
                    }
            })
        }
        else{
            setMainContext({
                shoppingItems:[]
            }
            )
        }
       
        this.setState({
            showset:true
        })
    }
    getTypeName(element){
        if(element.ITEM_TYPE === 0){return '单品'}
        else if(element.ITEM_TYPE === 1){
            return (
                <Label as='a' onClick={()=>this.showSetInfo(element)}
                       color={'blue'}>
                    {'套装'}
                </Label>
            ) // '套装'
        }
        else if(element.ITEM_TYPE === 2){return '散装'}
    }
    addNormolRow(element){
        if((this.state.filterItemType & 1) === 0 && element.ITEM_TYPE == 0){
            return
        }
        if((this.state.filterItemType & 2) === 0 && element.ITEM_TYPE == 1){
            return
        }
        if((this.state.filterItemType & 4) === 0 && element.ITEM_TYPE == 2){
            return
        }
        return (
            <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                            <Table.Cell collapsing>{this.getDelFlg(element)} {this.getSetFlg(element)} {element.ITEM_ID}</Table.Cell>
                            <Table.Cell collapsing>{element.COM_TYPE_ID}</Table.Cell>
                            <Table.Cell collapsing>{element.ITEM_NAME}</Table.Cell>
                            <Table.Cell collapsing  textAlign='right'>{element.ITEM_COST}</Table.Cell>
                            <Table.Cell collapsing  textAlign='right'>{element.ITEM_PRICE}</Table.Cell>
                            <Table.Cell collapsing  textAlign='right'>{element.ITEM_MEM_PRICE}</Table.Cell>
                            <Table.Cell collapsing  textAlign='right'>{element.ITEM_GROUP_PRICE}</Table.Cell>
                            <Table.Cell collapsing  textAlign='right'>{element.ITEM_DEPOSIT_PRICE}</Table.Cell>
                            <Table.Cell collapsing>{this.getTypeName(element)}</Table.Cell>
                            <Table.Cell collapsing>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    // 编辑项目
    onEditItem(itemname, item, value){
        if(itemname === 'ITEM_NAME'){
            // 控制长度
            if (value.length <= 20){
                item[itemname] = value
                console.log('控制长度', value.length)
                this.setState({
                    editobject:item
                })
            }
        }
        else{
            var isBuling = false
            // 检查是否为数字
            if(value.length > 0 && value[value.length - 1] === '.')
            {
                value+='0'
                isBuling = true
            }
            const reg = /^\d+([.]\d{1,2})?$/;		// 以数字1开头，任意数字结尾，且中间出现零个或多个数字
            if ((reg.test(value) && value.length < 8) || value === '') {
                if(value===''){
                    item[itemname] = ''
                }
                else{
                    if(isBuling){   // 后面补了一个零去掉
                        value = value.substring(0, value.length - 1)
                    }
                    item[itemname] = value
                }
                this.setState({
                    editobject:item
                })
            }
        }
    }
    // 套装设定画面保存按钮
    onSetSave(){
        const {shoppingItems} = this.context
        // 发送恢复删除请求

        var {editobject} = this.state

        var subitem = []
        shoppingItems.forEach(element => {
            subitem.push({
                SUB_ITEM_ID:element.ITEM_ID,
                SUB_COM_TYPE_ID:element.COM_TYPE_ID,
                ITEM_NUMBER:parseFloat(element.ITEM_NUMBER)
            })
        });
        editobject.ITEM_UNIT_INFO=JSON.stringify(subitem)
        this.setState({
            editobject:editobject,
            showset:false
        })
    }
    addEditRow(element){
        element = {...element, DISP_FLG:1} // 补充一个编辑标记
        return (
            <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                            <Table.Cell>{this.getDelFlg(element)} {this.getSetFlg(element)}{element.ITEM_ID}</Table.Cell>
                            <Table.Cell>{element.COM_TYPE_ID}</Table.Cell>
                            <Table.Cell><Input fluid value={element.ITEM_NAME} onChange={(e, f)=>this.onEditItem('ITEM_NAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input fluid value={element.ITEM_COST} onChange={(e, f)=>this.onEditItem('ITEM_COST', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input fluid value={element.ITEM_PRICE} onChange={(e, f)=>this.onEditItem('ITEM_PRICE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input fluid value={element.ITEM_MEM_PRICE} onChange={(e, f)=>this.onEditItem('ITEM_MEM_PRICE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input fluid value={element.ITEM_GROUP_PRICE} onChange={(e, f)=>this.onEditItem('ITEM_GROUP_PRICE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input fluid value={element.ITEM_DEPOSIT_PRICE} onChange={(e, f)=>this.onEditItem('ITEM_DEPOSIT_PRICE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell>
                             <ButtonGroup fluid vertical>
                                <Radio  name='radioGroup' label={'单品'} 
                                    checked={element.ITEM_TYPE === 0 ? true : false} onChange={(e, f)=>this.onEditSetChange(element,e,f)}>
                                </Radio>
                                <Radio  name='radioGroup' label={'套装'} 
                                    checked={element.ITEM_TYPE === 1 ? true : false} onChange={(e, f)=>this.onEditSetChange(element,e,f)}>
                                </Radio>
                                <Radio  name='radioGroup' label={'散装'} 
                                    checked={element.ITEM_TYPE === 2 ? true : false} onChange={(e, f)=>this.onEditSetChange(element,e,f)}>
                                </Radio>
                            </ButtonGroup>
                            </Table.Cell>
                            <Table.Cell>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }
    // 更改添加商品的类型选择
    handleAddItemComChange(e,f){
        Common.sendMessage(Common.baseUrl + "/item/getitemid"
        , "POST"
        , null
        , {COM_TYPE_ID: f.value}
        , null
        , (e)=>{
            // 取得
            // 修改基础列表，结尾追加一条
            var {editobject} = this.state
            editobject.ITEM_ID = e.data
            editobject.COM_TYPE_ID = f.value

            this.setState({
                editobject:editobject,
            })
        },null,
        this.context)     
    }
    addAddRow(element){
        element = {...element, DISP_FLG:2} // 补充一个添加标记
        console.log('addAddRow', element)
        return (
            <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                            <Table.Cell> {this.getAddFlg(element)}{this.getSetFlg(element)}{element.ITEM_ID}</Table.Cell>
                            <Table.Cell><Dropdown style={{ width: '50px'}}
                                onChange={(e,f)=>this.handleAddItemComChange(e,f)}
                                options={this.state.comtypes}
                                placeholder='商品类别'
                                selection
                                value={element.COM_TYPE_ID}/>
                            </Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '50px'}} fluid value={element.ITEM_NAME} onChange={(e, f)=>this.onEditItem('ITEM_NAME', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '50px'}} fluid value={element.ITEM_COST} onChange={(e, f)=>this.onEditItem('ITEM_COST', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '50px'}} fluid value={element.ITEM_PRICE} onChange={(e, f)=>this.onEditItem('ITEM_PRICE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '50px'}} fluid value={element.ITEM_MEM_PRICE} onChange={(e, f)=>this.onEditItem('ITEM_MEM_PRICE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '50px'}} fluid value={element.ITEM_GROUP_PRICE} onChange={(e, f)=>this.onEditItem('ITEM_GROUP_PRICE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell><Input style={{ minWidth: '50px'}} fluid value={element.ITEM_DEPOSIT_PRICE} onChange={(e, f)=>this.onEditItem('ITEM_DEPOSIT_PRICE', element, f.value)}></Input></Table.Cell>
                            <Table.Cell>
                             <ButtonGroup fluid vertical>
                                <Radio  name='radioGroup' label={'单品'} 
                                    checked={element.ITEM_TYPE === 0 ? true : false} onChange={(e, f)=>this.onEditSetChange(element,e,f)}>
                                </Radio>
                                <Radio  name='radioGroup' label={'套装'} 
                                    checked={element.ITEM_TYPE === 1 ? true : false} onChange={(e, f)=>this.onEditSetChange(element,e,f)}>
                                </Radio>
                                <Radio  name='radioGroup' label={'散装'} 
                                    checked={element.ITEM_TYPE === 2 ? true : false} onChange={(e, f)=>this.onEditSetChange(element,e,f)}>
                                </Radio>
                            </ButtonGroup>
                            </Table.Cell>
                            <Table.Cell>
                                {this.getButtonGroup(element)}
                            </Table.Cell>
                        </Table.Row>
        )
    }

    showSetInfo(element){

        Common.sendMessage(Common.baseUrl + "/xiaoshou/getsetinfo"
            , "POST"
            , null
            , {itemid:element.ITEM_ID,comtypeid:element.COM_TYPE_ID}
            , null
            , (e)=>{
                this.setState({showsetdlg:true,setinfo:e.data, setname:element.ITEM_NAME})
            }
            ,(e)=>{
                const {setMainContext} = this.context
                setMainContext({
                    errorMessage:e
                })
            },
            this.context)


    }

    render(){
        var rows = [];
        if ( this.state.items.length > 0 ) {
            this.state.items.forEach(element=>{
                var index = 0
                if(this.state.searchtext !== undefined){
                    index = (element.COM_TYPE_ID.toUpperCase() + element.ITEM_ID.toString() + element.ITEM_NAME).indexOf(this.state.searchtext.toUpperCase())
                }

                if(this.state.editstate === 0){ // 普通模式
                    if( index>= 0){
                    rows.push(this.addNormolRow(element))
                    }
                }
                if(this.state.editstate === 1){ // 编辑模式
                    if(element.ITEM_ID === this.state.editobject.ITEM_ID && element.COM_TYPE_ID === this.state.editobject.COM_TYPE_ID){
                        rows.push(this.addEditRow(this.state.editobject))
                    }
                    else{
                        if( index>= 0){
                        rows.push(this.addNormolRow(element))
                        }
                    }
                }
                if(this.state.editstate === 2){ // 编辑模式
                    if(element.ITEM_ID === this.state.editobject.ITEM_ID && element.COM_TYPE_ID === this.state.editobject.COM_TYPE_ID){
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
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell>
                                <Button onClick={()=>this.onAddNewClick()}>添加</Button>
                            </Table.Cell>
                        </Table.Row>)
        }
        return(
        <div >
            <Grid columns='equal'>
                <GridRow >
                    <GridColumn>
                        <Input icon='search' size='small' placeholder='Search...'
                               onChange={(e,f)=>{this.setState({searchtext:f.value})}} />
                    </GridColumn>
                    <GridColumn>
                        <Checkbox checked={(this.state.filterItemType & 7) === 7?true:false} label="全部"
                                  onChange={(e,f)=>{f.checked?this.setState({filterItemType:7}):this.setState({filterItemType:0})}} ></Checkbox>
                        <Checkbox checked={(this.state.filterItemType & 1) === 1?true:false} label="单品"
                                  onChange={(e,f)=>{
                                      let value = f.checked?(this.state.filterItemType | 1):(this.state.filterItemType & 6)
                                      this.setState({filterItemType:value})
                                  }
                        }></Checkbox>
                        <Checkbox checked={(this.state.filterItemType & 2) === 2?true:false} label="套装"
                                  onChange={(e, f) => {
                                      let value = f.checked ? (this.state.filterItemType | 2) : (this.state.filterItemType & 5)
                                      this.setState({filterItemType: value})
                                  }
                                  }></Checkbox>
                        <Checkbox checked={(this.state.filterItemType & 4) === 4?true:false} label="散装"
                                      onChange={(e, f) => {
                                          let value = f.checked ? (this.state.filterItemType | 4) : (this.state.filterItemType & 3)
                                          this.setState({filterItemType: value})
                                      }
                                      }></Checkbox>
                    </GridColumn>
                    <GridColumn>
                        <Button positive onClick={()=>{this.setState({showItemChangeType:true})}}>商品类别更换</Button>
                    </GridColumn>
                </GridRow>
            </Grid>

                <Divider horizontal >
                    <Header as='h4'>
                        <Icon name='envira gallery' />
                        商品一览
                    </Header>
                </Divider>
                    <div style={{ height:  '85vh' , overflowY:'scroll' }}>
                    <Table celled selectable>
                        <Table.Header  >
                        <Table.Row>
                            <Table.HeaderCell >序号</Table.HeaderCell>
                            <Table.HeaderCell >分类</Table.HeaderCell>
                            <Table.HeaderCell >商品名</Table.HeaderCell>
                            <Table.HeaderCell >成本</Table.HeaderCell>
                            <Table.HeaderCell >单价</Table.HeaderCell>
                            <Table.HeaderCell >会员价</Table.HeaderCell>
                            <Table.HeaderCell >团购价</Table.HeaderCell>
                            <Table.HeaderCell >处理价</Table.HeaderCell>
                            <Table.HeaderCell >类型</Table.HeaderCell>
                            <Table.HeaderCell width={5} ><Radio toggle label='显示全部' checked={this.state.showall} onChange={()=>this.onShowChange()}></Radio></Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body >
                            {rows}
                        </Table.Body>
                    </Table>
                    <Modal open={this.state.showset}>
                        <Modal.Header>编辑套装包含商品【{this.state.editobject.key}】
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
                                    <ItemSelect seltype={1}></ItemSelect>
                                </Grid.Column>
                                <Grid.Column>
                                    <ItemOrder opetype={7}></ItemOrder>
                                </Grid.Column>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>

                        </Modal.Actions>
                    </Modal>

                    <Modal open={this.state.showsetdlg}>
                        <Modal.Header> {'套餐【' + this.state.setname + '】的内容'  }
                            <ButtonGroup style={{position:'absolute',right:60}}>
                                <Button onClick={()=>this.setState({showsetdlg:false})} >
                                    关闭
                                </Button>
                            </ButtonGroup>
                        </Modal.Header>
                        <Modal.Content>
                            <Grid columns='equal'>
                                <Grid.Column>
                                    <div  style={{overflowY:'scroll' }}>
                                        <Table celled selectable>
                                            <Table.Header  >
                                                <Table.Row >
                                                    <Table.HeaderCell>商品ID</Table.HeaderCell>
                                                    <Table.HeaderCell>商品类别</Table.HeaderCell>
                                                    <Table.HeaderCell>商品名</Table.HeaderCell>
                                                    <Table.HeaderCell>数量</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body >
                                                {this.state.setinfo.map(element=> {
                                                    return (
                                                        <Table.Row
                                                            key={element.SUB_ITEM_ID + "_" + element.SUB_COM_TYPE_ID.toString()}>
                                                            <Table.Cell>{element.SUB_ITEM_ID}</Table.Cell>
                                                            <Table.Cell>{element.SUB_COM_TYPE_ID}</Table.Cell>
                                                            <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                                                            <Table.Cell>{element.ITEM_NUMBER}</Table.Cell>
                                                        </Table.Row>
                                                    )
                                                })
                                                }
                                            </Table.Body>
                                            <Table.Footer fullWidth>
                                            </Table.Footer>
                                        </Table></div>
                                </Grid.Column>
                            </Grid>
                        </Modal.Content>

                    </Modal>
                    <ItemChangeType setShowItemChangeType={this.setShowItemChangeType.bind(this)} showItemChangeType={this.state.showItemChangeType}></ItemChangeType>
                </div>


        </div>
        )
    }
}

