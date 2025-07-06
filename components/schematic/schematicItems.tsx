import React from "react";

export class Cell {
    pins: Pin[];

    origin: Coordinate;

    value: number;
    unit: string;

    cellName: string;
    instanceName: string;
    libraryName: string;
    techName: string;

    symbol: React.JSX.Element = <></>;

    // TODO: Figure out how to handle the origin in the constructor. It is not okay to assign null to origin as a default value. Investigate more to see if it is possible to do something similar as with args* in Python.
    // NOTE: Seems like the what is written in the above TODO might not be possible. Or, there is a work around. Pass an object instead.
    constructor(name: string, value: number=100, x?: number, y?: number, origin?: Coordinate, numPins: number=2) {

        this.unit = "";
        this.value = value;

        this.cellName = "";
        this.instanceName = name;
        this.libraryName = "";
        this.techName = "";

        if (origin !== undefined) {
            this.origin = origin;
        }
        else if (x !== undefined && y !== undefined) {
            this.origin = new Coordinate(x, y);
        }
        else {
            this.origin = new Coordinate(0, 0);
            console.warn('An explicit position is not given to ' + this.instanceName + '. Placing it at (0, 0).');
        }

        
        this.pins = []
        for (var i: number = 0; i < numPins; i++) {
            let pin_coordinate: Coordinate = new Coordinate(0, 0);
            this.pins.push(new Pin(pin_coordinate, 10));
        }

        //this.current_path = "";



    }

    rotate(val: number, useDeg: Boolean = true) {
        console.log(val);
    }

    getPin(name: string) {
        for (let p of this.pins) {
            if (p.name == name) {
                return p;
            }
        }
        throw new Error(`No pin named ${name} on ${this.instanceName} | cell: ${this.cellName} | lib: ${this.libraryName}.`);
    }

    getPinAbsCoord(name: string) {        
        let pin: Pin | null = null
        
        for (var p of this.pins) {
            if (p.name == name) {
                pin = p;
                break;
            }
        }
        
        if (pin === null) {
            throw new Error(`No pin named ${name} on ${this.instanceName} | cell: ${this.cellName} | lib: ${this.libraryName}.`);
        }

        let coord: Coordinate = new Coordinate(pin.origin.x + this.origin.x, pin.origin.y + this.origin.y);

        return coord;
    }


}

export class Pin {
    origin: Coordinate;
    length: number;

    name: string;

    symbol: React.JSX.Element = <></>;

    constructor(origin: Coordinate, length: number, name?: string) {
        this.origin = origin;
        this.length = length;
        
        if (name !== undefined) {
            this.name = name;
        }
        else {
            this.name = "";
        }

        this.makeSymbol();        
    }

    moveRelative(dx?: number, dy?: number, vector?: Coordinate) {
        this.origin.moveRelative(dx, dy, vector);
        this.makeSymbol();
    }

    moveAbsolute(x?: number, y?: number, origin?: Coordinate) {
        this.origin.moveAbsolute(x, y, origin);
        this.makeSymbol();
    }

    makeSymbol() {
        this.symbol =   <ellipse
                            cx={this.origin.x}
                            cy={this.origin.y}
                            fill="#fff"
                            stroke="#fff"
                            pointerEvents="all"
                            rx="1.2"
                            ry="1.2"
                        ></ellipse>;
    }
}

export class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    moveRelative(dx?: number, dy?: number, vector?: Coordinate) {
        if (vector !== undefined) {
            this.x += vector.x;
            this.y += vector.y;
        }
        else if (dx !== undefined && dy !== undefined) {
            this.x += dx;
            this.y += dy;
        }
    }

    moveAbsolute(x?: number, y?: number, origin?: Coordinate) {
        if (origin !== undefined) {
            this.x = origin.x;
            this.y = origin.y;
        }
        else if (x !== undefined && y !== undefined) {
            this.x += x;
            this.y += y;
        }
    }
}

export class Wire {
    netName: string;

    points: Coordinate[];

    symbol: React.JSX.Element;

    constructor(net: string, points: Coordinate[]) {
        this.netName = net;
        this.points = points;

        this.symbol = <WireSymbol points={this.points}></WireSymbol>;
    }
}

export function WireSymbol(props: any) {  
    
    var path = "M" + props.points[0].x + "," + props.points[0].y
    for (let i: number = 1; i < props.points.length; i++) {
        path += " L" + props.points[i].x + "," + props.points[i].y
    }

    // var path = "M" + props.p1.origin.x + "," + props.p1.origin.y + "L" + props.p2.origin.x + "," + props.p2.origin.y;
    
    return (
        <g className="wire"> 
            <Electrons points={props.points}></Electrons>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d={path}
                pointerEvents="stroke"
            ></path>
        </g>);
}

export function Electrons({points=[] as Coordinate[], size=4, speed=1, spacing=10}) {
    var current_rects: React.SVGProps<SVGRectElement>[] = [];

    var current_path_length = 0;
    for (let i = 1; i < points.length; i++) {
        let vector = {x: points[i].x - points[i-1].x, y: points[i].y - points[i-1].y}
        current_path_length += Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
    }

    var path = "M" + points[0].x + "," + points[0].y
    for (let i: number = 1; i < points.length; i++) {
        path += " L" + points[i].x + "," + points[i].y
    }

    var electronDensity = current_path_length/spacing;
    var isInt = electronDensity % 1 === 0;

    if (isInt !== true) {
        electronDensity = Math.round(electronDensity)
        spacing = current_path_length/electronDensity;
    }

    // This centers the electrons on the path.
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