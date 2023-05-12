const mysql = require('mysql2');
require('dotenv').config();

//creating the connection to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        //added multiple statements in order to process longer sql queries
        multipleStatements: true
        

    },

    console.log(`Connected to the employeetracker_db database.`)
);


//function to create database and tables if it's not there
const createDatabaseIfNotExist = () => {    
    db.query(`CREATE DATABASE IF NOT EXISTS employeetracker_db;

    USE employeetracker_db;
    
    CREATE TABLE IF NOT EXISTS department (
      id INT NOT NULL AUTO_INCREMENT,
      department_name VARCHAR(30),
      PRIMARY KEY (id),
      UNIQUE (department_name)
      
    );
    
    CREATE TABLE IF NOT EXISTS role (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(30),
      salary DECIMAL,
      department_id INT,
      UNIQUE (title),
      FOREIGN KEY (department_id)
      REFERENCES department(id)
    );
    
    CREATE TABLE IF NOT EXISTS employee (
      id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      first_name VARCHAR(30),
      last_name VARCHAR(30),
      role_id INT,
      manager_id INT,
      FOREIGN KEY (role_id)
      REFERENCES role(id)
    );`, (err, results)=> {
       if (err) {
        console.log(err);
       };
    });
};


//function to view all employees
const viewAllEmployees = () => {
    
    db.query(`SELECT
    employee.id,
    CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee name',
    r.title AS 'Title',
    r.salary AS 'Salary',
    d.department_name AS 'Department',
    CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
FROM role r
CROSS JOIN employee employee
    ON employee.role_id = r.id
CROSS JOIN department d
    ON d.id = r.department_id
LEFT JOIN employee manager 
    ON manager.id = employee.manager_id
ORDER BY
    employee.last_name;`, (err,results)=>{
        if(err) {
            (console.log(err))
         } else {
            displayResults(results); 
         };
    });
    
};


//function to view all the departments
const viewAllDepartments = () => {
    db.query(`SELECT department_name AS name FROM department;`, (err,results)=>{
        if(err) {
            (console.log(err))
         } else {
            displayResults(results); 
         };
    })
};

//function to view all the roles
const viewAllRoles = () => {
    db.query(`SELECT title AS 'Job Title' FROM role;`, (err,results) => {
        if(err) {
            (console.log(err))
         } else {
            displayResults(results); 
         };
    })
}

//function to show the results in a nice spaced out way
const displayResults = (results) => {
    console.log('\n');
    console.table(results);
    console.log('\n');
};

//exporting the queries to the index page
module.exports = { 
    viewAllEmployees, 
    createDatabaseIfNotExist, 
    viewAllDepartments, 
    viewAllRoles
 };

 //exporting the database connection to the index page
module.exports.db = db;