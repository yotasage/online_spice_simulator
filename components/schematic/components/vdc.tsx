import React from "react";

import Electrons from '/components/schematic/electrons'

class Vdc extends React.Component {
    constructor(props) {
        super(props);
        this.p1 = {x: 0, y: 0};
        // this.state = { counter: 0 };
        // this.handleClick = this.handleClick.bind(this);
    }



    render() {
        var Omega = '\u03A9';

        var origin_global = {x: this.props.origin.x, y: this.props.origin.y};
        var origin = {x: 0, y: 0};
        
        const translate_group = "translate(".concat(origin_global.x.toString(), ",", origin_global.y.toString(), ")");

        const pin_length = 20

        var p1_coord = {x: origin.x, y: origin.y - pin_length};
        var p2_coord = {x: origin.x, y: origin.y + pin_length + 20};

        this.p1 = {x: origin_global.x - origin.x, y: origin_global.y - origin.y - pin_length};

        var p1_path = "M".concat(p1_coord.x, ",", p1_coord.y, "l0,", pin_length.toString())
        var p2_path = "M".concat(p2_coord.x, ",", p2_coord.y, "l0,", -pin_length.toString())
        
        var p12_vect = {x: p2_coord.x - p1_coord.x, y: p2_coord.y - p1_coord.y}
        var current_path = "M".concat(p1_coord.x, ",", p1_coord.y, "  L" , p2_coord.x, ",", p2_coord.y.toString())
        var current_path_length = Math.sqrt(Math.pow(p12_vect.x, 2) + Math.pow(p12_vect.y, 2))

        var current_rects = []
        for (var i = 0; i < current_path_length/10; i++) {
            current_rects.push(<Electrons index={i} start={p1_coord} stop={p2_coord}></Electrons>)
        }

        return (
        <g className="electricalComponent vdc" id={this.props.name} transform={translate_group}>
            <text 
                x="11" 
                y="8" 
                fontSize="8"
                //textLength='10'
                fill="#fff"
                >{this.props.name}</text>

            <text 
                x="11" 
                y="18" 
                fontSize="8"
                //textLength='10'
                fill="#fff"
                >{this.props.val} V</text>

            <ellipse
                cx={p1_coord.x}
                cy={p1_coord.y}
                fill="#fff"
                stroke="#fff"
                pointerEvents="all"
                rx="1.2"
                ry="1.2"
            ></ellipse>

            <ellipse
                cx={0}
                cy={10}
                fill="none"
                stroke="#fff"
                pointerEvents="all"
                rx="10"
                ry="10"
            ></ellipse>

            <ellipse
                cx={p2_coord.x}
                cy={p2_coord.y}
                fill="#fff"
                stroke="#fff"
                pointerEvents="all"
                rx="1.2"
                ry="1.2"
            ></ellipse>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d={p1_path}
                pointerEvents="stroke"
            ></path>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d={p2_path}
                pointerEvents="stroke"
            ></path>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d="M-2.5,5 l5,0 l-2.5,0 l0,2.5 l0,-5"
                pointerEvents="stroke"
            ></path>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d="M-2.5,15 l5,0"
                pointerEvents="stroke"
            ></path>

            {current_rects}

            <path
                fill="none"
                stroke="none"
                strokeMiterlimit="10"
                d={current_path}
                pointerEvents="stroke"
            ></path>
        </g>);
    }
}

export default Vdc;