const inquirer = require("inquirer");
const mysql = require("mysql2/promise"); 

async function main() {
  const db = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Never5660217!",
      database: "workForce_db",
    },
    console.log(`Connected to the workForce_db database.`)
  );

  async function mainMenu() {
    let menuChoice;
    await inquirer
      .prompt([
        {
          type: "list",
          message: "Please select an option:",
          name: "choice1",
          choices: ["View all Employees", "Add Employee", "Quit"],
        },
      ])
      .then((response) => {
        menuChoice = response.choice1;
      });

    switch (menuChoice) {
      case "View all Employees":
        viewAllEmployees();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Quit":
        process.exit();
        break;
      default:
        console.log("Please select an option:");
    }
  }

  async function viewAllEmployees() {
    let results = await db.query("SELECT * FROM employee");
    console.table("\n");
    console.table(results[0]);
    mainMenu();
  }

  async function addEmployee() {
    const roles = await db.query("SELECT title, id FROM role");
    const managers = await db.query(
      "SELECT first_name, last_name, id FROM employee WHERE manager_id IS null"
    );

    var answers;

    await inquirer
      .prompt([
        {
          type: "input",
          message: "First name of employee:",
          name: "firstName",
        },
        {
          type: "input",
          message: "Last name of employee:",
          name: "lastName",
        },
        {
          type: "list",
          message: "Please choose thier title:",
          name: "role",
          choices: roles[0].map((role) => {
            return {
              name: `${role.title}`,
              value: role.id,
            };
          }),
        },
        {
          type: "list",
          message: "Who is there manager:",
          name: "manager",
          choices: managers[0].map((employee) => {
            return {
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            };
          }),
        },
      ])
      .then((response) => {
        answers = response;
      });

    await db.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.firstName}", "${answers.lastName}", ${answers.role}, ${answers.manager})`
    );

    console.log("\n-----EMPLOYEE ADDED TO DATABASE-----\n");

    mainMenu();
  }

  // process.exit();
  mainMenu();
}

main();

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

// const results = await db.query("SELECT * FROM employee");
// console.log(
//   results[0].map(
//     (employee) =>
//       `${employee.id} ${employee.first_name} ${employee.last_name}`
//   )
// );
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
