var mysql = require("mysql");

require('console.table');

var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazonDB"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function (err) {
      if (err) throw err;
      // run the start function after the connection is made to prompt the user
      console.log("\n");
     
     display()

  });

  function display() {
       
      connection.query(" SELECT item_id, product_name, price FROM products", function (err, res) {
          if (err) throw err;
          console.table(res);
          console.log("----------");
          prompting()

      })

           } 
            
    function prompting(){
        inquirer.prompt([
            {
                type: "list",
                name: "decision",
                message: "Would you like to make a purchase?",
                choices: ["Yes", "No"]
            }
        ])
            .then(function (ansewrs) {
              if (ansewrs.decision === "Yes"){
                UserItem()
              }
              else{
                  console.log("Thank you for coming and come again please!")
              }

            })
 
} 

function UserItem(){
    inquirer.prompt([
        {
            name: "productId",
            message: "What is the product ID?",
        },
        {
            name: "productUnits",
            message: "How many units do you want?",  
        }
    ])
        .then(function (ansewrs) {
             connection.query("SELECT stock_quantity FROM products WHERE item_id= ? ",[ansewrs.productId], function (err, res){
                    // console.log(res[0].stock_quantity);
                 if (ansewrs.productUnits > res[0].stock_quantity){
                    console.log(`Insufficient quantity!the max units we could do is ${res[0].stock_quantity}`) 
                 }
                 else{
                     res[0].stock_quantity -= ansewrs.productUnits;
                    //  console.log(`the new stock_quantity ${res[0].stock_quantity}`);
                     connection.query(
                         "UPDATE products SET ? WHERE ?",
                         [
                             {
                                 stock_quantity: res[0].stock_quantity
                             },
                             {
                                 item_id: ansewrs.productId
                             }
                         ],
                         function (err, res) {
                            console.log(res.affectedRows + " products updated!\n");
                             // Call deleteProduct AFTER the UPDATE completes
                         })
                         connection.query("SELECT price FROM products WHERE item_id= ? ",[ansewrs.productId], function (err, res) {
                              var itemPrice = res[0].price;
                              console.log(`Price per unit: $${ itemPrice}`);
                              var total = (itemPrice * ansewrs.productUnits).toFixed(2);
                                
                                console.log(`Total price of ${ansewrs.productUnits} units is $${total}`);
                                // Call deleteProduct AFTER the UPDATE completes
                            })
                            
                    
                 }

            });
        });   
}


