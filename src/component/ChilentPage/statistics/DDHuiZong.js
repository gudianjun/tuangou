import React,{Component} from "react"
import { Icon, Label, Menu, Table,Button , Grid, Segment, Pagination} from 'semantic-ui-react'
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
            activePage:-1
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

    render(){
        var rows=[]
        if(this.props.datas.length >= 0){
            this.props.datas.forEach(element => {
                // 添加空行
                rows.push(
                    <Table.Row key={element.RELATED_ORDER_ID}>
                        <Table.Cell>{element.RELATED_ORDER_ID}</Table.Cell>
                        <Table.Cell>{element.SHOP_NAME}</Table.Cell>
                        <Table.Cell>{element.OPE_TYPE}</Table.Cell>
                        <Table.Cell>{element.ORDER_TIME}</Table.Cell>
                        <Table.Cell><Button>查看</Button></Table.Cell>
                    </Table.Row>
                )
            });
            
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
            </div>
        )
    }
}
