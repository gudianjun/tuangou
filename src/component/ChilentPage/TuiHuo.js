import React,{Component} from "react"
import { Grid, Segment, Tab, Dropdown, Form, Radio } from "semantic-ui-react"
import ShopItemSelect from "./SubItem/ShopItemSelect"
import ItemOrder from "./SubItem/ItemOrder"
import {MainContext} from './ObjContext'


export default class TuiHuo extends Component{
    constructor(props){
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
    panes = [
        {
            menuItem: { key: 'normal', icon: 'yen sign', content: '普通退货' },
            render: () => <Tab.Pane><ItemOrder opetype={1}></ItemOrder></Tab.Pane>
        },
        {
            menuItem: { key: 'member', icon: 'users', content: '会员退货' },
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

                    <ItemOrder opetype={1}></ItemOrder>
            
                </Tab.Pane>
        }
      ]
    render(){
        return(
        <div  >
                <Grid columns='equal'>
                    <Grid.Column width={"6"}>
                    <ShopItemSelect isselect={false}></ShopItemSelect>
                    </Grid.Column>
                    <Grid.Column>
                        <Tab panes={this.panes}></Tab>
                        
                    </Grid.Column>
                </Grid>
        </div>
        )
    }
}

