import React, { Component } from 'react';
import {Divider, Button, Form, Confirm, Grid, Header, Image, Message, Segment, Dropdown, Popup, Sidebar, Menu, Icon, Container } from 'semantic-ui-react'
import {BrowserRouter, Switch, Router, route, hashHistory, Link, Route, NavLink, withRouter} from 'react-router-dom'
import logo from "./logo.png"
import Common from "../common/common"
import MySidebar from "./MySidebar"
import XiaoShou from "./ChilentPage/XiaoShou"
import BaoFei from "./ChilentPage/BaoFei"
import DangRiXiaoShouJiLu from "./ChilentPage/DangRiXiaoShouJiLu"

import TuiHuo       from "./ChilentPage/TuiHuo"
import CangKuGuanLi from "./ChilentPage/CangKuGuanLi"
import HuiYuanGuanLi from "./ChilentPage/HuiYuanGuanLi"

import HuiYuanCunHuoGuanLi from "./ChilentPage/HuiYuanCunHuoGuanLi"
import DianPuGuanLi from "./ChilentPage/DianPuGuanLi"
import YuanGongGuanLi from "./ChilentPage/YuanGongGuanLi"

import XiTongSheDing from "./ChilentPage/XiTongSheDing"
import CaiGouGuanLi from "./ChilentPage/CaiGouGuanLi"
import KuCunZongLan from "./ChilentPage/KuCunZongLan"
import MemKuCunZongLan from "./ChilentPage/MemKuCunZongLan"

import ShangPinGuanLi from "./ChilentPage/ShangPinGuanLi"
import TongJiBaoBiao from "./ChilentPage/TongJiBaoBiao"
import MeiRiShenPi from "./ChilentPage/MeiRiShenPi"

import { MainContext} from './ChilentPage/ObjContext'

class MainForm extends Component{
  constructor(props, context){
      super(props)
      this.state={
        activeItem: 'bio',
        ConfirmTitle:context.confirmInfo.content,
        open:context.confirmInfo.open,
        showMsg:true
    }
        // 请求登录检查，如果失败了，则跳转到login画面
        Common.sendMessage(Common.baseUrl + "/login/checklogin"
        , "POST"
        , null
        , null
        , null
        , (e)=>{
            if(e.error_code === 0){
                console.log("logining 状态")
                if(context.shops.length === 0){
                    this.props.history.push("/loading")
                }
                else{
                    // 跳转到主画面
                    if(e.data.shoptype === 0) // 商铺
                    {
                        context.shoptype = e.data.shoptype
                        this.setState({},()=>this.props.history.push("/main/xiaoshou"))
                    }
                    else if(e.data.shoptype === 1) // 仓库
                    {
                        context.shoptype = e.data.shoptype
                        this.setState({},()=>this.props.history.push("/main/cangkuguanli"))
                    }
                    else{
                        // 管理员
                        context.shoptype = e.data.shoptype
                        this.setState({},()=>this.props.history.push("/main/tongjibaobiao"))
                    }
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
    console.log("-----------------getDerivedStateFromProps")
    return {
    }
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  childrenRoute = (name)=>{
    console.log("childrenRoute " + name)
    this.props.history.push("/main/" + name)
    // 显示标题
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
     if(this.context.shoptype !== -1){
        if(this.context.shoptype === 0)
        {
         return(
                <Switch>
                            <Route exact path='/main/xiaoshou' component={XiaoShou}></Route>
                            <Route path='/main/baofei' component={BaoFei}></Route>
                            <Route path='/main/dangrixiaoshoujilu' component={DangRiXiaoShouJiLu}></Route>
                            <Route path='/main/tuihuo' component={TuiHuo}></Route>
                            <Route path='/main/huiyuanguanli' component={HuiYuanGuanLi}></Route>
                    </Switch>
                )
         }
         else if(this.context.shoptype === 1){
            return(
                <Switch>
                            <Route exact path='/main/cangkuguanli' component={CangKuGuanLi}></Route>
                            <Route path='/main/kucunzonglan' component={KuCunZongLan}></Route>
                            <Route path='/main/memkucunzonglan' component={MemKuCunZongLan}></Route>
                </Switch>
                )
         }
         else if(this.context.shoptype === 99){
            return(
                <Switch>
                            <Route exact path='/main/dangrixiaoshoujilu' component={DangRiXiaoShouJiLu}></Route>
                            <Route path='/main/cangkuguanli' component={CangKuGuanLi}></Route>
                            <Route path='/main/dianpuguanli' component={DianPuGuanLi}></Route>
                            <Route path='/main/yuangongguanli' component={YuanGongGuanLi}></Route>
                            <Route path='/main/kucunzonglan' component={KuCunZongLan}></Route>
                            <Route path='/main/memkucunzonglan' component={MemKuCunZongLan}></Route>
                            <Route path='/main/shangpinguanli' component={ShangPinGuanLi}></Route>
                            <Route path='/main/meirishenpi' component={MeiRiShenPi}></Route>
                            <Route path='/main/tongjibaobiao' component={TongJiBaoBiao}></Route>
                </Switch>
                )
         }
     }
  }
  render(){
    var fixed = true
    document.title = 'GL团购系统—' + Common._loadStorage('shopname')
    return ( 
        <MainContext.Consumer>{
            ({confirmInfo, items})=>(
        <div>
           
                <MySidebar childrenRoute={this.childrenRoute}></MySidebar>
               
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
                            <Button size='mini' as='a' onClick={()=>{this.onLogout()}} >
                                退出
                            </Button>
                        </Menu.Item>
                    
                    </Menu>

                </Segment>

                <div className="pusher pushable">
                    <div className="ui pusher" >
                        <div className="mainWrap navslide"  style={{ marginLeft:"110px", minWidth:"400px", overflow:"inherit"}}>
                        {/* 设定消息对话框 */}
                        <Confirm
                            open={confirmInfo.open}
                            content={confirmInfo.content}
                            cancelButton='取消'
                            confirmButton="确定"
                            onCancel={()=>confirmInfo.onCancel()}
                            onConfirm={()=>confirmInfo.onConfirm()}
                            />
                            {this.getRoute()}
                        {/* <Switch>
                            <Route exact path='/main/xiaoshou' component={XiaoShou}></Route>
                            <Route path='/main/baofei' component={BaoFei}></Route>
                            <Route path='/main/dangrixiaoshoujilu' component={DangRiXiaoShouJiLu}></Route>

                            <Route path='/main/tuihuo' component={TuiHuo}></Route>
                            <Route path='/main/cangkuguanli' component={CangKuGuanLi}></Route>
                            <Route path='/main/huiyuanguanli' component={HuiYuanGuanLi}></Route>

                            <Route path='/main/huiyuancunhuoguanli' component={HuiYuanCunHuoGuanLi}></Route>
                            <Route path='/main/dianpuguanli' component={DianPuGuanLi}></Route>
                            <Route path='/main/yuangongguanli' component={YuanGongGuanLi}></Route>

                      
                            <Route path='/main/kucunzonglan' component={KuCunZongLan}></Route>
                            <Route path='/main/memkucunzonglan' component={MemKuCunZongLan}></Route>

                            <Route path='/main/shangpinguanli' component={ShangPinGuanLi}></Route>
                            <Route path='/main/meirishenpi' component={MeiRiShenPi}></Route>
                            <Route path='/main/tongjibaobiao' component={TongJiBaoBiao}></Route>
          
                        </Switch> */}
                        </div>
                    </div>
                </div>
                
                
           
        </div>
        )}
         </MainContext.Consumer>
      )
  }
}

export default withRouter(MainForm);