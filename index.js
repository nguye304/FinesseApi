//option 1 = search by id
//option 2 = search by name

const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

function validateEmployee(employee){
    const schema = {
        FName:Joi.string().min(3).required()
    }
    return Joi.validate(employee,schema)

};

const employees = [
    {
        id: 1, FName: 'kevin'
    },
    {
        id: 2, FName: 'kevin'
    },
    {
        id: 3, FName: 'Bebe Nguyen'
    }
]
app.get('/', (req, res) => {
    res.send('hello world');
});
//GET: api/employees
//Returns all the employees
app.get('/api/employees', (req, res) => {
    res.send(employees);
});

//GET: api/employees/1/id
//Returns an employee by their ID. There will only be a single ID 
app.get('/api/1/employees/:id', (req, res) => {
    const target = employees.find(emp => emp.id === parseInt(req.params.id));
    if (!target) {
        res.status(404).send('Employee not found');
    }
    else {
        res.send(target);
    }
});

//GET: api/employees/2/name
//Returns employees by their first name. There could be multiple people with that name
app.get('/api/2/employees/:name', (req, res) => { 
    const target = employees.find(emp => emp.FName === req.params.name);
    if (!target) {
        res.status(404).send(`${req.params.name} was not found.`);
    }
    else {
        res.send(target);
    }
});

//GET: api/hours
//Returns the hours with date 
app.get('/api/hours', (req, res) => {
    res.send(hours);
});
//GET: api/services/
//returns all the services wit their prices an a description
app.get('/api/service', (req, res) => {
    res.send(services);
});
//PUT: api/employee/id
//TODO: Update the employees (Updates the employees information)
app.put('/api/employees/:id',(req,res)=>{
    const employee = employees.find(emp=>emp.id === parseInt(req.params.id))
    if(!employee) 
        res.status(404).send(`the employee with ${req.params.id} was not found`)
    const{error} = validateEmployee(req.body)
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    employee.FName = req.body.FName;
    res.send(employee)
});
//PUT: api/hours  
//TODO: Update the hours


//POST: api/employee (Adds a new employee incase someone is hired)
app.post('/api/employees', (req, res) => {
    const{error} = validateEmployee(req.body)
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    if(!req.body.FName||req.body.FName.length <2){
        res.status(400).send('First Name should be longer than 2');
    }
    const employee = {
        id:employees.length+1,
        FName:req.body.FName
    };
    employees.push(employee);
    res.send(employee);

});
//DELETE: api/employee (Deletes an employee incase someone is fired)

//DELETE: api/service/id (Deletes a service by it's id)




//For Testing 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));