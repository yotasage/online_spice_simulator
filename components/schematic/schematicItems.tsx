import React from "react";

export class Cell {
    p1: Pin;
    p2: Pin;

    origin: Coordinate;

    value: number;
    unit: string;

    cellName: string;
    instanceName: string;
    libraryName: string;
    techName: string;

    symbol: React.JSX.Element;

    // TODO: Figure out how to handle the origin in the constructor. It is not okay to assign null to origin as a default value. Investigate more to see if it is possible to do something similar as with args* in Python.
    constructor(name: string, value: number=100, x: number=0, y: number=0, origin: Coordinate=null, numPins: number=2) {

        
        if (origin != null) {
            this.origin = origin;
        }
        else {
            this.origin = new Coordinate(x, y);
        }
        
        // TODO: Use this in stead of what is done for pins below. Keep the pins in a list.
        for (var i: number = 0; i > numPins; i++) {

        }

        var p1_coord: Coordinate = new Coordinate(0, 0);
        var p2_coord: Coordinate = new Coordinate(0, 0);

        this.p1 = new Pin(p1_coord, 10);
        this.p2 = new Pin(p2_coord, 10);

        //this.current_path = "";

        this.unit = "";
        this.value = value;

        this.cellName = "";
        this.instanceName = name;
        this.libraryName = "";
        this.techName = "";


    }

    rotate(val: number, useDeg: Boolean = true) {

    }
}

export class Pin {
    origin: Coordinate;
    length: number;

    constructor(origin: Coordinate, length: number) {
        this.origin = origin;
        this.length = length;
    }
}

export class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Wire {
    netName: string;

    p1: Pin;
    p2: Pin;

    symbol: React.JSX.Element;

    constructor(net: string, p1_coord: Coordinate, p2_coord: Coordinate) {
        this.netName = net;

        this.p1 = new Pin(p1_coord, 0);
        this.p2 = new Pin(p2_coord, 0);

        this.symbol = <WireSymbol p1={this.p1} p2={this.p2}></WireSymbol>;
    }
}

export function WireSymbol(props) {   
    var path = "M" + props.p1.origin.x + "," + props.p1.origin.y + "L" + props.p2.origin.x + "," + props.p2.origin.y;
    
    return (
        <g className="electricalComponent wire"> 
            <Electrons start={props.p1.origin} stop={props.p2.origin}></Electrons>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d={path}
                pointerEvents="stroke"
            ></path>

            <path
                fill="none"
                stroke="none"
                strokeMiterlimit="10"
                d={path}
                pointerEvents="stroke"
            ></path>
        </g>);
}

export function Electrons({start, stop, size=4, speed=1, spacing=10}) {
    var current_rects: React.SVGProps<SVGRectElement>[] = [];

    var path_vect = {x: start.x - stop.x, y: start.y - stop.y}
    var current_path_length = Math.sqrt(Math.pow(path_vect.x, 2) + Math.pow(path_vect.y, 2))

    var electronDensity = current_path_length/spacing;
    var isInt = electronDensity % 1 === 0;

    if (isInt !== true) {
        electronDensity = Math.round(electronDensity)
        spacing = current_path_length/electronDensity;
    }

    var path = "M".concat(start.x, ",", start.y, "  L" , stop.x, ",", stop.y)

    var translate = "translate(-" + size/2 + ", -" + size/2 + ")"
    
    for (var i = 0; i < electronDensity; i++) {
        var current_style = {offsetPath: 'path("' + path + '")', animation: speed*current_path_length/spacing + "s linear " + -speed*i + "s infinite normal none followpath"}
        
        current_rects.push(<rect
            key={i}
            className="electron"
            style={current_style}
            transform={translate}
            width={size}
            height={size}
            rx="1"
            fill="yellow"
        ></rect>)
    }

    return (
        <>{current_rects}</>
    );
  }

export default Cell;