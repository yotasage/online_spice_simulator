import React from "react";
import SchematicEditor from "./editor";

interface IWirePoint {
    i: number;
    c: Coordinate;
    parent: Wire;
}

interface IConnectionCell2Wire {
    p: Pin;
    wp: IWirePoint;
}

interface IConnectionWire2Wire {
    wp0: IWirePoint;
    wp1: IWirePoint;
}

interface IWireConnection {
    p: Pin;
    wp: IWirePoint;
}

export class cellViewItem {
    _parent: SchematicEditor | cellViewItem | undefined;

    symbol: React.JSX.Element = <></>;

    private items: cellViewItem[] = [];

    constructor(parent: SchematicEditor | cellViewItem) {
        this.parent = parent;
    }

    set parent(val: SchematicEditor | cellViewItem) {
        this._parent = val;
        // this.parent.addItem(this);
    }

    get parent() {
        if (this._parent === undefined) {
            throw new Error(`No parent assigned to ${this.id()}.`);
        }
        return this._parent;
    }

    addItem(i: cellViewItem) {
        this.items.push(i);
    }

    id() {
        // This is just a prototype
        return "Prototype";
    }
}

export class Cell extends cellViewItem {
    pins: Pin[] = [];

    _speed: number = 0;

    origin: Coordinate;

    value: number;
    unit: string;

    cellName: string;
    instanceName: string;
    libraryName: string;
    techName: string;

    connections: IConnectionCell2Wire[] = [];

    // TODO: Figure out how to handle the origin in the constructor. It is not okay to assign null to origin as a default value. Investigate more to see if it is possible to do something similar as with args* in Python.
    // NOTE: Seems like the what is written in the above TODO might not be possible. Or, there is a work around. Pass an object instead.
    constructor(parent: SchematicEditor, name: string, value: number=100, x?: number, y?: number, origin?: Coordinate, numPins: number=2) {
        super(parent);

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
        
        for (var i: number = 0; i < numPins; i++) {
            let pin_coordinate: Coordinate = new Coordinate(0, 0);
            this.pins.push(new Pin(this, pin_coordinate, 10));
        }

        //this.current_path = "";



    }

    generateSymbol() {
        // This is just a prototype
    }

    set speed(val: number) {
        this._speed = val;

        // console.log(this.connections);

        for (let conn of this.connections) {
            if (conn.p.name == 'p') {
                if (this._speed > 0) {
                    conn.wp.parent.speed = this._speed;
                }
                else if (this._speed < 0) {
                    conn.wp.parent.speed = -this._speed;
                }
                else {
                    conn.wp.parent.speed = this._speed;
                }
            }
            else if (conn.p.name == 'n') {
                if (this._speed > 0) {
                    conn.wp.parent.speed = -this._speed;
                }
                else if (this._speed < 0) {
                    conn.wp.parent.speed = this._speed;
                }
                else {
                    conn.wp.parent.speed = this._speed;
                }
            }
            else {
                throw new Error(`No Pin named p nor n on ${this.id()}.`);
            }
        }

        this.generateSymbol();
    }

    get speed() {
        return this._speed;
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

    connect(p: Pin, wp: IWirePoint) {
        // Only cell-wire and wire-wire connections can be made. Cell-cell connections are not allowed. At least, not for now, and porbably will not be allowed ever.
        let conn: IConnectionCell2Wire = {
            p: p,
            wp: wp,
        }

        p.netName = wp.parent.netName;

        this.connections.push(conn);
    }

    connectDrawWire(device: Cell, p0name: string, p1name: string, netName: string) {
        
        let p0coord: Coordinate = this.getPinAbsCoord(p0name);
        let p1coord: Coordinate = device.getPinAbsCoord(p1name);
        
        var W0 = new Wire(this.parent, netName, [p0coord, p1coord]);
        
        this.connect(this.getPin(p0name), W0.points[0]);
        W0.connect(this.getPin(p0name), W0.points[0]);

        device.connect(device.getPin(p1name), W0.points[1]);
        W0.connect(device.getPin(p1name), W0.points[1]);

        return W0;
    }

    id() {
        return `${this.instanceName} | cell: ${this.cellName} | lib: ${this.libraryName}`;
    }

    getSpice() {
        if (this.connections.length > 0) {
            return `${this.instanceName} ${this.connections[0].wp.parent.netName} ${this.connections[1].wp.parent.netName} ${this.value}`
        }
        return '';
    }

}

export class Pin extends cellViewItem {
    netName: string | undefined;
    origin: Coordinate;
    length: number;

    name: string;

    constructor(parent: cellViewItem, origin: Coordinate, length: number, name?: string) {
        super(parent);
        
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



export class Wire extends cellViewItem {
    netName: string;
    _speed: number = 0;

    _parent: SchematicEditor | undefined;

    points: IWirePoint[];

    connections: IConnectionCell2Wire[] = [];

    constructor(parent: SchematicEditor | cellViewItem, net: string, points: Coordinate[]) {
        super(parent);

        this.netName = net;

        this.points = [];
        for (let i: number = 0; i < points.length; i++) {
            this.points.push({i:i, c:points[i], parent:this});
        }

        this.generateSymbol();
    }

    generateSymbol() {
        this.symbol = <WireSymbol points={this.points} speed={this._speed} key={'wire_' + this.netName}></WireSymbol>;
    }

    id() {
        return `${this.netName} | points: ${this.points}`;
    }

    connect(p: Pin, wp: IWirePoint) {
        // Only cell-wire and wire-wire connections can be made. Cell-cell connections are not allowed. At least, not for now, and porbably will not be allowed ever.
        let conn: IConnectionCell2Wire = {
            p: p,
            wp: wp,
        }

        p.netName = this.netName;

        this.connections.push(conn);
    }

    set speed(val: number) {
        if (this._speed != val) {
            this._speed = val;
            this.generateSymbol();
        }
    }

    get speed() {
        return this._speed;
    }
}

export function WireSymbol(props: any) {  
    
    let points = [];
    for (let p of props.points) {
        points.push(p.c)
    }

    var path = "M" + points[0].x + "," + points[0].y
    for (let i: number = 1; i < points.length; i++) {
        path += " L" + points[i].x + "," + points[i].y
    }

    return (
        <g className="wire" key={props.myKey}> 
            <Electrons points={points} speed={props.speed}></Electrons>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d={path}
                pointerEvents="stroke"
            ></path>
        </g>);
}

export function Electrons({points=[] as Coordinate[], size=4, speed=0, spacing=10}) {
    
    if (speed == 0) {
        return (
            <></>
        );
    }

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
    
    let dir: string = "";
    if (speed > 0) {
        dir = "normal";
    }
    else {
        dir = "reverse";
    }

    speed = Math.abs(speed);

    for (var i = 0; i < electronDensity; i++) {
        var current_style = {offsetPath: 'path("' + path + '")', animation: 1/speed*current_path_length/spacing + "s linear " + -1/speed*i + "s infinite " + dir + " none followpath"}
        
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