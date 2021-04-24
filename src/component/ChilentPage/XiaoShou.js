import React,{Component, createRef } from "react"
import {  Grid, Tab, Label, Segment, Dropdown, Radio} from "semantic-ui-react"

import ItemOrder from "./SubItem/ItemOrder"
import { MainContext} from './ObjContext'

import ShopItemSelect from "./SubItem/ShopItemSelect"

export default class XiaoShou extends Component{
    static contextType = MainContext;
    constructor(props, context){
        super(props)
        this.state = {
            
        }
       
    }
    
    static contextType = MainContext;
    static getDerivedStateFromProps(nexProps, prevState){
        return null
      }
    
    componentWillUnmount(){
        console.log(this.context)
        const {setMainContext} = this.context;
        setMainContext({
            shoppingItems : []
        })
    }
    
           
    shouldComponentUpdate(nextProps, nextState){
        if(nextState === null || nextState.items === null)
        {
            console.log("shouldComponentUpdate 不允许更新")
            return false
        }
        else{
            console.log("shouldComponentUpdate 允许更新")
            return true
        }
    }
    contextRef = createRef()
    handleUpdate = (e, { calculations }) => this.setState({ calculations })

    panes = [
        {
            menuItem: { key: 'normal', icon: 'yen sign', content: '普通销售' },
            render: () => <Tab.Pane><ItemOrder opetype={0} ></ItemOrder></Tab.Pane>
        },
        {
            menuItem: { key: 'member', icon: 'users', content: '会员销售' },
            render: () => <Tab.Pane>
                <Grid>
                        <Grid.Row>
                            <Grid.Column  width={8}>
                                    <Dropdown fluid textAlign='left' placeholder='请选择一个会员'  selection search></Dropdown>
                            </Grid.Column>
                            <Grid.Column  width={8} textAlign='right'>
                                <Radio textAlign='right'
                                    label='存入到会员账号'
                                    name='radioGroup'
                                    value='this'
                                    toggle
                                    checked={this.state.value === 'this'}
                                    onChange={this.handleChange}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <ItemOrder opetype={0}></ItemOrder>
                </Tab.Pane>
        }
      ]
    render(){
        
        return(
           
            <Grid columns='equal'  height='100%'>
                
                <Grid.Column width={"6"}> 
                    <ShopItemSelect isselect={false}></ShopItemSelect>
                </Grid.Column>
                <Grid.Column >
                    <Tab panes={this.panes}></Tab>
                </Grid.Column>
            </Grid>
           
        )
    }
}

