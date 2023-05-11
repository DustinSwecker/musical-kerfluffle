const mysql = require('mysql2/promise');

const db = require('./queries').db;


const getAllRoles = async () => {
     db.promise().query(`SELECT title AS 'Job Title' FROM role;`)
     .then(([rows]) =>  {
        const rowsToChoicesArray = rows.map(item=>item['Job Title'])
        console.log(rowsToChoicesArray);
        return rowsToChoicesArray;
        })
    };


Promise.resolve(getAllRoles());


module.exports = { getAllRoles };