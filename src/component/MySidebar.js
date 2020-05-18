import React,{Component} from "react"
import { Menu, Image, Grid , Label} from "semantic-ui-react"
import Logo from "../Logo/index"
import MenuExampleInvertedVertical from "./MyMenu"
import PropTypes from 'prop-types';

export default class MainForm extends Component{
    constructor(props, context){
        super(props)
        this.state={}
    }

    static propTypes={
        childrenRoute:PropTypes.func
    }
    render(){
        return(
            <div>
            <div className="ui sidebar vertical left menu overlay  borderless visible sidemenu inverted  grey"  style={{width:"100px"}} data-color="grey">
                <div className="something-else-semantic">
                    <div style={{width:"100%", height:"50px", background:"#A00"}}>
                        <div style={{top:"10px", position:"absolute", width:"100%"}}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <Logo ></Logo>
                                    </Grid.Column>
                                    
                                    <Grid.Column width={8}  style={{top:"10px" }}>
                                        <h3 style={{color:"#FFF"}}>{/*写文字*/}</h3>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            
                        </div>
                    </div>
                </div>
                <MenuExampleInvertedVertical childrenRoute = {this.props.childrenRoute}></MenuExampleInvertedVertical>
            </div>
            
            </div>
        )
    }
}
MenuExampleInvertedVertical.propTypes={
    childrenRoute:PropTypes.func
}