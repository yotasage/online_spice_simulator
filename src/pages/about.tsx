// https://nextjs.org/docs/pages/building-your-application/routing/api-routes

import Image from 'next/image'
import "../app/globals.css";
import { useState, useEffect } from 'react'
//import { Readable } from 'node:stream';

// const getData = async() => {
//   console.log("data from server")
//   const response = await get('/api/ngspice')
//   return response?.data
// }

const getDataa = async() => {
  console.log("data from server")
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
      const endpointDataa = await getDataa()
      console.log(endpointDataa)
      setDataa(endpointDataa)

      const endpointData = await getData()
      console.log(JSON.parse(endpointData)["i(vload)"]["data"][20])
    }

    //const staticData = await fetch('/api/ngspice', { cache: 'force-cache' })
    const [data, setData] = useState('null')
    const [dataa, setDataa] = useState('null')
    const [netlist, setNetlist] = useState('null')
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/ngspice')
          .then((res) => res.json())
          .then((data) => {
            setData(data)
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
    if (!data) return <p>No profile data</p>
    if (!dataa) return <p>No profile data</p>
    if (!netlist) return <p>No profile data</p>
      

    return (
    <div>
      <p>circuit</p>
      <button onClick={handleClick}>Run</button>
      <div className="border-double border-4 border-sky-500  my-5 w-2/4">
        <Image
        priority
        src="./examples/acmos1/nmos_current_mirror/fig.svg"
        className="dark:invert"
        width={830}
        height={500}
        alt="Example circuit"/>
      </div>
      <p>ngspice version information</p>
      <div className="border-double border-4 border-sky-500  my-5 w-2/4">
        <p className="whitespace-pre">{data.message}</p>
      </div>

      <div className="border-double border-4 border-sky-500  my-5 w-2/4">
        <p className="whitespace-pre">{dataa.message}</p>
      </div>

      <div className="border-double border-4 border-sky-500  my-5 w-2/4">
        <p className="whitespace-pre">{netlist}</p>
      </div>
    </div>
    
    )
}