import React,{Component} from "react"
import { Menu, Grid, Header, Tab, Icon, Divider, Dropdown } from "semantic-ui-react"
import SSxiangxi from './statistics/SSxiangxi'
import { MainContext} from './ObjContext'
import DatePicker from "react-datepicker";
import PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";
import KCHuiZong from './statistics/KCHuiZong'
import DDHuiZong from './statistics/DDHuiZong'
import Common from "../../common/common"
// 当日销售合计
class XiaoShouJiLuTab extends Component{
    constructor(props, context){
        super(props)
        this.state = {
            
        }
    }
    static propTypes = {
        selectdate:PropTypes.string,
        SHOP_ID:PropTypes.number,
        onTabChange:PropTypes.func,
        datas:PropTypes.array,
        page_index:PropTypes.number,
        allpage:PropTypes.number,
        onPageChange:PropTypes.func
    }
    static defaultProps = {
        selectdate:(new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10),
        SHOP_ID:-1
    }

    static contextType = MainContext;

    panes = [
        {
          menuItem: { key: 'huizong', icon: 'users', content: '当日销售汇总' },
          render: () => <Tab.Pane><SSxiangxi datas={this.props.datas}></SSxiangxi></Tab.Pane>,
        },
        {
            menuItem: { key: 'kucun', icon: 'users', content: '当日库存汇总' },
            render: () => <Tab.Pane><KCHuiZong datas={this.props.datas}></KCHuiZong></Tab.Pane>,
        },
        {
            menuItem: { key: 'orderlist', icon: 'users', content: '当日订单总览' },
            render: () => <Tab.Pane><DDHuiZong 
            onPageChange={(e)=>{this.props.onPageChange(e)}}
            page_index={this.props.page_index} allpage={this.props.allpage} datas={this.props.datas} ></DDHuiZong></Tab.Pane>,
        },
    ]
     
    onTabChange(e, f){
        console.log(f)
        this.props.onTabChange(f.activeIndex)
    }
    render(){
        return(
            <div>
                <Tab onTabChange={(e, f)=>this.onTabChange(e, f)} panes={this.panes} />
            </div>
        )
    }
}

export default class DangRiXiaoShouJiLu extends Component{

    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state={
            selectdate:(new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10),
            Shops:context.shops,
            selectType:0,    // 0: 订单合计，1：仓库概况：2：订单汇总
            datas:[],    // 查询结果
            page_index:1,
            page_size:8,
            allpage:0,
            shoptype:context.shoptype
        }

       this.SHOP_ID = -1
    }
    getitemsDDHuiZong(selecttype){
        if(this.SHOP_ID === -1){return}
        Common.sendMessage(Common.baseUrl + "/statistics/ddhuizong"
            , "POST"
            , null
            , {	page_index:this.state.page_index,
                page_size:this.state.page_size,
                SHOP_ID:this.SHOP_ID,
                ORDER_TIME: this.state.selectdate,
                selecttype:selecttype
                }
            , null
            , (e)=>{
                if(selecttype===0){
                    this.setState({
                        datas:e.data
                    })
                }
                else if (selecttype===1){
                    this.setState({
                        datas:e.data
                    })
                }
                else if (selecttype===2){
                    this.setState({
                        datas:e.data.msg,
                        page_index:e.data.page_index,
                        allpage:e.data.allpage
                    })
                }
                console.log(e)
            },(e)=>{
                const {setMainContext} = this.context
                setMainContext({
                    errorMessage:e
                })
            },
            this.context)
    }
    static getDerivedStateFromProps(nexProps, prevState){
        if(prevState.shoptype === 0){
           return {
                Shops:[{
                    key:0,
                    text:Common._loadStorage('shopname'),
                    value:0
                }]
            }
        }
        return null
    }

    dateChange( date){
        this.setState({
            selectdate:date.toISOString().substring(0, 10),
            page_index:1
        }, ()=>{
            this.selectTable()
        });
      };
    tabChange(e){
        // 查询标签页面变更
        this.setState({
            selectType:e,
            page_index:1,
            datas:[]
        }, ()=>{
            this.selectTable()
        })
        
    }
    pageChange(e){
        // 页面变更
        console.log(e)
        this.setState({
            page_index:e
        }, ()=>{
            this.selectTable()
        })
    }
    // 查询表数据
    selectTable(){
        this.getitemsDDHuiZong(this.state.selectType)
    }
    shopSelectChange(e, f){
        this.SHOP_ID = f.value
        this.setState({
             page_index:1
        }, ()=>{
            this.selectTable()
        })
        
    }
    render(){
        return(
            <div style={{ minHeight:800}}>             
                <Grid columns='equal' >
                    <Grid.Row>
                        <Grid.Column width={8}><Header as='h3'>每日统计</Header></Grid.Column>
                        
                        <Grid.Column width={8} textAlign='right' >
                        <Menu>
                            <Menu.Item>
                            <DatePicker dateFormat="yyyy-MM-dd"
                                        value={new Date(this.state.selectdate)}
                                        selected={new Date(this.state.selectdate)}
                                        onChange={(e)=>{this.dateChange(e)}}
                                        placeholder='Enter date'   showYearDropdown
                                /> 
                                </Menu.Item><Menu.Item>
                            <Dropdown options={this.state.Shops}   onChange={(e, f)=>this.shopSelectChange(e, f)}    placeholder='请选择一个店铺'></Dropdown> 
                            </Menu.Item>
                        </Menu>
                        </Grid.Column>
                    </Grid.Row>
                   
                </Grid>
                <Divider horizontal>
                <Header as='h4'>
                    <Icon name='bar chart' />
                    Specifications
                </Header>
                </Divider>
                <XiaoShouJiLuTab page_index={this.state.page_index} allpage={this.state.allpage}
                    datas={this.state.datas} 
                    onTabChange={(e)=>{this.tabChange(e)}} 
                    onPageChange={(e)=>{this.pageChange(e)}}
                ></XiaoShouJiLuTab>
            </div>
        )
    }
}
