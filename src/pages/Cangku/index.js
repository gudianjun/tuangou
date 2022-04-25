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
    SegmentGroup, GridColumn
} from 'semantic-ui-react'
import Common from "../../common/common";
import {element, object} from "prop-types";
import DatePicker from "react-datepicker";
const CangkuXiangXi = ({showCK,setShowCK, itemid, comtypeid, shopid, itemname, shopname}) =>{

    const [datefrom, setDatefrom] = useState(new Date())
    const [dateto, setDateto] = useState(new Date())
    const [orderinfos, setOrderinfos] = useState([])
    const [showordersub, setshowordersub] = useState(false)
    const [ordertitle, setOrderTitle] = useState("")
    const [selectobject, setSelectobject] = useState(null)
    const [modeltitles, setModeltitles] = useState([])
    const [modelrows, setModelrows] = useState([])

    const initFlg = useRef(false);
    function GetOrderInfos(){
        Common.sendMessage(Common.baseUrl + "/cangku/getcangkuxiangxi"
            , "POST"
            , null
            , {
                itemid:itemid,
                comtypeid:comtypeid,
                shopid:shopid,
                datefrom:datefrom,
                dateto:dateto,
            }
            , null
            , (e) => {
                setOrderinfos(e.data)
            }, null,
            null)
    }
    function getOpeType(item){
        if(item.OPE_TYPE===0){
            return '销售订单'
        }
        else if(item.OPE_TYPE===1){
            return '退货'
        }
        else if(item.OPE_TYPE===2){
            return '销毁'
        }
        else if(item.OPE_TYPE===3){
            if(item.RELATED_ORDER_ID[1] === 'I'){
                return '入库'
            }
            else{
                return '出库'
            }
        }
        else if(item.OPE_TYPE===4){
            return '转库'
        }
        else if(item.OPE_TYPE===5){
            if(item.RELATED_ORDER_ID[1] === 'I'){
                return '会员存货'
            }
            else{
                return '会员提货'
            }
        }
        else if(item.OPE_TYPE===6){
            return '采购'
        }
        else if(item.OPE_TYPE===7){
            return '确认转库'
        }
    }
    if(showCK){
        if(initFlg.current === false) {
            initFlg.current = true
            GetOrderInfos()
        }
    }
    function showSetInfo(element){

            Common.sendMessage(Common.baseUrl + "/statistics/ddxiangxi"
                , "POST"
                , null
                , {RELATED_ORDER_ID: element.RELATED_ORDER_ID, SHOP_ID: element.SHOP_ID}
                , null
                , (e)=>{

                    setshowordersub(true)
                    setSelectobject(e.data)
                },(e)=>{
                    const {setMainContext} = this.context
                    setMainContext({
                        errorMessage:e
                    })
                },
                null)


    }
    function dateChangeFrom( date){
        setDatefrom(date)
    }
    function dateChangeTo( date){
        setDateto(date)
    }
    useEffect(()=>{
        if(selectobject!==null && showordersub === true) {
            setOrderTitle(selectobject.txt)
            let titles = []
            selectobject.titles.forEach(element => {
                titles.push(<Table.HeaderCell key={element}>{element}</Table.HeaderCell>)
            })
            setModeltitles(titles)

            let key = 0
            let rows = []
            selectobject.items.forEach(element => {
                let temps = []
                key++
                rows.push(
                    <Table.Row key={key.toString()}>
                        {Object.keys(element).forEach(oi => {
                            temps.push(
                                <Table.Cell key={(key++).toString()}>{element[oi]}</Table.Cell>
                            )
                        })}
                        {temps}
                    </Table.Row>
                )
            })
            setModelrows(rows)
        }

    }, [selectobject])

    return (
        <div>
            <Modal open={showCK}>
                <Modal.Header>{'店铺【' + shopname + '】商品：【'+itemname+'】入出库履历'}
                    <ButtonGroup style={{position:'absolute',right:60}}>
                        <Button onClick={()=>{
                            initFlg.current = false

                            setShowCK(false)
                        }} >
                            关闭
                        </Button>
                    </ButtonGroup>
                </Modal.Header>
                <Modal.Content>
                    <Grid columns='equal'>
                        <Grid.Row>
                            <GridColumn>


                                    <Label>起始时间</Label>
                                    <DatePicker dateFormat="yyyy-MM-dd"
                                                value={datefrom}
                                                selected={datefrom}
                                                onChange={(e)=>{dateChangeFrom(e)}}
                                                placeholder='Enter date'   showYearDropdown
                                    />
                            </GridColumn>
                            <GridColumn>
                                    <Label>结束时间</Label>
                                    <DatePicker dateFormat="yyyy-MM-dd"
                                                value={dateto}
                                                selected={dateto}
                                                onChange={(e)=>{dateChangeTo(e)}}
                                                placeholder='Enter date'   showYearDropdown
                                    />
                            </GridColumn>


                            <GridColumn><Button primary onClick={()=>GetOrderInfos()} >查询</Button></GridColumn>


                        </Grid.Row>
                        <Grid.Row>
                            <Table celled selectable sortable>
                                <Table.Header  >
                                    <Table.Row>
                                        <Table.HeaderCell >订单ID</Table.HeaderCell>
                                        <Table.HeaderCell >订单时间</Table.HeaderCell>
                                        <Table.HeaderCell >订单类型</Table.HeaderCell>
                                        <Table.HeaderCell >操作类型</Table.HeaderCell>

                                        <Table.HeaderCell >数量</Table.HeaderCell>
                                        <Table.HeaderCell >操作前数量</Table.HeaderCell>
                                        <Table.HeaderCell >关联订单</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body >
                                    {orderinfos.map(element=>{
                                        return (
                                            <Table.Row key={element.ORDER_ID+element.ITEM_ID+element.COM_TYPE_ID}>
                                                <Table.Cell>{element.ORDER_ID}</Table.Cell>
                                                <Table.Cell>{element.ORDER_TIME}</Table.Cell>
                                                <Table.Cell>{element.ORDER_TYPE===0?"入库":"出库"}</Table.Cell>
                                                <Table.Cell>{getOpeType(element)}</Table.Cell>
                                                <Table.Cell>{element.ITEM_NUMBER}</Table.Cell>
                                                <Table.Cell>{element.BEFORE_ITEM_NUMBER}</Table.Cell>
                                                <Table.Cell><Label as='a' onClick={()=>showSetInfo(element)}
                                                                   color={'blue'}>{element.ORDER_ID}</Label> </Table.Cell>
                                            </Table.Row>
                                        )

                                    })}
                                </Table.Body>
                                <Table.Footer fullWidth>
                                </Table.Footer>
                            </Table>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>

                </Modal.Actions>
            </Modal>
            <Modal open={showordersub}>
                <Modal.Header>{ordertitle}
                    <ButtonGroup style={{position:'absolute',right:60}}>
                        <Button onClick={()=>setshowordersub(false)} >
                            关闭
                        </Button>
                    </ButtonGroup>
                </Modal.Header>
                <Modal.Content>
                    <Grid columns='equal'>
                        <Grid.Column>
                            <Table celled selectable>
                                <Table.Header  >
                                    <Table.Row>
                                        {modeltitles}
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body >
                                    {modelrows}
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
        </div>
    );

}
export default CangkuXiangXi;