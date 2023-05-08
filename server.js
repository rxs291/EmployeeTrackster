const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
let quit = false;

async function connected() {
  const db = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Never5660217!",
      database: "workForce_db",
    },
    console.log(`Connected to the workForce_db database.`)
  );

  // const results = await db.query("SELECT * FROM employee");
  // console.log(
  //   results[0].map(
  //     (employee) =>
  //       `${employee.id} ${employee.first_name} ${employee.last_name}`
  //   )
  // );

  // async function mainMenu () {
  //   .prompt([
  //     {
  //       type: "list",
  //       message: "What would you like to do?",
  //       name: "choice",
  //       choices: 
  //       {
  //         "Add Employee", "Update EmployeeRole"
  //       }
        
  //     },
  //   ])

  // }

  while (quit === false) {

    const response1 = await inquirer
  .prompt([
    {
      type: "list",
      message: "Choose from this list?",
      name: "choice1",
      choices: ['View all Employees', 'Quit'] 

    },
  ])
  .then((response) => {
    
    console.log(response.choice1)
  })
 


  }
  

 
  // const response1 = await inquirer
  // .prompt([
  //   {
  //     type: "list",
  //     message: "Choose from this list?",
  //     name: "choice1",
  //     choices: results[0].map(
  //       (employee) =>
  //         `${employee.id} ${employee.first_name} ${employee.last_name}`
  //     ),
  //   },
  // ])
  

  // const response2 = await inquirer
  // .prompt([
  //   {
  //     type: "boolean",
  //     message: `Is this who you chose, ${response1.choice1} ?`,
  //     name: "choice1",
  //   },
  // ])
 
  // console.log(response2)

 


}
 
connected();