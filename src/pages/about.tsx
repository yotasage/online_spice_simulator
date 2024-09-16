// https://nextjs.org/docs/pages/building-your-application/routing/api-routes

import Image from 'next/image'
import "../app/globals.css";
import { useState, useEffect } from 'react'


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

export default function About() {

    const handleClick = async() => {
      const endpointDataa = await getDataa()
      console.log(endpointDataa)
      setDataa(endpointDataa)

      const endpointData = await getData()
      console.log(JSON.parse(endpointData)["i(vload)"]["data"][0])
    }

    //const staticData = await fetch('/api/ngspice', { cache: 'force-cache' })
    const [data, setData] = useState('null')
    const [dataa, setDataa] = useState('null')
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/ngspice')
          .then((res) => res.json())
          .then((data) => {
            setData(data)
            setLoading(false)
          })
      }, [])
     
      if (isLoading) return <p>Loading...</p>
      if (!data) return <p>No profile data</p>
      if (!dataa) return <p>No profile data</p>
      

    return (
    <div className="w-2/4 mx-auto my-5">
      <p>circuit</p>
      <button onClick={handleClick}>Like</button>
      <div className="border-double border-4 border-sky-500  my-5 min-w-830px">
        <Image
        priority
        src="./examples/acmos1/nmos_current_mirror/fig.svg"
        className="dark:invert"
        width={830}
        height={500}
        alt="Example circuit"/>
      </div>
      <p>ngspice version information</p>
      <div className="border-double border-4 border-sky-500  my-5 min-w-830px">
        
        <p className="whitespace-pre">{data.message}</p>
      </div>

      <div className="border-double border-4 border-sky-500  my-5 min-w-830px">
        
      <p className="whitespace-pre">{dataa.message}</p>
      </div>
    </div>
    
    )
}