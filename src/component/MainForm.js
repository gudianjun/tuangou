import React, { Component } from 'react';
import {Button, Confirm, Message, Segment, Menu, Icon, Grid, ButtonGroup} from 'semantic-ui-react'
import {Switch, Route, withRouter} from 'react-router-dom'
import Common from "../common/common"
import MySidebar from "./MySidebar"
import XiaoShou from "./ChilentPage/XiaoShou"
import BaoFei from "./ChilentPage/BaoFei"
import DangRiXiaoShouJiLu from "./ChilentPage/DangRiXiaoShouJiLu"

import TuiHuo       from "./ChilentPage/TuiHuo"
import CangKuGuanLi from "./ChilentPage/CangKuGuanLi"
import HuiYuanGuanLi from "./ChilentPage/HuiYuanGuanLi"

import DianPuGuanLi from "./ChilentPage/DianPuGuanLi"
import YuanGongGuanLi from "./ChilentPage/YuanGongGuanLi"
import KuCunZongLan from "./ChilentPage/KuCunZongLan"
import MemKuCunZongLan from "./ChilentPage/MemKuCunZongLan"

import ShangPinGuanLi from "./ChilentPage/ShangPinGuanLi"
import TongJiBaoBiao from "./ChilentPage/TongJiBaoBiao"
import MeiRiShenPi from "./ChilentPage/MeiRiShenPi"
import Role from "../pages/Role";

import { MainContext} from './ChilentPage/ObjContext'
import CaiGouGuanLi from './ChilentPage/CaiGouGuanLi';
import ShenPiXiangXi from "../pages/ShenPiXiangXi";


class MainForm extends Component{
  constructor(props, context){
      super(props)
      this.state={
        activeItem: 'bio',
        ConfirmTitle:context.confirmInfo.content,
        open:context.confirmInfo.open,
        showMsg:true,
          showXX:false,
          setShowXX:this.setShowXX,
          shopID:-1,
          spInfos:{}
    }
        // 请求登录检查，如果失败了，则跳转到login画面
        Common.sendMessage(Common.baseUrl + "/login/checklogin"
        , "POST"
        , null
        , null
        , null
        , (e)=>{
            if(e.error_code === 0){

                const {setMainContext} = this.context
                setMainContext({
                    rolemodels:e.data.rolemodels,
                })

                console.log("logining 状态")
                if(context.shops.length === 0){
                    this.props.history.push("/loading")
                }
                else{
                    // 在这里启动定时器，来刷新消息
                    context.timeinterval = setInterval(() => {
                        Common.sendMessage(Common.baseUrl + "/confirm/getcount"
                        , "POST"
                        , null
                        , null
                        , null
                        , (e)=>{
                            // 读取确认信息列表
                            context.setMainContext({messagecount:e.data})
                        },null,
                        this.context)
                    }, 100000);  // 每分钟刷新一下次
                    // 跳转到主画面
                    const {checkRole} = context;
                    context.setMainContext({shoptype:e.data.shoptype})
                    checkRole()
                    if(this.context.rolemodels !== undefined && this.context.rolemodels.length > 0){
                        const title =  ""
                        if(this.context.rolemodels !== undefined) {
                            let init = true
                            this.context.rolemodels.forEach(element=> {
                                if (element.ALLOW_FLG === 1 && init) {
                                    this.setState({},()=>this.props.history.push("/main/"
                                        + element.MODEL_TITLE))
                                    init = false
                                }
                            })
                        }

                        console.log(this.context.rolemodels[0].MODEL_TITLE)
                    }

                    // if(e.data.shoptype === 0) // 商铺
                    // {
                    //     context.shoptype = e.data.shoptype
                    //     this.setState({},()=>this.props.history.push("/main/xiaoshou"))
                    // }
                    // else if(e.data.shoptype === 1) // 仓库
                    // {
                    //     context.shoptype = e.data.shoptype
                    //     this.setState({},()=>this.props.history.push("/main/kucunzonglan"))
                    // }
                    // else{
                    //     // 管理员
                    //     context.shoptype = e.data.shoptype
                    //     this.setState({},()=>this.props.history.push("/main/tongjibaobiao"))
                    // }
                }
            }
            else{
                this.props.history.push("/login")
            }
        }
        ,(e)=>{
            this.props.history.push("/login")
        },
        context)
    // 设定消息对话框
  }
  static contextType = MainContext;
  static getDerivedStateFromProps(props, state){
    return {
    }
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  childrenRoute = (name)=>{
    console.log("childrenRoute " + name)
    this.props.history.push("/main/" + name)
    // 显示标题
  }
    setShowXX(show){
        this.setState({showXX:show})
    }
  getTitle(){
    const {errorMessage} = this.context
    if(errorMessage.length > 0){
        setTimeout(()=>{
            this.context.errorMessage=''
            this.setState({
                showMsg:false
            })
        }, 5000)
    }
    return (
        <Message style={{ marginLeft:"100px" , visibility: errorMessage.length > 0 ? 'visible' : 'hidden '}} attached='bottom' warning>
                                        <Icon name='help' />
                                        {errorMessage}
                                        </Message>
        )
  }
  onLogout(){
      // 关闭定时器
    clearInterval(this.context.timeinterval)

    Common.sendMessage(Common.baseUrl + "/login/logout"
    , "POST"
    , null
    , null
    , null
    , (e)=>{
        // 清空缓存数据
        // 写入缓存
        Common._clear()
        this.props.history.push("/login")
    },(e)=>{
        this.props.history.push("/loading")
    },
    this.context)
  }
  getRoute(){
      const {menumstate} = this.context;
     if(this.context.shoptype !== -1){
         return(
             <Switch>
                 {menumstate.xiaoshou ? (<Route path='/main/xiaoshou' component={XiaoShou}></Route>) : null}
                 {menumstate.baofei ? (<Route path='/main/baofei' component={BaoFei}></Route>) : null}
                 {menumstate.dangrixiaoshoujilu ? (<Route path='/main/dangrixiaoshoujilu' component={DangRiXiaoShouJiLu}></Route>) : null}
                 {menumstate.tuihuo ? (<Route path='/main/tuihuo' component={TuiHuo}></Route>) : null}
                 {menumstate.huiyuanguanli ? (<Route path='/main/huiyuanguanli' component={HuiYuanGuanLi}></Route>) : null}
                 {menumstate.memkucunzonglan ? (<Route path='/main/memkucunzonglan' component={MemKuCunZongLan}></Route>) : null}
                 {menumstate.caigouguanli ? (<Route path='/main/caigouguanli' component={CaiGouGuanLi}></Route>) : null}
                 {menumstate.kucunzonglan ? (<Route path='/main/kucunzonglan' component={KuCunZongLan}></Route>) : null}
                 {menumstate.cangkuguanli ? (<Route path='/main/cangkuguanli' component={CangKuGuanLi}></Route>) : null}
                 {menumstate.dianpuguanli ? (<Route path='/main/dianpuguanli' component={DianPuGuanLi}></Route>) : null}
                 {menumstate.yuangongguanli ? (<Route path='/main/yuangongguanli' component={YuanGongGuanLi}></Route>) : null}
                 {menumstate.shangpinguanli ? (<Route path='/main/shangpinguanli' component={ShangPinGuanLi}></Route>) : null}
                 {menumstate.meirishenpi ? (<Route path='/main/meirishenpi' component={MeiRiShenPi}></Route>) : null}
                 {menumstate.tongjibaobiao ? (<Route path='/main/tongjibaobiao' component={TongJiBaoBiao}></Route>) : null}
                 {(menumstate.quanxianguanli || this.context.shoptype === 99) ? (<Route path='/main/quanxianguanli' component={Role}></Route>) : null}
             </Switch>
         )
     }
  }
  addYingYeGaiKuang(){
      console.log('addYingYeGaiKuang')
      if(this.context.shoptype !== -1 && this.context.shoptype === 0) {
          return (
              <Button primary size='mini' as='a'  onClick={()=>
                  Common.sendMessage(Common.baseUrl + "/statistics/getshenpixiangxi"
                      , "POST"
                      , null
                      , {

                      }
                      , null
                      , (e)=>{
                          console.log('/statistics/getshenpixiangxi')
                          this.setState({
                              showXX:true,
                              shopID:e.data['SHOP_ID'],
                              spInfos:e.data,
                          })
                      },null,
                      this.context)
              }>
                  营业概况
              </Button>
          )
      }

  }
  getMessageCount(){
      if(this.context.messagecount > 0){
          return( <Button onClick={()=>{this.props.history.push("/main/caigouguanli")}}
            color='red'
            content=''
            icon='bullhorn'
            label={{ basic: true, color: 'red', pointing: 'left', content: this.context.messagecount.toString() }}
            />
            )
      }
  }
  render(){
    var fixed = true
    document.title = 'GL团购系统—' + Common._loadStorage('shopname')
    return ( 
        <MainContext.Consumer>{
            ({confirmInfo, items})=>(
        <div > 

                <MySidebar history={this.props.history} childrenRoute={this.childrenRoute}></MySidebar>
                <Grid>
                    <Grid.Row>
                    <Segment
                    inverted
                    textAlign='center'
                    style={{ minHeight: 66, padding: '1em 0em' }}
                    vertical
                >
                    <Menu 
                        fixed={fixed ? 'top' : null}
                        inverted={!fixed}
                        pointing={!fixed}
                        secondary={!fixed}
                        size='large'
                        >
                    
                        {this.getTitle()}
                        <Menu.Item position='right'>
                       
                            {this.getMessageCount()}
                            <ButtonGroup>
                                {this.addYingYeGaiKuang()}
                                <Button size='mini' as='a' onClick={()=>{this.onLogout()}} >
                                    退出
                                </Button>
                            </ButtonGroup>
                        </Menu.Item>
                    
                    </Menu>

                    </Segment>
                    </Grid.Row>
                </Grid>
                
                <Grid.Row >
                {/* <div className="pusher pushable">
                    <div className="ui pusher" >
                        <div className="mainWrap navslide"  style={{ marginLeft:"110px", minWidth:"400px", overflow:"inherit"}}> */}
                        <div style={{ marginLeft:"110px"}}>
                            <Confirm
                                open={confirmInfo.open}
                                content={confirmInfo.content}
                                cancelButton='取消'
                                confirmButton="确定"
                                onCancel={()=>confirmInfo.onCancel()}
                                onConfirm={()=>confirmInfo.onConfirm()}
                            />
                            {this.getRoute()}
                        </div>
                    </Grid.Row>

            <ShenPiXiangXi showXX={this.state.showXX} setShowXX={this.setShowXX.bind(this)} shopID={this.state.shopID}
                           selDateTime={new Date()} spInfos={this.state.spInfos}></ShenPiXiangXi>
                </div>
        )}
         </MainContext.Consumer>
      )
  }
}

export default withRouter(MainForm);