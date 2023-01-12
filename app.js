// Based on Matheus Battisti Course (udemy)

// External modules
const inquirer = require("inquirer")
const chalk = require("chalk")

// Internal modules
const fs = require("fs")
console.log("Initiating Accounts")

operation()

function operation() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                message: "How can we help you today?",
                choices: [
                    "Create account",
                    "Check balance",
                    "Deposit",
                    "Withdraw",
                    "Exit"
                ],
            }
        ])
        .then((answer) => {
            const action = answer["action"]
            
            if(action === "Create account") createAccount();
        })
        .catch((err) => console.log(err))
}

// CREATE AN ACCOUNT
function createAccount() {
    console.log(chalk.bgGreen.black("Thank you for choosing our bank!"))
    console.log(chalk.green.black("Please configure your account:"))
    configureAccount();
}

function configureAccount() {
    inquirer
        .prompt([
            {
                name: "accountName",
                message: "Write your account name:"
            }
        ])
    .then((answer) => {
        const accountName = answer["accountName"] 
        console.info(accountName)

        if(!fs.existsSync("accounts")) {
            fs.mkdirSync("accounts")
        }
        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed("This account already exists. Please choose another name"))
            configureAccount()
        }
        fs.writeFileSync(
            `accounts/${accountName}.json`, 
            '{"balance": 0}',
            function (err) {
                console.log(err)
            }
        )
        console.log(chalk.bgGreen("Congrats! Your account was just created and it is ready to use!"))
        operation()
    })
    .catch((err) => console.log(err))
}


// https://www.npmjs.com/package/inquirer#documentation