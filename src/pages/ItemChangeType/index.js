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
import ItemWhAll from "./components/ItemWhAll";
const ItemChangeType = ({showItemChangeType, setShowItemChangeType}) =>{
    return (
        <div>
            <Modal open={showItemChangeType} size={'fullscreen'}>
                <Modal.Header>
                    商品类别更换
                    <ButtonGroup style={{position:'absolute',right:60}}>
                        <Button onClick={()=>setShowItemChangeType(false)} >
                            关闭
                        </Button>
                    </ButtonGroup>
                </Modal.Header>
                <Modal.Content>
                    <ItemWhAll></ItemWhAll>
                </Modal.Content>
                <Modal.Actions>
                    将原始商品的所有库存平移到目标商品的仓库中
                </Modal.Actions>
            </Modal>
        </div>
    );

}
export default ItemChangeType;