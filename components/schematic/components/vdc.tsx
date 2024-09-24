import React from "react";

import {Cell, Pin, Coordinate, Electrons} from "../schematicItems";

export default class Vdc extends Cell {
    constructor(name: string, value: number=5, x: number=0, y: number=0, origin: Coordinate=null) {
        super(name, value, x, y, origin, 2);
        
        var symbol_length: number = 20

        this.p1.origin.y = this.p1.origin.y - this.p1.length
        this.p2.origin.y = this.p2.origin.y + this.p2.length + symbol_length

        this.unit = 'V';
        this.symbol = <VdcSymbol instanceName={this.instanceName} val={this.value} origin={this.origin} p1={this.p1} p2={this.p2}></VdcSymbol>;
    }
}

export function VdcSymbol(props) {
    const translate_group = "translate(" + props.origin.x + "," + props.origin.y + ")";
    
    var p1_path = "M" + props.p1.origin.x + "," + props.p1.origin.y + "l0," + props.p1.length;
    var p2_path = "M" + props.p2.origin.x + "," + props.p2.origin.y + "l0," + -props.p2.length;

    return (
        <g className="electricalComponent vdc" id={props.name} transform={translate_group}>
            <text 
                x="11" 
                y="8" 
                fontSize="8"
                fill="#fff"
                >{props.name}</text>

            <text 
                x="11" 
                y="18" 
                fontSize="8"
                fill="#fff"
                >{props.val} V</text>

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
                cx={0}
                cy={10}
                fill="none"
                stroke="#fff"
                pointerEvents="all"
                rx="10"
                ry="10"
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

            <Electrons start={props.p1.origin} stop={props.p2.origin}></Electrons>
        </g>);
}