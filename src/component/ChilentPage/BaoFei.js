import React,{Component} from "react"
import { Grid } from "semantic-ui-react"
import ShopItemSelect from "./SubItem/ShopItemSelect"
import ItemOrder from "./SubItem/ItemOrder"
import {MainContext} from './ObjContext'

export default class BaoFei extends Component{
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
    render(){
        return(
        <div  >
                <Grid columns='equal'>
                    <Grid.Column width={"6"}> 
                    <ShopItemSelect isselect={false}></ShopItemSelect>
                    </Grid.Column>
                    <Grid.Column>
                        <ItemOrder opetype={2}></ItemOrder>
                    </Grid.Column>
                </Grid>
        </div>
        )
    }
}
