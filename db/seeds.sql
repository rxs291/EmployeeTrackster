INSERT INTO department (name)
VALUES ("Kitchen"),
       ("Academics"),
       ("Administration");

INSERT INTO role (title, salary, department_id)
VALUES ("Chef", 50000.00, 1), 
       ("Line Cook", 35000.00, 1),
       ("Teacher", 45000.00, 2),
       ("Librarian", 60000.00, 2),
       ("Front Desk", 40000.00, 3),
       ("Principal", 80000.00, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sue", "Susan", 4, NULL),
       ("Jack", "Jason", 1, NULL),
       ("Lee", "Lenard", 2, 2), 
       ("Carl", "Cason", 2, 2),
       ("Harriet", "Hellsman", 3, NULL),
       ("Brian", "Bakers", 3, 5),
       ("Neil", "Kneeman", 3, 5),
       ("Mariah", "Moore", 6, NULL),
       ("Janet", "Joys", 5, 8),
       ("Ki", "Kassen", 5, 8);
       

       
       
