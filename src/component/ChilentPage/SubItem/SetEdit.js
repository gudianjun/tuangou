import React,{Component} from "react"
import {MainContext} from "../ObjContext"
import { Icon, Label, Menu, Grid, Select, Table,Button, Dropdown , Input, Tab, Segment, Modal, Header, Image} from 'semantic-ui-react'
import PropTypes, { element, array, checkPropTypes } from 'prop-types';
import Common from '../../../common/common'
import ItemOrder from "./ItemOrder"
import ItemSelect from "./ItemSelect"

class SetEdit extends Component{
    constructor(props, context){
        super(props)
        this.state = {}
    }

    static contextType = MainContext;

   
    render(){
        return(
            <div>
               <Modal open={this.props.open} trigger={<Button>Long Modal</Button>}>
                    <Modal.Header>编辑套装包含商品</Modal.Header>
                    <Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Column width={"6"}> {/*this.state.items*/}
                                <ItemSelect></ItemSelect>
                            </Grid.Column>
                            <Grid.Column>
                                <ItemOrder opetype={0}></ItemOrder>
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary>
                            Proceed <Icon name='right chevron' />
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}


export default SetEdit