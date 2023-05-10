INSERT INTO department (department_name)
VALUES ("Front-end"),
       ("Back-end"),
       ("Servers"),
       ("Databases");      

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 140000, 3),
       ("Web Developer", 115000, 2),
       ("Front-end Developer", 95000, 1),
       ("Data Analyst", 85000, 4),
       ("Data Scientist", 130000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dan", "Marino", 1, null),
       ("Ryan", "Sandburg", 3, 1),
       ("Peyton", "Manning", 2, 1),
       ("Sammy", "Sosa", 4, 5),
       ("Dirk", "Nowitzki", 5,null);
