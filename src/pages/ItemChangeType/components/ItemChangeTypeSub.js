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
    SegmentGroup, GridColumn, GridRow
} from 'semantic-ui-react'
import ComTypeDropDown from "./ComTypeDropDown";
import ItemDropDown from "./ItemDropDown";
import ItemWHGrid from "./ItemWHGrid";

const ItemChangeTypeSub = ({itemInfo, setItemInfo, itemNames, itemsWh}) => {

    const initFlg = useRef(false);
    if(initFlg.current === false) {
        initFlg.current = true
    }
    return (

            <Grid>
                <GridRow color={'blue'}>
                    <GridColumn width={8}><ComTypeDropDown itemInfo={itemInfo} setItemInfo={setItemInfo}></ComTypeDropDown></GridColumn>
                    <GridColumn width={8}><ItemDropDown itemInfo={itemInfo} setItemInfo={setItemInfo} itemNames={itemNames}></ItemDropDown></GridColumn>
                </GridRow>
                <GridRow >
                    <GridColumn width={16}>
                        <ItemWHGrid itemInfo={itemInfo} setItemInfo={setItemInfo} itemsWh={itemsWh}></ItemWHGrid>
                    </GridColumn>
                </GridRow>
            </Grid>
    )
}
export default ItemChangeTypeSub;