const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

//using ASYNC function to wrap entire function to allow for AWAITS to be used
async function main() {
  ////everything waits for connection to be established
  const db = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Never5660217!",
      database: "workForce_db",
    },
    console.log(`Connected to the workForce_db database.`)
  );
  ///// MENU function defined first, called at the bottom of MAIN function
  async function mainMenu() {
    let menuChoice;
    await inquirer
      .prompt([
        {
          type: "list",
          message: "Please select an option:",
          name: "choice1",
          choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "View Employees by Manager",
            "View Employees by Department",
            "Quit",
          ],
        },
      ])
      .then((response) => {
        menuChoice = response.choice1;
      });
    ///switch statement OUTSIDE of inquere prompt, to ensure only ONE inquirer prompt is running at any given time
    switch (menuChoice) {
      case "View All Employees":
        viewAllEmployees();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee":
        updateEmployee();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "Add Role":
        addRole();
      case "View All Departments":
        viewAllDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "View Employees by Manager":
        viewEmployeesByManager();
        break;
      case "View Employees by Department":
        viewEmployeesByDepartment();
        break;
      case "Quit":
        process.exit();
        break;
      default:
        console.log("Please select an option:");
    }
  }
  ////all functions defined in squential order according to list-order in the menu, starting with viewAllemployees
  async function viewAllEmployees() {
    let results = await db.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id,    FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id "
    );
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
          choices: managers[0].map((manager) => {
            return {
              name: `${manager.first_name} ${manager.last_name}`,
              value: manager.id,
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

  async function updateEmployee() {
    let employeeList = await db.query("SELECT * FROM employee");
    let employeeTraits = await db.query("Describe employee");
    let answers;

    await inquirer
      .prompt([
        {
          type: "list",
          message: "Choose an employee to update:",
          name: "employee",
          choices: employeeList[0].map((employee) => {
            return {
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            };
          }),
        },
        {
          type: "list",
          message: "Choose what to update:",
          name: "trait",
          choices: employeeTraits[0].map((trait) => `${trait.Field}`),
        },
        {
          type: "input",
          message: "What would you like to update it with:",
          name: "update",
        },
      ])
      .then((response) => {
        answers = response;
      });

    await db.query(
      `UPDATE employee SET ${answers.trait} = "${answers.update}" WHERE id = ${answers.employee}`
    );

    console.log("\n-----EMPLOYEE ADDED TO DATABASE-----\n");

    mainMenu();
  }

  async function viewAllRoles() {
    let results = await db.query(
      "SELECT role.id, role.title, department.name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id"
    );
    console.table("\n");
    console.table(results[0]);
    mainMenu();
  }

  async function addRole() {
    const departmentNames = await db.query("SELECT name, id FROM department");
    var answers;

    await inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role:",
          name: "name",
        },
        {
          type: "input",
          message: "What is the salary of the role:",
          name: "salary",
        },
        {
          type: "list",
          message: "Which department does the role belong to:",
          name: "dept_id",
          choices: departmentNames[0].map((dept) => {
            return {
              name: `${dept.name}`,
              value: dept.id,
            };
          }),
        },
      ])
      .then((response) => {
        answers = response;
      });

    console.log(answers);

    await db.query(
      `INSERT INTO role (title, salary, department_id) VALUES ("${answers.name}", "${answers.salary}", ${answers.dept_id})`
    );

    console.log("\n-----ROLE ADDED TO DATABASE-----\n");

    mainMenu();
  }

  async function viewAllDepartments() {
    let results = await db.query("SELECT id, name  FROM department");
    console.table("\n");
    console.table(results[0]);
    mainMenu();
  }

  async function addDepartment() {
    var answers;

    await inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the new department:",
          name: "name",
        },
      ])
      .then((response) => {
        answers = response;
      });

    await db.query(`INSERT INTO department (name) VALUES ("${answers.name}")`);

    console.log("\n-----DEPARTMENT ADDED TO DATABASE-----\n");

    mainMenu();
  }

  async function viewEmployeesByManager() {
    const managers = await db.query(
      "SELECT first_name, last_name, id FROM employee WHERE manager_id IS null"
    );
    var answers;

    await inquirer
      .prompt([
        {
          type: "list",
          message: "Who's employees would you like to see:",
          name: "manager",
          choices: managers[0].map((manager) => {
            return {
              name: `${manager.first_name} ${manager.last_name}`,
              value: manager.id,
            };
          }),
        },
      ])
      .then((response) => {
        answers = response;
      });

    let results = await db.query(
      `SELECT first_name, last_name, title, name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE manager_id = ${answers.manager}`
    );

    console.table(results[0]);

    mainMenu();
  }

  async function viewEmployeesByDepartment() {
    const dept = await db.query("SELECT name, id FROM department");
    var answers;

    await inquirer
      .prompt([
        {
          type: "list",
          message: "Which department employees would you like to see:",
          name: "dept",
          choices: dept[0].map((dept) => {
            return {
              name: `${dept.name}`,
              value: dept.id,
            };
          }),
        },
      ])
      .then((response) => {
        answers = response;
      });

    let results = await db.query(
      `SELECT first_name, last_name, title, name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id = ${answers.dept}`
    );

    console.table(results[0]);

    mainMenu();
  }

  mainMenu();
}

main();
