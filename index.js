const inquirer = require('inquirer');

require('dotenv').config();
const { viewAllEmployees, createDatabaseIfNotExist, viewAllDepartments, viewAllRoles } = require('./helpers/queries.js')



const db = require('./helpers/queries.js').db;


//this stumps me, I've run over this for about 10 hours now--seeing as dynamically updating the choices based on the database would be an important feature for this app--and done every thing I can imagine to get this to actually return the array--several different ways of writing out syncronous functions, asyncronous promises/await/async/.thens, written and rewritten, promise.all, promise.resolve, etc and just can not get it to work. The console.log() of choicesArray shows that it's returning an array in the exact form for the choices: column, but node is telling me that when it tries to run it's not reading as an array--or at least that's what googling the error--"choices.forEach is not a Function"--said was the issue. I tried getting instructor help and using askBCS and none were able to resolve fully--granted for different iterations of my attempted solution. I'd prefer to create a dynamic solution that works with how the db is built, not a static solution for the current iteration which is what I eventually settled on doing as I was tired of working on this. As I can't get this to function correctly, all my choices fields will be static and won't be dynamic. A big plus to this project would be figuring out how to get this to work right.

// const getRoleChoices = db.query(`SELECT title AS 'Job Title' FROM role;`, (err, results) => {
//     if (err) {
//         console.log(err);
//     } else {
//         
//         const choicesArray = results.map(item=>item['Job Title']); 
//         return choicesArray;
//         }
//     })


//function to be start the app, includes the initial prompt and a switch statement to handle each answer
function init () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'initial-prompt',
            choices: ['View All Employees','Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }])
        .then((answers)=> {
            
            switch(answers['initial-prompt']) {
                case 'View All Employees': 
                    createDatabaseIfNotExist();
                    viewAllEmployees();
            //setTimeout() fixed an issue with tables being overwritten when the next init() started: found at https://stackoverflow.com/questions/63161758/text-in-bash-terminal-getting-overwritten-using-js-node-js-npms-are-inquirer
                    setTimeout(()=> {
                         init();
                       }, 1000);
                    break;
                case 'View All Departments':
                    createDatabaseIfNotExist();
                    viewAllDepartments();
                    setTimeout(()=> {
                        init();
                      }, 1000);
                    break;
                case 'View All Roles':
                    createDatabaseIfNotExist();
                    viewAllRoles();
                    setTimeout(()=> {
                        init();
                      }, 1000);
                    break;                    
                case 'Add Employee': 
                    createDatabaseIfNotExist();
                    addEmployeePrompt();
                    break;
                case 'Update Employee Role': 
                    createDatabaseIfNotExist();
                    updateEmployeeRole();
                    break;
                case 'Add Role':
                    createDatabaseIfNotExist();
                    addRole();
                    break;
                case 'Add Department': 
                      createDatabaseIfNotExist();
                      addDept();
                      break;
                case 'Quit':
                //code to break the connection and return to the terminal prompt    
                    process.exit(0);
            }
        })      
}

//functions to perform further inquirer prompts and then add to the database
async function addEmployeePrompt () {
    
    await inquirer.prompt([
        {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'firstName'
        },
        {
            type: 'input',
            message: "What is the employee's last name?",
            name: 'lastName'
        },
        {
            type: 'list',
            message: "What is the employees role?",
            choices: [1,2,3,4,5],              
            name: 'employeeRole'
        }, 
        {
            type: 'list',
            message: "Who is the employee's manager?",
            choices: [1,5],
            name: 'manager'
        }
    ])
    .then((answers)=> {
        db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [answers.firstName, answers.lastName, answers.employeeRole, answers.manager], (err, results) => {
    if(err) {
        console.log(err);
    } else {
        console.log(`Data entered for ${answers.firstName} ${answers.lastName}`)
        init();
    }
});
       
    })
};

async function updateEmployeeRole () {
    await inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: ['Dan Marino', 'Ryan Sandburg', "Peyton Manning", "Sammy Sosa", "Dirk Nowitzki"],
            name: 'employeeToUpdate'
        },
        {

            type: 'list',
            message: 'Which role would you like to change the employee to?',
            choices: ['Software Engineer', 'Web Developer', 'Front-end Developer', 'Data Analyst', 'Data Scientist'],
            name: 'newTitle'
        }
    ]).then((answers)=>{
        db.query(`USE employeetracker_db;
        SELECT r.title,
            CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name'
        FROM role r
        CROSS JOIN employee employee
            ON employee.role_id = r.id FOR UPDATE;
        UPDATE role r
        SET r.title = ?
        WHERE 'Employee Name' = ?
        ORDER by 'Employee Name';`, [answers.newTitle, answers.employeeToUpdate], (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`${answers.employeeToUpdate}'s role updated.`)
                init();
            }
        })
    });
}

async function addRole () {
    await inquirer.prompt([
        {
            type: 'input',
            message: 'Which role would you like to add?',
            name: 'roleToAdd'
        },
        {

            type: 'number',
            message: 'What is the salary of the role?',
            name: 'roleSalary'
        },
        {
            type: 'list',
            message: 'To which department does this role belong?',
            choices: [1, 2, 3, 4],
            name: 'roleDept'
        }
    ]).then((answers)=>{
        db.query(`INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`, [answers.roleToAdd, answers.roleSalary, answers.roleDept], (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`${answers.roleToAdd} added.`)
                init();
            }
        })
    });
}

async function addDept () {
    await inquirer.prompt([
        {
            type: 'input',
            message: 'What department would you like to add?',
            name: 'deptToAdd'
        },
    ]).then((answers)=>{
        db.query(`INSERT INTO department(department_name) VALUES (?)`, [answers.deptToAdd], (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`${answers.deptToAdd} added.`)
                init();
            }
        })
    });
}


//function call to start the app
init();