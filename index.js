const inquirer = require('inquirer');

require('dotenv').config();
const { viewAllEmployees, createDatabaseIfNotExist } = require('./queries.js')

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
                    break;
                case 'Add Employee': createDatabaseIfNotExist();
                const addEmployeeInput = addEmployeePrompt();
                    


            }
        })
        .then(()=> {
            //fixed issue with overwriting tables: found at https://stackoverflow.com/questions/63161758/text-in-bash-terminal-getting-overwritten-using-js-node-js-npms-are-inquirer
            setTimeout(()=> {
                init();
            }, 1000);
        })          
}


function addEmployeePrompt () {
    inquirer.prompt([
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
            choices: ['Software Engineer', 'Web Developer', 'Front-end Developer', 'Back-end Developer', 'Human Resources', 'Payroll', 'Sales Represenative', 'Data Analyst', 'Data Scientist'],
            name: 'employeeRole'
        }
    ])
    .then((answers)=> {
        return answers;
    })
};


init();