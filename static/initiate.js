const path = require('path');
// TODO change climate-plots-config pathing
module.exports = require("climate-plots-config").genStaticFiles(path.join(__dirname, '../'))
