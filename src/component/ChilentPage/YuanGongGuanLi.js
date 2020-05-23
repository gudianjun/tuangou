import React,{Component} from "react"
import EmpEdit from './SubItem/EmpEdit'

export default class YuanGongGuanLi extends Component{
    constructor(props){
        super(props)
        this.state={}
    }

    render(){
        return(
            <div>
               <EmpEdit></EmpEdit>
            </div>
        )
    }
}
