import React,{Component} from "react"
import {Icon, Table, Button, Label, Input, Modal, ButtonGroup, Grid} from 'semantic-ui-react'
import PropTypes, {element} from 'prop-types';
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
        console.log("ShopItemSelect")


        if(!this.props.isselect){
            this.state = {
                items : [],
                searchtext:'',
                showset:false,
                setinfo:[],
                setname:"",
            }
            this.getCangKuXiaShouItems(context)
        }
        else{
            const {cangkuInfo} = context
            this.state = {
                items : cangkuInfo.shopItems,
                searchtext:'',
                showset:false,
                setinfo:[],
                setname:"",
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
        isselect:PropTypes.bool,// 是不是带有选择功能的商铺物品清单
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
    showSetInfo(element){

        Common.sendMessage(Common.baseUrl + "/xiaoshou/getsetinfo"
            , "POST"
            , null
            , {itemid:element.ITEM_ID,comtypeid:element.COM_TYPE_ID}
            , null
            , (e)=>{
                this.setState({showset:true,setinfo:e.data, setname:element.ITEM_NAME})
            }
            ,(e)=>{
                const {setMainContext} = this.context
                setMainContext({
                    errorMessage:e
                })
            },
            this.context)


    }

    getItemCount(element){
        if(element.ITEM_TYPE === 0){
            return parseInt(element.ITEM_COUNT)
        }
        else if(element.ITEM_TYPE === 1){
            return (
                <Label as='a' onClick={()=>this.showSetInfo(element)}
                       color={'blue'}>
                    {'套装'}
                </Label>
            ) // '套装'
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
                            ></AddButton>
                            </Table.Cell>
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
                 <Modal open={this.state.showset}>
                    <Modal.Header> {'套餐【' + this.state.setname + '】的内容'  }
                        <ButtonGroup style={{position:'absolute',right:60}}>
                            <Button onClick={()=>this.setState({showset:false})} >
                                关闭
                            </Button>
                        </ButtonGroup>
                    </Modal.Header>

                    <Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Column>
                                <div  style={{overflowY:'scroll' }}>
                                    <Table celled selectable>
                                        <Table.Header  >
                                            <Table.Row >
                                                <Table.HeaderCell>商品ID</Table.HeaderCell>
                                                <Table.HeaderCell>商品类别</Table.HeaderCell>
                                                <Table.HeaderCell>商品名</Table.HeaderCell>
                                                <Table.HeaderCell>数量</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body >
                                            {this.state.setinfo.map(element=> {
                                                return (
                                                    <Table.Row
                                                        key={element.SUB_ITEM_ID + "_" + element.SUB_COM_TYPE_ID.toString()}>
                                                        <Table.Cell>{element.SUB_ITEM_ID}</Table.Cell>
                                                        <Table.Cell>{element.SUB_COM_TYPE_ID}</Table.Cell>
                                                        <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                                                        <Table.Cell>{element.ITEM_NUMBER}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            })
                                            }
                                        </Table.Body>
                                        <Table.Footer fullWidth>
                                        </Table.Footer>
                                    </Table></div>
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>

                </Modal>

            </div>
        )
    }
}
