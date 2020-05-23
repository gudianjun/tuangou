import React,{Component, createRef } from "react"
import {  Grid, Sticky, Ref , Visibility, Segment, Image, Divider} from "semantic-ui-react"
import ItemSelect from "./SubItem/ItemSelect"
import ItemOrder from "./SubItem/ItemOrder"
import { MainContext} from './ObjContext'
import Common from "../../common/common"
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
    render(){
        return(
           
            <Grid columns='equal'  height='100%'>
                <Grid.Column width={"6"}> 
                    <ShopItemSelect isselect={false}></ShopItemSelect>
                </Grid.Column>
                <Grid.Column >
                        <ItemOrder opetype={0} ></ItemOrder>
                </Grid.Column>
            </Grid>
           
        )
    }
}

