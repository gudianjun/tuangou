import React,{Component} from "react"
import {MainContext} from "../ObjContext"
import { Icon, Label, Menu, Grid, Select, Table,Button, Dropdown , Input, Tab, Segment} from 'semantic-ui-react'
import PropTypes, { element, array, checkPropTypes } from 'prop-types';
import Common from '../../../common/common'
import ItemOrder from "./ItemOrder"
import ItemSelect from "./ItemSelect"
import ItemsEdit from "./ItemsEdit"
class ItemManage extends Component{
    constructor(props, context){
        super(props)
        this.state = {}
    }

    static contextType = MainContext;

    panes = [
        {
          menuItem: { key: 'ruku', icon: 'users', content: '编辑商品' },
          render: () => <Tab.Pane><ItemsEdit></ItemsEdit></Tab.Pane>,
        },
        // {
        //     menuItem: { key: 'zhuanku', icon: 'users', content: '商品套装编辑' },
        //     render: () => {
        //         return (
        //             <Tab.Pane>
        //             <Segment>
        //                 <Grid columns='equal'>
        //                     <Grid.Column width={"6"}>   {/*this.state.items*/}
        //                         <ItemSelect></ItemSelect>
        //                     </Grid.Column>
        //                     <Grid.Column>
        //                         <ItemOrder></ItemOrder>
        //                     </Grid.Column>
        //                 </Grid>
        //             </Segment>
        //          </Tab.Pane>
        //     )},
        // },
    ]
     
    onTabChange(e, f){
        console.log(f)
        
    }
    render(){
        return(
            <div>
                <Tab onTabChange={(e, f)=>this.onTabChange(e, f)} panes={this.panes} />
            </div>
        )
    }
}


export default ItemManage