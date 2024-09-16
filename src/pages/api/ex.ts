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
  const { stdout, stderr } = await exec('cd local_assets\\active_ngspice\\Spice64\\bin\\ & ngspice_con.exe ..\\..\\..\\examples\\acmos1\\nmos_current_mirror\\dc.spi');
  res.status(200).json({ message: stdout })
}