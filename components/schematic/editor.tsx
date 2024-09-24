import React from "react";

import Resistor from './components/resistor'
import Vdc from "./components/vdc";
import {Coordinate, Wire} from "./schematicItems";

class SchematicEditor extends React.Component {
    constructor(props) {
        super(props);

        // this.state = { counter: 0 };
        // this.handleClick = this.handleClick.bind(this);
      }

    // componentDidMount() {

    // }

    render() {
        //<Resistor ref={this.R1_ref} name={'R1'} val={300} origin={{x: 120, y: 60}}/>
        var R1 = new Resistor('R1', 300, 120, 60);
        var V0 = new Vdc('V0', 5, 55, 60);
        var W0 = new Wire('net0', new Coordinate(55, 50), new Coordinate(120, 50));
        var W1 = new Wire('net1', new Coordinate(55, 90), new Coordinate(120, 90));

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                //width="" // 207
                //height="" // 121
                viewBox="-0 -0 201 201"
            >
            
            // https://stackoverflow.com/a/14209704
            // Thomas W
        
            <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1.5"/>
                </pattern>
            </defs>
        
            <rect width="100%" height="100%" fill="url(#grid)" />
        
            {R1.symbol}
            {V0.symbol}
            {W0.symbol}
            {W1.symbol}
        
            </svg>
        );
    }
}

export default SchematicEditor;