const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
let quit = false;


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


  const managers = await db.query("SELECT first_name, last_name, id FROM employee WHERE manager_id IS null")

  console.log(managers[0])


// console.log(roles[0].map((employee) =>
//         `${employee.title}`))

        
process.exit()
}

test();