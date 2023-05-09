const inquirer = require("inquirer");
const mysql = require("mysql2/promise"); 

async function test(){
const db = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Never5660217!",
      database: "workForce_db",
    },
    console.log(`Connected to the workForce_db database.`)
  );


  let results = await db.query("SELECT *  FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ");

  console.table(results[0])

 
        
process.exit()
}

test();