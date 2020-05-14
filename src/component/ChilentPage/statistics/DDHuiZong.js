import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button , Grid, Segment, Pagination, Modal, ButtonGroup} from 'semantic-ui-react'
import PropTypes, { element } from 'prop-types';
import {ShoppingItem, MainContext} from '../ObjContext'
import Common from "../../../common/common"
// 定制一个添加按钮

// 当日订单汇总
export default class DDHuiZong extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            activePage:-1,
            xiangqing:[],
            showset:false,
            selectobject:{} // 查询结果对象
        }
    }
    static propTypes = {
        datas:PropTypes.array,
        page_index:PropTypes.number,
        allpage:PropTypes.number,
        onPageChange:PropTypes.func
    }
    // static getDerivedStateFromProps(nexProps, prevState){
    //     return {activePage:nexProps.page_index}
    // }
    handlePaginationChange = (e, { activePage }) => {
        console.log(activePage)
        // this.setState({ activePage })
        this.props.onPageChange(activePage)
    }
    // 查看详情
    onShowInfoClick(element){
        Common.sendMessage(Common.baseUrl + "/statistics/ddxiangxi"
        , "POST"
        , null
        , {RELATED_ORDER_ID: element.RELATED_ORDER_ID, SHOP_ID: element.SHOP_ID}
        , null
        , (e)=>{
           this.setState({selectobject:e.data,
        showset:true})
        },null,
        this.context)     
    }
    getOpeType(item){
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
    }
    render(){
        var rows=[]
        if(this.props.datas.length >= 0){
            this.props.datas.forEach(element => {
                // 添加空行
                rows.push(
                    <Table.Row key={element.RELATED_ORDER_ID}>
                        <Table.Cell>{element.RELATED_ORDER_ID}</Table.Cell>
                        <Table.Cell>{element.SHOP_NAME}</Table.Cell>
                        <Table.Cell>{this.getOpeType(element)}</Table.Cell>
                        <Table.Cell>{element.ORDER_TIME}</Table.Cell>
                        <Table.Cell><Button onClick={()=>this.onShowInfoClick(element)}>查看</Button></Table.Cell>
                    </Table.Row>
                )
            });
            
        }

        var modeltitles = []
        var modelrows = []
        var title = ''
        if(this.state.selectobject !== undefined && this.state.selectobject.titles !== undefined){
            title = this.state.selectobject.txt
            this.state.selectobject.titles.forEach(element=>{
                modeltitles.push(<Table.HeaderCell key={element}>{element}</Table.HeaderCell>)
            })
            var nkey = 0
            this.state.selectobject.items.forEach(element=>{
                var temps = []
                nkey++
                modelrows.push(
                    <Table.Row key={nkey.toString()}>
                        {Object.keys(element).forEach(oi=>{
                            temps.push(
                                <Table.Cell key={(nkey++).toString()}>{element[oi]}</Table.Cell>
                            )
                        })}
                        {temps}
                    </Table.Row>
                )
            })
        }
        return(
            <div>
                <Grid columns='equal'>
                    <Grid.Row>
                    <Grid.Column>
                        <Table celled selectable>
                            <Table.Header  >
                                <Table.Row>
                                    <Table.HeaderCell>订单编号</Table.HeaderCell>
                                    <Table.HeaderCell>所属店铺</Table.HeaderCell>
                                    <Table.HeaderCell>订单类型</Table.HeaderCell>
                                    <Table.HeaderCell>订单时间</Table.HeaderCell>
                                    <Table.HeaderCell>详细</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                                {rows}
                            </Table.Body>

                            <Table.Footer fullWidth>
                                <Table.Row>
                                <Table.HeaderCell colSpan='5' textAlign='center'>
                                    {/* 分页操作 */}
                                <Pagination 
                                    activePage={this.props.page_index >= 1?this.props.page_index:1}
                                    boundaryRange={0}
                                   
                                    ellipsisItem={null}
                                    firstItem={null}
                                    lastItem={null}
                                    siblingRange={10}
                                    onPageChange={this.handlePaginationChange}
                                    totalPages={this.props.allpage}
                                />
                                </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Modal open={this.state.showset}>   
                    <Modal.Header>{title}
                        <ButtonGroup style={{position:'absolute',right:60}}>
                            <Button onClick={()=>this.setState({showset:false})} >
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
        )
    }
}
