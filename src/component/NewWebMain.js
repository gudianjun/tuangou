import React, { Component } from 'react';
import { Button, Confirm, Message, Segment, Menu, Icon, Sidebar , Header, Image, Ref,Grid ,Visibility, Sticky} from 'semantic-ui-react'
import {Switch, Route, withRouter} from 'react-router-dom'
import Common from "../common/common"
import MySidebar from "./MySidebar"
import XiaoShou from "./ChilentPage/XiaoShou"
import BaoFei from "./ChilentPage/BaoFei"
import DangRiXiaoShouJiLu from "./ChilentPage/DangRiXiaoShouJiLu"

import TuiHuo       from "./ChilentPage/TuiHuo"
import CangKuGuanLi from "./ChilentPage/CangKuGuanLi"
import HuiYuanGuanLi from "./ChilentPage/HuiYuanGuanLi"

import DianPuGuanLi from "./ChilentPage/DianPuGuanLi"
import YuanGongGuanLi from "./ChilentPage/YuanGongGuanLi"
import KuCunZongLan from "./ChilentPage/KuCunZongLan"
import MemKuCunZongLan from "./ChilentPage/MemKuCunZongLan"

import ShangPinGuanLi from "./ChilentPage/ShangPinGuanLi"
import TongJiBaoBiao from "./ChilentPage/TongJiBaoBiao"
import MeiRiShenPi from "./ChilentPage/MeiRiShenPi"

import { MainContext} from './ChilentPage/ObjContext'
import ItemSelect from './ChilentPage/SubItem/ItemSelect';
import ItemOrder from './ChilentPage/SubItem/ItemOrder';


export default class NewWebMain extends Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }
    static contextType = MainContext;
    static getDerivedStateFromProps(nexProps, prevState){
        return null
    }

    render(){
        return(
            <Sidebar.Pushable as={Segment}>
    <Sidebar
      as={Menu}
      animation='overlay'
      icon='labeled'
      inverted
      vertical
      visible
      width='thin'
    >
        <Menu.Item as='a'>
            <Icon name='home' />
            Home
        </Menu.Item>
        <Menu.Item as='a'>
            <Icon name='gamepad' />
            Games
        </Menu.Item>
        <Menu.Item as='a'>
            <Icon name='camera' />
            Channels
        </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
        <Segment basic 
       >
            <Header as='h3'>Application Content</Header>
            <div >
            <Ref innerRef={this.contextRef}>
                <Grid columns='equal'  height='100%'>
                    <Grid.Column width={"6"}> 
                    <Visibility onUpdate={this.handleUpdate}>
                        <ItemSelect></ItemSelect>
                    </Visibility>
                    </Grid.Column>
                    <Grid.Column >
                     <Sticky context={this.contextRef} >
                        <ItemOrder opetype={0}></ItemOrder>
                        </Sticky>
                    </Grid.Column>
                </Grid>
     
        </Ref>
            </div>
        </Segment>
        </Sidebar.Pusher>
        </Sidebar.Pushable>

        )
    }
}