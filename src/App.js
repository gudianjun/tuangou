import React from 'react';
import {Switch, Route, withRouter} from 'react-router-dom'
import { withCookies  } from 'react-cookie';
import LoginForm from './component/LoginForm'
import MainForm from './component/MainForm'

import {MainContext} from './component/ChilentPage/ObjContext'
import Common from './common/common'
import * as commonConst from './common/commonConst'
import LoaderExampleInline from './component/Loading'
import {array, element} from "prop-types";
class App extends React.Component{
  
  constructor(props, context){
    super(props)
    console.log(this.props)
    const { cookies } = this.props;
    cookies.set('name', "dean", { path: '/' });
    Common._setStorage('value', "bbbbb");
    
    console.log("App props")
    console.log(this.props)
    // 读取存储库中的数据判断是否登陆中
    const token = Common._getSendToken();
    console.log(token)
    if(token.length !== 0){
      // 进入主画面
      this.props.history.push("/loading")
    }
    else{
      // 进入login画面
      this.props.history.push("/login")
    }
    
  }
  // 系统总上下文
  mainContext = {

    messagecount:0, // 转库采购消息数量
    timeinterval:-1,  // 定时器句柄
    shoptype:-1, // 默认为没有类型
    errorMessage:'',  // 错误消息
    items:[], // 商品信息
    allshops:[], // 所有的店铺信息
    shops:[], // 只有商店的清单。排除仓库和管理者
    cangkuInfo:{  // 仓库操作信息
      shopItems:[], // 仓库商品信息
      selectedShopid:-1, // 当前选择
      shopList:[],  // 移库仓库清单
      selectedShopid2:-1  // 移库目标仓库选择id
    },
    menumstate: {
      xiaoshou: false,
      baofei: false,
      dangrixiaoshoujilu: false,
      tuihuo: false,
      huiyuanguanli : false,
      memkucunzonglan : false,
      caigouguanli : false,
      kucunzonglan : false,
      cangkuguanli : false,
      dianpuguanli : false,
      yuangongguanli : false,
      shangpinguanli : false,
      meirishenpi : false,
      tongjibaobiao : false,
      quanxianguanli : false,
      download : false,
    },
    shoppingItems:[],
    setMainContext:(obj)=>{this.setMainContext(obj)},
    checkRole:(modelName)=>{this.checkRole(modelName)},
    logout:()=>{
      // 登出操作，
      console.log("mainContext->logout")
      Common._clear();
      this.props.history.push("/login")
    },
    confirmInfo: {
            open:false,
            content:'你确定要这么做吗',
            callback:(isCon)=>{}, // 回调方法
            onCancel:()=>{this.open=false;},
            onConfirm:()=>{this.open=false;},
            Show:(cont)=>{
                this.context = cont;
                this.open=true;
            }
        }
    }


  setMainContext(obj){
    this.mainContext = {...this.mainContext, ...obj}
    this.setState({})
  }

  checkRole(modelName){
    if(this.mainContext.rolemodels !== undefined) {
      this.mainContext.rolemodels.forEach(element=>{
        if(element.ALLOW_FLG === 1) {
          this.mainContext.menumstate[element.MODEL_TITLE] = true
        }
        else{
          this.mainContext.menumstate[element.MODEL_TITLE] = false
        }
      })
      return
    }

      this.mainContext.menumstate.forEach(element=>{element=false})

  }

  resetMainContext(obj){
    console.log("setMainContext")
    console.log(obj)
    this.mainContext = {...this.mainContext, ...obj}
    console.log(this.mainContext)
    this.setState({})
  }
  //  className="pace  pace-inactive" 
  render(){
    
    return (
      <div>
        <MainContext.Provider value = {this.mainContext}>
          <Switch>
            <Route exact path='/' component={MainForm}></Route>
            <Route path='/loading' component={LoaderExampleInline}></Route>
            <Route path='/login' component={LoginForm}></Route>
            <Route path='/main' component={MainForm}></Route>
          </Switch>
        </MainContext.Provider>
      </div>
    )
  }

  y
}

export default withCookies(withRouter(App));
