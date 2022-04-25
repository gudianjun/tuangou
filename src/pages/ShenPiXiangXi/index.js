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
    SegmentGroup, GridColumn, Tab, Icon, TableCell, GridRow, Segment
} from 'semantic-ui-react'
import Common from "../../common/common";
import {element, object} from "prop-types";
import DatePicker from "react-datepicker";
import {MainContext} from "../../component/ChilentPage/ObjContext";
import ComTypeTabs from "./components/ComTypeTabs";
import SPXiangXiSub from "./components/SPXiangXiSub";
const ShenPiXiangXi = ( {showXX, setShowXX, shopID, selDateTime, spInfos}) =>{

    const [rows, setRows] = useState([])
    const [total, setTotal] = useState(0.0)

    const [rukuStr, setRukuStr] = useState('')
    const [chukuStr, setChukuStr] = useState('')
    const [lingquStr, setLingquStr] = useState('')
    const [comItems, setComItems] = useState({})
    const [panes, setPanes] = useState([])
    useEffect(()=>{
        let comt = 0
        rows.forEach(element=>{
            comt = comt + element.price
        })
        setTotal(comt)
    }, [rows])

    const initFlg = useRef(false);
    const shopName = useRef('');
    const {_currentValue} = MainContext;
    const {allshops} = _currentValue;

    if(showXX === true){
        console.log('ShenPiXiangXi')
        if(initFlg.current === false) {
            initFlg.current = true

            let shopInfo = allshops.find(element=>element.SHOP_ID === shopID)
            if(shopInfo !== undefined) {
                shopName.current = shopInfo.SHOP_NAME

                const {comTypeSum, comTypes, ruku, chuku, lingqu} = spInfos
                let comrows = []
                for (let key in comTypeSum) {
                    console.log(key) // name age
                    let obj = comTypeSum[key]
                    let name = obj['COM_TYPE_NAME']
                    let price = obj['TOTAL_PRICE']
                    comrows.push({'key': key, 'name': name, 'price': price})
                }
                let temPanes = []
                for (let key in comTypes) {

                    let totel = 0
                    comTypes[key].forEach(element=>{
                        totel += element.TOTAL_PRICE
                    })

                    temPanes.push(
                        {
                            menuItem:key,
                            render:()=>(
                                <Tab.Pane>
                                    <SPXiangXiSub items={comTypes[key]} totel={totel}></SPXiangXiSub>
                                </Tab.Pane>
                            )
                        }
                    )
                }
                setPanes(temPanes)
                setComItems(comTypes)
                setRukuStr(ruku)
                setChukuStr(chuku)
                setLingquStr(lingqu)
                setRows(comrows)
            }
        }
    }


    return (
        <div >
            <Modal open={showXX}>
                <Modal.Header>{(shopName.current + '店'
                    + selDateTime.getFullYear().toString() + '年'
                    + selDateTime.getMonth().toString() + '月'
                    + selDateTime.getDate().toString() + '日 '+ '报表')}
                    <ButtonGroup style={{position:'absolute',right:60}}>
                        <Button onClick={()=>{
                            initFlg.current = false
                            setShowXX(false)
                        }} >
                            关闭
                        </Button>
                    </ButtonGroup>
                </Modal.Header>
                <Modal.Content>
                    <div  >
                        <Grid columns='equal'>
                            <Grid.Row>
                                <GridColumn>
                                    <div >
                                        <Table celled selectable sortable fixed={true} compact>
                                        <Table.Header  >
                                            <Table.Row>
                                                <Table.HeaderCell >商品类别</Table.HeaderCell>
                                                <Table.HeaderCell >类别名称</Table.HeaderCell>
                                                <Table.HeaderCell >收入小记</Table.HeaderCell>
                                            </Table.Row>

                                        </Table.Header>

                                        <Table.Body >
                                            {
                                                rows.map(element=>{
                                                    return (
                                                        <Table.Row key={element.key}>
                                                            <TableCell>{element.key}</TableCell>
                                                            <TableCell>{element.name}</TableCell>
                                                            <TableCell textAlign='right'>{Common.formatCurrency(element.price)}</TableCell>
                                                        </Table.Row>
                                                    )
                                                })
                                            }
                                        </Table.Body>

                                        <Table.Footer fullWidth>
                                            <Table.Row>
                                                <Table.HeaderCell colSpan='3'>
                                                    <Button
                                                        floated='right'
                                                        icon
                                                        labelPosition='left'
                                                        primary
                                                        size='small'
                                                    >
                                                        <Icon name='yen' /> {Common.formatCurrency(total)}
                                                    </Button>
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Footer>
                                    </Table>
                                    </div>
                                </GridColumn>
                            </Grid.Row>
                            <Grid.Row>
                                <ComTypeTabs panes={panes}></ComTypeTabs>
                            </Grid.Row>
                            <GridRow>
                                <Label as='a'>
                                    <Icon name='mail' /> 入库
                                </Label>
                            </GridRow>
                            <GridRow>
                                <Segment style={{ width:'100%', minHeight: 80}} >{rukuStr}</Segment>
                            </GridRow>
                            <GridRow>
                                <Label as='a'>
                                    <Icon name='mail' /> 出库
                                </Label>
                            </GridRow>
                            <GridRow>
                                <Segment style={{ width:'100%', minHeight: 80}}>{chukuStr}</Segment>
                            </GridRow>
                            <GridRow>
                                <Label as='a'>
                                    <Icon name='mail' /> 取领货
                                </Label>
                            </GridRow>
                            <GridRow>

                                <Segment  style={{ width:'100%', minHeight: 80}} >{lingquStr}</Segment>

                            </GridRow>
                        </Grid>
                    </div>
                </Modal.Content>
                <Modal.Actions>

                </Modal.Actions>
            </Modal>
        </div>
    );
}
export default ShenPiXiangXi;