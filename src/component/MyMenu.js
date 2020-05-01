import React, { Component } from 'react'
import { Menu, Label } from 'semantic-ui-react'
import PropTypes from 'prop-types';

export default class MenuExampleInvertedVertical extends Component {
    constructor(props){
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
    }

  render() {
    const { activeItem } = this.state

    return (
      <Menu inverted vertical  style={{width:"100%", borderRadius: "0px", fontSize:"25px" }} >
        <Menu.Item
          name='xiaoshou'
          active={activeItem === 'xiaoshou'}
          onClick={this.handleItemClick}
        >销    售</Menu.Item>
        <Menu.Item
          name='baofei'
          active={activeItem === 'baofei'}
          onClick={this.handleItemClick}
          >报    废</Menu.Item>
        <Menu.Item
          name='dangrixiaoshoujilu'
          active={activeItem === 'dangrixiaoshoujilu'}
          onClick={this.handleItemClick}
          >当日销售</Menu.Item>
          <Menu.Item
          name='tuihuo'
          active={activeItem === 'tuihuo'}
          onClick={this.handleItemClick}
          >退    货</Menu.Item>
          <Menu.Item
          name='cangkuguanli'
          active={activeItem === 'cangkuguanli'}
          onClick={this.handleItemClick}
          >仓库管理</Menu.Item>
          <Menu.Item
          name='huiyuanguanli'
          active={activeItem === 'huiyuanguanli'}
          onClick={this.handleItemClick}
          >会员管理</Menu.Item>
          <Menu.Item
          name='huiyuancunhuoguanli'
          active={activeItem === 'huiyuancunhuoguanli'}
          onClick={this.handleItemClick}
          >会员存货</Menu.Item>
          <Menu.Item
          name='dianpuguanli'
          active={activeItem === 'dianpuguanli'}
          onClick={this.handleItemClick}
          >店铺管理</Menu.Item>
          <Menu.Item
          name='yuangongguanli'
          active={activeItem === 'yuangongguanli'}
          onClick={this.handleItemClick}
          >员工管理</Menu.Item>
          <Menu.Item
          name='xitongsheding'
          active={activeItem === 'xitongsheding'}
          onClick={this.handleItemClick}
          >系统设定</Menu.Item>
          <Menu.Item
          name='caigouguanli'
          active={activeItem === 'caigouguanli'}
          onClick={this.handleItemClick}
          >采购管理</Menu.Item>
          <Menu.Item
          name='kucunzonglan'
          active={activeItem === 'kucunzonglan'}
          onClick={this.handleItemClick}
          >库存总览</Menu.Item>
          <Menu.Item
          name='zhuankuguanli'
          active={activeItem === 'zhuankuguanli'}
          onClick={this.handleItemClick}
          >转库管理</Menu.Item>
          <Menu.Item
          name='shangpinguanli'
          active={activeItem === 'shangpinguanli'}
          onClick={this.handleItemClick}
          >商品管理</Menu.Item>
           <Menu.Item
          name='tongjibaobiao'
          active={activeItem === 'tongjibaobiao'}
          onClick={this.handleItemClick}
          >统计报表</Menu.Item>
      </Menu>
    )
  }
}
