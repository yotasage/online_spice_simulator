// https://nextjs.org/docs/pages/building-your-application/routing/api-routes

import Image from 'next/image'
import "../app/globals.css";
import { useState, useEffect } from 'react'

import Resistor from '../schematic/components/resistor'

const getSimOutput = async() => {
  const res = await fetch('/api/ex')
  const res_json = res.json()
  return res_json

}

const getData = async() => {
  console.log("rawspice from server")
  const file = await fetch('./examples/acmos1/nmos_current_mirror/sample.json')
  const data = file.json() //JSON.parse(String(file.json()))
  return data

}

const getNetlist = async() => {
  console.log("Get netlist")
  const res = await fetch('/api/netlist')
  const body = res.body

  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');

  var reader_result = await reader.read()
  //console.log('Reader result: ', reader_result)

  var decoded_response = decoder.decode(reader_result.value)
  //console.log('Decoded response: ', decoded_response)

  return decoded_response
}

export default function About() {

    const handleClick = async() => {
      const endpointsimOutput = await getSimOutput()
      console.log(endpointsimOutput)
      setSimOutput(endpointsimOutput)

      const endpointData = await getData()
      console.log(JSON.parse(endpointData)["i(vload)"]["data"][20])
    }

    //const staticData = await fetch('/api/ngspice', { cache: 'force-cache' })
    const [simVersion, setSimVersion] = useState('null')
    const [simOutput, setSimOutput] = useState('null')
    const [netlist, setNetlist] = useState('null')
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/ngspice')
          .then((res) => res.json())
          .then((data) => {
            setSimVersion(data)
            setLoading(false)
          })
    }, [])

    useEffect(() => {
      getNetlist()
      .then((res) => {
        //console.log(res)
        setNetlist(res)}
        )
    }, [])
     
    if (isLoading) return <p>Loading...</p>
    if (!simVersion) return <p>Loading simulator version</p>
    if (!simOutput) return <p>No profile data</p>
    if (!netlist) return <p>Loading netlist</p>

    const rightnow = () => new Date().toLocaleTimeString()
      
    // https://svg2jsx.com/

    return (
    <div>
      
      <div className="border-double border-4 border-sky-500 top-0 left-0 bottom-0 absolute inline-block w-2/4">
      <button onClick={handleClick}>Run</button>

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

      <Resistor name={'R1'} val={300} origin={{x: 120, y: 60}}/>

      <Resistor name={'R2'} val={600} origin={{x: 50, y: 60}}/>

      </svg>

      </div>
      
      <div className="border-double border-4 border-sky-500 top-0 right-0 absolute inline-block w-2/4 h-full">

      </div>  
    </div>
    
    )
}