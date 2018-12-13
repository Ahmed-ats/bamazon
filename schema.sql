DROP DATABASE IF EXISTS  bamazonDB;

CREATE DATABASE  bamazonDB;

USE  bamazonDB;
                 
                 
CREATE TABLE products(
	item_id INT AUTO_INCREMENT ,
	product_name VARCHAR(250) NOT NULL,
	department_name  VARCHAR(250) NOT NULL,
	 price DECIMAL(7,2) NOT NULL ,
     stock_quantity INT(10),
	 PRIMARY KEY (item_id)
 
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("pen", "office", 1.20, 50),
 ("mouse", "office", 75.29, 80),
 ("I phone", "phones", 700.95, 20),
 ("galaxy s8", "phones",650.59, 40),
 ("LG screen", "electronics", 400.99,10),
 ("tray", "kitchen", 4.99, 70),
 ("pan", "kitchen", 19.20, 55),
 ("white board", "office", 21.20, 50),
 ("pod adidas ", "clothing",139.95, 50),
 ("T-shirt", "clothing", 23.58,11);

SELECT * FROM products;