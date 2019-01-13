const location = "0xb0702df32de0371f39a98cc911a2dd69c3a13e6f";
const json  = require("./build/contracts/ERC20d.json");
const discordjs = require('discord.js');
const telegraf = require('telegraf');
const firebase = require('firebase');
const Web3 = require('web3');

const _web3 = new Web3(Web3.givenProvider || "https://jsonrpc.egem.io/custom");
const _instance = new _web3.eth.Contract(json.abi, location);

const _decimals = Math.pow(10,18);

initialiseDatabase = async() => {
   firebase.initializeApp(_preferences);
   firebase.firestore().settings({
     timestampsInSnapshots: true
   });
 }

getAccount = async(_chatid) => {
    _chatid = "x" + _chatid;
   return await firebase.firestore().collection(_chatid)
   .orderBy('privateKey', 'desc').limit(1).get()
   .then(async(state) => {
      var result;
      await state.forEach((asset) => {
         result = asset.data().privateKey;
      })
    result = _web3.eth.accounts.privateKeyToAccount(result);
    return result.address;
 })
}

listAccounts = async(_chatid) => {
    _chatid = "x" + _chatid;
   return await firebase.firestore().collection(_chatid)
   .orderBy('privateKey', 'desc').get()
   .then(async(state) => {
      var result = [];
      await state.forEach((asset) => {
         var account = _web3.eth.accounts.privateKeyToAccount(asset.data().privateKey);
         result.push(account.address);
      })
    return result;
 })
}

createAccount = async(_chatid) => {
  _chatid = "x" + _chatid;
  var account = _web3.eth.accounts.create();
  await firebase.firestore().collection(_chatid).add({
    privateKey: account.privateKey
  });
  var address = await getAccount(_chatid);
  return address;
}

tokenbalance = async(_target) => {
  const balance = await _instance.methods.balanceOf(_target).call();
  return parseFloat(balance/_decimals).toFixed(2) + " VLDY";
}

gasBalance = async(_target) => {
  var balance = await _web3.eth.getBalance(_target)
  return parseFloat(balance/_decimals).toFixed(2) + " EGEM";
}

initialiseDatabase();

const tbot = new telegraf(_tg)

tbot.start((ctx) => ctx.reply('Validity (VDLY) Hybrid tipbot'))
tbot.command('bal', async(ctx) => {
  var account = await getAccount(ctx.message.chat.id);
  console.log(account);
  var token = await tokenbalance(account);
  var gas = await gasBalance(account);
  return ctx.reply(`EGEM: ${gas}  VLDY: ${token}`);
})
tbot.command('acc', async(ctx) => {
  var accounts = await listAccounts(ctx.message.chat.id);
  console.log(accounts);
  return ctx.reply(`Your accounts:
    \n ${accounts[0]},
    \n ${accounts[1]},
    \n ${accounts[3]}`);
})
tbot.command('deposit', async(ctx) => {
  var nuo = await getAccount(ctx.message.chat.id);
  return ctx.reply(`Your depositing address is: ${nuo}`);
})
tbot.command('generate', async(ctx) => {
  var nuo = await createAccount(ctx.message.chat.id);
  return ctx.reply(`${nuo}`);
})
tbot.command('tip', async(ctx) => {
  var message = ctx.message.text.split("/tip ").pop();
  return ctx.reply(`${message}`)
})
tbot.launch()
