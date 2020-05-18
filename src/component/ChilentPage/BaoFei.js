import React,{Component} from "react"
import { Menu, Grid ,Segment, Button, Dropdown} from "semantic-ui-react"
import ItemSelect from "./SubItem/ItemSelect"
import ItemOrder from "./SubItem/ItemOrder"
import Common from "../../common/common"
import { string, element } from "prop-types"
import PropTypes from 'prop-types';
import {ShoppingItem, MainContext} from './ObjContext'

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
                    <Grid.Column width={"6"}> {/*this.state.items*/}
                        <ItemSelect></ItemSelect>
                    </Grid.Column>
                    <Grid.Column>
                        <ItemOrder opetype={2}></ItemOrder>
                    </Grid.Column>
                </Grid>
        </div>
        )
    }
}
