import React,{Component} from "react"
import ItemsEdit from './SubItem/ItemsEdit'

export default class ShangPinGuanLi extends Component{
    constructor(props){
        super(props)
        this.state={}
    }

    render(){
        return(
            <div>
               <ItemsEdit></ItemsEdit>
            </div>
        )
    }
}
