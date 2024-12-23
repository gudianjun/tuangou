import React,{Component} from "react"
import {
    Table,
    Grid,
    Label,
    Button,
    Modal,
    ButtonGroup,
    Input,
    GridColumn,
    Dropdown,
    GridRow,
    Icon
} from 'semantic-ui-react'
import {MainContext} from './ObjContext'
import Common from "../../common/common"
import _ from 'lodash'
// 定制一个添加按钮

// 会员的库存总览
export default class MemKuCunZongLan extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            data:[],
            column:null,
            direction:null,
            showset:false,
            modelinfo:{},
            dropselect:-1,
        }

        Common.sendMessage(Common.baseUrl + "/statistics/cangkumemzonglan"
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
    getMemShop(shopid, itemid, comtype){
        Common.sendMessage(Common.baseUrl + "/statistics/shopmemitems"
            , "POST"
            , null
            , {SHOP_ID:shopid, ITEM_ID:itemid, COM_TYPE_ID:comtype}
            , null
            , (e)=>{
                this.setState(
                    {
                        showset:true,
                        modelinfo:e.data
                    }
                )
                console.log(e)
            },null,
            this.context)

    }
    getNumber(element, shop){
        if(element['SHOP_NAME_' + shop.SHOP_ID]===0){
            return (element['SHOP_NAME_' + shop.SHOP_ID])
        }
        else{
            return ( 
                <Label as='a' onClick={()=>this.getMemShop(shop.SHOP_ID, element.ITEM_ID, element.COM_TYPE_ID)}  color='blue' >
                    {element['SHOP_NAME_' + shop.SHOP_ID]}
            </Label>
           )
        }
    }
    handleSort = (clickedColumn) => () => {
        const { column, modelinfo, direction } = this.state
    
        if (column !== clickedColumn) {
            modelinfo.infos = _.sortBy(modelinfo.infos, [clickedColumn])
          this.setState({
            column: clickedColumn,
            modelinfo:modelinfo,
            direction: 'ascending',
          })
    
          return
        }
        modelinfo.infos = modelinfo.infos.reverse()
        this.setState({
            modelinfo: modelinfo,
          direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
      }
    onShopChange(value){
        this.setState({dropselect:value})
    }
    addDownloadButton(){
        const {menumstate} = this.context;
        if(menumstate.download){
            return (
                <Label as='a' size={'huge'} onClick={() => {
                    Common.downloadFile(Common.baseUrl + "/item/downloadfile", "POST", null
                        , {filetype: 'cangkumemzonglan'}, null
                        , (e) => {

                        }
                    );
                }

                }>
                    下载
                    <Icon name='download'/>
                </Label>
            )
        }
    }
    onDownloadHuiYuan(shopid) {
        Common.downloadFile(Common.baseUrl + "/item/downloadfile", "POST", null
            , {
                filetype: 'huiyuankucun',
                SHOP_ID: shopid,
            }, null
            , (e) => {
            }
        )
    }
    addDownloadButton2(shop) {
        const {menumstate} = this.context;
        if(menumstate.download) {
            return (
                <Label onClick={() => {
                    this.onDownloadHuiYuan(shop.SHOP_ID)
                }}>
                    <Icon name='download'></Icon>
                </Label>
            )
        }
    }
    render(){
        var nkey = 1
        var rows=[]
        var shopclms=[]

        var dropshops=[]
        dropshops.push({key:-1,value:-1,text:"全部"})


        if (this.state.data.shopname !== undefined){
            this.state.data.shopname.forEach(shop => {
                if(this.state.dropselect === -1 || shop.SHOP_ID === this.state.dropselect) {
                    shopclms.push(<Table.HeaderCell key={(nkey++).toString()}>


                        {shop.SHOP_NAME}
                        {this.addDownloadButton2(shop)}
                    </Table.HeaderCell>)
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
                            <Table.Row key={element.COM_TYPE_ID + '_' + element.ITEM_ID + nkey.toString()}>
                                <Table.Cell
                                    key={(nkey++).toString()}>{element.COM_TYPE_ID + element.ITEM_ID}</Table.Cell>
                                <Table.Cell key={(nkey++).toString()}>{element.ITEM_NAME}</Table.Cell>
                                {
                                    this.state.data.shopname.forEach(shop => {
                                        if(this.state.dropselect === -1 || shop.SHOP_ID === this.state.dropselect) {
                                            colms.push(<Table.Cell key={(nkey++).toString()} textAlign='right'><span
                                                title={shop.SHOP_NAME + ":" + element.ITEM_NAME}>{this.getNumber(element, shop)}</span></Table.Cell>)
                                        }
                                })}
                                {colms}
                                <Table.Cell key={(nkey++).toString()}
                                            textAlign='right'>{element.TOTLE_NUMBER}</Table.Cell>
                            </Table.Row>
                        )

                }
            });
            
        }
        var memrows=[]
        if(this.state.showset){ 
            var seq = 1
            this.state.modelinfo.infos.forEach(element => {
               
                memrows.push(
                    <Table.Row key = {element.MEM_CODE}>
                        <Table.Cell>{seq++}</Table.Cell>
                        <Table.Cell>{element.MEM_CODE}</Table.Cell>
                        <Table.Cell>{element.MEM_NAME}</Table.Cell>
                        <Table.Cell textAlign='right'>{element.ITEM_NUMBER}</Table.Cell>
                    </Table.Row>
                        )
            })
        }
        const { column, direction } = this.state
        return(
            <div >
                <Grid columns='equal'>
                <GridRow>
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
                        {this.addDownloadButton()}

                    </GridColumn>
                </GridRow>
                </Grid>
                <div style={{ height:  '85vh' , overflowY:'scroll', overflowX:'scroll' }}>
                <Grid columns='equal'>
                    <Grid.Row  key={ (nkey++).toString()}>
                    <Grid.Column>
                        <Table celled selectable>
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

                <Modal open={this.state.showset}>   
                    <Modal.Header>{'店铺【' + this.state.modelinfo.SHOP_NAME + '】中商品【' + this.state.modelinfo.ITEM_NAME + '】的会员存货：'}
                        <ButtonGroup style={{position:'absolute',right:60}}>
                            <Button onClick={()=>this.setState({showset:false})} >
                                关闭
                            </Button>
                        </ButtonGroup>
                    </Modal.Header>
                    <Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Column>
                                <Table celled selectable sortable>
                                    <Table.Header  >
                                        <Table.Row key={ (nkey++).toString()}>
                                            <Table.HeaderCell  >序号</Table.HeaderCell>
                                            <Table.HeaderCell sorted={column === 'MEM_CODE' ? direction : null} onClick={this.handleSort('MEM_CODE')}>会员号</Table.HeaderCell>
                                            <Table.HeaderCell sorted={column === 'MEM_NAME' ? direction : null} onClick={this.handleSort('MEM_NAME')}>会员姓名</Table.HeaderCell>
                                            <Table.HeaderCell sorted={column === 'ITEM_NUMBER' ? direction : null} onClick={this.handleSort('ITEM_NUMBER')}>持有数量</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body >
                                            {memrows}
                                    </Table.Body>
                                    <Table.Footer fullWidth>
                                    </Table.Footer>
                                </Table>
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        
                    </Modal.Actions>
                </Modal>
            </div></div>
        )
    }
}
