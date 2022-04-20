import React,{Component,useState, useEffect, useRef} from "react"
import {Table, Grid, Input, Label, Dropdown, Segment, GridColumn, Icon} from 'semantic-ui-react'
import {MainContext} from './ObjContext'
import Common from "../../common/common"
import CangkuXiangXi from "../../pages/Cangku";
// 定制一个添加按钮

// 会员的库存总览
export default class KuCunZongLan extends Component{
    static contextType = MainContext;


    constructor(props, context){
        super(props)



        this.state = {
            data:[],
            searchtext:'',
            showCK:false,
            itemid:-1,
            comtypeid:'',
            shopid:-1,
            itemname:'',
            shopname:'',
            dropselect:-1,
        }

        Common.sendMessage(Common.baseUrl + "/statistics/cangkuzonglan"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                this.setState({
                    data:e.data
                })
                console.log(e)
            },null,
            this.context)
    }

    setShowCK(isshow){
        this.setState({showCK:isshow})
    }
    showSetInfo(shop,element){

       this.setState({
           shopid:shop.SHOP_ID,
           itemid:element.ITEM_ID,
           comtypeid:element.COM_TYPE_ID,
           showCK:true,
           itemname:element.ITEM_NAME,
           shopname:shop.SHOP_NAME,

       })
    }
    onShopChange(value){
        this.setState({dropselect:value})
    }
    render(){
        // const [showCK, setShowCK] = useState(false);
        // const [itemid, setItemid] = useState(-1);
        // const [comtypeid, setComtypeid] = useState("");
        // const [shopid, setShopid] = useState(-1);

        var nkey = 1
        var rows=[]
        var shopclms=[]
        var dropshops=[]
        dropshops.push({key:-1,value:-1,text:"全部"})

        if (this.state.data.shopname !== undefined){
            this.state.data.shopname.forEach(shop => {
                if(this.state.dropselect === -1 || shop.SHOP_ID === this.state.dropselect) {
                    shopclms.push(<Table.HeaderCell  key={ (nkey++).toString()}>{shop.SHOP_NAME}</Table.HeaderCell>)
                }
                dropshops.push({key: shop.SHOP_ID, value: shop.SHOP_ID, text: shop.SHOP_NAME})

            })
            
            this.state.data.items.forEach(element => {
                var index = 0
                if(this.state.searchtext !== undefined){
                    index = (element.COM_TYPE_ID.toUpperCase() + element.ITEM_ID.toString() + element.ITEM_NAME).indexOf(this.state.searchtext.toUpperCase())
                }
                if(index>=0){
                    var colms = []
                    nkey++
                    rows.push(
                    <Table.Row key = {element.COM_TYPE_ID + '_' + element.ITEM_ID + nkey.toString()}>
                        <Table.Cell key={ (nkey++).toString()}>{element.COM_TYPE_ID + element.ITEM_ID}</Table.Cell>
                        <Table.Cell key={ (nkey++).toString()}>{element.ITEM_NAME}</Table.Cell>
                        {
                            this.state.data.shopname.forEach(shop => {
                                if(this.state.dropselect === -1 || shop.SHOP_ID === this.state.dropselect) {
                                    colms.push(
                                        <Table.Cell key={(nkey++).toString()} textAlign='right'>
                                            <Label as='a' onClick={() => this.showSetInfo(shop, element)}
                                                   color={'blue'}>
                                            <span title={shop.SHOP_NAME + ":" + element.ITEM_NAME}>
                                            {element['SHOP_NAME_' + shop.SHOP_ID]}</span>
                                            </Label>
                                        </Table.Cell>
                                    )
                                }
                        })}
                        {colms}
                        <Table.Cell key={ (nkey++).toString()} textAlign='right'>{element.TOTLE_NUMBER}</Table.Cell>
                    </Table.Row>
                        )
                }
            });
            
        }
        return(
            <div >

                <div style={{ height:  '85vh' , overflowY:'scroll', overflowX:'scroll' }}>
                <Grid columns='equal'>
                    <Grid.Row>
                        <GridColumn>
                            <Input icon='search' size='small' placeholder='Search...'  onChange={(eX,f)=>{this.setState({searchtext:f.value})}} />
                        </GridColumn>
                        <GridColumn>
                            <Dropdown
                                placeholder='选择一个仓库'

                                search
                                selection
                                options={dropshops}
                                value={this.state.dropselect}
                                onChange={(e,f)=>this.onShopChange(f.value)}
                            />
                        </GridColumn>
                        <GridColumn>
                            <Label as='a' size={'huge'} onClick={()=>{
                                Common.downloadFile(Common.baseUrl + "/item/downloadfile", "POST", null
                                    , {filetype:'cangkuzonglan'}, null
                                    , (e)=>{

                                    }
                                        );
                                    }

                            }>
                                下载
                                <Icon name='download' />
                            </Label>
                        </GridColumn>

                    </Grid.Row>
                    <Grid.Row  key={ (nkey++).toString()}>
                    <Grid.Column>
                        <Table celled selectable >
                            <Table.Header  >
                                <Table.Row key={ (nkey++).toString()}>
                                    <Table.HeaderCell key={ (nkey++).toString()}>商品编号</Table.HeaderCell>
                                    <Table.HeaderCell key={ (nkey++).toString()}>商品名称</Table.HeaderCell>
                                    {shopclms}
                                    <Table.HeaderCell key={ (nkey++).toString()}>合计</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                               {rows}
                            </Table.Body>
                            <Table.Footer fullWidth>
                             
                            </Table.Footer>
                        </Table>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
                <CangkuXiangXi itemname={this.state.itemname} shopname={this.state.shopname} showCK={this.state.showCK} setShowCK={this.setShowCK.bind(this)} itemid={this.state.itemid} comtypeid={this.state.comtypeid} shopid={this.state.shopid}></CangkuXiangXi>
            </div>
        )
    }
}
