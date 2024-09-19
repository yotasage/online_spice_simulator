import type { NextApiRequest, NextApiResponse } from 'next'
const fs  = require("fs");
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

export default async function runsim(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // Clean input
    var netlist_arr = req.body.split('\r\n').slice(3)

    for (let i = 0, len = netlist_arr.length; i < len; i++) {
      netlist_arr[i] = 'circbyline '.concat(netlist_arr[i]) // 13.5.14 Circbyline: Enter a circuit line by line
    }
    netlist_arr[netlist_arr.length - 2] = 'print all' // Print all the results after the simulation has ended so that it can be sent back to the client.
    netlist_arr[netlist_arr.length - 1] = 'quit' // Make sure that we quit ngspice, though this seems to happen automatically.

    // Line feed is the ASCII character 10. In most programming languages it is escaped by writing \n , but in powershell it is `n.
    var netlist = netlist_arr.join("`r`n")
  
    // 12.12 Pipe mode option -p
    const { stdout, stderr } = await exec('echo "'.concat(netlist, '" | local_assets\\ngspice\\ngspice-43_64\\Spice64\\bin\\ngspice_con.exe -p'), {'shell':'powershell.exe'}); // , '  | local_assets\\ngspice\\ngspice-43_64\\Spice64\\bin\\ngspice_con.exe -p
    // console.log('stderr', stderr)
    // console.log('stdout', stdout)
    // console.log('finish')

    res.status(200).json({ message: stdout })
}