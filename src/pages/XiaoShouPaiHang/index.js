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
import {MainContext} from "../../component/ChilentPage/ObjContext";
const XiaoShouPaiHang = ({showCK, setShowCK, itemid, comtypeid, itemname}) =>{
    console.log('XiaoShouPaiHang')
    const [datefrom, setDatefrom] = useState(new Date())
    const [dateto, setDateto] = useState(new Date())
    const [orderinfos, setOrderinfos] = useState([])

    const [ordertitle, setOrderTitle] = useState(itemname )
    const initFlg = useRef(false);

    if(showCK === true){
        if(initFlg.current === false) {
            initFlg.current = true
            setOrderTitle(itemname)
        }

    }


    function GetOrderInfos(){
        Common.sendMessage(Common.baseUrl + "/confirm/getitemxsforshop"
            , "POST"
            , null
            , {
                ITEM_ID:itemid,
                COM_TYPE_ID:comtypeid,
                FROM_ORDER_TIME:datefrom,
                TO_ORDER_TIME:dateto,
            }
            , null
            , (e) => {
                setOrderinfos(e.data)
            }, null,
            null)
    }


    function dateChangeFrom( date){
        setDatefrom(date)
    }
    function dateChangeTo( date){
        setDateto(date)
    }

    return (
        <div>
            <Modal open={showCK}>
                <Modal.Header>{ordertitle + '的各店销售排行'}
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
                        <GridColumn width={16}>
                            <div  style={{ height:  '55vh' , overflowY:'scroll' }}>
                                <Table celled selectable sortable  style={{minHeight:'100%', height:'100%'}} >
                                <Table.Header  >
                                    <Table.Row>
                                        <Table.HeaderCell >排行</Table.HeaderCell>
                                        <Table.HeaderCell >店铺名称</Table.HeaderCell>
                                        <Table.HeaderCell >销售数量</Table.HeaderCell>
                                        <Table.HeaderCell >销售金额</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body >
                                    {orderinfos.map(element=>{
                                        console.log('orderinfos')
                                        return (
                                            <Table.Row key={element.SEQ}>
                                                <Table.Cell>{element.SEQ}</Table.Cell>
                                                <Table.Cell>{element.SHOP_NAME}</Table.Cell>
                                                <Table.Cell textAlign='right'>{element.ITEM_NUMBER}</Table.Cell>
                                                <Table.Cell textAlign='right'>{Common.formatCurrency(element.TOTAL_PRICE)}</Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                                <Table.Footer fullWidth>
                                </Table.Footer>
                            </Table>
                            </div>
                        </GridColumn>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>

                </Modal.Actions>
            </Modal>

        </div>
    );

}
export default XiaoShouPaiHang;