const { initialiseDatabase }  = require('./wallet.js');
const { tbot }  = require('./telegram.js');

initialiseServer = async() => {
  console.log("Initialising Firebase...")
  await initialiseDatabase();
  console.log("Initialising Telegraf...")
  await tbot.launch();
  console.log("The bot is alive!")
}

initialiseServer();
