import React, { Component } from 'react';
import {Divider, Button, Form, Grid, Header, Image, Message, Segment, Dropdown, Popup, Sidebar, Menu, Icon, Container } from 'semantic-ui-react'
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

import ZhuanKuGuanLi from "./ChilentPage/ZhuanKuGuanLi"
import ShangPinGuanLi from "./ChilentPage/ShangPinGuanLi"
import TongJiBaoBiao from "./ChilentPage/TongJiBaoBiao"


class MainForm extends Component{
  constructor(props){
      super(props)
      this.state={activeItem: 'bio'}
       // 请求登录检查，如果失败了，则跳转到login画面
        Common.sendMessage(Common.baseUrl + "/login/checklogin"
        , "POST"
        , null
        , null
        , null
        , (e)=>{
        if(e.error_code === 0){
            console.log("logining 状态")
            //this.props.history.push("/main/xiaoshou")
            this.setState({})
        }
        else{
            this.props.history.push("/login")
        }
        // 跳转到主画面
        
        }
        ,(e)=>{
            console.log("login 报错了")
        })
    console.log("MainForm props")
    console.log(this.props)    
  }
  static getDerivedStateFromProps(props, state){
    console.log("-----------------getDerivedStateFromProps")
    return null
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  childrenRoute = (name)=>{
      console.log("childrenRoute " + name)
        this.props.history.push("/main/" + name)
  }
  render(){
     
    return ( 
        <div>
            <MySidebar childrenRoute={this.childrenRoute}></MySidebar>
            <div className="pusher pushable">
                <div className="ui pusher" >
                    <div className="navslide navwrap" >{/* 上边条 */}
                        <div className="ui menu icon borderless grid">
                            <div className="right menu">
                                <Form.Button color='teal' fluid='true' large='true'>
                                    退出
                                </Form.Button>
                        
                            </div>
                        </div>
                    </div>
                    <div className="mainWrap navslide"  style={{ marginLeft:"250px", minWidth:"550px", overflow:"inherit"}}>
                    <Switch>
                        <Route exact path='/main/xiaoshou' component={XiaoShou}></Route>
                        <Route path='/main/baofei' component={BaoFei}></Route>
                        <Route path='/main/dangrixiaoshoujilu' component={DangRiXiaoShouJiLu}></Route>

                        <Route path='/main/tuihuo' component={TuiHuo}></Route>
                        <Route path='/main/cangkuguanli' component={CangKuGuanLi}></Route>
                        <Route path='/main/huiyuanguanli' component={HuiYuanGuanLi}></Route>

                        <Route path='/main/huiyuancunhuoguanli' component={HuiYuanCunHuoGuanLi}></Route>
                        <Route path='/main/dianpuguanli' component={DianPuGuanLi}></Route>
                        <Route path='/main/yuangongguanli' component={YuanGongGuanLi}></Route>

                        <Route path='/main/xitongsheding' component={XiTongSheDing}></Route>
                        <Route path='/main/caigouguanli' component={CaiGouGuanLi}></Route>
                        <Route path='/main/kucunzonglan' component={KuCunZongLan}></Route>

                        <Route path='/main/zhuankuguanli' component={ZhuanKuGuanLi}></Route>
                        <Route path='/main/shangpinguanli' component={ShangPinGuanLi}></Route>
                        <Route path='/main/tongjibaobiao' component={TongJiBaoBiao}></Route>
                        {/*<Redirect from="*" to="/login"></Redirect>*/}
                    </Switch>
                    </div>
                </div>
            </div>
        </div>
      )
  }
}

export default withRouter(MainForm);