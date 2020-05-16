import React,{Component} from "react"
import { Menu , Grid, Dropdown,Label, Divider, Header, Icon, Table, Button, BUttonG, Input, ButtonGroup} from "semantic-ui-react"
import ShopEdit from './SubItem/ShopEdit'
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import PropTypes, { element, array, checkPropTypes } from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";

import {ShoppingItem, MainContext} from './ObjContext'
import Common from "../../common/common"

export default class MeiRiShenPi extends Component{
    static contextType = MainContext;
    constructor(props, context){
        super(props)
        this.state = {
            selectobject:[],
            showset:false,
            selectdate:(new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10)
        }
        this.getInitData()
     
    }
    dateChange(date){
        this.setState({
            selectdate:date.toISOString().substring(0, 10)
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
               selectobject:e.data,
               showset:true})
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
        const reg = /^\d+([.]\d{1,2})?$/;		// 以数字1开头，任意数字结尾，且中间出现零个或多个数字
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
            return (<Input fluid value={item.SHIJI_RUZHANG} onChange={(e, f)=>this.onEditItem(item, f.value)}></Input>)
        } 
    }
    render(){
        var rows=[]
        if (this.state!=null && this.state.selectobject !== null){
            this.state.selectobject.forEach(element => {
                rows.push(
                    <Table.Row>
                    <Table.Cell>{this.getRefFlg(element)}{element.SHOP_NAME}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? element.TOTAL_XS : '-'}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? element.TOTAL_XS_COST : '-'}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? element.TOTAL_TH : '-'}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? element.TOTAL_TH_COST : '-'}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? element.TOTAL_XH_COST : '-'}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.DISP_STATE !== 0 ? element.EMP_PRICE : '-'}</Table.Cell>
                    <Table.Cell textAlign='right'><Label color={'red'}>{element.DISP_STATE !== 0 ? element.TOTAL_XS - element.TOTAL_TH : '请刷新'}</Label></Table.Cell>
                    <Table.Cell textAlign='right'>{this.getShijiRuZhang(element)}</Table.Cell>
                    <Table.Cell>{element.DISP_STATE !== 1 ? '未审批':'已审批'}</Table.Cell>
                    <Table.Cell>
                        {this.getButtons(element)}
                    </Table.Cell>
                </Table.Row>
                ) 
                });
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
                                        value={new Date(this.state === null ? (new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10) : this.state.selectdate)}
                                        selected={new Date(this.state === null ? (new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10) : this.state.selectdate)}
                                        onChange={(e)=>{this.dateChange(e)}}
                                        placeholder='Enter date'   showYearDropdown
                                /> 
                            </Menu.Item><Menu.Item>
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
                        {rows}
                    <Table.Body >
                   
                    </Table.Body>
                </Table>
        </div>
        )
    }
}
