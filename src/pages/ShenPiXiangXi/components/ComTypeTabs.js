import React,{useState, useEffect, useRef } from "react"
import {
    Tab,
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
import Common from "../../../common/common";
import {element} from "prop-types";
import SPXiangXiSub from "./SPXiangXiSub";

const ComTypeTabs = ({panes}) => {
    return (
        <Tab panes={panes}></Tab>
    )
}
export default ComTypeTabs;