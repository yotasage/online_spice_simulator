export default function Electrons({index, start, stop, size=4, speed=1, spacing=10}) {

    // console.log(index)
    // console.log(start)
    // console.log(stop)

    var path_vect = {x: start.x - stop.x, y: start.y - stop.y}
    var current_path_length = Math.sqrt(Math.pow(path_vect.x, 2) + Math.pow(path_vect.y, 2))

    var path = "M".concat(start.x, ",", start.y, "  L" , stop.x, ",", stop.y)

    var current_style = {offsetPath: 'path("' + path + '")', animation: speed*current_path_length/spacing + "s linear " + -speed*index + "s infinite normal none followpath"}
    var translate = "translate(-" + size/2 + ", -" + size/2 + ")"

    return (
        <rect
            key={index}
            className="electron"
            style={current_style}
            transform={translate}
            width={size}
            height={size}
            rx="1"
            fill="yellow"
        ></rect>
    );
  }