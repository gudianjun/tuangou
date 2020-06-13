import React,{Component} from "react"
import {  Label,  Table, Grid, } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import {MainContext} from '../ObjContext'
// 定制一个添加按钮

// 仓库详细
export default class KCHuiZong extends Component{
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
        var hejiin = 0
        var hejiout = 0
        if (this.props.datas !== undefined && this.props.datas.length > 0){
            this.props.datas.forEach(element => {
                rows.push(
                <Table.Row key = {element.COM_TYPE_ID + element.ITEM_ID}>
                    <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID}</Table.Cell>
                    <Table.Cell>{element.ITEM_NAME}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.XS_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.TH_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.XH_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.RK_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.CK_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.HC_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.HT_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.CG_ITEM_NUMBER}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.IN_TOTLE}</Table.Cell>
                    <Table.Cell textAlign='right'>{element.OUT_TOTLE}</Table.Cell>
                </Table.Row>
                    )
                    hejiin+=element.IN_TOTLE
                    hejiout+=element.OUT_TOTLE
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
                                    <Table.HeaderCell >退货数量</Table.HeaderCell>
                                    <Table.HeaderCell >销毁数量</Table.HeaderCell>
                                    <Table.HeaderCell >入库数量</Table.HeaderCell>
                                    <Table.HeaderCell >出库数量</Table.HeaderCell>
                                    <Table.HeaderCell >会员存货</Table.HeaderCell>
                                    <Table.HeaderCell >会员提货</Table.HeaderCell>
                                    <Table.HeaderCell >采购入库</Table.HeaderCell>
                                    <Table.HeaderCell >合计入库</Table.HeaderCell>
                                    <Table.HeaderCell >合计出库</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body >
                               {rows}
                            </Table.Body>
                            <Table.Footer fullWidth>
                                <Table.Row>
                                   
                                    <Table.HeaderCell colSpan='12' textAlign='right'>
                                        <Label size='huge' color='violet'>合计入库:{hejiin}</Label>
                                        <Label size='huge' color='olive'>合计出库:{hejiout}</Label>
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
