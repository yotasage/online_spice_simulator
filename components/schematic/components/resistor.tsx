import React from "react";

import {Cell, Pin, Coordinate, Electrons} from "../schematicItems";

var Omega = '\u03A9';

export default class Resistor extends Cell {
    constructor(name: string, value: number=100, x?: number, y?: number, origin?: Coordinate) {
        super(name, value, x, y, origin, 2);

        var symbol_length: number = 20

        this.pins[0].name = "p";
        this.pins[1].name = "n";

        this.pins[0].moveRelative(0, this.pins[0].origin.y - this.pins[0].length);
        this.pins[1].moveRelative(0, this.pins[1].origin.y + this.pins[1].length + symbol_length)

        this.unit = Omega;
        this.symbol = <ResistorSymbol instanceName={this.instanceName} val={this.value} origin={this.origin} p1={this.pins[0]} p2={this.pins[1]}></ResistorSymbol>;
    }
}

export function ResistorSymbol(props: any) {
    const translate_group = "translate(" + props.origin.x + "," + props.origin.y + ")";
    
    var current_path_points: Coordinate[] = [props.p1.origin, props.p2.origin];

    var symbol_svg = "M" + props.p1.origin.x + "," + props.p1.origin.y + "l0," + props.p1.length;
    
    symbol_svg = symbol_svg.concat(`l5,2.5
                                    l-10,2.5
                                    l10,2.5
                                    l-10,2.5
                                    l10,2.5
                                    l-10,2.5
                                    l10,2.5
                                    l-5,2.5`);
    
    symbol_svg = symbol_svg + "l0," + props.p2.length;
    
    return (
        <g className="cell res" id={props.instanceName} transform={translate_group}>
            <text 
                x="11" 
                y="8" 
                fontSize="8"
                //textLength='10'
                fill="#fff"
                >{props.instanceName}
            </text>

            <text 
                x="11" 
                y="18" 
                fontSize="8"
                //textLength='10'
                fill="#fff"
                >{props.val} {Omega}
            </text>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d={symbol_svg}
                pointerEvents="stroke"
            ></path>

            {props.p1.symbol}
            {props.p2.symbol}
            <Electrons points={current_path_points}></Electrons>
        </g>);
}