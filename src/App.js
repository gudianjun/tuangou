import React from 'react';
import logo from './logo.svg';
import {BrowserRouter, Switch, Router, route, hashHistory, Link, Route, Redirect, withRouter} from 'react-router-dom'
import { useCookies, withCookies, Cookies  } from 'react-cookie';
import LoginForm from './component/LoginForm'
import MainForm from './component/MainForm'
import {MainContext} from './component/ChilentPage/ObjContext'
import Common from './common/common'
import LoaderExampleInline from './component/Loading'
class App extends React.Component{
  
  constructor(props){
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
    errorMessage:'',  // 错误消息
    items:[], // 商品信息
    cangkuInfo:{  // 仓库操作信息
      shopItems:[], // 仓库商品信息
      selectedShopid:-1, // 当前选择
      shopList:[],  // 移库仓库清单
      selectedShopid2:-1  // 移库目标仓库选择id
    },
    shoppingItems:[],
    setMainContext:(obj)=>{this.setMainContext(obj)},
    logout:()=>{
      // 登出操作，
      console.log("mainContext->logout")
      Common._setStorage("token", "");
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
    console.log("setMainContext")
    console.log(obj)
    this.mainContext = {...this.mainContext, ...obj}
    console.log(this.mainContext)
    this.setState({})
  }

  resetMainContext(obj){
    console.log("setMainContext")
    console.log(obj)
    this.mainContext = {...this.mainContext, ...obj}
    console.log(this.mainContext)
    this.setState({})
  }

  /*componentDidMount(){
    //const { cookies } = this.props;
    //this.setState = {
    //  name: cookies.get('name') || 'Ben'
    //};

    
  }*/
  render(){
    return (
      <div className="pace  pace-inactive">
        <MainContext.Provider value = {this.mainContext}>
          <Switch>
            <Route exact path='/' component={LoginForm}></Route>
            <Route path='/loading' component={LoaderExampleInline}></Route>
            <Route path='/login' component={LoginForm}></Route>
            <Route path='/main' component={MainForm}></Route>
            {/*<Redirect from="*" to="/login"></Redirect>*/}
          </Switch>
        </MainContext.Provider>
      </div>
    )
  }

  y
}

export default withCookies(withRouter(App));
