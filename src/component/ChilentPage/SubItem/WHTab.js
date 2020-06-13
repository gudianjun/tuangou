import React,{Component} from "react"
import {MainContext} from "../ObjContext"
import { Dropdown , Tab, Segment} from 'semantic-ui-react'
import ItemOrder from "./ItemOrder"

class WHTab extends Component{
    constructor(props, context){
        super(props)
        this.state = {}
    }

    static contextType = MainContext;
    onShopChange(e, f){
        const {cangkuInfo} = this.context;
        const {setMainContext} = this.context;
        cangkuInfo.selectedShopid2 = f.value
        setMainContext({cangkuInfo:cangkuInfo})
    }
    panes = [
        {
          menuItem: { key: 'ruku', icon: 'pallet', content: '入库' },
          render: () => <Tab.Pane><ItemOrder opetype={3} ordertype={0}></ItemOrder></Tab.Pane>,
        },
        {
            menuItem: { key: 'chuku', icon: 'dolly', content: '出库' },
            render: () => <Tab.Pane><ItemOrder opetype={3} ordertype={1}></ItemOrder></Tab.Pane>,
        },
        {
            menuItem: { key: 'zhuanku', icon: 'sync alternate', content: '转库' },
            render: () => {
                const {cangkuInfo} = this.context;

                return (<Tab.Pane>
                <Segment  color='orange'>
                <Dropdown
                            placeholder='选择目标仓库'
                            fluid
                            search
                            selection
                            options={cangkuInfo.shopList}
                            value={cangkuInfo.selectedShopid2}
                            onChange={(e, f)=>{ this.onShopChange(e, f)}}
                        />
                      </Segment>
                      <Segment  color='orange'>
                <ItemOrder opetype={4}></ItemOrder></Segment></Tab.Pane>
            )},
        },
    ]
     
    onTabChange(e, f){
        console.log(f)
        // f.activeIndex
        const {setMainContext} = this.context;
        const {cangkuInfo} = this.context;
        cangkuInfo.selectedShopid2 = -1
        setMainContext({shoppingItems:[],
            cangkuInfo:cangkuInfo})


    }
    render(){
        return(
            <div>
                <Tab onTabChange={(e, f)=>this.onTabChange(e, f)} panes={this.panes} />
            </div>
        )
    }
}


export default WHTab