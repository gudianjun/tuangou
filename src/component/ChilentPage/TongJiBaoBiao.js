import React,{Component} from "react"
import {Grid, Header, Button, Segment, Table, Icon, Divider, Label, Input, GridRow} from "semantic-ui-react"
import {MainContext} from './ObjContext'
import PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";
import Common from "../../common/common"
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Legend,
    Coordinate,
    Interval,
    Interaction } from 'bizcharts';
import DataSet from "@antv/data-set";
import XiaoShouPaiHang from "../../pages/XiaoShouPaiHang";
import YingYee from "../../pages/BaoBiao/YingYeE";
import JingShouYi from "../../pages/BaoBiao/JingShouYi";
import XiaoSHouTicheng from "../../pages/BaoBiao/XiaoShouTicheng";

// 销售类别占比
class ComTypePie extends React.Component {
    constructor(props, context){
        super(props)
        this.state={}
    }
    static propTypes = {
        datas:PropTypes.array
    }

    render() {
        var data = []
        var totel = 0.0

        for(var i=0;i<this.props.datas.length;i++){
            totel = totel + this.props.datas[i].ITEM_XS_PRICE - this.props.datas[i].ITEM_TH_PRICE
        }
        for(i=0;i<this.props.datas.length;i++){
            data.push({
                item: this.props.datas[i].COM_TYPE_ID,
                count: this.props.datas[i].ITEM_XS_PRICE - this.props.datas[i].ITEM_TH_PRICE, 
                percent: totel===0?0:(this.props.datas[i].ITEM_XS_PRICE - this.props.datas[i].ITEM_TH_PRICE) / totel
            })
        }


        var cols = {
            percent: {
              formatter: val => {
                return `${(val * 100).toFixed(2)}%`;
              },
            },
          };
          return (
            <Chart
                height={400}
                data={data}
                scale={cols}
                autoFit
                placeholder
                // interactions={['element-selected']}
            >
                <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
                <Tooltip showTitle={false} />
                <Axis visible={false} />
                <Interval
                shape="sliceShape"
                position="percent"
                adjust="stack"
                color="item"
                label={['count', {
                    content: d => {
                    return `${d.item}: ${(d.percent * 100).toFixed(2)}%`;
                    },
                }]}
                />
                 <Legend itemName={{ formatter: () => '' }} itemValue={
                    { 
                        formatter: (e) => e
                    }
                    } />

                  
                <Interaction type="element-selected" />
            </Chart>
          );
    
    }
  }

// 商店销售占比
class ShopPie extends React.Component {
    constructor(props, context){
        super(props)
        this.state={}
    }
    static propTypes = {
        datas:PropTypes.array
    }

    render() {
        var data = []
        var totel = 0.0

        for(var i=0;i<this.props.datas.length;i++){
            totel = totel + this.props.datas[i].TOTAL_XS - this.props.datas[i].TOTAL_TH
        }
        for(i=0;i<this.props.datas.length;i++){
            data.push({
                item: this.props.datas[i].SHOP_NAME,
                count: this.props.datas[i].TOTAL_XS - this.props.datas[i].TOTAL_TH, 
                percent: totel===0?0:(this.props.datas[i].TOTAL_XS - this.props.datas[i].TOTAL_TH) / totel
            })
        }


        var cols = {
            percent: {
              formatter: val => {
                return `${(val * 100).toFixed(2)}%`;
              },
            },
          };
          return (
            <Chart
                height={400}
                data={data}
                scale={cols}
                autoFit
                placeholder
                // interactions={['element-selected']}
            >
                <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
                <Tooltip showTitle={false} />
                <Axis visible={false} />
                <Interval
                shape="sliceShape"
                position="percent"
                adjust="stack"
                color="item"
                label={['count', {
                    content: d => {
                    return `${d.item}: ${(d.percent * 100).toFixed(2)}%`;
                    },
                }]}
                />
                 <Legend itemName={{ formatter: () => '' }} itemValue={
                    { 
                        formatter: (e) => e
                    }
                    } />

                  
                <Interaction type="element-selected" />
            </Chart>
          );
    
    }
  }
// 商品销售top10
class Top10 extends React.Component {
    constructor(props, context){
        super(props)
        this.state={}
    }
    static propTypes = {
        datas:PropTypes.array
    }

    render() {
        var data = []
        var totel = 0.0
        var nMax = Math.min(this.props.datas.length, 10)
        for(var i=0;i<nMax;i++){
            totel = totel + this.props.datas[i].ITEM_XS_PRICE - this.props.datas[i].ITEM_TH_PRICE
        }
        for(i=0;i<nMax;i++){
            data.push({
                item: this.props.datas[i].ITEM_NAME,
                 count: this.props.datas[i].ITEM_XS_PRICE - this.props.datas[i].ITEM_TH_PRICE, 
                 percent: totel===0?0:(this.props.datas[i].ITEM_XS_PRICE - this.props.datas[i].ITEM_TH_PRICE) / totel
            })
        }


        var cols = {
            percent: {
              formatter: val => {
                return `${(val * 100).toFixed(2)}%`;
              },
            },
          };
          return (
            <Chart
                height={400}
                data={data}
                scale={cols}
                autoFit
                placeholder
                // interactions={['element-selected']}
            >
                <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
                <Tooltip showTitle={false} />
                <Axis visible={false} />
                <Interval
                shape="sliceShape"
                position="percent"
                adjust="stack"
                color="item"
                label={['count', {
                    content: d => {
                    return `${d.item}: ${(d.percent * 100).toFixed(2)}%`;
                    },
                }]}
                />
                 <Legend itemName={{ formatter: () => '' }} itemValue={
                    { 
                        formatter: (e) => e
                    }
                    } />

                  
                <Interaction type="element-selected" />
            </Chart>
          );
    
    }
  }
  
class KeDanJia extends React.Component {
    constructor(props, context){
        super(props)
        this.state={}
    }
    static propTypes = {
        datas:PropTypes.array
    }

    render() {
        var data = []
        this.props.datas.forEach(element => {
            data.push({
                time: element.TEDAY,
                call: element.TOTAL_XS_COUNT,
                TotalSales:  element.TOTAL_XS,
                OrderCount: element.TOTAL_XS_COUNT === 0? 0: (element.TOTAL_XS / element.TOTAL_XS_COUNT).toFixed(2),
            })
        });

        const scale = {
            call: {
              min: 0
            },
            OrderCount: {
              min: 0
            },
            TotalSales: {
              min: 0
            }
          };
          let chartIns = null;
          return (
            <div>
              <Chart forceFit
                scale={scale}
                height={200}
                data={data}
                onGetG2Instance={chart => {
                  chartIns = chart;
                  chartIns.on('interval:mouseenter', e => {
                    chartIns.geometries.forEach(g => {
                      if (g.type === 'interval') {
                        (g.getShapes() || []).forEach(s => {
                          s.set('origin_fill',s.get('attrs').fill);
                          s.attr('fill', 'red');
                        });
                      }
                    });
                  });
                  chartIns.on('interval:mouseleave', e => {
                    chartIns.geometries.forEach(g => {
                      if (g.type === 'interval') {
                        (g.getShapes() || []).forEach(s => {
                          s.attr('fill',s.get('origin_fill'));
                        });
                      }
                    });
                  });
                }}
              >
                <Legend
                  custom={true}
                  allowAllCanceled={true}
                  
                  items={[
                    {
                        id:"TotalSales",
                        name:"合计销售额",
                        value: "TotalSales",
                        marker: {
                            symbol: "square",
                            fill: "#3182bd",
                            radius: 5
                        }
                    },
                    {
                        id:"OrderCount",
                        name:"订单总数",
                        value: "OrderCount",
                        marker: {
                            symbol: "square",
                            fill: "#ffae6b",
                            radius: 5
                        }
                    }
                  ]}
                  onChange={ev => {
                    const item = ev.item;
                    const value = item.value;
                    const checked = !ev.item.unchecked;
                    const geoms = chartIns.geometries;
      
                    for (let i = 0; i < geoms.length; i++) {
                      const geom = geoms[i];
      
                      if (geom.getYScale().field === value) {
                        if (checked) {
                          geom.show();
                        } else {
                          geom.hide();
                        }
                      }
                    }
                  }}
                />
                <Axis
                  name="OrderCount"
                  grid={null}
                  label={{
                    textStyle: {
                      fill: "#fdae6b"
                    }
                  }}
                />
                <Axis
                  name="TotalSales"
                  grid={null}
                  label={{
                    textStyle: {
                      fill: "#fdae6b"
                    }
                  }}
                />
                <Tooltip />
                <Geom type="interval" position="time*TotalSales" color="#3182bd" />
                <Geom
                  type="line"
                  position="time*OrderCount"
                  color="#fdae6b"
                  size={3}
                  shape="smooth"
                />
                <Geom
                  type="point"
                  position="time*OrderCount"
                  color="#fdae6b"
                  size={3}
                  shape="circle"
                />
              </Chart>
            </div>
          );
       
      }
  }

// 累计销售额
class Groupedcolumn2 extends React.Component {
    constructor(props, context){
        super(props)
        this.state={}
    }
    static propTypes = {
        datas:PropTypes.array
    }

    jianMonth(year, month, count){
        var m = month - count
        var y = year
        if(m <= 0){
            m = 12 + m
            y = y - 1
        }

        return {year: y, month:m}
    }

    render() {
        var data = []

        var leiji = 0
        this.props.datas.forEach(element => {
            leiji = leiji +  (element.TOTAL_XS - element.TOTAL_TH) - (element.TOTAL_XS_COST - element.TOTAL_TH_COST + element.TOTAL_XH_COST)
            data.push({
                year:element.TEDAY,
                value:leiji
            })
        });
        

        const cols = {
          value: {
            min: 0,
            range:[0,0.93],
            alias:'累计净收入'
          },
          year: {
            range: [0, 0.9],
            alias:'月份'
          }
        };
        return (
          <div>
            <Chart height={200} data={data} scale={cols} forceFit>
              <Axis name="year" title={{
                  position:'end',
                  offset:15,
                  textStyle: {
                    fontSize: '12',
                    textAlign: 'center',
                    fill: '#999',
                    fontWeight: 'bold',
                    rotate: 0,
                    autoRotate:true
                }
              }} />
              <Axis name="value"  title={{
                  position:'end',
                  offset:5.5,
                  textStyle: {
                    fontSize: '12',
                    textAlign: 'right',
                    fill: '#999',
                    fontWeight: 'bold',
                    rotate: 0
                }
              }}/>
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom type="line" position="year*value" size={2} 
                tooltip={['year*value',(year,value)=>{
                  return {
                      name:'累计净收入', // 要显示的名字
                      value:value,
                      title:year
                  }
              }]} />
              <Geom
                type="point"
                position="year*value"
                size={4}
                shape={"circle"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
                tooltip={['year*value',(year,value)=>{
                  return {
                      name:'累计净收入', // 要显示的名字
                      value:value,
                      title:year
                  }
              }]}
              />
            </Chart>
          </div>
        );
      }
  }

// 销售情况汇总
// class Groupedcolumn extends React.Component {
//
//     constructor(props, context){
//         super(props)
//         this.state={}
//     }
//     static propTypes = {
//         datas:PropTypes.array
//     }
//
//     jianMonth(year, month, count){
//         var m = month - count
//         var y = year
//         if(m <= 0){
//             m = 12 + m
//             y = y - 1
//         }
//
//         return {year: y, month:m}
//     }
//
//     render() {
//         var dv = {}
//         if(this.props.datas !== undefined){
//             var data = []
//
//
//             var fields = [
//             ]
//
//             var xiaoshou = {
//                 name:'实际销售额'
//             }
//             this.props.datas.forEach(element => {
//                 xiaoshou[element.TEDAY] = (element.TOTAL_XS - element.TOTAL_TH)
//                 fields.push(element.TEDAY)
//             });
//             data.push(xiaoshou)
//
//             var chengben = {
//                 name:'销售成本'
//             }
//             this.props.datas.forEach(element => {
//                 chengben[element.TEDAY] = (element.TOTAL_XS_COST - element.TOTAL_TH_COST + element.TOTAL_XH_COST)
//             });
//             data.push(chengben)
//
//             var jingyingli = {
//                 name:'净盈利'
//             }
//             this.props.datas.forEach(element => {
//                 jingyingli[element.TEDAY] = ((element.TOTAL_XS - element.TOTAL_TH) - (element.TOTAL_XS_COST - element.TOTAL_TH_COST + element.TOTAL_XH_COST))
//             });
//             data.push(jingyingli)
//
//             const ds = new DataSet();
//             dv = ds.createView().source(data);
//             dv.transform({
//                 type: "fold",
//                 fields: fields,
//                 // 展开字段集
//                 key: "月份",
//                 // key字段
//                 value: "销售额" // value字段
//             });
//         }
//       return (
//         <div>
//           <Chart height={200} data={dv} forceFit>
//             <Axis name="月份" />
//             <Axis name="销售额" />
//             <Legend position="right"/>
//             <Tooltip
//               crosshairs={{
//                 type: "y"
//               }}
//             />
//             <Geom
//               type="intervalStack"
//               position="月份*销售额"
//               color={"name"}
//               adjust={[
//                 {
//                   type: "dodge",
//                   marginRatio: 1 / 32
//                 }
//               ]}
//             />
//           </Chart>
//         </div>
//       );
//
//     }
//   }


export default class TongJiBaoBiao extends Component{
    static contextType = MainContext;

    // 减去月份
    jianMonth(year, month, count){
        var m = month - count
        var y = year
        if(m <= 0){
            m = 12 + m
            y = y - 1
        }

        return {year: y, month:m}
    }

    constructor(props, context){
        super(props)
        this.state={
            datas:{
                'month12s': [],
                'items': [],
                'shops': [],
                'comtypes': [],
                'months': [],
                'cangkuinfo': [],
                'shopcoms': [],
                'coms': []
            },
            showCK:false,
            setShowCK:this.setShowCK.bind(this),
            selitemid:-1,
            selcomtypeid:'',
            orderSearchText:"", //　会员详细订单搜索文本
            selitemname:'',
            SEL_YEAR:(new Date(+new Date() + 8 * 3600 * 1000)).getFullYear(),
            SEL_MONTH:(new Date(+new Date() + 8 * 3600 * 1000)).getMonth() + 1,
            selmonth:0, // 默认选择当前月
            months:[
                this.jianMonth((new Date(+new Date() + 8 * 3600 * 1000)).getFullYear(), (new Date(+new Date() + 8 * 3600 * 1000)).getMonth() + 1, 0 ),
                this.jianMonth((new Date(+new Date() + 8 * 3600 * 1000)).getFullYear(), (new Date(+new Date() + 8 * 3600 * 1000)).getMonth() + 1, 1 ),
                this.jianMonth((new Date(+new Date() + 8 * 3600 * 1000)).getFullYear(), (new Date(+new Date() + 8 * 3600 * 1000)).getMonth() + 1, 2 ),
                this.jianMonth((new Date(+new Date() + 8 * 3600 * 1000)).getFullYear(), (new Date(+new Date() + 8 * 3600 * 1000)).getMonth() + 1, 3 ),
                this.jianMonth((new Date(+new Date() + 8 * 3600 * 1000)).getFullYear(), (new Date(+new Date() + 8 * 3600 * 1000)).getMonth() + 1, 4 ),
                this.jianMonth((new Date(+new Date() + 8 * 3600 * 1000)).getFullYear(), (new Date(+new Date() + 8 * 3600 * 1000)).getMonth() + 1, 5 )
            ]
        }
        this.getdata()
    }
    setShowCK(show){
        this.setState({showCK: show})
    }
    getdata(){
        // 获取查询数据， 默认为当天
        Common.sendMessage(Common.baseUrl + "/statistics/tongji" // 请求数据汇总
            , "POST"
            , null
            , {SEL_YEAR:this.state.SEL_YEAR, SEL_MONTH:this.state.SEL_MONTH}
            , null
            , (e)=>{
                this.setState({
                    datas:e.data
                })
            },(e)=>{
                const {setMainContext} = this.context
                setMainContext({
                    errorMessage:e
                })
            },
            this.context)
    }

    getOrder(month12s){
        if(month12s === undefined){
            return
        }
        var data = []

        var xiaoshou = {
            name:'实际销售'
        }
        var fields = []
        month12s.forEach(element => {
            xiaoshou[element.TEDAY] = Common.formatCurrency(element.TOTAL_XS - element.TOTAL_TH)
            fields.push(element.TEDAY)
        });
        data.push(xiaoshou)

        var chengben = {
            name:'销售成本'
        }
        month12s.forEach(element => {
            chengben[element.TEDAY] = Common.formatCurrency(element.TOTAL_XS_COST - element.TOTAL_TH_COST + element.TOTAL_XH_COST)
        });
        data.push(chengben)

        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
        type: "fold",
        fields: fields,
        // 展开字段集
        key: "月份",
        // key字段
        value: "销售额" // value字段
        });
        return dv
    }

    onMonthClick(month){
        this.setState({
            selmonth: month,
            SEL_YEAR: this.state.months[month].year,
            SEL_MONTH: this.state.months[month].month
        }, ()=>this.getdata())
    }
    getTubiao1(){
        console.log('getTubiao1')
        if (this.state.datas.month12s.length>0){
            return (<YingYee datas={this.state.datas.month12s}></YingYee>)
        }
    }
    getTubiaoLeiji(){
        if (this.state.datas.month12s.length>0){
            return (<JingShouYi datas={this.state.datas.month12s}></JingShouYi>)
        }
    }
    getKeDanJia(){
        if (this.state.datas.month12s.length>0){
            return (<XiaoSHouTicheng datas={this.state.datas.month12s}/>)
        }
    }
    getCangKuInxi(){
        if (this.state.datas.cangkuinfo.length>0){
            return (
                <Grid.Row>
                    <Grid.Column width={4}><Segment inverted color='red'>会员存货总成本：{Common.formatCurrency(this.state.datas.cangkuinfo[1].ITEM_COST)}</Segment></Grid.Column>
                    <Grid.Column width={4}><Segment inverted color='orange'>会员存货总数量：{Common.formatCurrency(this.state.datas.cangkuinfo[1].ITEM_COUNT)}</Segment></Grid.Column>
                    <Grid.Column width={4}><Segment inverted color='red'>库存存货总成本：{Common.formatCurrency(this.state.datas.cangkuinfo[0].ITEM_COST)}</Segment></Grid.Column>
                    <Grid.Column width={4}><Segment inverted color='orange'>库存存货总数量：{Common.formatCurrency(this.state.datas.cangkuinfo[0].ITEM_COUNT)}</Segment></Grid.Column>
                </Grid.Row>
            )
        }
    }
    getTop10(){
         if (this.state.datas.items.length>0){
             return <Top10 datas={this.state.datas.items}></Top10>
         }
    }
    getShopPie(){
        if (this.state.datas.shops.length>0){
            return <ShopPie datas={this.state.datas.shops}></ShopPie>
        }
   } 
   getComTypePie(){
        if (this.state.datas.comtypes.length>0){
            return <ComTypePie datas={this.state.datas.comtypes}></ComTypePie>
        }
   }
    getBengYueXiaoShou(){
        if (this.state.datas.months.length>0){
            return (
              <Grid.Row>
                <Grid.Column width={8}>
                    <Segment inverted color='violet'>本月销售金额：{Common.formatCurrency(this.state.datas.months[0].TOTAL_XS - this.state.datas.months[0].TOTAL_TH)}</Segment>
                </Grid.Column>
                <Grid.Column  width={8}> <Segment inverted color='violet'>本月净利润：{
                    Common.formatCurrency((this.state.datas.months[0].TOTAL_XS - this.state.datas.months[0].TOTAL_TH) -
                    (this.state.datas.months[0].TOTAL_XS_COST - 
                    this.state.datas.months[0].TOTAL_TH_COST + this.state.datas.months[0].TOTAL_XH_COST))}</Segment></Grid.Column>
                </Grid.Row>
            )
        }
    }
    // 获得分类表中的行数据
    getCOMRows(){
      if (this.state.datas.coms.length>0){
      var items = []

      this.state.datas.shopcoms.forEach(element => {
        var rowcoms = []
        this.state.datas.coms.forEach(comtype=>{
          rowcoms.push(
            <Table.Cell  textAlign='right' key={element.SHOP_ID.toString() + '_' + comtype}>{Common.formatCurrency(element[comtype])}</Table.Cell>
          )

        })

        items.push(
          <Table.Row key={'KEY_' + element.SHOP_ID.toString()}>
            <Table.Cell>{element.SHOP_NAME}</Table.Cell>
            {rowcoms}
            <Table.Cell textAlign='right'>{Common.formatCurrency(element.ITEM_XS_PRICE)}</Table.Cell>
            <Table.Cell textAlign='right'>{Common.formatCurrency(element.ITEM_TH_PRICE)}</Table.Cell>
            <Table.Cell textAlign='right'>{Common.formatCurrency(element.REAL_XS_PRICE)}</Table.Cell>
            <Table.Cell textAlign='right'>{Common.formatCurrency(element.REAL_SHOURU)}</Table.Cell>

          </Table.Row>
        )
      });
      return (
        <Table.Body>
          {items}
        </Table.Body>
      )  
    }
    }
    toPercent(point){
      var str=Number(point*100).toFixed(2);
      str+="%";
      return str;
  }
    // 获取商品汇总
    getItemRows(){
        console.log('获取商品汇总')

      if (this.state.datas.items.length>0){
        var items = []
        var index = 0
        var hejiuxiaoshou = 0
        this.state.datas.items.forEach(element => {
          hejiuxiaoshou = hejiuxiaoshou+ (element.ITEM_XS_PRICE - element.ITEM_TH_PRICE)

        })

        this.state.datas.items.forEach(element => {
            let index = 0
            if(this.state.orderSearchText.length>0){
                index = (element.COM_TYPE_ID.toUpperCase() + element.ITEM_ID.toString() + element.ITEM_NAME).indexOf(this.state.orderSearchText.toUpperCase())
            }
           if(index<0){
               return
           }
          var shangsheng = '上升'
          var panduan = (element.ITEM_XS_PRICE - element.ITEM_TH_PRICE) - (element.BF_ITEM_XS_PRICE - element.BF_ITEM_TH_PRICE)
          if (panduan > 0){shangsheng = '↗'}
          else if (panduan === 0){shangsheng = '='}
          else if (panduan < 0){shangsheng = '↓'}
          items.push(
            <Table.Row key={element.COM_TYPE_ID + element.ITEM_ID}>
              <Table.Cell>{index}</Table.Cell>
              <Table.Cell>
                  <Label onClick={()=>{
                    this.setState({
                        showCK:true,
                        selitemid:element.ITEM_ID,
                        selcomtypeid:element.COM_TYPE_ID,
                        selitemname:element.ITEM_NAME,
                    })
                  }} color='blue'>
                      {element.ITEM_NAME}
                  </Label>
                  </Table.Cell>
              <Table.Cell>{element.COM_TYPE_ID + element.ITEM_ID}</Table.Cell>
              <Table.Cell textAlign='right'>{Common.formatCurrency(element.ITEM_XS_PRICE - element.ITEM_TH_PRICE)}</Table.Cell>
              <Table.Cell textAlign='right'>{element.ITEM_XS_NUMBER - element.ITEM_TH_NUMBER}</Table.Cell>
              <Table.Cell textAlign='right'>{Common.formatCurrency(element.ITEM_XS_COST - element.ITEM_TH_COST)}</Table.Cell>
              <Table.Cell textAlign='right'>{this.toPercent(hejiuxiaoshou === 0? 0:(element.ITEM_XS_PRICE - element.ITEM_TH_PRICE)/hejiuxiaoshou)}</Table.Cell>
              <Table.Cell textAlign='right'>{Common.formatCurrency(element.BF_ITEM_XS_PRICE - element.BF_ITEM_TH_PRICE)}</Table.Cell>
              <Table.Cell textAlign='center'>{shangsheng}</Table.Cell>
          </Table.Row>
          )
        });
        return (<Table.Body>
                          {items}
                      </Table.Body>)
      }
    }
    getcomHeadle(){
      if (this.state.datas.coms.length>0){
        var items = []

        this.state.datas.coms.forEach(element => {
          items.push(
            <Table.HeaderCell key={element}>{element}</Table.HeaderCell>
          )
        });

        return (
            <Table.Header>
                <Table.Row key='0'>
                    <Table.HeaderCell rowSpan='2'>店铺名称</Table.HeaderCell>
                    <Table.HeaderCell colSpan={this.state.datas.coms.length}>销售分类</Table.HeaderCell>
                    <Table.HeaderCell rowSpan='2'>销售总额</Table.HeaderCell>
                    <Table.HeaderCell rowSpan='2'>退货金额</Table.HeaderCell>
                    <Table.HeaderCell rowSpan='2'>实际销售</Table.HeaderCell>
                    <Table.HeaderCell rowSpan='2'>纯利润</Table.HeaderCell>
                </Table.Row>
                <Table.Row key='1'>
                    {items}
                </Table.Row>
            </Table.Header>
            )
      }
    }
    render(){
       

        return(
            <div style={{ minHeight:800}}>             
                <Grid>
                    <Grid.Row  >
                        <Grid.Column width={5}>
                            <GridRow>
                            {this.getTubiao1()}
                            </GridRow>
                            <GridRow>
                            月销售额
                            </GridRow>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <GridRow>
                            {this.getTubiaoLeiji()}
                            </GridRow>
                            <GridRow>
                                月净收益
                            </GridRow>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <GridRow>
                            {this.getKeDanJia()}
                            </GridRow>
                            <GridRow>
                                月净收益
                            </GridRow>
                        </Grid.Column>
                    </Grid.Row>
                       
                        {this.getCangKuInxi()}
                        {this.getBengYueXiaoShou()}
                    <Grid.Row> 
                        
                        <Grid.Column width={5}>{this.getTop10()}</Grid.Column>
                        <Grid.Column width={6}>{this.getShopPie()}</Grid.Column>
                        <Grid.Column width={5}>{this.getComTypePie()}</Grid.Column>
                    </Grid.Row>

                    <Grid.Row> 
                        <Button.Group>
                            <Button onClick={()=>this.onMonthClick(5)} color={this.state.selmonth === 5 ? 'red' : 'grey' }>{this.state.months[5].year + '年' + this.state.months[5].month + '月'}</Button>
                            <Button.Or />
                            <Button  onClick={()=>this.onMonthClick(4)} color={this.state.selmonth === 4 ? 'red' : 'grey' }>{this.state.months[4].year + '年' + this.state.months[4].month + '月'}</Button>
                            <Button.Or />
                            <Button  onClick={()=>this.onMonthClick(3)} color={this.state.selmonth === 3 ? 'red' : 'grey' }>{this.state.months[3].year + '年' + this.state.months[3].month + '月'}</Button>
                            <Button.Or />
                            <Button  onClick={()=>this.onMonthClick(2)} color={this.state.selmonth === 2 ? 'red' : 'grey' }>{this.state.months[2].year + '年' + this.state.months[2].month + '月'}</Button>
                            <Button.Or />
                            <Button  onClick={()=>this.onMonthClick(1)} color={this.state.selmonth === 1 ? 'red' : 'grey' }>{this.state.months[1].year + '年' + this.state.months[1].month + '月'}</Button>
                            <Button.Or />
                            <Button  onClick={()=>this.onMonthClick(0)} color={this.state.selmonth === 0 ? 'red' : 'grey' } >{this.state.months[0].year + '年' + this.state.months[0].month + '月'}</Button>
                        </Button.Group>
                    </Grid.Row>
                </Grid>
                <Divider horizontal>
                <Header as='h4'>
                    <Icon name='bar chart' />
                    Specifications
                </Header>
                </Divider>

                <Table  celled structured>
                    {this.getcomHeadle()}
                    {this.getCOMRows()}
                </Table>
                <Divider horizontal>
                <Header as='h4'>
                    <Icon name='bar chart' />
                    Specifications
                </Header>
                </Divider>
                <Input icon='search' size='small' placeholder='Search...'  onChange={(e,f)=>{this.setState({orderSearchText:f.value})}} />
                <Table  celled structured>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell>序号</Table.HeaderCell>
                            <Table.HeaderCell>商品名称</Table.HeaderCell>
                            <Table.HeaderCell>商品编号</Table.HeaderCell>
                            <Table.HeaderCell>销售金额</Table.HeaderCell>
                            <Table.HeaderCell>销售数量</Table.HeaderCell>
                            <Table.HeaderCell>销售成本</Table.HeaderCell>

                            <Table.HeaderCell>销售占比</Table.HeaderCell>

                            <Table.HeaderCell>上月销售额</Table.HeaderCell>
                            <Table.HeaderCell>相比上个月</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {this.getItemRows()}
                </Table>
                <XiaoShouPaiHang showCK={this.state.showCK}  setShowCK={this.state.setShowCK}  itemid={this.state.selitemid}   comtypeid={this.state.selcomtypeid}  itemname={this.state.selitemname}></XiaoShouPaiHang>
            </div>
        )
    }
}
