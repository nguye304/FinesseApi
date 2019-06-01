require('dotenv').config();

exports.rds_hostname=process.env.hostname||"finessedb.chn5rdataxwt.us-east-1.rds.amazonaws.com";
exports.rds_username=process.env.username||"nguye304";
exports.rds_password=process.env.password||"kip742Jeg";
exports.rds_database=process.env.database||"finessenailsdb";
exports.rds_port=process.env.port||"3306";