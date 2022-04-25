import React,{Component} from "react"
import {
    Table,
    Button,
    Grid,
    Pagination,
    Modal,
    SegmentGroup,
    Segment,
    Dropdown,
    Label,
    GridColumn, Icon
} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { MainContext} from '../ObjContext'
import Common from "../../../common/common"
import DatePicker from "react-datepicker";

// 重装详细清单
export default class ZYXiangXi extends Component{
    static contextType = MainContext;



    constructor(props, context){
        super(props)
        var ctypes = []
        ctypes.push({
            key:-1,
            text:'全部',
            value:-1,
            icon:'th'
        })
        ctypes.push({
            key:0,
            text:'采购',
            value:0,
            icon:'shopping bag'
        })
        ctypes.push({
            key:1,
            text:'转库',
            value:1,
            icon:'truck'
        })

        var shoparr = []
        var shopsel = -1
        var shoptype = Common._loadStorage('shoptype')
        var shopname = Common._loadStorage('shopname')
        if(shoptype !== '0'){
            shoparr.push({
                key:-1,
                text:'全部',
                value:-1,
                icon:'th'
            })
            context.allshops.forEach(element=>{
                var icon = ''
                if(element.SHOP_TYPE === 0){icon='suitcase'}
                else if(element.SHOP_TYPE === 1){icon='shipping'}
                else{icon='settings'}
                shoparr.push({
                    key:element.SHOP_ID ,
                    text:element.SHOP_NAME,
                    value:element.SHOP_ID,
                    icon:icon
                })
            })
        }
        else{
            context.allshops.forEach(element=>{
                if(element.SHOP_NAME === shopname){
                    var icon = ''
                    if(element.SHOP_TYPE === 0){icon='suitcase'}
                    else if(element.SHOP_TYPE === 1){icon='shipping'}
                    else{icon='settings'}
                    shoparr.push({
                        key:element.SHOP_ID ,
                        text:element.SHOP_NAME,
                        value:element.SHOP_ID,
                        icon:icon
                    })
                    shopsel = element.SHOP_ID
                }
            })
        }

        this.state = {
            page_index:1,
            selectobject:[], // 查询结果对象
            allpage:1,
            fromdate:(new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10),
            todate:(new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10),
            shoparr:shoparr,  // 店铺
            ctypes:ctypes,    // 类型
            ctypesel:-1,    // 订单类型选择
            shopsel:shopsel,  // 店铺选择
            page_size:15,
            itemoption:[{
                key:-1,
                text: '全部商品',
                value:'-1',
                icon:'th'
            }, ...props.itemoption], // 商品列表
            itemoptionsel:'-1', // 选择的商品
        }      
    }

    addDownloadButton(){
        const {menumstate} = this.context;
        if(menumstate.download){
            return (
                <Label as='a' size={'huge'} onClick={() => {
                    Common.downloadFile(Common.baseUrl + "/item/downloadfile", "POST", null
                        , {filetype: 'liuzhuanxinxi'}, null
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

    handlePaginationChange = (e, { activePage }) => {
        console.log(activePage)
        this.setState({page_index:activePage},()=>this.refData())
    }

    selectTable(){
        
    }
    dateChangeFrom( date){
        this.setState({
            fromdate:date.toISOString().substring(0, 10),
            page_index:1
        }, ()=>{
            this.selectTable()
        });
      };
      dateChangeTo( date){
        this.setState({
            todate:date.toISOString().substring(0, 10),
            page_index:1
        }, ()=>{
            this.selectTable()
        });
      };
    shopSelectChange(e, f){
        this.setState({
             shopsel:f.value
        })
        
    }
    CTypeSelectChange(e, f){
        this.setState({
            ctypesel:f.value
       })
    }
    itemSelectChange(e, f){
        this.setState({
            itemoptionsel:f.value
        })
    }
    refData(){
        let index = this.context.items.findIndex(element=>{ return (element.COM_TYPE_ID + element.ITEM_ID.toString()) === this.state.itemoptionsel})
        let itemid = -1
        let comtypeid = ''
        if(index >= 0){
            itemid = this.context.items[index].ITEM_ID
            comtypeid = this.context.items[index].COM_TYPE_ID
        }

        Common.sendMessage(Common.baseUrl + "/confirm/confirms"
            , "POST"
            , null
            , {	page_index:this.state.page_index,
                page_size:this.state.page_size,
                SHOP_ID:this.state.shopsel,
                FROM_ORDER_TIME: this.state.fromdate,
                TO_ORDER_TIME: this.state.todate,
                CONFIRM_TYPE: this.state.ctypesel,
                ITEM_ID:itemid,
                COM_TYPE_ID:comtypeid,
                }
            , null
            , (e)=>{
                this.setState({
                    selectobject:e.data.msg,
                    page_index:e.data.page_index,
                    page_size:e.data.page_size,
                    allpage:e.data.allpage,
                })
                console.log(e)
            },(e)=>{
                const {setMainContext} = this.context
                setMainContext({
                    errorMessage:e
                })
            },
            this.context)
    }
    onCLick(){
        this.setState({page_index:1,selectobject:[]}, ()=>this.refData())
    }
    render(){
        var rows=[]
        this.state.selectobject.forEach((element)=>{
            rows.push(
                <Table.Row key={element.ORDER_ID}>
                    <Table.Cell>{element.ORDER_ID}</Table.Cell>
                    <Table.Cell>{element.ORDER_TIME}</Table.Cell>
                    <Table.Cell>{element.CONFIRM_TYPE}</Table.Cell>
                    <Table.Cell>{element.ORDER_STATE}</Table.Cell>
                    <Table.Cell>{element.ITEM_NAME}</Table.Cell>
            <Table.Cell>{element.ALREADY_IN_NUMBER} / {element.ITEM_NUMBER}</Table.Cell>
                    <Table.Cell>{element.FROM_SHOP_NAME}</Table.Cell>
                    <Table.Cell>{element.TO_SHOP_NAME}</Table.Cell>
                </Table.Row>
            )
        })
        return(
            <div>
                <Grid columns='equal'>
                <Grid.Row>

                        <Segment.Group horizontal>
                        <Label color={'blue'}>查询条件：</Label>
                        <Label>起始时间</Label>
                        <DatePicker dateFormat="yyyy-MM-dd"
                                        value={new Date(this.state.fromdate)}
                                        selected={new Date(this.state.fromdate)}


                                        onChange={(e)=>{this.dateChangeFrom(e)}}
                                        placeholder='Enter date'   showYearDropdown
                                /> 
                        <Label>结束时间</Label>
                        <DatePicker dateFormat="yyyy-MM-dd"
                                        value={new Date(this.state.todate)}
                                        selected={new Date(this.state.todate)}
                                        onChange={(e)=>{this.dateChangeTo(e)}}
                                        placeholder='Enter date'   showYearDropdown
                                /> 
                        <Label>店铺选择</Label>
                        <Dropdown placeholder='选择一个店铺' value={this.state.shopsel} search
                                    selection  onChange={(e, f)=>this.shopSelectChange(e, f)} 
                                    options={this.state.shoparr}></Dropdown>
                        <Label>商品选择</Label>
                        <Dropdown style={{ minWidth: '250px'}} placeholder='选择一个商品' value={this.state.itemoptionsel} search
                                  selection  onChange={(e, f)=>this.itemSelectChange(e, f)}
                                  options={this.state.itemoption}></Dropdown>
                        <Label>类型</Label>
                        <Dropdown placeholder='类型' value={this.state.ctypesel}
                                    selection  onChange={(e, f)=>this.CTypeSelectChange(e, f)} 
                                    options={this.state.ctypes}></Dropdown>
                        <Button primary onClick={()=>this.onCLick()} >查询</Button>
                            {this.addDownloadButton()}
                    </Segment.Group>



                </Grid.Row>
                    <Grid.Row>
                    <Grid.Column>
                        <Table celled selectable>
                            <Table.Header  >
                                <Table.Row>
                                    <Table.HeaderCell>订单ID</Table.HeaderCell>
                                    <Table.HeaderCell>时间</Table.HeaderCell>
                                    <Table.HeaderCell>类型</Table.HeaderCell>
                                    <Table.HeaderCell>状态</Table.HeaderCell>
                                    <Table.HeaderCell>商品名</Table.HeaderCell>
                                    <Table.HeaderCell>已入库/数量</Table.HeaderCell>
                                    <Table.HeaderCell>出库店</Table.HeaderCell>
                                    <Table.HeaderCell>入库店</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                                {rows}
                            </Table.Body>

                            <Table.Footer fullWidth>
                                <Table.Row>
                                <Table.HeaderCell colSpan='8' textAlign='center'>
                                <Pagination 
                                    activePage={this.state.page_index >= 1 ? this.state.page_index : 1}
                                    boundaryRange={0}
                                    ellipsisItem={null}
                                    firstItem={null}
                                    lastItem={null}
                                    siblingRange={10}
                                    onPageChange={this.handlePaginationChange}
                                    totalPages={this.state.allpage}
                                />
                                </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
