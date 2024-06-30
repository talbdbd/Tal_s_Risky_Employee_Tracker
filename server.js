
require('dotenv').config();
const inquirer = require('inquirer');
const createConnection = require('./js/connection');

const viewAllDepartments = () => {
  const connection = createConnection();
  connection.connect((err) => {
    if (err) throw err;
    connection.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      console.table(results);
      connection.end();
      promptUser();
    });
  });
};

const viewAllRoles = () => {
  const connection = createConnection();
  connection.connect((err) => {
    if (err) throw err;
    connection.query('SELECT * FROM role', (err, results) => {
      if (err) throw err;
      console.table(results);
      connection.end();
      promptUser();
    });
  });
};

const viewAllEmployees = () => {
  const connection = createConnection();
  connection.connect((err) => {
    if (err) throw err;
    connection.query('SELECT * FROM employee', (err, results) => {
      if (err) throw err;
      console.table(results);
      connection.end();
      promptUser();
    });
  });
};

const addDepartment = () => {
  inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:'
    }
  ]).then((answer) => {
    const connection = createConnection();
    connection.connect((err) => {
      if (err) throw err;
      connection.query('INSERT INTO department SET ?', { name: answer.name }, (err) => {
        if (err) throw err;
        console.log('Department added successfully!');
        connection.end();
        promptUser();
      });
    });
  });
};

const addRole = () => {
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
      type: 'input',
      message: 'Enter the department ID for the role:'
    }
  ]).then((answers) => {
    const connection = createConnection();
    connection.connect((err) => {
      if (err) throw err;
      connection.query('INSERT INTO role SET ?', {
        title: answers.title,
        salary: answers.salary,
        department_id: answers.department_id
      }, (err) => {
        if (err) throw err;
        console.log('Role added successfully!');
        connection.end();
        promptUser();
      });
    });
  });
};

const addEmployee = () => {
  inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'Enter the first name of the employee:'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Enter the last name of the employee:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the role ID for the employee:'
    },
    {
      name: 'manager_id',
      type: 'input',
      message: 'Enter the manager ID for the employee (or leave blank):',
      default: null
    }
  ]).then((answers) => {
    const connection = createConnection();
    connection.connect((err) => {
      if (err) throw err;
      connection.query('INSERT INTO employee SET ?', {
        first_name: answers.first_name,
        last_name: answers.last_name,
        role_id: answers.role_id,
        manager_id: answers.manager_id
      }, (err) => {
        if (err) throw err;
        console.log('Employee added successfully!');
        connection.end();
        promptUser();
      });
    });
  });
};

const updateEmployeeRole = () => {
  inquirer.prompt([
    {
      name: 'employee_id',
      type: 'input',
      message: 'Enter the ID of the employee you want to update:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the new role ID for the employee:'
    }
  ]).then((answers) => {
    const connection = createConnection();
    connection.connect((err) => {
      if (err) throw err;
      connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.employee_id], (err) => {
        if (err) throw err;
        console.log('Employee role updated successfully!');
        connection.end();
        promptUser();
      });
    });
  });
};

const promptUser = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]).then((answer) => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Goodbye!');
        process.exit();
    }
  });
};

promptUser();