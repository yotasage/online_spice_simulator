// https://nextjs.org/docs/pages/building-your-application/routing/api-routes

import Image from 'next/image'
import "../app/globals.css";
import { useState, useEffect } from 'react'

import SchematicEditor from '../../components/schematic/editor'
import Link from 'next/link';
import HomeIcon from '../../components/schematic/components/icons/home';

const getSimOutput = async() => {
  const res = await fetch('/api/ex', {
    method: 'POST', // TODO: This should probably be a GET, but a GET can not have a body. So, I have to figure out another way to specify which Spice file I want. Later though.
    body: "ngspice\\basic1\\dc.spi",
  })
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
  const res = await fetch('/api/netlist', {
    method: 'POST', // TODO: This should probably be a GET, but a GET can not have a body. So, I have to figure out another way to specify which Spice file I want. Later though.
    body: "ngspice\\basic1\\dc.spi",
  })
  const body = res.body

  if (body === null) {
    return "";
  }

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
      // console.log(endpointsimOutput)

      let data: any = {};

      // Parsing data

      // Extract the last part of the output
      let outputArray: string[] = endpointsimOutput.message.split('No. of Data Rows')[1].split('\r\n');
      // console.log(outputArray)

      // Get number of rows of data
      // TODO: This should be used to extract the data from the output probably.
      let rows: number = Number(outputArray[0].replace(" : ", ""));
      // console.log(rows)

      // Extract the simulation results
      let dataArray: string[] = outputArray.slice(1, -2);
      // console.log(dataArray)

      // Split into name-value pairs and add to object to make it easy to access the data.
      for (let d of dataArray) {
        let dl = d.split(" = ");

        data[dl[0]] = dl[1];
      }
      // console.log(data)
      // console.log(data.net0)
      // console.log(data["v0#branch"])

      setSimOutput(data)

      // const endpointData = await getData()
      // console.log(JSON.parse(endpointData))
      // console.log(JSON.parse(endpointData)["i(vload)"]["data"][20])
    }

    //const staticData = await fetch('/api/ngspice', { cache: 'force-cache' })
    const [simVersion, setSimVersion] = useState('null')
    const [simOutput, setSimOutput] = useState({})
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
    // <button onClick={handleClick}>Run</button>

    return (
    <div>
      <div className="grid border-double border-4 border-sky-500 top-0 left-0 absolute inline-block w-full h-16 overflow-hidden">
        <Link href="/" className='card'>
            <HomeIcon width='30' height='30'/>
        </Link>

        <div className='card' onClick={handleClick}>
          Run
        </div>
      </div>
      <div className="border-double border-4 border-sky-500 top-16 left-0 bottom-16 absolute inline-block w-full overflow-hidden">
        <SchematicEditor simOutput={simOutput}></SchematicEditor>
      </div>
      
      <div className="border-double border-4 border-sky-500 bottom-0 left-0 absolute inline-block w-full h-16 overflow-hidden"></div>

      
    </div>
    
    )
}