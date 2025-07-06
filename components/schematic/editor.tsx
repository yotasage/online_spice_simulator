import React from "react";

import { useEffect, useRef } from 'react';

import Resistor from './components/resistor'
import Vdc from "./components/vdc";
import {Coordinate, Wire} from "./schematicItems";

interface IProps {

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
}

class SchematicEditor extends React.Component<IProps, IState> {
    private svgRef: React.RefObject<SVGSVGElement> = React.createRef<SVGSVGElement>();
    private svgCenterRef: React.RefObject<SVGRectElement> = React.createRef<SVGRectElement>();
    
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
            svgStyle: {height: '', width: '100%'}
        };

      }

    // componentDidMount() {

    // }

    handleWheel(e: React.WheelEvent<SVGElement>) {
        if (this.svgRef != null && this.svgRef.current != null) {
            let realCenter = this.svgCenterRef.current?.getBoundingClientRect()
            console.log(realCenter)


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

            console.log(realWidth, realHeight)
        }
    }

    componentDidMount(){
        this.handleResize();
    }

    handleResize() {
        if (this.svgRef != null && this.svgRef.current != null) {
            let w = window.innerWidth; // this.svgRef.current.clientWidth // window.innerWidth
            let h = window.innerHeight; // this.svgRef.current.clientHeight // window.innerHeight

            let ratio = w/h;

            console.log(w, h, ratio)

            if (ratio >= 1) {
                this.setState({svgStyle: {height: '', width: '100%'}});
            }
            else {
                this.setState({svgStyle: {height: '100%', width: ''}});
            }
        }
    }

    

    render() {
        //<Resistor ref={this.R1_ref} name={'R1'} val={300} origin={{x: 120, y: 60}}/>
        
        // Instanciate components and place them.
        var R0 = new Resistor('R0', 300, 150, 150);
        var R1 = new Resistor('R1', 300, 120, 60);
        var V0 = new Vdc('V0', 5, 55, 60);

        // Draw wires
        var W0 = new Wire('net0', [V0.getPinAbsCoord('p'), new Coordinate(70, 20), new Coordinate(75, 30), R1.getPinAbsCoord('p')]);
        var W1 = new Wire('net1', [V0.getPinAbsCoord('n'), R1.getPinAbsCoord('n')]);

        // Make connections

        let components = [R0.symbol, R1.symbol, V0.symbol, W0.symbol, W1.symbol]

        let viewBox = this.state.viewBox.x + ' ' + this.state.viewBox.y + ' ' + this.state.viewBox.h + ' ' + this.state.viewBox.w


        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                ref={this.svgRef}
                viewBox={viewBox}
                style={{height: this.state.svgStyle.height, width: this.state.svgStyle.width, backgroundColor: '#2B2B2B'}}
                onWheel={this.handleWheel}
                
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