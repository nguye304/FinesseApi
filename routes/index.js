//option 1 = search by id
//option 2 = search by name

const express = require('express');
const router = express.Router();
const mysql = require ('mysql');
const cors = require ('cors');

process.env.NODE_ENV = 'production';
const config = require('../config.js');

router.use(express.json());
router.use(cors());

process.env.RDS_HOSTNAME=config.RDS_HOSTNAME;
process.env.RDS_USERNAME=config.RDS_USERNAME;
process.env.RDS_PASSWORD=config.RDS_PASSWORD;
process.env.RDS_DATABASE=config.RDS_DATABASE;
process.env.RDS_PORT=config.RDS_PORT;

var connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE
});



connection.connect(function(err){
    if(err){
        console.log('Database connection failed'+err.stack);
        return;
    }
    console.log('Connected to database');
});



router.get('/', (req, res) => {
    res.send('hello world');
});

//GET: api/employees
//Returns all the employees
router.get('/api/employees', (req, res) => {

    connection.query('SELECT * FROM Employees',function(error,results,fields){
        if(error) {
            res.send(error);
            return;
        }
        res.send(results);
    })
   
});

//GET: api/employees/1/id
//Returns an employee by their ID. There will only be a single ID 
router.get('/api/1/employees/:id', (req, res) => {
    connection.query(`SELECT * FROM Employees WHERE EmpID=${parseInt(req.params.id)}`,function(err,result){
        if(err) {
            res.send(err);
            return;
        }
        if (result.length < 1){
            res.send(`${req.params.id} user was not found`)
        }

        res.send(result);
        

    })

});

//GET: api/employees/2/name
//Returns employees by their first name. There could be multiple people with that name
router.get('/api/2/employees/:name', (req, res) => { 
    connection.query(`SELECT * FROM Employees WHERE FName="${req.params.name}"`,function(err,result){
        if(err) {
            res.send(err);
            return;
        }
        if (result.length < 1){
            res.send(`${req.params.FName} user was not found`)
        }

        res.send(result);
    })
});

//GET: api/hours
//Returns the hours with date 
router.get('/api/hours', (req, res) => {
     connection.query(`SELECT * FROM StoreInfo`,function(err,result){
        if(err) {
            res.send("there was an error in get all hours");
            return;
        }
        res.send(result);
     })
});

//GET: api/services/
//returns all the services wit their prices an a description
router.get('/api/services', (req, res) => {
    connection.query(`SELECT * FROM Services`,function(err,result){
        if(err) {
            res.send(err);
            return;
        }
        res.send(result);
    })
});
//PUT: api/employee/id
//TODO: Update the employees (Updates the employees information)
router.put('/api/employees/:id',(req,res)=>{
    const employee = {
        FName:req.body.FName,
        LName:req.body.LName,
        Phone:req.body.Phone,
        Email:req.body.Email,
        Gender:req.body.Gender,
        MgrID:req.body.MgrID,
        AboutMe:req.body.AboutMe,
        EmpImgPath:req.body.EmpImgPath
    };
    connection.query(`UPDATE Employees 
                      SET FName = "${employee.FName}",
                          LName = "${employee.LName}",
                          Phone = "${employee.Phone}",
                          Email="${employee.Email}",
                          Gender="${employee.Gender}",
                          MgrID="${employee.MgrID}",
                          AboutMe="${employee.AboutMe}",
                          EmpImgPath="${employee.EmpImgPath}"
                      WHERE EmpID = "${parseInt(req.params.id)}"`,
        function(err,result){
            if(err) {
                res.send(err);
                return;
            }
            res.send(`Successfully added Employee Info for ID: ${parseInt(req.params.id)}`);
        })
});

//GET: api/hours
//TODO: Gets all information from storeinfo
router.get('/api/storeInfo', (req, res) => {
    connection.query("SELECT * FROM StoreInfo",function(err,result){
        if(err) {
            res.send(err);
            return;
        }
        res.send(result);
    })
});

//PUT: api/hours  
//TODO: Update the hours
router.put('/api/storeInfo',(req,res)=>{
    if(req.body.OpenHours ==null){
        myquery = `UPDATE StoreInfo SET CloseHours = "${req.body.CloseHours}" WHERE Day = "${req.body.Day}"`;
    }else if(req.body.CloseHours==null){
        myquery = `UPDATE StoreInfo SET OpenHours="${req.body.OpenHours}" WHERE Day = "${req.body.Day}"`;
    }else{
        myquery = `UPDATE StoreInfo SET OpenHours="${req.body.OpenHours}", CloseHours = "${req.body.CloseHours}" WHERE Day = "${req.body.Day}"`;
    }
    connection.query(myquery,function(err,result){
        if(err) {
            res.send(err);
            return;
        }
        res.send(`Successfully added hours for ${req.body.Day}`);
    })
});

//POST: api/employee (Adds a new employee incase someone is hired)
router.post('/api/employees', (req, res) => {
    
  
    //assign the body to an object
    const employee = {
        //id:employees.length+1,
        FName:req.body.FName,
        LName:req.body.LName,
        Phone:req.body.Phone,
        Email:req.body.Email,
        Gender:req.body.Gender,
        MgrID:req.body.MgrID,
        AboutMe:req.body.AboutMe,
        EmpImgPath:req.body.EmpImgPath
    };
    //The query that will add a new person into the database
    var empQuery = 
        `INSERT INTO Employees(FName,LName,Phone,Email,Gender,MgrID,AboutMe,EmpImgPath) 
         VALUES('${employee.FName}','${employee.LName}','${employee.Phone}','${employee.Email}','${employee.Gender}','${employee.MgrID}','${employee.AboutMe}','${employee.EmpImgPath}')`;
    connection.query(empQuery,function(err,result){
        if(err){
            message = err;
        }
        else{
            message = `Successfully added ${employee.FName}`;
        }
        res.send(message);
    })
});
//DELETE: api/employees/id (Deletes an employee incase someone is fired)
router.delete('/api/employees/:id',(req,res)=>{
    var query = `DELETE FROM Employees WHERE EmpID = ${parseInt(req.params.id)}`;
    connection.query(query,function(err,result){
        if(err){
            message=err;
        }
        else{
            message = `Successfully Removed Employee with id ${req.params.id}`;
        }
        res.send(message);
    })
});
//POST: api/services (Adds a new service incase here are new services)
router.post('/api/services', (req, res) => {
    
  
    //assign the body to an object
    const service = {
        //id:employees.length+1,
        Type:req.body.Type,
        Name:req.body.Name,
        Price1:req.body.Price,
        Price2:req.body.Price2,
        Description:req.body.Description,
    
    };
    //The query that will add a new service into the database
    var serQuery = 
        `INSERT INTO Services(Type,Name,Price,Price2,Description) 
         VALUES('${service.Type}','${service.Name}','${service.Price}','${service.Price2}','${service.Description}')`;
    connection.query(serQuery,function(err,result){
        if(err){
            message = err;
        }
        else{
            message = `Successfully added ${service.Name}`;
        }
        res.send(message);
    })
});

//DELETE: api/services/id (Deletes a service by it's id)
router.delete('/api/services/:id',(req,res)=>{
    var query = `DELETE FROM Services WHERE ItemID = ${parseInt(req.params.id)}`;
    connection.query(query,function(err,result){
        if(err){
            message=err;
        }
        else{
            message = `Successfully Removed Service with id ${req.params.id}`
        }
        res.send(message);
    })  


});

//GET: api/holidays
//returns all the holidays wit their hours
router.get('/api/holidays', (req, res) => {
    connection.query(`SELECT * FROM Holidays`,function(err,result){
        if(err) {
            res.send(err);
            return;
        }
        res.send(result);
    })
});
//DELETE: api/holidays/id (Deletes a holiday by it's id
router.delete('/api/holidays/:id',(req,res)=>{
    var query = `DELETE FROM Holidays WHERE HolidayID = ${parseInt(req.params.id)}`;
    connection.query(query,function(err,result){
        if(err){
            message=err;
        }
        else{
            message = `Successfully Removed Hoiday with id ${req.params.id}`
        }
        res.send(message);
    })  


});
//POST: api/holidays (Adds a new service incase here are new services)
router.post('/api/holidays', (req, res) => {
    
  
    //assign the body to an object
    const holiday = {
        //id:employees.length+1,
        HolidayName:req.body.HolidayName,
        HolidayDate:req.body.HolidayDate,
        OpenHours:req.body.OpenHours,
        CloseHours:req.body.CloseHours
    
    };
    //The query that will add a new service into the database
    var holiQuery = 
        `INSERT INTO Holidays(HolidayName,HolidayDate,OpenHours,CloseHours) 
         VALUES('${holiday.HolidayName}','${holiday.HolidayDate}','${holiday.OpenHours}','${holiday.CloseHours}')`;
    connection.query(holiQuery,function(err,result){
        if(err){
            message = err;
        }
        else{
            message = `Successfully added ${holiday.HolidayName}`;
        }
        res.send(message);
    })
});

//PUT: api/holidays  
//TODO: Update the holiday
router.put('/api/holidays/:id',(req,res)=>{
    if(req.body.OpenHours ==null){
        myquery = `UPDATE Holidays SET CloseHours = "${req.body.CloseHours}" WHERE HolidayID = "${parseInt(req.params.id)}"`;
    }else if(req.body.CloseHours==null){
        myquery = `UPDATE Holidays SET OpenHours="${req.body.OpenHours}" WHERE HolidayID = "${parseInt(req.params.id)}"`;
    }else{
        myquery = `UPDATE Holidays SET OpenHours="${req.body.OpenHours}", HolidayDate = "${req.body.HolidayDate}",CloseHours = "${req.body.CloseHours}" WHERE HolidayID = "${parseInt(req.params.id)}"`;
    }
    connection.query(myquery,function(err,result){
        if(err) {
            res.send(err);
            return;
        }
        res.send(`Successfully updated information for holiday with id: ${req.body.id}`);
    })
});

//connection.end();
//For Testing 
const port = process.env.PORT || 3000;
//app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = router;