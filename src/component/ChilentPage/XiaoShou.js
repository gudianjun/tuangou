import React,{Component, createRef } from "react"
import {Grid, Tab, Label, Segment, Dropdown, Radio, Header} from "semantic-ui-react"

import ItemOrder from "./SubItem/ItemOrder"
import { MainContext} from './ObjContext'

import ShopItemSelect from "./SubItem/ShopItemSelect"
import Common from "../../common/common";

export default class XiaoShou extends Component{
    static contextType = MainContext;
    constructor(props, context){
        super(props)
        this.state = {
            xsMemoptions:[],
            selectMemID:-1,
            inMemWH:false,
        }
        this.getMemItems()
    }
    getMemItems() {
        var optionObjs = []

        Common.sendMessage(Common.baseUrl + "/member/getmembers"
            , "POST"
            , null
            , null
            , null
            , (e) => {
                e.data.forEach(element => {
                    optionObjs.push({
                            key: element.MEM_ID,
                            value: element.MEM_ID,
                            text: element.MEM_LASTNAME + " " + element.MEM_FIRSTNAME + "(¥" + element.MEM_MONEY + ")",
                            memmoney:element.MEM_MONEY
                        }
                    )

                });

                // 写入缓存
                this.setState({
                    xsMemoptions: optionObjs,
                    selectMemID:-1
                })
            }, null,
            this.context)

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

    onInMemWH(e,f){
        this.setState({ inMemWH:f.checked}) // 当前选择的用户ID
    }

    onMemberChange(e,f){
        this.setState({ selectMemID:f.value}) // 当前选择的用户ID

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
            render: () => <Tab.Pane><ItemOrder opetype={0}  ismemorder={false}></ItemOrder></Tab.Pane>
        },
        {
            menuItem: { key: 'member', icon: 'users', content: '会员销售' },
            render: () => <Tab.Pane>
                    <Grid>
                        <Grid.Row>

                            <Grid.Column  width={8}>
                                    <Dropdown selection options={this.state.xsMemoptions}  placeholder='请选择一个会员'
                                              value={this.state.selectMemID}
                                              value={this.state.selectMemID}
                                              selection search onChange={this.onMemberChange.bind(this)}/>
                            </Grid.Column>

                            <Grid.Column  width={8} textAlign='right'>
                                <Radio textAlign='right'
                                    label='存入到会员账号'
                                    name='radioGroup'
                                    toggle
                                    checked={this.state.inMemWH}
                                    onChange={this.onInMemWH.bind(this)}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <ItemOrder opetype={0} ismemorder={true} selectMemID={this.state.selectMemID}
                               memoptions={this.state.xsMemoptions} updateItems={this.getMemItems.bind(this)}></ItemOrder>
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

