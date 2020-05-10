import React, { Component } from 'react'
import { Menu, Label, Icon } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

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

        // 设定整体的标题内容
    }

  render() {
    const { activeItem } = this.state

    return (
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
          name='cangkuguanli'
          active={activeItem === 'cangkuguanli'}
          onClick={this.handleItemClick}
          ><Icon name='yen sign' />仓库管理</Menu.Item>
          <Menu.Item
          name='huiyuanguanli'
          active={activeItem === 'huiyuanguanli'}
          onClick={this.handleItemClick}
          ><Icon name='users' />会员管理</Menu.Item>
          <Menu.Item
          name='dianpuguanli'
          active={activeItem === 'dianpuguanli'}
          onClick={this.handleItemClick}
          ><Icon name='recycle' />店铺管理</Menu.Item>
          <Menu.Item
          name='yuangongguanli'
          active={activeItem === 'yuangongguanli'}
          onClick={this.handleItemClick}
          ><Icon name='user outline' />员工管理</Menu.Item>
          <Menu.Item
          name='xitongsheding'
          active={activeItem === 'xitongsheding'}
          onClick={this.handleItemClick}
          ><Icon name='recycle' />系统设定</Menu.Item>
          <Menu.Item
          name='caigouguanli'
          active={activeItem === 'caigouguanli'}
          onClick={this.handleItemClick}
          ><Icon name='truck' />采购管理</Menu.Item>
          <Menu.Item
          name='kucunzonglan'
          active={activeItem === 'kucunzonglan'}
          onClick={this.handleItemClick}
          ><Icon name='recycle' />库存总览</Menu.Item>
          <Menu.Item
          name='shangpinguanli'
          active={activeItem === 'shangpinguanli'}
          onClick={this.handleItemClick}
          ><Icon name='recycle' />商品管理</Menu.Item>
           <Menu.Item
          name='tongjibaobiao'
          active={activeItem === 'tongjibaobiao'}
          onClick={this.handleItemClick}
          ><Icon name='recycle' />统计报表</Menu.Item>
      </Menu>
    )
  }
}
