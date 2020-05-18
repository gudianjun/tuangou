import React, { Component } from 'react'
import { Menu, Label, Icon } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { MainContext} from './ChilentPage/ObjContext'

export default class MenuExampleInvertedVertical extends Component {
    static contextType = MainContext;
    constructor(props, context){
        super(props)
        this.state={ activeItem: 'xiaoshou' }
        this.props.childrenRoute('xiaoshou')
    }

    static propTypes={
        childrenRoute:PropTypes.func
    }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        // 设定路由
        this.props.childrenRoute(name)

        // 设定整体的标题内容
    }
    getMenu(){
      const { activeItem } = this.state
      if(this.context.shoptype !== -1){
         if(this.context.shoptype === 0)
         {
          return(
            <Menu inverted vertical  style={{width:"100%", borderRadius: "0px", fontSize:"15px" }}  icon='labeled'>
            <Menu.Item
              name='xiaoshou'
              active={activeItem === 'xiaoshou'}
              onClick={this.handleItemClick}
            > <Icon name='cart' />销售</Menu.Item>
              <Menu.Item
              name='tuihuo'
              active={activeItem === 'tuihuo'}
              onClick={this.handleItemClick}
              ><Icon name='undo' />退货</Menu.Item>
            <Menu.Item
              name='baofei'
              active={activeItem === 'baofei'}
              onClick={this.handleItemClick}
              ><Icon name='delete' />报废</Menu.Item>
            <Menu.Item
              name='dangrixiaoshoujilu'
              active={activeItem === 'dangrixiaoshoujilu'}
              onClick={this.handleItemClick}
              ><Icon name='chart bar outline' />当日销售</Menu.Item>
             
              <Menu.Item
              name='huiyuanguanli'
              active={activeItem === 'huiyuanguanli'}
              onClick={this.handleItemClick}
              ><Icon name='users' />会员管理</Menu.Item>
          </Menu>
                 )
          }
          else if(this.context.shoptype === 1){
             return(
              <Menu inverted vertical  style={{width:"100%", borderRadius: "0px", fontSize:"15px" }}  icon='labeled'>
                <Menu.Item
                name='cangkuguanli'
                active={activeItem === 'cangkuguanli'}
                onClick={this.handleItemClick}
                ><Icon name='shipping' />仓库管理</Menu.Item>               
                <Menu.Item
                name='kucunzonglan'
                active={activeItem === 'kucunzonglan'}
                onClick={this.handleItemClick}
                ><Icon name='boxes' />库存总览</Menu.Item>
                <Menu.Item
                name='memkucunzonglan'
                active={activeItem === 'memkucunzonglan'}
                onClick={this.handleItemClick}
                ><Icon name='shopping basket' />会员存货</Menu.Item>
            </Menu>
                 )
          }
          else if(this.context.shoptype === 99){
             return(
              <Menu inverted vertical  style={{width:"100%", borderRadius: "0px", fontSize:"15px" }}  icon='labeled'>
                <Menu.Item
                name='tongjibaobiao'
                active={activeItem === 'tongjibaobiao'}
                onClick={this.handleItemClick}
                ><Icon name='line graph' />统计报表</Menu.Item>
                <Menu.Item
                name='meirishenpi'
                active={activeItem === 'meirishenpi'}
                onClick={this.handleItemClick}
                ><Icon name='calculator' />每日审批</Menu.Item>

                <Menu.Item
                name='dangrixiaoshoujilu'
                active={activeItem === 'dangrixiaoshoujilu'}
                onClick={this.handleItemClick}
                ><Icon name='chart bar outline' />当日销售</Menu.Item>
                <Menu.Item
                name='cangkuguanli'
                active={activeItem === 'cangkuguanli'}
                onClick={this.handleItemClick}
                ><Icon name='shipping' />仓库管理</Menu.Item>
                <Menu.Item
                name='dianpuguanli'
                active={activeItem === 'dianpuguanli'}
                onClick={this.handleItemClick}
                ><Icon name='suitcase' />店铺管理</Menu.Item>
                <Menu.Item
                name='yuangongguanli'
                active={activeItem === 'yuangongguanli'}
                onClick={this.handleItemClick}
                ><Icon name='user outline' />员工管理</Menu.Item>
                <Menu.Item
                name='kucunzonglan'
                active={activeItem === 'kucunzonglan'}
                onClick={this.handleItemClick}
                ><Icon name='boxes' />库存总览</Menu.Item>
                <Menu.Item
                name='memkucunzonglan'
                active={activeItem === 'memkucunzonglan'}
                onClick={this.handleItemClick}
                ><Icon name='shopping basket' />会员存货</Menu.Item>
                <Menu.Item
                name='shangpinguanli'
                active={activeItem === 'shangpinguanli'}
                onClick={this.handleItemClick}
                ><Icon name='clipboard outline' />商品管理</Menu.Item>
                
            </Menu>
                 )
          }
      }
      return (<div></div>)
   }
  render() {
    return this.getMenu()
  }
}
