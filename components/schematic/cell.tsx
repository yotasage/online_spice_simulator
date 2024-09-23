import React from "react";

import Electrons from '/components/schematic/electrons'

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

    symbol: React.Component;

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

export default Cell;