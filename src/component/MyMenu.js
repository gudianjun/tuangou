import React, {Component, useRef} from 'react'
import { Menu, Icon} from 'semantic-ui-react'
import PropTypes, {element} from 'prop-types';
import { MainContext} from './ChilentPage/ObjContext'
import * as commonConst from '../common/commonConst'

export default class MenuExampleInvertedVertical extends Component {
    static contextType = MainContext;
    constructor(props, context){
        super(props)
        this.state={
            activeItem: ''
        }
        if(context.rolemodels !== undefined) {
            let init = true
            context.rolemodels.forEach(element=> {
                if (element.ALLOW_FLG === 1 && init) {
                    this.state={ activeItem: element.MODEL_TITLE}
                    this.props.childrenRoute(element.MODEL_TITLE)
                    init = false
                }
            })
        }

    }

    static propTypes={
        childrenRoute:PropTypes.func,
        history:PropTypes.object
    }

    // static getDerivedStateFromProps(nexProps, prevState){
    //   var url = nexProps.history.location.pathname.replace('/main/', '')
    //   return {activeItem: url}
    // }
    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        // 设定路由
        this.props.childrenRoute(name)

        // 设定整体的标题内容
    }

    getMenu(){

      const { activeItem } = this.state
      const {menumstate} = this.context;

      if(this.context.shoptype !== -1){
          console.log("getMenu=========->>>>")
              return (
                  <Menu inverted vertical style={{width: "100%", borderRadius: "0px", fontSize: "15px"}} icon='labeled'>
                      {menumstate.xiaoshou ? (
                          <Menu.Item as='a'
                                     name='xiaoshou'
                                     active={activeItem === 'xiaoshou'}
                                     onClick={this.handleItemClick}
                          > <Icon name='cart'/>销售</Menu.Item>) : null}

                      {
                          menumstate.tuihuo ? (
                              <Menu.Item as='a'
                                         name='tuihuo'
                                         active={activeItem === 'tuihuo'}
                                         onClick={this.handleItemClick}
                              ><Icon name='undo'/>退货</Menu.Item>
                          ) : null
                      }

                      {menumstate.baofei ? (<Menu.Item as='a'
                                                       name='baofei'
                                                       active={activeItem === 'baofei'}
                                                       onClick={this.handleItemClick}
                      ><Icon name='delete'/>报废</Menu.Item>) : null}

                      {menumstate.tongjibaobiao ? (<Menu.Item
                          name='tongjibaobiao'
                          active={activeItem === 'tongjibaobiao'}
                          onClick={this.handleItemClick}
                      ><Icon name='line graph'/>统计报表</Menu.Item>) : null}
                      {menumstate.meirishenpi ? (<Menu.Item
                          name='meirishenpi'
                          active={activeItem === 'meirishenpi'}
                          onClick={this.handleItemClick}
                      ><Icon name='calculator'/>每日审批</Menu.Item>) : null}

                      {menumstate.dangrixiaoshoujilu ? (<Menu.Item
                          name='dangrixiaoshoujilu'
                          active={activeItem === 'dangrixiaoshoujilu'}
                          onClick={this.handleItemClick}
                      ><Icon name='chart bar outline'/>当日销售</Menu.Item>) : null}

                      {menumstate.cangkuguanli ? (<Menu.Item
                          name='cangkuguanli'
                          active={activeItem === 'cangkuguanli'}
                          onClick={this.handleItemClick}
                      ><Icon name='shipping'/>仓库管理</Menu.Item>) : null}
                      {menumstate.caigouguanli ? (<Menu.Item
                          name='caigouguanli'
                          active={activeItem === 'caigouguanli'}
                          onClick={this.handleItemClick}
                      ><Icon name='dolly'/>商品流转</Menu.Item>) : null}

                      {menumstate.dianpuguanli ? (<Menu.Item
                          name='dianpuguanli'
                          active={activeItem === 'dianpuguanli'}
                          onClick={this.handleItemClick}
                      ><Icon name='suitcase'/>店铺管理</Menu.Item>) : null}
                      {menumstate.yuangongguanli ? (<Menu.Item
                          name='yuangongguanli'
                          active={activeItem === 'yuangongguanli'}
                          onClick={this.handleItemClick}
                      ><Icon name='user outline'/>员工管理</Menu.Item>) : null}

                      {menumstate.kucunzonglan ? (<Menu.Item
                          name='kucunzonglan'
                          active={activeItem === 'kucunzonglan'}
                          onClick={this.handleItemClick}
                      ><Icon name='boxes'/>库存总览</Menu.Item>) : null}

                      {menumstate.huiyuanguanli ? (<Menu.Item as='a'
                                                              name='huiyuanguanli'
                                                              active={activeItem === 'huiyuanguanli'}
                                                              onClick={this.handleItemClick}
                      ><Icon name='users'/>会员管理</Menu.Item>) : null}

                      {menumstate.memkucunzonglan ? (<Menu.Item
                          name='memkucunzonglan'
                          active={activeItem === 'memkucunzonglan'}
                          onClick={this.handleItemClick}
                      ><Icon name='shopping basket'/>会员存货</Menu.Item>) : null}

                      {
                          menumstate.shangpinguanli ? (
                              <Menu.Item
                                  name='shangpinguanli'
                                  active={activeItem === 'shangpinguanli'}
                                  onClick={this.handleItemClick}
                              ><Icon name='clipboard outline'/>商品管理</Menu.Item>
                          ) : null
                      }

                      {(menumstate.quanxianguanli || this.context.shoptype === 99) ? (<Menu.Item
                          name='quanxianguanli'
                          active={activeItem === 'quanxianguanli'}
                          onClick={this.handleItemClick}
                      ><Icon name='key'/>权限管理</Menu.Item>) : null}
                  </Menu>
              )

      }
      return (<div></div>)
   }
  render() {

          return this.getMenu()


  }
}
