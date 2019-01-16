const location = "0xb0702df32de0371f39a98cc911a2dd69c3a13e6f";
const json  = require("./build/contracts/ERC20d.json");
const telegramApi = require('telegraf/telegram');
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

getAccount = async(_username) => {
   return await firebase.firestore().collection(_username)
   .orderBy('privateKey', 'desc').limit(1).get()
   .then(async(state) => {
     var result;
      await state.forEach((asset) => {
         result = asset.data().privateKey;
      })
    if(result == undefined){
      return result;
    } else {
      result = _web3.eth.accounts.privateKeyToAccount(result);
      return result.address;
    }
 })
}

getID = async(_username) => {
   return await firebase.firestore().collection(_username)
   .orderBy('id', 'desc').limit(1).get()
   .then(async(state) => {
     var result;
      await state.forEach((asset) => {
         result = asset.data().id;
      })
    if(result == undefined){ return result;
    } else {
      return result;
    }
 })
}

tipUser = async(_user1, _user2, _amount, _asset) => {
  var reciever = await getAccount(_user2.replace('@', ''));
  var payee = await getAccount(_user1);
  var token = await tokenbalance(payee);
  var gas = await gasBalance(payee);
  _amount = parseFloat(_amount);
  if(_asset == "VLDY" && gas != 0 && token != 0){
    return await tokenTransfer(payee, reciever, _amount);
  } else if(_asset == "EGEM" && gas != 0){
    return await gasTransfer(payee, reciever, _amount);
  } else if(payee == undefined){
    return "Please generate an account with the command /generate."
  } else if(reciever == undefined){
    return "Recipent has not generated an account."
  } else if(token == 0 && gas != 0){
    return "No tokens available for transaction."
  } else if(gas == 0){
    return "No gas available for transaction."
  }
}

createAccount = async(_username, _chatid) => {
  if(await getAccount(_username) == undefined){
    var account = _web3.eth.accounts.create();
    await firebase.firestore().collection(_username).add({
      privateKey: account.privateKey,
      id:  _chatid
    });
    return `Your new account is ${account.address}`;
  }
  else{
    return "You already have an account."
  }
}

tokenbalance = async(_target) => {
  const balance = await _instance.methods.balanceOf(_target).call();
  return parseFloat(balance/_decimals).toFixed(2);
}

gasBalance = async(_target) => {
  var balance = await _web3.eth.getBalance(_target)
  return parseFloat(balance/_decimals).toFixed(2);
}

gasTransfer = async(_payee, _recipent, _amount) => {
  return await _web3.eth.sendTransaction({
    amount: parseFloat(_amount),
    from: _payee,
    to: _reciever,
    gas: 2750000
  }).send();
}

gasTransfer = async(_payee, _recipent, _amount) => {
  return await _instance.transfer(_reciever, _amount,
  { from: _payee, gas: 2750000 }).send();
}

initialiseDatabase();

const tbot = new telegraf(_tg)
const tapi = new telegramApi(_tg)

tbot.start((ctx) => ctx.reply('Validity (VDLY) Hybrid tipbot'))

tbot.command('balance', async(ctx) => {
  var account = await getAccount(ctx.message.from.username);
  var token = await tokenbalance(account);
  var gas = await gasBalance(account);
  return ctx.reply(`EGEM: ${gas}  VLDY: ${token}`);
})

tbot.command('deposit', async(ctx) => {
  var nuo = await getAccount(ctx.message.from.username);
  return ctx.reply(`Your depositing address is: ${nuo}`);
})

tbot.command('yips', async(ctx) => {
  var user = ctx.message.from.username;
  var id =  ctx.message.chat.id;
  var nuo = await createAccount(user, id);
  return ctx.reply(`${nuo}`);
})

tbot.command('buere', async(ctx) => {
  var message = ctx.message.text.split("/buere ").pop();
  var params = message.split(" ");
  var tx = await tipUser(ctx.message.from.username,
    params[0], params[1], params[2]);
  return ctx.reply(`${tx}`)
})

tbot.launch()
