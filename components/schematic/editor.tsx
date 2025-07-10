import React from "react";

import { useEffect, useRef } from 'react';

import Resistor from './components/resistor'
import Vdc from "./components/vdc";
import {Coordinate, Wire, Cell, cellViewItem} from "./schematicItems";

interface IProps {
    simOutput: object;
    onNetlistChange: (netlist: cellViewItem[]) => void;
}

interface IBox {
    x: number;
    y: number;
    h: number;
    w: number;
}

interface IState {
    viewBox: IBox;
    gridBox: IBox;
    svgStyle: any;
    baseCurrent: number;
    components: cellViewItem[];
}

class SchematicEditor extends React.Component<IProps, IState> {
    private svgRef: React.RefObject<SVGSVGElement> = React.createRef<SVGSVGElement>();
    private svgCenterRef: React.RefObject<SVGRectElement> = React.createRef<SVGRectElement>();
    private items: cellViewItem[] = [];
    
    constructor(props: IProps) {
        super(props);

        // this.state = { counter: 0 };
        // this.handleClick = this.handleClick.bind(this);

        // this.svgRef = React.createRef<SVGSVGElement>();

        this.handleWheel = this.handleWheel.bind(this);
        window.addEventListener('resize', this.handleResize.bind(this))

        // console.log(this.svgRef.current)
        
        this.state = {
            viewBox: {x: -0, y: -0, h: 500, w: 500},
            gridBox: {x: -0, y: -0, h: 500, w: 500},
            svgStyle: {height: '', width: '100%'},
            baseCurrent: 1,
            components: [],
        };

      }

    // componentDidMount() {

    // }

    handleWheel(e: React.WheelEvent<SVGElement>) {
        if (this.svgRef != null && this.svgRef.current != null) {
            let realCenter = this.svgCenterRef.current?.getBoundingClientRect()
            // console.log(realCenter)


            let viewBoxZoom: IBox = this.state.viewBox;
            let gridBoxZoom: IBox = this.state.gridBox;
            let viewBox: IBox;
            let gridBox: IBox;

            let mx: number = e.nativeEvent.offsetX; // mouse x
            let my: number = e.nativeEvent.offsetY;

            let realWidth = this.svgRef.current.clientWidth
            let realHeight = this.svgRef.current.clientHeight

            let sensitivityZoomWH: number = 0.1;
            let sensitivityZoomXY: number = 1.15;

            let dw: number = -viewBoxZoom.w*Math.sign(e.deltaY)*sensitivityZoomWH;
            let dh: number = -viewBoxZoom.h*Math.sign(e.deltaY)*sensitivityZoomWH;
            let dx: number = sensitivityZoomXY*dw*mx/realWidth;
            let dy: number = sensitivityZoomXY*dh*my/realHeight;

            viewBox = {x:viewBoxZoom.x+dx,y:viewBoxZoom.y+dy,w:viewBoxZoom.w-dw,h:viewBoxZoom.h-dh};
            
            dw = -gridBoxZoom.w*Math.sign(e.deltaY)*sensitivityZoomWH;
            dh = -gridBoxZoom.h*Math.sign(e.deltaY)*sensitivityZoomWH;
            dx = sensitivityZoomXY*dw*mx/realWidth;
            dy = sensitivityZoomXY*dh*my/realHeight;

            gridBox = {x:gridBoxZoom.x+dx,y:gridBoxZoom.y+dy,w:gridBoxZoom.w-dw,h:gridBoxZoom.h-dh};

            this.setState({viewBox: viewBox, gridBox: gridBox});

            // console.log(realWidth, realHeight)
        }
    }

    componentDidMount(){
        this.handleResize();

        this.populateSchematic();
    }

    static getDerivedStateFromProps(props: IProps, state: IState) {
        // console.log(props);
        // console.log(state);

        // let speed: number = SchematicEditor.getSpeedFromSimOutput(props.simOutput, state.baseCurrent);
        let baseCurrent: number = SchematicEditor.determineBaseCurrent(props.simOutput, state.baseCurrent);

        return {baseCurrent: baseCurrent};
    }

    handleResize() {
        if (this.svgRef != null && this.svgRef.current != null) {
            let w = window.innerWidth; // this.svgRef.current.clientWidth // window.innerWidth
            let h = window.innerHeight; // this.svgRef.current.clientHeight // window.innerHeight

            let ratio = w/h;

            // console.log(w, h, ratio)

            if (ratio >= 1) {
                this.setState({svgStyle: {height: '', width: '100%'}});
            }
            else {
                this.setState({svgStyle: {height: '100%', width: ''}});
            }
        }
    }

    // This method would require this "this.handleKey = this.handleKey.bind(this); // Binding handleKey to 'this'" to be added to the constructor of the class.
    // handleKey(e: React.KeyboardEvent<SVGElement>) {
    //     console.log(e);

    //     this.props.onNetlistChange(this.state.components);
    // }

    // Handle the input field changes
    handleKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e);

        this.props.onNetlistChange(this.state.components);
    };

    addItem(i: cellViewItem) {
        // this.items.push(i);

        this.state.components;

        this.setState({components: []});
    }

    static getCurrentsFromSimOutput(simOutput: {}, baseCurrent: number=1) {
        let is: number | undefined = simOutput["v0#branch"];
        
        let speed: number = 0;

        if (is !== undefined) {
            console.log(is);
            console.log(is/baseCurrent);

            speed = -1*is/baseCurrent;
        }

        return speed;
    }

    static determineBaseCurrent(simOutput: {}, baseCurrent: number=1) {
        let speed_min: number = 0;
        let speed_avg: number = 0;
        let speed_max: number = 0;

        let val: number = 0;

        let first: boolean = true;
        
        for (const property in simOutput) {
            if (!(property.includes('[i]') || property.includes('#'))) {
                continue;
            }
            val = Math.abs(Number(simOutput[property]));

            if (first) {
                speed_min = val;
                speed_max = val;

                first = false;
            }
            
            if (val < speed_min) {
                speed_min = val;
            }

            if (val > speed_max) {
                speed_max = val;
            }
        }

        speed_avg = (speed_max + speed_min)/2; // Not really the average, but it works for now.
        
        // console.log(speed_min, speed_avg, speed_max);

        return speed_avg;
    }

    populateSchematic() {
        let components: cellViewItem[] = [];

        // Instanciate components and place them.
        var R0 = new Resistor(this, 'R0', 300, 150, 150);
        var R1 = new Resistor(this, 'R1', 300, 120, 60);
        var V0 = new Vdc(this, 'V0', 5, 55, 60);
        
        // Draw wires and make connections
        var W0 = V0.connectDrawWire(R1, 'p', 'p', 'net0');
        var W1 = V0.connectDrawWire(R1, 'n', 'n', '0');

        components.push(R0, R1, V0, W0, W1);
        
        // let speed: number = SchematicEditor.getSpeedFromSimOutput(this.props.simOutput);

        // R1.speed = speed;
        // V0.speed = -speed;
        // W0.speed = speed;
        // W1.speed = -speed;

        this.setState({components: components});
    }

    render() {

        console.log('Render');

        // Set speeds
        for (let c of this.state.components) {
            // console.log(c);

            if (c instanceof Cell) {

                for (const property in this.props.simOutput) {
                    let instanceName: string = property.replace('@', '').replace('[i]', '').replace('#branch', '').toLowerCase();

                    if (c.instanceName.toLowerCase().includes(instanceName)) {
                        let speed: number = Number((Number(this.props.simOutput[property])/this.state.baseCurrent).toFixed(3));

                        c.speed = speed;
                    }
                }
            }
        }



        let components: JSX.Element[] = [];
        for (let c of this.state.components) {
            components.push(c.symbol);
        }
        
        let viewBox = this.state.viewBox.x + ' ' + this.state.viewBox.y + ' ' + this.state.viewBox.h + ' ' + this.state.viewBox.w

        // Using tabIndex={0} in the svg was necessary to make it focusable it seems. Without doing this, it would not be possible for the svg element to receive onKeyDown events.
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                ref={this.svgRef}
                viewBox={viewBox}
                style={{height: this.state.svgStyle.height, width: this.state.svgStyle.width, backgroundColor: '#2B2B2B'}}
                onWheel={this.handleWheel}
                onKeyDown={this.handleKey}
                tabIndex={0}
            >
            
                {/* // https://stackoverflow.com/a/14209704
                // Thomas W */}
            
                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)"/>
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1.5"/>
                    </pattern>
                </defs>
            
                <rect width='100%' ref={this.svgCenterRef}/> 
                <rect x={this.state.gridBox.x} y={this.state.gridBox.y} width={this.state.gridBox.w} height={this.state.gridBox.h} fill="url(#grid)"  /> 
                {/* style={{width: '100%', height: '100%'}} */}
            
                {components}
        
            </svg>
        );
    }
}

export default SchematicEditor;