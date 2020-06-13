import React,{Component} from "react"
import { Icon, Table,Button, Label,Input} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from '../../../common/common'
// 仓库物品选择

// 定制一个添加按钮
class AddButton extends Component{
    constructor(props){
        super(props)
        this.state={
            itemkey:props.itemkey
            , iconN:props.iconN
            
        };
    }
    static getDerivedStateFromProps(nexProps, prevState){
        return null
    }
    static propTypes = {
        itemkey:PropTypes.string,
        iconN:PropTypes.string,
    }
    static defaultProps = {
        iconN:'shopping cart'
    }
    static contextType = MainContext;
    onClickHandler(){
        //this.props.onAddshopping(this.props.itemKey)
        const {items} = this.context;
        if(items.length > 0){
            const {shoppingItems} = this.context;
            const {setMainContext} = this.context;
            var sii = new ShoppingItem()
            var fi = items.find(element=>element.key === this.props.itemkey)
            
            sii.InitShoppingItem(fi, shoppingItems.length)
            shoppingItems.push(sii)
            console.log(this.context)
            setMainContext({shoppingItems:shoppingItems})
            this.setState({
                shoppingItems:shoppingItems
            })
        }
    }
    render(){
        return (
            <Button icon onClick={()=>{this.onClickHandler()}}><Icon name={this.state.iconN}/></Button>
        )
    }
}


export default class ShopItemSelect extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)

        this.state = {
            items : [],
            searchtext:''
        }

        if(!this.props.isselect){
            this.getCangKuXiaShouItems(context)
        }
        else{
            const {cangkuInfo} = context
            this.state = {
                items : cangkuInfo.shopItems
            }
        }
    }
    // static getDerivedStateFromProps(nexProps, prevState){
    //    return null
    // } 
    getCangKuXiaShouItems(context){
        // 请求商品数据
        const {setMainContext} = context;
        context.cangkuInfo.selectedShopid = -1
        // 请求商店所拥有的items
        Common.sendMessage(Common.baseUrl + "/cangku/xsshopitems"
        , "POST"
        , null
        , null
        , null
        , (e)=>{
        if(e.error_code === 0){
            const {cangkuInfo} = context;
            cangkuInfo.shopItems = e.data
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
            const {setMainContext} = this.context
            setMainContext({
                errorMessage:e
            })
        },
        this.context)
   }

    shouldComponentUpdate(nexProps, prevState)    {
        return true;
    }
    static propTypes = {
        onref:PropTypes.func,
        isselect:PropTypes.bool // 是不是带有选择功能的商铺物品清单
    }
    static defaultProps = {
        isselect:true, 
        onref:null
    }
    // UNSAFE_componentWillUpdate(){
    //     const {cangkuInfo} = this.context
    //     this.setState( {
    //         items : cangkuInfo.shopItems
    //     })
    // }
    onRefClick(){
        if(this.props.onref!==null){
            this.props.onref()
        }
        else{
            this.getCangKuXiaShouItems(this.context)
        }
    }
    getSetFlg(item){
        if (item.ITEM_TYPE === 1){
            return (<Label color='green' ribbon>SET</Label>)
        }
        else if (item.ITEM_TYPE === 2){
            return (<Label color='blue' ribbon>散</Label>)
        }
    }
    getItemCount(element){
        if(element.ITEM_TYPE === 0){
            return parseInt(element.ITEM_COUNT)
        }
        else if(element.ITEM_TYPE === 1){
            return '套装'
        }
        else if(element.ITEM_TYPE === 2){
            return element.ITEM_COUNT.toFixed(2)
        }
    }
    render(){
        const {cangkuInfo} = this.context
        var rows = [];
       
        cangkuInfo.shopItems.forEach(element=>{
            var index = 0
            if(this.state.searchtext !== undefined){
                index = (element.COM_TYPE_ID.toUpperCase() + element.ITEM_ID.toString() + element.ITEM_NAME).indexOf(this.state.searchtext.toUpperCase())
            }
            if( index>= 0){
                if(this.props.isselect){
                    rows.push(
                        <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                            <Table.Cell>{this.getSetFlg(element)}{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                            <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                            <Table.Cell textAlign='right'>{element.ITEM_COUNT}</Table.Cell>
                            <Table.Cell><AddButton itemkey = {element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()} 
                            ></AddButton></Table.Cell>
                        </Table.Row>
                    )
                    }
                else{
                    rows.push(
                        <Table.Row key={element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()}>
                            <Table.Cell>{this.getSetFlg(element)}{element.COM_TYPE_ID + element.ITEM_ID.toString()}</Table.Cell>
                            <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                            <Table.Cell>{this.getItemCount(element)}</Table.Cell>
                            <Table.Cell><AddButton itemkey = {element.COM_TYPE_ID + "_" + element.ITEM_ID.toString()} 
                            ></AddButton></Table.Cell>
                        </Table.Row>
                    )
                }
            }
        }
        )
        
        return(
            <div>
                <Input icon='search' size='small' placeholder='Search...' fluid onChange={(e,f)=>{this.setState({searchtext:f.value})}} />
                <div style={{height: this.props.isselect?'75vh':'90vh', overflowY:'scroll'}}>
                    
                    <Table celled selectable>
                        <Table.Header  >
                        <Table.Row>
                            <Table.HeaderCell >商品编号</Table.HeaderCell>
                            <Table.HeaderCell>商品名称</Table.HeaderCell>
                            <Table.HeaderCell>数量</Table.HeaderCell>
                            <Table.HeaderCell><Button icon onClick={()=>{this.onRefClick()}}> <Icon  name='refresh'></Icon>操作</Button> </Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body >
                            {rows}
                        </Table.Body>
                    </Table>
                </div>

                
            </div>
        )
    }
}
