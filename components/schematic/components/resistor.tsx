import React from "react";

import Electrons from '/components/schematic/electrons'
import {Cell, Pin, Coordinate} from '/components/schematic/cell'

var Omega = '\u03A9';

export default  class Resistor extends Cell {
    constructor(name: string, value: number=100, x: number=0, y: number=0, origin: Coordinate=null) {
        super(name, value, x, y, origin, 2);

        var symbol_length: number = 20

        this.p1.origin.y = this.p1.origin.y - this.p1.length
        this.p2.origin.y = this.p2.origin.y + this.p2.length + symbol_length

        this.unit = Omega;
        this.symbol = <ResistorSymbol instanceName={this.instanceName} val={this.value} origin={this.origin} p1={this.p1} p2={this.p2}></ResistorSymbol>;
    }
}

export function ResistorSymbol(props) {
    const translate_group = "translate(" + props.origin.x + "," + props.origin.y + ")";
    
    var symbol_svg = "M" + props.p1.origin.x + "," + props.p1.origin.y + "l0," + props.p1.length
    
    symbol_svg = symbol_svg.concat(`l5,2.5
                                    l-10,2.5
                                    l10,2.5
                                    l-10,2.5
                                    l10,2.5
                                    l-10,2.5
                                    l10,2.5
                                    l-5,2.5`);
    
    symbol_svg = symbol_svg + "l0," + props.p2.length
    
    var p12_vect = {x: props.p2.origin.x - props.p1.origin.x, y: props.p2.origin.y - props.p1.origin.y}
    var current_path = "M" + props.p1.origin.x + "," + props.p1.origin.y + "  L" + props.p2.origin.x + "," + props.p2.origin.y
    var current_path_length = Math.sqrt(Math.pow(p12_vect.x, 2) + Math.pow(p12_vect.y, 2))

    var current_rects = []
    for (var i = 0; i < current_path_length/10; i++) {
        current_rects.push(<Electrons index={i} start={props.p1.origin} stop={props.p2.origin}></Electrons>)
    }

    return (
        <g className="electricalComponent res" id={props.instanceName} transform={translate_group}>
            <text 
                x="11" 
                y="8" 
                fontSize="8"
                //textLength='10'
                fill="#fff"
                >{props.instanceName}</text>

            <text 
                x="11" 
                y="18" 
                fontSize="8"
                //textLength='10'
                fill="#fff"
                >{props.val} {Omega}</text>

            <ellipse
                cx={props.p1.origin.x}
                cy={props.p1.origin.y}
                fill="#fff"
                stroke="#fff"
                pointerEvents="all"
                rx="1.2"
                ry="1.2"
            ></ellipse>

            <ellipse
                cx={props.p2.origin.x}
                cy={props.p2.origin.y}
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
                d={symbol_svg}
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