import React,{Component} from "react"
import {  Label,  Table, Grid} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { MainContext} from '../ObjContext'
import Common from '../../../common/common'
// 定制一个添加按钮

// 销售详细
export default class SSxiangxi extends Component{
    static contextType = MainContext;

    constructor(props, context){
        super(props)
        this.state = {
            
        }
    }
    static propTypes = {
        datas:PropTypes.array
    }

    render(){
        var rows=[]
        var heji = 0.0
        if (this.props.datas !== undefined && this.props.datas.length > 0){
            this.props.datas.forEach(element => {
                rows.push(
                <Table.Row key = {element.COM_TYPE_ID + element.ITEM_ID}>
                    <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID}</Table.Cell>
                    <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.XS_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{Common.formatCurrency(element.XS_ITEM_PRICE)}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.TH_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{Common.formatCurrency(element.TH_ITEM_PRICE)}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.XH_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{Common.formatCurrency(element.XS_TOTLE)}</Table.Cell>
                </Table.Row>
                    )
                    heji+=element.XS_TOTLE
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
                                    <Table.HeaderCell >商品编号</Table.HeaderCell>
                                    <Table.HeaderCell >商品名称</Table.HeaderCell>
                                    <Table.HeaderCell >销售数量</Table.HeaderCell>
                                    <Table.HeaderCell >销售金额</Table.HeaderCell>
                                    <Table.HeaderCell >退货数量</Table.HeaderCell>
                                    <Table.HeaderCell >退货金额</Table.HeaderCell>
                                    <Table.HeaderCell >销毁数量</Table.HeaderCell>
                                    <Table.HeaderCell >收入小计</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                               {rows}
                            </Table.Body>
                            <Table.Footer fullWidth>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='8' textAlign='right'>
                                        <Label size='huge' color='violet'>销售合计:{Common.formatCurrency(heji)}</Label>
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
