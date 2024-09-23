import React from "react";

import Resistor from './components/resistor'
import Vdc from './components/vdc'

class SchematicEditor extends React.Component {
    constructor(props) {
        super(props);

        // this.state = { counter: 0 };
        // this.handleClick = this.handleClick.bind(this);
      }

    // componentDidMount() {

    // }

    render() {

        var Omega = '\u03A9';
        
        var R1 = new Resistor('R1', 300, 120, 60);//<Resistor ref={this.R1_ref} name={'R1'} val={300} origin={{x: 120, y: 60}}/>
        console.log(R1)

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
        
            <Vdc name={'V0'} val={5} origin={{x: 50, y: 60}}/>
        
            </svg>
        );
    }
}

export default SchematicEditor;