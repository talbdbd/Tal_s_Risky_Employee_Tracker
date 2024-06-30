const inquirer = require('inquirer');
const connection = require('./js/connection');
const cTable = require('console.table');

const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ]
    }
  ]).then(answer => {
    switch (answer.action) {
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add a Department':
        addDepartment();
        break;
      case 'Add a Role':
        addRole();
        break;
      case 'Add an Employee':
        addEmployee();
        break;
      case 'Update an Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
    }
  });
};

const viewAllDepartments = () => {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const viewAllRoles = () => {
  const query = `SELECT role.id, role.title, department.name AS department, role.salary
                 FROM role
                 LEFT JOIN department ON role.department_id = department.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const viewAllEmployees = () => {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                 FROM employee
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id
                 LEFT JOIN employee manager ON manager.id = employee.manager_id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const addDepartment = () => {
  inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:'
    }
  ]).then(answer => {
    const query = 'INSERT INTO department SET ?';
    connection.query(query, { name: answer.name }, (err, res) => {
      if (err) throw err;
      console.log(`Added ${answer.name} to the database.`);
      mainMenu();
    });
  });
};

const addRole = () => {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:'
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Select the department for the role:',
        choices: departments.map(department => ({
          name: department.name,
          value: department.id
        }))
      }
    ]).then(answer => {
      const query = 'INSERT INTO role SET ?';
      connection.query(query, answer, (err, res) => {
        if (err) throw err;
        console.log(`Added ${answer.title} to the database.`);
        mainMenu();
      });
    });
  });
};

const addEmployee = () => {
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) throw err;
    connection.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;
      inquirer.prompt([
        {
          name: 'first_name',
          type: 'input',
          message: "Enter the employee's first name:"
        },
        {
          name: 'last_name',
          type: 'input',
          message: "Enter the employee's last name:"
        },
        {
          name: 'role_id',
          type: 'list',
          message: "Select the employee's role:",
          choices: roles.map(role => ({
            name: role.title,
            value: role.id
          }))
        },
        {
          name: 'manager_id',
          type: 'list',
          message: "Select the employee's manager:",
          choices: [{ name: 'None', value: null }].concat(
            employees.map(employee => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id
            }))
          )
        }
      ]).then(answer => {
        const query = 'INSERT INTO employee SET ?';
        connection.query(query, answer, (err, res) => {
          if (err) throw err;
          console.log(`Added ${answer.first_name} ${answer.last_name} to the database.`);
          mainMenu();
        });
      });
    });
  });
};

const updateEmployeeRole = () => {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;
    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;
      inquirer.prompt([
        {
          name: 'employee_id',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          }))
        },
        {
          name: 'role_id',
          type: 'list',
          message: 'Select the new role:',
          choices: roles.map(role => ({
            name: role.title,
            value: role.id
          }))
        }
      ]).then(answer => {
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        connection.query(query, [answer.role_id, answer.employee_id], (err, res) => {
          if (err) throw err;
          console.log(`Updated employee's role.`);
          mainMenu();
        });
      });
    });
  });
};

mainMenu();