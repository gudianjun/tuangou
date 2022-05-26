import React,{useState, useEffect, useRef } from "react"
import {
    Table,
    Grid,
    Input,
    TextArea,
    Label,
    Modal,
    ButtonGroup,
    Button,
    Dropdown,
    SegmentGroup, GridColumn, Header, Menu, Divider, Icon
} from 'semantic-ui-react'
import Common from "../../common/common";
import {element, func, object} from "prop-types";
import DatePicker from "react-datepicker";
import {MainContext} from "../../component/ChilentPage/ObjContext";
import _ from 'lodash'

const XiaoHui = ( ) =>{
    console.log('XiaoHui')
    const [shops, setShops] = useState([])
    const [curselshop, setCurSelShop] = useState(-1)
    const [curselitem, setCurSelItem] = useState('all')
    const [itemNames, setItemNames ]= useState([])
    const [xiaohuiInfos, setXiaohuiInfos ]= useState([])
    const [fromDate, setFromDate ]= useState((new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10))
    const [toDate, setToDate ]= useState((new Date(+new Date() + 8 * 3600 * 1000)).toISOString().substring(0, 10))
    const initFlg = useRef(false)
    const {_currentValue} = MainContext;
    const {items} = _currentValue;

    if(initFlg.current === false) {
        initFlg.current = true
        console.log('XiaoHui ： /shop/getshops')
        Common.sendMessage(Common.baseUrl + "/shop/getshops", "POST", null
            , {ishaswh:1}, null
            , (e)=>{
                let shops = []
                shops.push({key:-1, value:-1, text:'全部'})
                e.data.forEach(element=>{
                    shops.push({key:element.SHOP_ID, value:element.SHOP_ID, text:element.SHOP_NAME})
                })
                setShops(shops)

            }
        )
        let temparr = []
        temparr.push({key:'all', value:'all', text:'全部',icon: ''})
        //
        items.forEach(element=>{
            if(element.ITEM_TYPE !== 1) // 单品
            {
                temparr.push({
                    key:element.COM_TYPE_ID +  element.ITEM_ID.toString(),
                    text: element.COM_TYPE_ID +  element.ITEM_ID.toString() + '_' + element.ITEM_NAME,
                    value:element.COM_TYPE_ID +  element.ITEM_ID.toString(),
                    icon:element.ITEM_TYPE === 2 ? 'balance scale' : ''
                })
            }
            setItemNames(temparr)
        })
    }

    function fromDateChange(date){
        setFromDate(date.toISOString().substring(0, 10));
    };
    function toDateChange(date){
        setToDate(date.toISOString().substring(0, 10));
    };
    function shopSelectChange(e, f) {
        setCurSelShop(f.value)
    }
    function  onSelClick() {
        let comtype = ''
        let itemid = -1
        if(curselitem !== 'all'){
            var index = items.findIndex(element=>{ return (element.COM_TYPE_ID + element.ITEM_ID.toString()) === curselitem})
            if(index>=0){
                comtype = items[index].COM_TYPE_ID
                itemid =  items[index].ITEM_ID
            }
        }



        Common.sendMessage(Common.baseUrl + "/item/selxiaohuiinfos", "POST", null
            , {SHOP_ID:curselshop, ITEM_ID : itemid, COM_TYPE_ID : comtype, datefrom : fromDate, dateto : toDate},
            null
            , (e)=>{
                setXiaohuiInfos(e.data)
            },(e)=>{
                console.log('XiaoHui ： e')
            }
        )
    }
    function exampleReducer(state, action) {
        switch (action.type) {
            case 'CHANGE_SORT':
                if (state.column === action.column) {
                    return {
                        ...state,
                        data: state.data.slice().reverse(),
                        direction:
                            state.direction === 'ascending' ? 'descending' : 'ascending',
                    }
                }

                return {
                    column: action.column,
                    data: _.sortBy(state.data, [action.column]),
                    direction: 'ascending',
                }
            default:
                throw new Error()
        }
    }
    const [state, dispatch] = React.useReducer(exampleReducer, {
        column: null,
        data: xiaohuiInfos,
        direction: null,
    })
    const { column, data, direction } = state

    return (
        <div style={{ minHeight:800}}>
            <Grid columns='equal' >
                <Grid.Row>
                    <Grid.Column width={2}><Header as='h3'>销毁查询</Header></Grid.Column>

                    <Grid.Column width={14} textAlign='right' >
                        <Menu widths={5}>

                            <Menu.Item>
                                <Label>FROM</Label>
                                <DatePicker dateFormat="yyyy-MM-dd"
                                            value={new Date(fromDate)}
                                            selected={new Date(fromDate)}
                                            onChange={(e)=>{fromDateChange(e)}}
                                            placeholder='Enter date'   showYearDropdown
                                />

                            </Menu.Item>
                            <Menu.Item>
                                <Label>TO</Label>
                                <DatePicker dateFormat="yyyy-MM-dd"
                                            value={new Date(toDate)}
                                            selected={new Date(toDate)}
                                            onChange={(e)=>{toDateChange(e)}}
                                            placeholder='Enter date'   showYearDropdown
                                />

                            </Menu.Item>
                            <Menu.Item>
                                <Dropdown value={curselshop} search
                                          selection  onChange={(e, f)=>shopSelectChange(e, f)}
                                          options={shops}  placeholder='请选择一个店铺'></Dropdown>
                            </Menu.Item>
                            <Menu.Item>
                                <Dropdown value={curselitem} placeholder='请选择一个商品' search options={itemNames}  onChange={
                                    (e,f)=>{
                                        setCurSelItem(f.value)
                                    }
                                }></Dropdown>
                            </Menu.Item>
                            <Menu.Item>
                                <Button  onClick={(e)=>onSelClick()}>
                                    查询
                                </Button>
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='bar chart' />
                    Specifications
                </Header>
            </Divider>
            <Table celled selectable fixed sortable>
                <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell sorted={column === 'SHOP_NAME' ? direction : null}
                                          onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'SHOP_NAME' })}
                        >店铺名称</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'ITEM_NAME' ? direction : null}>销毁商品名</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'ITEM_NUMBER' ? direction : null}>销毁数量</Table.HeaderCell>
                        <Table.HeaderCell sorted={column === 'TOTAL_PRICE' ? direction : null}>销毁成本</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body >
                    {
                        xiaohuiInfos.map(element=>{
                             return (
                                 <Table.Row key = {element.INDEX }>
                                     <Table.Cell >{element.SHOP_NAME}</Table.Cell>
                                     <Table.Cell >{element.ITEM_NAME}</Table.Cell>
                                     <Table.Cell >{element.ITEM_NUMBER}</Table.Cell>
                                     <Table.Cell >{element.TOTAL_PRICE}</Table.Cell>
                                 </Table.Row>

                             )
                            }
                        )
                    }
                </Table.Body>
            </Table>
        </div>
    );

}
export default XiaoHui;