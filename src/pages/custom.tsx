// https://nextjs.org/docs/pages/building-your-application/routing/api-routes

import Image from 'next/image'
import "../app/globals.css";
import { useState, useEffect, FormEvent } from 'react'

const getSimOutput = async() => {
  const res = await fetch('/api/ex')
  const res_json = res.json()
  return res_json
}

const getData = async() => {
  console.log("rawspice from server")
  const file = await fetch('./examples/acmos1/nmos_current_mirror/sample.json')
  const data = file.json()
  return data
}

export default function About() {
    const handleRun = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      
      // Read the form data
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      console.log(formData)

      // Or you can work with it as a plain object:
      const formJson = Object.fromEntries(formData.entries());
      //console.log(formJson);
      //console.log(form);

      const response = await fetch('/api/runsim', { method: form.method, body: formData });
      const response_json = response.json()
      console.log(response_json)

      
      // const endpointsimOutput = await getSimOutput()
      // console.log(endpointsimOutput)
      // setSimOutput(endpointsimOutput)

      // const endpointData = await getData()
      // console.log(JSON.parse(endpointData)["i(vload)"]["data"][20])
    }

    const [simVersion, setSimVersion] = useState('null')
    const [simOutput, setSimOutput] = useState('null')
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/ngspice')
          .then((res) => res.json())
          .then((data) => {
            setSimVersion(data)
            setLoading(false)
          })
    }, [])
     
    if (isLoading) return <p>Loading...</p>
    if (!simVersion) return <p>Loading simulator version</p>
    if (!simOutput) return <p>No profile data</p>

    return (
    <div>
      <div className="border-double border-4 border-sky-500 top-0 left-0 bottom-0 absolute inline-block font-mono w-2/4">
        <form className="w-full h-full" method="post" onSubmit={handleRun}>
          <button>Run</button>
          <textarea id="netlist" name="netlist" className="outline-none text-white bg-transparent w-full h-full text-left" defaultValue="* nmos_current_mirror
            .include ../../../models/CMOS/180nm/p18_cmos_models_tt.inc

            .option TNOM=27 GMIN=1e-15 reltol=1e-5

            IREF VSS VREF dc 1u
            VLOAD VL VSS dc 0
            VSS VSS 0 dc 0

            M1 VREF VREF VSS VSS nmos w=1e-6 l=4e-6
            M2 VL VREF VSS VSS nmos w=2e-6 l=4e-6

            .control

            save all @m1[id] @m2[id]


            set num_threads=8
            set color0=white
            set color1=black
            unset askquit

            dc VLOAD 0 3.3 0.1

            write

            *load rawspice.raw

            *plot i(@m1[id]) i(@m2[id])
            *plot VL VREF

            quit

            .endc
            .end"/>
        </form>
      
      </div>
      
      <div className="border-double border-4 border-sky-500 top-0 right-0 absolute inline-block w-2/4 h-1/6">
        <p className="whitespace-pre">{simVersion.message}</p>
      </div>

      <div className="border-double border-4 border-sky-500 bottom-0 right-0 absolute inline-block w-2/4 h-5/6">
        <p className="whitespace-pre">{simOutput.message}</p>
      </div>
    </div>
    )
}