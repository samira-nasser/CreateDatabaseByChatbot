const path = require('path');
const { ConsoleAdapter } = require('./consoleAdapter');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
const adapter = new ConsoleAdapter();
const { EchoBot } = require('./bot');
const bot = new EchoBot();
const chalk = require('chalk');
// const clear = require('clear');
const figlet = require('figlet');


console.log(
    chalk.yellow(
      figlet.textSync('Database Chatbot', { horizontalLayout: 'full' })
    )
  );

adapter.listen(async (context) => {
    bot.onTurn(context)
    .then(function(response){        
        if(response == 1)
            console.log("Please Enter Collection Name :");
        if(response == 2)
            console.log("Please Enter Json Object of fields of collection :");
        if(response == undefined)
            console.log("Validation Error : Please Enter Json Object of fields for the collection :");
    })
    .catch(function(error){
        console.log("Validation Error : Please Enter Json Object of fields for the collection :");

        return error ;
    })
    
});



// Emit a startup message with some instructions.
console.log('> Console EchoBot is online. First Please Enter The Database Name!');
console.log('> Say "quit" to end.');
console.log(''); // Leave a blank line after instructions.
