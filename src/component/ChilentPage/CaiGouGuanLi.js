import React,{Component} from "react"
import ConfirmEdit from './SubItem/ConfirmEdit'
export default class CaiGouGuanLi extends Component{
    constructor(props, context){
        super(props)
        this.state={}
    }
    static getDerivedStateFromProps(props, state){
        return null
      }
    render(){
        return(
            <div>
               <ConfirmEdit></ConfirmEdit>
            </div>
        )
    }
}
