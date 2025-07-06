import React from "react";

import {Cell, Pin, Coordinate, Electrons} from "../schematicItems";
import SchematicEditor from "../editor";

export default class Vdc extends Cell {
    _speed: number = 0;

    constructor(parent: SchematicEditor, name: string, value: number=5, x?: number, y?: number, origin?: Coordinate) {
        super(parent, name, value, x, y, origin, 2);
        
        var symbol_length: number = 20

        this.pins[0].name = "p";
        this.pins[1].name = "n";

        this.pins[0].moveRelative(0, this.pins[0].origin.y - this.pins[0].length);
        this.pins[1].moveRelative(0, this.pins[1].origin.y + this.pins[1].length + symbol_length)

        this.unit = 'V';
        this.generateSymbol();
        
    }

    generateSymbol() {
        this.symbol = <VdcSymbol instanceName={this.instanceName} val={this.value} origin={this.origin} p1={this.pins[0]} p2={this.pins[1]} speed={this._speed} key={'vdc_' + this.instanceName}></VdcSymbol>;
    }

    set speed(val: number) {
        this._speed = val;
        this.generateSymbol();
    }

    get speed() {
        return this._speed;
    }
}

export function VdcSymbol(props: any) {
    const translate_group = "translate(" + props.origin.x + "," + props.origin.y + ")";
    
    var current_path_points: Coordinate[] = [props.p1.origin, props.p2.origin];

    var p1_path = "M" + props.p1.origin.x + "," + props.p1.origin.y + "l0," + props.p1.length;
    var p2_path = "M" + props.p2.origin.x + "," + props.p2.origin.y + "l0," + -props.p2.length;

    return (
        <g className="cell vdc" id={props.instanceName} transform={translate_group}>
            <text 
                x="11" 
                y="8" 
                fontSize="8"
                fill="#fff"
                >{props.instanceName}
            </text>

            <text 
                x="11" 
                y="18" 
                fontSize="8"
                fill="#fff"
                >{props.val} V
            </text>

            <ellipse
                cx={0}
                cy={10}
                fill="none"
                stroke="#fff"
                pointerEvents="all"
                rx="10"
                ry="10"
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

            {props.p1.symbol}
            {props.p2.symbol}
            <Electrons points={current_path_points} speed={props.speed}></Electrons>
        </g>);
}