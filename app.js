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
            
            if(action === "Create account") 
                createAccount();
            else if(action === "Check balance")
                checkBalance();
            else if(action === "Deposit")
                deposit();
            else if(action === "Withdraw")
                checkBalance();
            else if(action === "Exit")
                exit();
        })
        .catch((err) => console.log(err))
}

// CREATE AN ACCOUNT
function createAccount() {
    console.log(chalk.bgGreen.black("Thank you for choosing our bank!"))
    console.log(chalk.green.black("Please configure your account:"))
    configureAccount();
}

// Add account name
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

// Check if account exists
function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("This account doesn't exist. Please choose a valid account"))
        return false
    }
    return true
}

// CHECK BALANCE OF THE ACCOUNT
function checkBalance() {
    inquirer.prompt([
        {
            name: "accountName",
            message:"Write your account's name"
        }
    ]).then((answer) => {

        const accountName = answer["accountName"]

        // Verify if account exists
        if(!checkAccount(accountName)) {
            return checkBalance()
        }

        const accountData = getAccountByName(accountName)

        console.log(
            chalk.bgBlue.black(
                `Your account's balance is $${accountData.balance}`
            )
        )

    }).catch(err => console.log(err))
}

// MAKE A DEPOSIT
function deposit() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "What is your account's name?"
        }
    ])
    .then((answer)=> {
        accountName = answer["accountName"]
        // verify if account exists
        if(!checkAccount(accountName)) {
            return deposit()
        }
        inquirer.prompt([
            {
                name: "amount",
                message: "How much do you want to deposit?"
            }
        ]).then((answer) => {
            const amount = answer["amount"]

            // add an amount
            addAmount(accountName, amount)
            operation()
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function addAmount(accountName, amount) {
    const accountData = getAccountByName(accountName)
    if(!amount) {
        console.log(
            chalk.bgRed.black("Please provide a valid amount")
        )
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.green(`The amount of ${amount} has been successfully deposited`))
}

function getAccountByName(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: "utf8",
        flag: "r"
    })
    
    return JSON.parse(accountJSON)
}

// EXIT THE PROGRAM
function exit() {
    console.log(chalk.bgCyan.black("Thank you for using our services. See you later!"))
    process.exit()
}

// https://www.npmjs.com/package/inquirer#documentation