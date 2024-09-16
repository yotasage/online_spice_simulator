import type { NextApiRequest, NextApiResponse } from 'next'
const fs  = require("fs");
  
export default async function netlist(
  req: NextApiRequest,
  res: NextApiResponse
) {
    var filePath = 'local_assets\\examples\\acmos1\\nmos_current_mirror\\dc.spi'

    var file = fs.createReadStream(filePath, { encoding: 'utf8' });
    var stat = fs.statSync(filePath);

    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'text/html');

    // TODO: This might not be neccesary as it seems like this was intended for a case when writing to the file.
    // Add this to ensure that the out.txt's file descriptor is closed in case of error.
    res.on('error', function(err) {
        file.end();
    });

    file.pipe(res);
}