import React,{Component} from "react"
import MemberEdit from './SubItem/MemberEdit'

export default class HuiYuanGuanLi extends Component{
    constructor(props){
        super(props)
        this.state={}
    }

    render(){
        return(
            <div>
               <MemberEdit></MemberEdit>
            </div>
        )
    }
}
