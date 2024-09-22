import React from "react";

class Resistor extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = { counter: 0 };
    //     this.handleClick = this.handleClick.bind(this);
    //   }

    render() {
        //console.group(this.props)

        var Omega = '\u03A9';


        var origin = {x: 0, y: 0};

        const pin_length = 20

        var p1_coord = {x: origin.x, y: origin.y - pin_length};
        var p2_coord = {x: origin.x, y: origin.y + pin_length + 20};

        var p12_vect = {x: p2_coord.x - p1_coord.x, y: p2_coord.y - p1_coord.y}

        var symbol_svg = "M".concat(p1_coord.x, ",", p1_coord.y, "l0,", pin_length.toString())

        symbol_svg = symbol_svg.concat(`l5,2.5
                                        l-10,2.5
                                        l10,2.5
                                        l-10,2.5
                                        l10,2.5
                                        l-10,2.5
                                        l10,2.5
                                        l-5,2.5`);

        symbol_svg = symbol_svg.concat("l0,".concat(pin_length.toString()))

        var current_path = "M".concat("0", ",", p1_coord.y, "  L" , "0", ",", p2_coord.y.toString())
        console.log(current_path)

        var current_path_length = Math.sqrt(Math.pow(p12_vect.x, 2) + Math.pow(p12_vect.y, 2))
        console.log(p12_vect)
        console.log(current_path_length)

        //var current_style = {offsetPath: 'path("' + current_path + '")', animation: "10s linear 0s infinite normal none followpath"}
        //console.log(current_style)

        var current_rects = []

        for (var i = 0; i < current_path_length/10; i++) {
            console.log(i)

            var current_style = {offsetPath: 'path("' + current_path + '")', animation: 2*current_path_length/10 + "s linear " + -2*i + "s infinite normal none followpath"}

            current_rects.push(
            <rect
                key={i}
                className="electron"
                style={current_style}
                transform="translate(-1.5, -1.5)"
                width="3"
                height="3"
                rx="1"
                fill="yellow"
            ></rect>)
        }

        const translate_group = "translate(".concat(this.props.origin.x.toString(), ",", this.props.origin.y.toString(), ")")

        return (
        <g className="elComp res" transform={translate_group}>
            <text 
                x="11" 
                y="8" 
                fontSize="8"
                //textLength='10'
                fill="#fff"
                >{this.props.name}</text>

            <text 
                x="11" 
                y="18" 
                fontSize="8"
                //textLength='10'
                fill="#fff"
                >{this.props.val} {Omega}</text>

            <ellipse
                cx={p1_coord.x}
                cy={p1_coord.y}
                fill="#fff"
                stroke="#fff"
                pointerEvents="all"
                rx="1.2"
                ry="1.2"
            ></ellipse>

            <ellipse
                cx={p2_coord.x}
                cy={p2_coord.y}
                fill="#fff"
                stroke="#fff"
                pointerEvents="all"
                rx="1.2"
                ry="1.2"
            ></ellipse>

            <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                d={symbol_svg}
                pointerEvents="stroke"
            ></path>

            {current_rects}

            <path
                fill="none"
                stroke="none"
                strokeMiterlimit="10"
                d={current_path}
                pointerEvents="stroke"
            ></path>
        </g>);
    }
}

export default Resistor;


// import React from "react";

// export default function Resistor({name, val, origin}) {
//     var p1_coord = origin
//     var p2_coord = {x: origin.x, y: origin.x+40}

//     return (
//     <g className="elComp res">
//         <ellipse
//             cx={p1_coord.x}
//             cy={p1_coord.y}
//             fill="#fff"
//             stroke="#fff"
//             pointerEvents="all"
//             rx="1.2"
//             ry="1.2"
//         ></ellipse>
//         <ellipse
//             cx={p2_coord.x}
//             cy={p2_coord.y}
//             fill="#fff"
//             stroke="#fff"
//             pointerEvents="all"
//             rx="1.2"
//             ry="1.2"
//         ></ellipse>
//         <path
//             fill="none"
//             stroke="#fff"
//             strokeMiterlimit="10"
//             d={" M" + "120,50
//                 l0,10
//                 l5,2.5
//                 l-10,2.5
//                 l10,2.5
//                 l-10,2.5
//                 l10,2.5
//                 l-10,2.5
//                 l10,2.5
//                 l-5,2.5
//                 l0,10
//                 "}
//             pointerEvents="stroke"
//         ></path>
//     </g>);
// }