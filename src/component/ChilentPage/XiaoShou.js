import React,{Component} from "react"
import { Menu, Grid ,Segment, Button, Dropdown} from "semantic-ui-react"
import ItemSelect from "./SubItem/ItemSelect"
import ItemOrder from "./SubItem/ItemOrder"
import Common from "../../common/common"
import { string, element } from "prop-types"
import PropTypes from 'prop-types';
import {ShoppingItem, MainContext} from './ObjContext'


// class XiaoShouProvider extends Component{
//     render(){
//         return(
//             <XiaoShouContext.Provider value={"im xiaoshouProvider"}>

//             </XiaoShouContext.Provider>
//         )
//     }
// }
export default class XiaoShou extends Component{
    constructor(props){
        super(props)
        this.state = {
            items : []
        }
        this.addShopping = this.addShopping.bind(this);
    
        console.log("XiaoShou 的构造函数")
        var itemstring = Common._loadStorage("itemsList")
       
        if(itemstring === null) // 没有数据，跳转加载
        {
            this.props.history.push("/loading")
        }
    }
    static contextType = MainContext;
    static getDerivedStateFromProps(nexProps, prevState){
       
        //var arrayObj = [];
        //if(this.context.shoppingItems===undefined || this.context.shoppingItems === null){
            // 请求登录列表
        //     Common.sendMessage(Common.baseUrl + "/xiaoshou/getitems"
        //     , "POST"
        //     , null
        //     , null
        //     , null
        //     , (e)=>{
                
               
        //         e.data.forEach(element => {
        //             arrayObj.push({...element, key:element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()})
        //         });
        //         console.log(arrayObj)
        //     })
        // //}
        // return {items:arrayObj}
        var itemstring = Common._loadStorage("itemsList")
        return {
            items:JSON.parse(itemstring)
        }
      }
    
    componentWillUnmount(){
        console.log("componentWillUnmount---------------------------------")
        console.log(this.context)
        const {shoppingItems} = this.context;
        const {setMainContext} = this.context;
        if(typeof(shoppingItems)!="undefined"&&shoppingItems!=null)
            shoppingItems.splice(0, shoppingItems.length);
        setMainContext({
            shoppingItems : shoppingItems
        })
    }
    
           
    shouldComponentUpdate(nextProps, nextState){
        console.log("shouldComponentUpdate ---------------------------")
        if(nextState === null || nextState.items === null)
        {
            console.log("shouldComponentUpdate 不允许更新")
            return false}
        else{
            console.log("shouldComponentUpdate 允许更新")
            return true
        }
    }
    shoppingItems = []
    // 选择商品加入购物车回调
    addShopping(itemKey){
        console.log('addShopping: ' + itemKey)

        var sii = new ShoppingItem()
        var fi = this.state.items.find(element=>element.key === itemKey)
        console.log(this.shoppingItems)
        sii.InitShoppingItem(fi, this.shoppingItems.length)
        this.shoppingItems.push(sii)
        console.log(this.context)
        this.context.setMainContext({shoppingItems:this.shoppingItems})
        this.setState({
            shoppingItems:this.shoppingItems
        })
    }

    render(){
        return(
        <div  >
            
                <Grid columns='equal'>
                    <Grid.Column width={"6"}> {/*this.state.items*/}
                        <ItemSelect items={this.state.items} onAddshopping={this.addShopping}></ItemSelect>
                    </Grid.Column>
                    <Grid.Column>
                        <ItemOrder></ItemOrder>
                    </Grid.Column>
                </Grid>
        </div>
        )
    }
}

