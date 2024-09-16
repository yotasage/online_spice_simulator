import type { NextApiRequest, NextApiResponse } from 'next'
// import { promises as fs } from 'fs';
//import 'fs';
const fs  = require("fs");

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

type ResponseData = {
  message: string
}
  
export default async function netlist(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    //const { stdout, stderr } = await exec('cat local_assets\\examples\\acmos1\\nmos_current_mirror\\dc.spi');
    //res.status(200).json({ message: stdout })

    var filePath = 'local_assets\\examples\\acmos1\\nmos_current_mirror\\dc.spi'

    //const file = await fs.readFile(filePath, 'utf8');
    var file = fs.createReadStream(filePath, { encoding: 'utf8' });
    var stat = fs.statSync(filePath);
    //var stat = fs.stat(filePath);

    //console.log(stat.size)

    //res.setHeader('Content-Length', (await stat).size);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'text/html');
    //res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');

    // TODO: This might not be neccesary as it seems like this was intended for a case when writing to the file.
    // Add this to ensure that the out.txt's file descriptor is closed in case of error.
    res.on('error', function(err) {
        file.end();
    });

    // res.status(200).json({ message: file })
    file.pipe(res);
    
}