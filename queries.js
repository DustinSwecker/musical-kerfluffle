const mysql = require('mysql2');
const util = require('util');
require('dotenv').config();


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
        

    },

    console.log(`Connected to the employeetracker_db database.`)
);

const query = util.promisify(db.query).bind(db);

const createDatabaseIfNotExist = () => {
    
    db.query('CREATE DATABASE IF NOT EXISTS employeetracker_db;', (err, results)=> {
        if (err) {
            console.log(err);
        }
    }); 
};

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

const viewAllDepartments = () => {
    db.query(`SELECT department_name AS name FROM department;`, (err,results)=>{
        console.log(results);
        if(err) {
            (console.log(err))
         } else {
            displayResults(results); 
         };
    })
};

const getAllRoles = async () => {
    await query(`SELECT title AS 'Job Title' FROM role;`, (err,results) => {
        if (err) {
            console.log(err);
        } else {
            const finalResults = Promise.all(results.map(async function(results) {
            const parsedData = await results['Job Title'];
            return parsedData
            }));
        }
    });
};

const roles = await getAllRoles();
console.log(roles);

const viewAllRoles = () => {
    db.query(`SELECT title AS 'Job Title' FROM role;`, (err,results) => {
        if(err) {
            (console.log(err))
         } else {
            displayResults(results); 
         };
    })
}

const displayResults = (results) => {
    console.log('\n');
    console.table(results);
    console.log('\n');
};

// const addEmployee = () => {
//     db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
//     VALUES (?, ?, ?, ?);`), 
// }





module.exports = { viewAllEmployees, createDatabaseIfNotExist, viewAllDepartments, viewAllRoles, getAllRoles }