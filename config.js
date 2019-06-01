require('dotenv').config();

exports.RDS_HOSTNAME=process.env.hostname||"finessedb.chn5rdataxwt.us-east-1.rds.amazonaws.com";
exports.RDS_USERNAME=process.env.username||"nguye304";
exports.RDS_PASSWORD=process.env.password||"kip742Jeg";
exports.RDS_DATABASE=process.env.database||"finessenailsdb";
exports.RDS_PORT=process.env.port||"3306";