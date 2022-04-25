import React,{Component} from "react"
import { Menu ,Input, Grid, Label, Divider, Header, Icon, Table, Button, ButtonGroup, Modal} from "semantic-ui-react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {MainContext} from './ObjContext'
import Common from "../../common/common"
import  ShenPiXiangXi from  "../../pages/ShenPiXiangXi";
export default class MeiRiShenPi extends Component{
    static contextType = MainContext;
    constructor(props, context){
        super(props)
        this.state = {
            selectobject:[],
            searchtext:'',  // 搜索文本
            showset:false,
            modelinfo:{}, // 模型要显示的数据
            selectdate:(new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10),
            selDateTime: (new Date()),
            showXX:false,
            setShowXX:this.setShowXX,
            shopID:-1,
            spInfos:{}
        }
        this.getInitData()
     
    }
    setShowXX(show){
        this.setState({showXX:show})
    }
    dateChange(date){
        this.setState({
            selectdate:date.toISOString().substring(0, 10),
            selDateTime:date,
        }, ()=>{
            this.getInitData()
        });
      };
    getInitData(){
        Common.sendMessage(Common.baseUrl + "/statistics/meirishenpi"
        , "POST"
        , null
        , {ORDER_TIME:this.state.selectdate}
        , null
        , (e)=>{
           this.setState({
               selectobject:e.data
            })
        },null,
        this.context)     
     }
    getRefFlg(item){
        if (item.DISP_STATE !== 1 )
            return (<Label color='red' ribbon><Icon name='warning' /></Label>)
    }
    onDelClick(item){
        const {setMainContext} = this.context
        Common.sendMessage(Common.baseUrl + "/statistics/delmeirishenpi" // 请求更新每日审批
            , "POST"
            , null
            , {SHOP_ID:item.SHOP_ID,ORDER_TIME:this.state.selectdate}
            , null
            , (e)=>{
                var index = this.state.selectobject.findIndex(elm=>{return elm.SHOP_ID === e.data.SHOP_ID})
                var {selectobject} = this.state
                selectobject[index].DISP_STATE = 0

                selectobject[index].TOTAL_XS = e.data.TOTAL_XS
                selectobject[index].TOTAL_XS_COST = e.data.TOTAL_XS_COST
                selectobject[index].TOTAL_TH = e.data.TOTAL_TH
                selectobject[index].TOTAL_TH_COST = e.data.TOTAL_TH_COST
                selectobject[index].TOTAL_XH_COST = e.data.TOTAL_XH_COST
                selectobject[index].EMP_PRICE = e.data.EMP_PRICE
                selectobject[index].SHIJI_RUZHANG = e.data.SHIJI_RUZHANG
                this.setState({
                    selectobject:selectobject
                })
            },(e)=>{
                setMainContext({
                    errorMessage:e
                })
            },
            this.context)
    }
    onRefClick(item){
        Common.sendMessage(Common.baseUrl + "/statistics/meirishenpishop"
        , "POST"
        , null
        , {SHOP_ID:item.SHOP_ID,ORDER_TIME:this.state.selectdate}
        , null
        , (e)=>{
            var index = this.state.selectobject.findIndex(elm=>{return elm.SHOP_ID === item.SHOP_ID})
            var {selectobject} = this.state
            selectobject[index].DISP_STATE = 2

            selectobject[index].TOTAL_XS = e.data[0].TOTAL_XS
            selectobject[index].TOTAL_XS_COST = e.data[0].TOTAL_XS_COST
            selectobject[index].TOTAL_TH = e.data[0].TOTAL_TH
            selectobject[index].TOTAL_TH_COST = e.data[0].TOTAL_TH_COST
            selectobject[index].TOTAL_XH_COST = e.data[0].TOTAL_XH_COST
            selectobject[index].EMP_PRICE = e.data[0].EMP_PRICE
            this.setState({
                selectobject:selectobject
            })
        },null,
        this.context)
       
    }
    onSimClick(item){
        // 提示错误
        const {setMainContext} = this.context
        
        if(Math.abs(parseFloat(item.SHIJI_RUZHANG) - parseFloat(item.TOTAL_XS) + parseFloat(item.TOTAL_TH)) <= 0.0000000001){
            Common.sendMessage(Common.baseUrl + "/statistics/updatemeirishenpi" // 请求更新每日审批
            , "POST"
            , null
            , {SHOP_ID:item.SHOP_ID,ORDER_TIME:this.state.selectdate}
            , null
            , (e)=>{
                var index = this.state.selectobject.findIndex(elm=>{return elm.SHOP_ID === e.data.SHOP_ID})
                var {selectobject} = this.state
                selectobject[index].DISP_STATE = 1

                selectobject[index].TOTAL_XS = e.data.TOTAL_XS
                selectobject[index].TOTAL_XS_COST = e.data.TOTAL_XS_COST
                selectobject[index].TOTAL_TH = e.data.TOTAL_TH
                selectobject[index].TOTAL_TH_COST = e.data.TOTAL_TH_COST
                selectobject[index].TOTAL_XH_COST = e.data.TOTAL_XH_COST
                selectobject[index].EMP_PRICE = e.data.EMP_PRICE
                selectobject[index].SHIJI_RUZHANG = e.data.SHIJI_RUZHANG
                this.setState({
                    selectobject:selectobject
                })
            },(e)=>{
                setMainContext({
                    errorMessage:e
                })
            },
            this.context)
        }
        else{
            setMainContext({
                errorMessage:'实收账款必须等于应收账款。'
            })
        }
    }
    getButtons(item){
        if (item.DISP_STATE === 1 ){
            return (<ButtonGroup>
                <Button  onClick={()=>{this.onDelClick(item)}}>删除</Button>
            </ButtonGroup>)
        }
        else{
            if (item.DISP_STATE === 0 ){
            return (<ButtonGroup>
                <Button onClick={()=>{this.onRefClick(item)}}>刷新</Button>
            </ButtonGroup>)
            }
            else{
                return (<ButtonGroup>
                    <Button onClick={()=>{this.onRefClick(item)}}>刷新</Button>
                    <Button primary  onClick={()=>{this.onSimClick(item)}}>确认</Button>
                </ButtonGroup>)
            }
        }
    }
    onDownload(shopid){
        Common.downloadFile(Common.baseUrl + "/item/downshenpifile", "POST", null
            , {SHOP_ID: shopid, ORDER_TIME:this.state.selectdate,}, null
            , (e) => {

            }
        );
    }
    // 编辑项目
    onEditItem(item, value){
        var isBuling = false
        var index = this.state.selectobject.findIndex(elm=>{return elm.SHOP_ID === item.SHOP_ID})
        var {selectobject} = this.state
        // 检查是否为数字
        if(value.length > 0 && value[value.length - 1] === '.')
        {
            value+='0'
            isBuling = true
        }
        const reg = /^[\-]?(\d+([.]\d{1,2})?)?$/;		// 以数字1开头，任意数字结尾，且中间出现零个或多个数字
        if ((reg.test(value) && value.length < 12) || value === '') {
            if(value===''){
                selectobject[index].SHIJI_RUZHANG = ''
            }
            else{
                if(isBuling){   // 后面补了一个零去掉
                    value = value.substring(0, value.length - 1)
                }
                selectobject[index].SHIJI_RUZHANG = value
            }
            this.setState({
                selectobject:selectobject
            })
        }        
    }
    // 获取实际入账金额控件
    getShijiRuZhang(item){
        if(item.DISP_STATE === 0){
            return ('-')
        }
        else if(item.DISP_STATE === 1){
            return (item.SHIJI_RUZHANG)
        } 
        else if(item.DISP_STATE === 2){
            return (<Input fluid value={item.SHIJI_RUZHANG}
                           onChange={(e, f)=>this.onEditItem(item, f.value)}></Input>)
        } 
    }
    getItems(element, seltype){
        Common.sendMessage(Common.baseUrl + "/statistics/shenpiitems"
        , "POST"
        , null
        , {
            SEL_TYPE:seltype,
            ORDER_TIME:this.state.selectdate,
            SHOP_ID:element.SHOP_ID
        }
        , null
        , (e)=>{
           this.setState({
            modelinfo:e.data,
            showset:true
            })
        },null,
        this.context)     
    }
    getNumber(element, seltype){
        // {element.DISP_STATE !== 0 ? element.TOTAL_XS : '-'}
        if(element.DISP_STATE !== 0){
            if(seltype === 0){
                if(element.TOTAL_XS===0){
                    return (0)
                }
                else{
                    return ( 
                        <Label as='a' onClick={()=>this.getItems(element, seltype)}  color='blue' >
                            {Common.formatCurrency(element.TOTAL_XS)}
                    </Label>
                )
                }
            }
            else if(seltype === 1){
                if(element.TOTAL_TH===0){
                    return (0)
                }
                else{
                    return ( 
                        <Label as='a' onClick={()=>this.getItems(element, seltype)}  color='blue' >
                            {Common.formatCurrency(element.TOTAL_TH)}
                    </Label>
                )
                }
            }
            else if(seltype === 2){
                if(element.TOTAL_XH_COST===0){
                    return (0)
                }
                else{
                    return ( 
                        <Label as='a' onClick={()=>this.getItems(element, seltype)}  color='blue' >
                            {Common.formatCurrency(element.TOTAL_XH_COST)}
                    </Label>
                )
                }
            }
        }
        else{
            return ('-')
        }
    }
    getSelName(seltype){
        if(seltype === 0){
            return '销售'
        }
        else if(seltype === 1){
            return '退货'
        }
        else if(seltype === 2){
            return '销毁'
        }
    }
    addDownloadButton(){
        const {menumstate} = this.context;
        if(menumstate.download){
            return (
                <Label as='a' size={'huge'} onClick={() => {
                    this.onDownload(-1)
                }

                }>
                    下载全部
                    <Icon name='download'/>
                </Label>
            )
        }
    }
    addDownloadButton2(element){
        const {menumstate} = this.context;
        if(menumstate.download){
            return (
                <Label onClick={()=>{
                    this.onDownload(element.SHOP_ID)

                }}>
                    <Icon name='download'></Icon>
                </Label>
            )
        }
    }
    render(){
        var rows=[]
        if (this.state!=null && this.state.selectobject !== null){
            this.state.selectobject.forEach(element => {
                var index = 0
                if(this.state.searchtext !== undefined){
                    index = (element.SHOP_NAME).indexOf(this.state.searchtext.toUpperCase())
                }
                if(index>=0){
                    rows.push(
                    <Table.Row key={element.SHOP_ID}>
                        <Table.Cell>{this.getRefFlg(element)}{element.SHOP_NAME}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.getNumber(element, 0)}</Table.Cell>
                        <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? Common.formatCurrency(element.TOTAL_XS_COST) : '-'}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.getNumber(element, 1)}</Table.Cell>
                        <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? Common.formatCurrency(element.TOTAL_TH_COST) : '-'}</Table.Cell>
                        <Table.Cell textAlign='right'>{this.getNumber(element, 2)}</Table.Cell>
                        <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? Common.formatCurrency(element.EMP_PRICE) : '-'}</Table.Cell>
                        <Table.Cell textAlign='right'>
                            <Label color={'red'} onClick={() => {


                                Common.sendMessage(Common.baseUrl + "/statistics/getshenpixiangxi"
                                    , "POST"
                                    , null
                                    , {
                                        ORDER_TIME:this.state.selectdate,
                                        SHOP_ID:element.SHOP_ID
                                    }
                                    , null
                                    , (e)=>{
                                        console.log('/statistics/getshenpixiangxi')
                                        this.setState({
                                            showXX:true,
                                            shopID:element.SHOP_ID,
                                            spInfos:e.data,
                                        })
                                    },null,
                                    this.context)
                            }}>
                                {element.DISP_STATE !== 0 ? Common.formatCurrency(element.TOTAL_XS - element.TOTAL_TH): '请刷新'}
                            </Label>
                            {this.addDownloadButton2(element)}
                        </Table.Cell>
                        <Table.Cell textAlign='right'>{this.getShijiRuZhang(element)}</Table.Cell>
                        <Table.Cell>{element.DISP_STATE !== 1 ? '未审批':'已审批'}</Table.Cell>
                        <Table.Cell>
                            {this.getButtons(element)}
                        </Table.Cell>
                    </Table.Row>
                    ) 
                }
                });
        }
        var itemrows=[]
        if(this.state.showset){
            var nkey = 0
            var total = 0.0
            this.state.modelinfo.items.forEach(element => {
                    var priceName = '成本价'
                    if(element.PRICE_SELECT === 0){
                        priceName = '零售价'
                    }
                    else if(element.PRICE_SELECT === 1){
                        priceName = '会员价'
                    }
                    else if(element.PRICE_SELECT === 2){
                        priceName = '团购价'
                    }
                    else if(element.PRICE_SELECT === 3){
                        priceName = '处理价'
                    }
                    total += (element.ITEM_PRICE * element.ITEM_NUMBER)
                    itemrows.push(
                    <Table.Row key = {nkey++}>
                        <Table.Cell >{nkey}</Table.Cell>
                        <Table.Cell >{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                        <Table.Cell >{element.ITEM_NAME}</Table.Cell>
                        <Table.Cell >{priceName}</Table.Cell>
                        <Table.Cell textAlign='right' >{Common.formatCurrency(element.ITEM_PRICE)}</Table.Cell>
                        <Table.Cell textAlign='right' >{element.ITEM_NUMBER}</Table.Cell>
                        <Table.Cell textAlign='right' >{Common.formatCurrency(element.ITEM_PRICE * element.ITEM_NUMBER)}</Table.Cell>
                    </Table.Row>
                        )
            })

           
        }

        return(
            <div style={{ minHeight:800}}>             
                <Grid columns='equal' >
                    <Grid.Row>
                        <Grid.Column width={8}><Header as='h3'>每日审批</Header></Grid.Column>
                        <Grid.Column width={8} textAlign='right' >
                        <Menu>
                            <Menu.Item>
                            <DatePicker dateFormat="yyyy-MM-dd"
                                            value={new Date(this.state === null ?
                                                (new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10) :
                                                this.state.selectdate)}
                                            selected={new Date(this.state === null ?
                                                (new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10) :
                                                this.state.selectdate)}
                                            onChange={(e)=>{this.dateChange(e)}}
                                            placeholder='Enter date'   showYearDropdown
                                    />
                            </Menu.Item>

                            <Menu.Item>
                                <Input icon='search' size='small' placeholder='Search...'
                                               onChange={(eX,f)=>{this.setState({searchtext:f.value})}} />
                            </Menu.Item>
                            <Menu.Item>
                                {this.addDownloadButton()}

                            </Menu.Item>
                        </Menu>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider horizontal>
                    <Header as='h4'>
                        <Icon name='bar chart' />
                        选择日期的店铺数据汇总
                    </Header>
                </Divider>
                <Table celled selectable style={{minHeight:'100%', height:'100%'}}>
                        <Table.Header  >
                        <Table.Row>
                            <Table.HeaderCell >店铺名称</Table.HeaderCell>
                            <Table.HeaderCell >销售金额</Table.HeaderCell>
                            <Table.HeaderCell >销售成本</Table.HeaderCell>
                            <Table.HeaderCell >退货金额</Table.HeaderCell>
                            <Table.HeaderCell >退货成本</Table.HeaderCell>
                            <Table.HeaderCell >销毁成本</Table.HeaderCell>
                            <Table.HeaderCell >提成金额</Table.HeaderCell>
                            <Table.HeaderCell >应收账款</Table.HeaderCell>
                            <Table.HeaderCell >实收账款</Table.HeaderCell>
                            <Table.HeaderCell >审批状态</Table.HeaderCell>
                            <Table.HeaderCell >操作</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body >
                        {rows}
                        </Table.Body>
                    </Table>
                <Modal open={this.state.showset}>
                        <Modal.Header>{'【' + this.state.modelinfo.date + ' 】店铺【' + this.state.modelinfo.shopname + '】当日的【' + this.getSelName(this.state.modelinfo.seltype) + '】'}
                            <ButtonGroup style={{position:'absolute',right:60}}>
                                <Button onClick={()=>this.setState({showset:false})} >
                                    关闭
                                </Button>
                            </ButtonGroup>
                        </Modal.Header>
                        <Modal.Content>
                            <Grid columns='equal'>
                                <Grid.Column>
                                <div  style={{height:  '75vh' , overflowY:'scroll' }}>
                                    <Table celled selectable>
                                        <Table.Header  >
                                            <Table.Row  >
                                                <Table.HeaderCell>序号</Table.HeaderCell>
                                                <Table.HeaderCell>商品ID</Table.HeaderCell>
                                                <Table.HeaderCell>商品名称</Table.HeaderCell>
                                                <Table.HeaderCell>价格类型</Table.HeaderCell>
                                                <Table.HeaderCell>{this.state.modelinfo.seltype === 2? '成本' : '单价'}</Table.HeaderCell>
                                                <Table.HeaderCell>销售数量</Table.HeaderCell>
                                                <Table.HeaderCell>小计</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body >
                                                {itemrows}
                                        </Table.Body>
                                        <Table.Footer fullWidth  >

                                        </Table.Footer>
                                    </Table>
                                    </div>
                                </Grid.Column>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {'合计' + (this.state.modelinfo.seltype === 2 ? '成本：' : '价格：') + Common.formatCurrency(total)}
                        </Modal.Actions>
                    </Modal>
                <ShenPiXiangXi showXX={this.state.showXX} setShowXX={this.setShowXX.bind(this)} shopID={this.state.shopID}
                               selDateTime={this.state.selDateTime} spInfos={this.state.spInfos}></ShenPiXiangXi>
            </div>
        )
    }
}
