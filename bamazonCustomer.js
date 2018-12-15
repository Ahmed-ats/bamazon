var mysql = require("mysql");

require('console.table');

var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",
  
    password: "password",
    database: "bamazonDB"
  });
  
 
  connection.connect(function (err) {
      if (err) throw err;
    
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
                  console.log("Thank you for coming, come again please!");
                    connection.end()
              }

            })
 
} 

function UserItem(){
   
    inquirer.prompt([
        {
            type: "input",
            name: "productId",
            message: "What is the product ID?", 
            validate: function(userInput){
                if (Number(userInput) < 11) {
                    return true
                }
                else {
                    return false
                }
            }
        },
        {
            type: "input",
            name: "productUnits",
            message: "How many units do you want?", 
            validate: function(userInput){
                if (Number(userInput) ) {
                    return true
                }
                else {
                    return false
                }
            }
        }
    ])
        .then(function (ansewrs) {
           
        
            connection.query("SELECT stock_quantity FROM products WHERE item_id= ? ", [ansewrs.productId], function (err, res) {
                
                if (err) throw err;
              
                if (ansewrs.productUnits > res[0].stock_quantity) {

                    console.log(`\n`)
                    console.log(`Insufficient quantity!the max units we could do is ${res[0].stock_quantity}`)
                    console.log(`\n`)
                    console.log(`------`)

                    anotherPurchase()
                }

                else {
                    res[0].stock_quantity -= ansewrs.productUnits;
                    updatedProducts();
                    totalPrice()

                }


                function updatedProducts() {
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
                       
                       )
                }


                function totalPrice() {
                    connection.query("SELECT price FROM products WHERE item_id= ? ", [ansewrs.productId], function (err, res) {
                        var itemPrice = res[0].price;
                        var total = (itemPrice * ansewrs.productUnits).toFixed(2);
                        
                        console.log("\n")
                        console.log(`Price per unit: $${itemPrice}`);
                        console.log(`Total price of ${ansewrs.productUnits} units is $${total}`);
                        console.log("\n")
                        console.log(`--------`);
                        
                        anotherPurchase() 
                        
                    })

                }


            });

                function anotherPurchase(){
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "decision",
                            message: "Would you like to make another purchase?",
                            choices: ["Yes", "Yes, Show products again", "No"]
                        }
                    ])
                        .then(function (ansewrs) {
                            if (ansewrs.decision === "Yes") {
                                UserItem()
                            }
                            else if (ansewrs.decision === "Yes, Show products again"){
                                display()
                            }
                            else {
                                console.log("Thank you for coming and come again please!");
                                connection.end()
                            }

                        })

               } 

     });

}


