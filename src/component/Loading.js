import React, {Component} from 'react'
import { Loader } from 'semantic-ui-react'
import {MainContext} from "./ChilentPage/ObjContext"
import Common from '../common/common'
class LoaderExampleInline extends Component{
    
    constructor(props){
        super(props)
        var arrayObj = [];
        this.state={}
        console.log('LoaderExampleInline')
        Common.sendMessage(Common.baseUrl + "/xiaoshou/getitems"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                e.data.forEach(element => {
                    arrayObj.push({...element, key:element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()})
                });
                // const {setMainContext} = this.context;
                // setMainContext({itemsList:arrayObj}) // 设定商品列表
                // 写入缓存
                Common._setStorage("itemsList", JSON.stringify(arrayObj))
                // 跳转到
                this.props.history.push("/main")
            })

    }
    static contextType = MainContext;
    // 开始加载初始化数据
    static getDerivedStateFromProps(nexProps, prevState){
        return null
      }
    render(){
        return(
            <div style={{ width:'100%', height: '100%',position: 'absolute'}}>
                <Loader style={{ left:'50%', top: '50%', size:"100px"}} big active inline />
            </div>
        )
    }
    
}


export default LoaderExampleInline