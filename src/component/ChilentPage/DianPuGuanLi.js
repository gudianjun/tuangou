import React,{Component} from "react"
import ShopEdit from './SubItem/ShopEdit'

export default class DianPuGuanLi extends Component{
    constructor(props){
        super(props)
        this.state={}
    }

    render(){
        return(
            <div>
               <ShopEdit></ShopEdit>
            </div>
        )
    }
}
