import React,{useState, useEffect, useRef } from "react"
import {Table, Grid, Input, TextArea, Label, Radio, Checkbox, ButtonGroup, Button} from 'semantic-ui-react'
import {element, func} from "prop-types";
import Common from "../../../common/common";
import {MainContext} from "../../../component/ChilentPage/ObjContext";

const ComTypeManage = () =>{
    const {_currentValue} = MainContext;
    const [showall, setShowall] = useState(false)
    const [shoptypes, setShoptypes] = useState([])
    const [editstate, setEditstate] = useState(0) // 0:初始状态，1:编辑现存状态，2:添加状态
    const initFlg = useRef(false);
    const [editObj, setEditObj] = useState({comtypeid:'',comtypename:'',comtypesort:''})
    useEffect(()=>{

    }, [showall])
    function getAllTypes(){
        Common.sendMessage(Common.baseUrl + "/rolemanage/getallcomtype"
            , "POST"
            , null
            , null
            , null
            , (e)=>{
                console.log(e)
                setShoptypes(e.data)
            },null,
            null)
    }
    function onEditItem(flg, value){
        if(flg === "comtypeid") {
            const reg = /^[A-Z0-9]+$/;
            if (reg.test(value) || value === '') {
                setEditObj({comtypeid: value, comtypename: editObj.comtypename,comtypesort:editObj.comtypesort})
            }
        }
        else if(flg === "comtypename"){
            setEditObj({comtypeid: editObj.comtypeid, comtypename: value, comtypesort:editObj.comtypesort})
        }
        else if(flg === "comtypesort"){
            const reg = /^\d+$/;
            if (reg.test(value) || value === '') {
                setEditObj({comtypeid: editObj.comtypeid, comtypename: editObj.comtypename,comtypesort:value})
            }
        }
    }
    function onSaveAddStop(){
        if(editObj.comtypeid.length > 0 && editObj.comtypename.length > 0 && editObj.comtypesort.length > 0){
            Common.sendMessage(Common.baseUrl + "/rolemanage/addcomtype"
                , "POST"
                , null
                , {COM_TYPE_ID:editObj.comtypeid, COM_TYPE_NAME:editObj.comtypename, COM_TYPE_SORT:editObj.comtypesort}
                , null
                , (e)=>{
                    initFlg.current = false
                    setEditstate(0)
                    setEditObj({comtypeid:'',comtypename:'',comtypesort:''})
                },(err)=>{

                    const {setMainContext} = _currentValue
                     setMainContext({
                         errorMessage: err
                     })
                },
                null)
        }
    }
    function addAddRow(){
        if(editstate === 0) {
            return (
                <Table.Row key={"aaaa"}>
                    <Table.Cell collapsing></Table.Cell>
                    <Table.Cell collapsing></Table.Cell>
                    <Table.Cell collapsing></Table.Cell>
                    <Table.Cell collapsing>
                        {
                            (<Button primary onClick={(e) => onAddStop(element)}>添加</Button>)
                        }

                    </Table.Cell>
                </Table.Row>
            )
        }
        else if(editstate === 1){

        }
        else{
            return (
                <Table.Row key={99999}>
                    <Table.Cell collapsing>
                        <Input fluid value={editObj.comtypeid} onChange={(e, f)=>onEditItem('comtypeid', f.value)}></Input>
                    </Table.Cell>
                    <Table.Cell collapsing>
                        <Input fluid value={editObj.comtypename} onChange={(e, f)=>onEditItem('comtypename', f.value)}></Input>
                    </Table.Cell>
                    <Table.Cell collapsing>
                        <Input fluid value={editObj.comtypesort} onChange={(e, f)=>onEditItem('comtypesort', f.value)}></Input>
                    </Table.Cell>
                    <Table.Cell collapsing>
                        {
                            (<Button primary onClick={(e) => onSaveAddStop()}>添加</Button>)
                        }
                        {
                            (<Button primary onClick={(e) => onEditShop()}>取消</Button>)
                        }
                    </Table.Cell>
                </Table.Row>
            )
        }

    }
    function addNormolRow(element){
        if(showall || element.DEL_FLG === 0){
            return (
                <Table.Row key={element.COM_TYPE_ID}>
                    <Table.Cell collapsing>{element.COM_TYPE_ID}</Table.Cell>
                    {
                        (editstate === 1 && element.COM_TYPE_ID === editObj.comtypeid)?
                            (<Table.Cell collapsing>
                                <Input fluid value={editObj.comtypename}
                                       onChange={(e, f)=>
                                           onEditItem('comtypename', f.value)}>
                                </Input></Table.Cell>)
                            :(<Table.Cell collapsing>{element.COM_TYPE_NAME}</Table.Cell>)

                    }
                    {
                        (editstate === 1 && element.COM_TYPE_ID === editObj.comtypeid)?
                            (<Table.Cell collapsing>
                                <Input fluid value={editObj.comtypesort}
                                       onChange={(e, f)=>
                                           onEditItem('comtypesort', f.value)}>
                                </Input></Table.Cell>)
                            :(<Table.Cell collapsing>{element.COM_TYPE_SORT}</Table.Cell>)

                    }
                    <Table.Cell collapsing>
                        {
                            element.DEL_FLG === 0?
                            (
                                <ButtonGroup>
                                 <Button primary onClick={(e) => onDeleteStop(element)}>{
                                            editstate===1 && editObj.comtypeid === element.COM_TYPE_ID? "提交" : "删除"}</Button>
                                    <Button.Or/>
                                    <Button secondary onClick={(e) => onEditShop(element)}>{
                                        editstate===1 && editObj.comtypeid === element.COM_TYPE_ID? "取消" : "编辑"}</Button>
                                </ButtonGroup>
                            )
                            :(<Button secondary onClick={(e) => onRecoverStop(element)}>恢复</Button>)
                        }
                    </Table.Cell>
                </Table.Row>
            )
        }
    }

    function onDeleteStop(element){
        if(editstate === 0) {
            Common.sendMessage(Common.baseUrl + "/rolemanage/deltecomtype"
                , "POST"
                , null
                , {COM_TYPE_ID: element.COM_TYPE_ID}
                , null
                , (e) => {
                    initFlg.current = false

                    setEditstate(0)
                    setEditObj({comtypeid:'',comtypename:'',comtypesort:''})
                }, (err) => {

                    const {setMainContext} = _currentValue
                    setMainContext({
                        errorMessage: err
                    })
                },
                null)
        }
        else if(editstate === 1 && element.COM_TYPE_ID === editObj.comtypeid) { // 编辑状态
            Common.sendMessage(Common.baseUrl + "/rolemanage/editcomtype"
                , "POST"
                , null
                , {COM_TYPE_ID:editObj.comtypeid, COM_TYPE_NAME:editObj.comtypename, COM_TYPE_SORT:editObj.comtypesort}
                , null
                , (e) => {
                    initFlg.current = false
                    setEditstate(0)
                    setEditObj({comtypeid:'',comtypename:'',comtypesort:''})
                }, (err) => {

                    const {setMainContext} = _currentValue
                    setMainContext({
                        errorMessage: err
                    })
                },
                null)
        }

    }
    function onEditShop(element){
        if(editstate === 0) {
            setEditstate(1)
            setEditObj({comtypeid:element.COM_TYPE_ID,comtypename:element.COM_TYPE_NAME,comtypesort:element.COM_TYPE_SORT})
        }
        else if(editstate === 1 && element.COM_TYPE_ID === editObj.comtypeid) {
            setEditstate(0)
            setEditObj({comtypeid:'',comtypename:'',comtypesort:''})
        }
        else if(editstate === 2  ) {
            setEditstate(0)
            setEditObj({comtypeid:'',comtypename:'',comtypesort:''})
        }
    }
    function onRecoverStop(element){
        Common.sendMessage(Common.baseUrl + "/rolemanage/deltecomtype "
            , "POST"
            , null
            , {COM_TYPE_ID:element.COM_TYPE_ID, DEL_FLG:0}
            , null
            , (e)=>{
                initFlg.current = false
                setEditstate(0)
                setEditObj({comtypeid:'',comtypename:'',comtypesort:''})
            },(err)=>{

                const {setMainContext} = _currentValue
                setMainContext({
                    errorMessage: err
                })
            },
            null)
    }
    function onAddStop(){
        setEditstate(2)
    }
    if(initFlg.current === false) {
        initFlg.current = true
        getAllTypes()
    }

    return (
        <div>

            <Table celled selectable fixed >
                <Table.Header  >
                    <Table.Row>
                        <Table.HeaderCell >商品类型ID</Table.HeaderCell>
                        <Table.HeaderCell >商品类型名称</Table.HeaderCell>
                        <Table.HeaderCell >排序</Table.HeaderCell>
                        <Table.HeaderCell width={3} >
                            <Radio toggle label='显示全部' checked={showall}
                                   onChange={(e,f)=>setShowall(f.checked)}>
                            </Radio>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body >
                    {
                        shoptypes.map(element=>{
                            return addNormolRow(element)
                        })
                    }
                    {
                        addAddRow()
                    }
                </Table.Body>
            </Table>

        </div>
    );

}
export default ComTypeManage;