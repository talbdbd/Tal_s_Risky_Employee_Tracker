INSERT INTO department (name) VALUES
    ('Engineering'),
    ('Sales'),
    ('Marketing');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
    ('Software Engineer', 80000, 1),
    ('Salesperson', 60000, 2),
    ('Marketing Manager', 70000, 3);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Rob', 'White', 1, NULL),
    ('Nick', 'Taha', 2, NULL),
    ('Mike', 'Sea', 3, NULL);