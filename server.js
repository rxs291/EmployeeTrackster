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
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Update Employee Manager",
            "View Employees by Manager",
            "View Employees by Department",
            "Delete Deptartment, Role, or Employee",
            "Department Budget",
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
      case "Update Employee Role":
        updateEmployeeRole();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "View All Departments":
        viewAllDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Update Employee Manager":
        updateEmployeeManager();
        break;
      case "View Employees by Manager":
        viewEmployeesByManager();
        break;
      case "View Employees by Department":
        viewEmployeesByDepartment();
        break;
      case "Delete Deptartment, Role, or Employee":
        deleteRowFromTable();
        break;
      case "Department Budget":
        departmentBudget();
        break;
      case "Quit":
        process.exit();
      default:
        console.log("Please select an option:");
    }
  }
  ////all functions defined in squential order according to list-order in the menu, starting with viewAllemployees
  async function viewAllEmployees() {
    let results = await db.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id"
    );

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

  async function updateEmployeeRole() {
    let employeeList = await db.query("SELECT * FROM employee");
    let employeeRoles = await db.query("SELECT title, id FROM role");
    let answers;

    await inquirer
      .prompt([
        {
          type: "list",
          message: "Choose an employee to update their role:",
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
          message: "Choose a role to give them:",
          name: "roleID",
          choices: employeeRoles[0].map((employeeRoles) => {
            return {
              name: `${employeeRoles.title}`,
              value: employeeRoles.id,
            };
          }),
        },
      ])
      .then((response) => {
        answers = response;
      });

    await db.query(
      `UPDATE employee SET role_id = ${answers.roleID} WHERE id = ${answers.employee}`
    );

    console.log("\n-----UPDATE ADDED TO DATABASE-----\n");

    mainMenu();
  }

  async function viewAllRoles() {
    let results = await db.query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id"
    );
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

    await db.query(
      `INSERT INTO role (title, salary, department_id) VALUES ("${answers.name}", "${answers.salary}", ${answers.dept_id})`
    );

    console.log("\n-----ROLE ADDED TO DATABASE-----\n");

    mainMenu();
  }

  async function viewAllDepartments() {
    let results = await db.query(
      "SELECT id, name AS department FROM department"
    );
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

  async function updateEmployeeManager() {
    let employeeList = await db.query("SELECT * FROM employee");
    let answers1;
    let answers2;

    await inquirer
      .prompt([
        {
          type: "list",
          message: "Choose an employee to update their manager:",
          name: "employee",
          choices: employeeList[0].map((employee) => {
            return {
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            };
          }),
        },
        {
          type: "confirm",
          message: "Are they being promoted to manager?",
          name: "management",
        },
      ])
      .then((response) => {
        answers1 = response;
      });

    if (!answers1.management) {
      let managerInfo = await db.query(
        "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS manager FROM employee WHERE employee.manager_id IS NULL"
      );
      await inquirer
        .prompt([
          {
            type: "list",
            message: "Please choose a manager to give them:",
            name: "managerID",
            choices: managerInfo[0].map((managerInfo) => {
              return {
                name: `${managerInfo.manager}`,
                value: managerInfo.id,
              };
            }),
          },
        ])
        .then((response) => {
          answers2 = response;
        });
    } else {
      await db.query(
        `UPDATE employee SET manager_id = null WHERE id = ${answers1.employee}`
      );
      console.log("\n-----UPDATE ADDED TO DATABASE-----\n");
      return mainMenu();
    }

    await db.query(
      `UPDATE employee SET manager_id = ${answers2.managerID} WHERE id = ${answers1.employee}`
    );

    console.log("\n-----UPDATE ADDED TO DATABASE-----\n");

    mainMenu();
  }

  async function deleteRowFromTable() {
    let answers1;
    let answers2;

    await inquirer
      .prompt([
        {
          type: "list",
          message: "What would you like to delete:",
          name: "choice1",
          choices: ["department", "role", "employee"],
        },
      ])
      .then((response) => {
        answers1 = response;
      });

    if (answers1.choice1 === "department") {
      let departments = await db.query(
        "SELECT id, name AS department from department"
      );
      await inquirer
        .prompt([
          {
            type: "list",
            message: "Please choose a department to delete:",
            name: "choice2",
            choices: departments[0].map((department) => {
              return {
                name: `${department.department}`,
                value: department.id,
              };
            }),
          },
        ])
        .then((response) => {
          answers2 = response;
        });
    } else if (answers1.choice1 === "role") {
      let roles = await db.query("SELECT id, title FROM role");
      await inquirer
        .prompt([
          {
            type: "list",
            message: "Please choose a role to delete:",
            name: "choice2",
            choices: roles[0].map((role) => {
              return {
                name: `${role.title}`,
                value: role.id,
              };
            }),
          },
        ])
        .then((response) => {
          answers2 = response;
        });
    } else {
      let employees = await db.query(
        "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee FROM employee"
      );
      await inquirer
        .prompt([
          {
            type: "list",
            message: "Please choose a employee to delete:",
            name: "choice2",
            choices: employees[0].map((employee) => {
              return {
                name: `${employee.employee}`,
                value: employee.id,
              };
            }),
          },
        ])
        .then((response) => {
          answers2 = response;
        });
    }

    await db.query(
      `DELETE FROM ${answers1.choice1} WHERE id =  ${answers2.choice2}`
    );

    console.log(`\n-----${answers1.choice1} deleted from database.-----\n`);

    mainMenu();
  }

  async function departmentBudget() {
    let departments = await db.query(
      "SELECT id, name AS department FROM department"
    );
    let answer;

    await inquirer
      .prompt([
        {
          type: "list",
          message: "Choose a deparment to see their budget:",
          name: "choice",
          choices: departments[0].map((department) => {
            return {
              name: `${department.department}`,
              value: {
                name: department.department,
                id: department.id,
              },
            };
          }),
        },
      ])
      .then((response) => {
        answer = response;
      });

    let total_salary = await db.query(
      `SELECT SUM(role.salary) AS ${answer.choice.name}_salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = ${answer.choice.id}`
    );

    console.table(total_salary[0]);

    mainMenu();
  }

  mainMenu();
}

main();
