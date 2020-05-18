import React,{Component} from "react"
import { Menu, Grid ,Segment, Button, Dropdown} from "semantic-ui-react"
import ItemSelect from "./SubItem/ItemSelect"
import WHTab from "./SubItem/WHTab"
import ItemOrder from "./SubItem/ItemOrder"
import Common from "../../common/common"
import { string, element } from "prop-types"
import PropTypes from 'prop-types';
import {ShoppingItem, MainContext} from './ObjContext'
import logo from "../logo.png"
import ShopItemSelect from "./SubItem/ShopItemSelect"

export default class CangKuGuanLi extends Component{
    constructor(props, context){
        super(props)
        this.state={shopList:[]}

        // 请求商店列表
        Common.sendMessage(Common.baseUrl + "/login/getshops", "POST", null
        , {shoptype:1}, null
        , (e)=>{
            console.log("回调。。。。。。。。。。。。。。。。。。。。")
            console.log(e)
            var arrayObj = [];
            e.data.forEach(element => {
                var icon = ''
                if(element.SHOP_TYPE === 0){icon='suitcase'}
                else if(element.SHOP_TYPE === 1){icon='shipping'}
                else{icon='settings'}
                arrayObj.push({
                key: element.SHOP_ID,
                text: element.SHOP_NAME,
                value: element.SHOP_ID,
                icon: icon
                });
            });
            this.setState({
                shopList:arrayObj
            })
            

            }
        )
    }
    static contextType = MainContext;
    onShopChange(shopid){
        // 请求商品数据
        const {setMainContext} = this.context;
        //shopItems:[], // 仓库商品信息
        //selectedShopid:0 // 当前选择
        // f.value
        // 请求登录检查，如果失败了，则跳转到login画面
        Common.sendMessage(Common.baseUrl + "/cangku/getishoptems"
        , "POST"
        , null
        , {shopid:shopid}
        , null
        , (e)=>{
        if(e.error_code === 0){
            var cangkuInfo = {}
            cangkuInfo.selectedShopid = shopid
            cangkuInfo.shopItems = e.data
            cangkuInfo.shopList = []
            cangkuInfo.selectedShopid2=-1  // 移库目标仓库选择id
            this.state.shopList.forEach((element)=>{
                if(element.value !== shopid){
                    cangkuInfo.shopList.push(element)
                }
            })
            setMainContext({
                cangkuInfo:cangkuInfo
            })
        }
        else{
            this.props.history.push("/login")
        }
        // 跳转到主画面
        }
        ,(e)=>{
            console.log("login 报错了")
        },
        this.context)
    }
    componentWillUnmount(){
        var cangkuInfo = {}
        cangkuInfo.shopItems=[] // 仓库商品信息
        cangkuInfo.selectedShopid=-1 // 当前选择
        cangkuInfo.shopList=[]  // 移库仓库清单
        cangkuInfo.selectedShopid2=-1  // 移库目标仓库选择id
        const {setMainContext} = this.context;
        setMainContext({
            cangkuInfo:cangkuInfo,
            shoppingItems:[]
        })

    }
    render(){

        return(
            <div style={{ minHeight:800}}>
                <Grid columns='equal'>
                    <Grid.Column width={"6"}> {/*this.state.items*/}
                    <Segment  color='orange'>
                    <Dropdown
                            placeholder='选择一个仓库'
                            fluid
                            selection
                            options={this.state.shopList}
                            onChange={(e,f)=>this.onShopChange(f.value)}
                        />
                    </Segment>
                    <Segment  color='orange'>
                    <ShopItemSelect></ShopItemSelect>
                    </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <WHTab></WHTab>
                    </Grid.Column>
                </Grid>
        </div>
        )
    }
}
