const { initialiseTelegram }  = require('./telegram.js');
const { initialiseDatabase }  = require('./wallet.js');
const { initialiseDiscord }  = require('./discord.js');

var serviceAccount = require("./FirebasePrivateKey.json");
const admin = require("firebase-admin");

const discordToken = "";
const telegramToken = "";
const firebaseAuth = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  credential: ,
  databaseURL: ""
};

initialiseServer = async() => {
  console.log("Initialising Firebase...")
  await initialiseDatabase(firebaseAuth);
  console.log("Initialising Telegraf...")
  await initialiseTelegram(telegramToken);
  console.log("Initialising Discord.js...")
  await initialiseDiscord(discordToken);
  console.log("The bot is alive!")
}

initialiseServer();
