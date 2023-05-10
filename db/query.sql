SELECT
    employee.id,
    CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee name',
    r.title AS 'Title',
    r.salary AS 'Salary',
    d.name AS 'Department',
    CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
FROM role r
CROSS JOIN employee employee
    ON employee.role_id = r.id
CROSS JOIN department d
    ON d.id = r.department_id
LEFT JOIN employee manager 
    ON manager.id = employee.manager_id
ORDER BY
    employee.last_name;
