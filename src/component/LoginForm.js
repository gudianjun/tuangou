import React, { Component } from 'react';
import { Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'
import logo from "./logo.png"
import Common from "../common/common"
import {MainContext} from "./ChilentPage/ObjContext"
class LoginForm extends Component{
  static contextType = MainContext;

  constructor(props, context){
    console.log("LoginForm初始化")
    super(props);
    this.state={
      shopList:[], pwd:"", selectShop:null, pwdShowInfo:"密码", shopShowInfo:"选择你的店铺"
    };

    // 请求登录列表
    Common.sendMessage(Common.baseUrl + "/login/getshops", "GET", null
    , null, null
    , (e)=>{
      console.log("回调。。。。。。。。。。。。。。。。。。。。")
      console.log(e)
      var arrayObj = [];
      e.data.forEach(element => {
        var icon = ''
        if(element.SHOP_TYPE === 0){icon='suitcase'}
        else if(element.SHOP_TYPE === 1){icon='shipping'}
        else{icon='settings'}
        arrayObj.push({
          key: element.SHOP_ID,
          text: element.SHOP_NAME,
          value: element.SHOP_ID,
          icon:icon
        });
      });
      
      this.setState({
        shopList:arrayObj
      })
    })
    console.log(this.state.shopList)
  }
  static getDerivedStateFromProps(props, state){
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
      Common._setStorage("shoptype", e.data.shoptype)
      // 跳转到主画面
      this.setState({}, ()=>{
        this.context.shoptype = e.data.shoptype
        this.forceUpdate()
        this.props.history.push("/loading")
        
      })
      
    })

  }
    render(){
        return (
            <Grid textAlign='center' verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Image src={logo} /> 为了我们的生活一起努力
                </Header>
                <Form size='large'>
                    <Segment stacked>
                    <Form.Dropdown placeholder={this.state.shopShowInfo} search  fluid  selection  options={this.state.shopList} 
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