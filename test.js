const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

async function test() {
  const db = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Never5660217!",
      database: "workForce_db",
    },
    console.log(`Connected to the workForce_db database.`)
  );

  let results = await db.query(
    "SELECT SUM(role.salary) AS total_salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = 3"
  );

//   SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id

  console.table(results[0]);

  process.exit();
}

test();

