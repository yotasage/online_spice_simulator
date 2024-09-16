// https://nodejs.org/api/child_process.html#child_processspawncommand-args-options

import type { NextApiRequest, NextApiResponse } from 'next'
import * as child from 'child_process';

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

type ResponseData = {
  message: string
}
  
export default async function ngspice(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  /*const ng = child.spawn("powershell.exe",["./local_assets/active_ngspice/Spice64/bin/ngspice_con.exe"], {
    detached: true
  });

  

  console.log('ngspice started')
  // console.log(ng)

  ng.stdout.on('data', (data: any) => {
    console.log(`stdout: ${data}`);
  });

  ng.stderr.on('data', (data: any) => {
    console.error(`stderr: ${data}`);
  });
  
  ng.on('close', (code: any) => {
    console.log(`child process exited with code ${code}`);
  }); 

  ng.stdin.write('help all');*/

  /*const ng = child.exec('cd local_assets\\active_ngspice\\Spice64\\bin\\ & dir & ngspice_con.exe', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  }); */

  //const { stdout, stderr } = await exec('cd local_assets\\active_ngspice\\Spice64\\bin\\ & ngspice_con.exe --help');
  //const { stdout, stderr } = await exec('cd local_assets\\active_ngspice\\Spice64\\bin\\ & ngspice_con.exe ../../../examples/ngspice/ac/ac_no_plot.spi');
  const { stdout, stderr } = await exec('cd local_assets\\active_ngspice\\Spice64\\bin\\ & ngspice_con.exe --version');
  //console.log('stdout:', stdout);
  //console.error('stderr:', stderr);


  //console.log(ng)
  res.status(200).json({ message: stdout })
  //res.status(200).json({ message: String(stdout).replaceAll('**', '**<\\br>') })
}