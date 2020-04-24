import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Dropdown, Popup } from 'semantic-ui-react'
import {BrowserRouter, Switch, Router, route, hashHistory, Link, Route, NavLink} from 'react-router-dom'
import logo from "./logo.png"
import Common from "../common/common"

class LoginForm extends Component{
  constructor(props){
    console.log("LoginForm初始化")
    super(props);
    this.state={shopList:[], pwd:"", selectShop:null, pwdShowInfo:"密码", shopShowInfo:"选择你的店铺"};
    // 请求登录列表
    Common.sendMessage(Common.baseUrl + "/login/getshops", "GET", {abc:"abcd"}
    , {a:1,b:2,c:3}, {"auth111":"dddddddddddddddddddddddddddd"}
    , (e)=>{
      console.log("回调。。。。。。。。。。。。。。。。。。。。")
      console.log(e)
      var arrayObj = new Array();
      e.data.forEach(element => {
        arrayObj.push({
          key: element.SHOP_ID,
          text: element.SHOP_NAME,
          value: element.SHOP_ID,
          image: { avatar: true, src: logo }
        });
      });
      
      this.setState({
        shopList:arrayObj
      })
    })
    console.log(this.state.shopList)
  }
  static getDerivedStateFromProps(props, state){
    console.log("-----------------getDerivedStateFromProps")
    return null
  }

  // 登录操作
  onLogin(){
    if(!isNaN(this.state.selectShop)){
      this.setState({
        shopShowInfo:"请选择一个店铺进行登录"
      })
      return;
    }
    if(this.state.pwd.length === 0)
    {
      this.setState({
        pwdShowInfo:"请输入登录密码"
      })
      return;
    }
    
    console.log("发送login请求")
    Common.sendMessage(Common.baseUrl + "/login/accountlogin", "POST", null
    , {
      shopid:this.state.selectShop.value, 
      pwd:this.state.pwd
    }, null
    , (e)=>{
      console.log("login 成功")
      console.log(e)
      Common._setStorage("shopname", e.data.name)
      Common._setStorage("token", e.data.token)

      // 跳转到主画面
      this.props.history.push("/main")
    })

  }
    render(){
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Image src={logo} /> 登陆到你的账号
                </Header>
                <Form size='large'>
                    <Segment stacked>
                    <Form.Dropdown placeholder={this.state.shopShowInfo}  fluid  selection  options={this.state.shopList} 
                    onChange={(e, f)=>{this.setState({selectShop:this.state.shopList.find(element=>element.value === f.value)})}}/>
                    <Form.Input
                        maxLength='20'
                        fluid
                        icon='lock'
                        error={false}
                        iconPosition='left'
                        placeholder={this.state.pwdShowInfo}
                        type='password'
                        onChange={(e)=>{console.log(e); this.setState({pwd:e.target.value})}}
                    ></Form.Input>
            
                    <Form.Button color='teal' fluid size='large' onClick={()=>this.onLogin()}>
                              登陆店铺
                    </Form.Button>
                    </Segment>
                </Form>
                <Message>
                    密码请咨询管理员
                </Message>
                </Grid.Column>
          </Grid>
        )
    }
}
 


export default LoginForm