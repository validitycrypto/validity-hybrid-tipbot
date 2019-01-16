const location = "0xb95561a4a12383eac1d07fbfdcc0525d54b74cbc";
const json  = require("./build/contracts/ERC20d.json");
const telegramApi = require('telegraf/telegram');
const discordjs = require('discord.js');
const telegraf = require('telegraf');

const firebase = require('firebase');
const Web3 = require('web3');

const _web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:9545/");
const _instance = new _web3.eth.Contract(json.abi, location);

const _decimals = Math.pow(10,18);


initialiseDatabase = async() => {
   firebase.initializeApp(_preferences);
   firebase.firestore().settings({
     timestampsInSnapshots: true
   });
 }

getAccount = async(_username) => {
   var id = await getID(_username);
   if(id != undefined){
     return await firebase.firestore().collection(id)
     .orderBy('privateKey', 'desc').limit(1).get()
     .then(async(state) => {
       var result;
       await state.forEach((asset) => {
          result = asset.data().privateKey;
        })
      result = _web3.eth.accounts.privateKeyToAccount(result);
      return result.address;
    })
  } else {
    return id;
  }
}

getID = async(_username) => {
   return await firebase.firestore().collection(_username)
   .orderBy('id', 'desc').limit(1).get()
   .then(async(state) => {
     var result;
      await state.forEach((asset) => {
         result = asset.data().id;
      })
    return result;
 })
}

tipUser = async(_user1, _user2, _amount, _asset) => {
  var reciever = await getAccount(_user2.replace('@', ''));
  var payee = await getAccount(_user1);
  if(payee == undefined){
    return "⚠️ Please generate an account firstly by using the command: /generate";
  } else if(reciever == undefined){
    return "⚠️ Recipent has not generated an account"
  } else {
    _amount = parseFloat(_amount)*_decimals;
    var token = await tokenbalance(payee);
    var gas = await gasBalance(payee);
    if(_asset == "VLDY" && gas != 0 && token != 0){
      return await tokenTransfer(payee, reciever, _amount);
    } else if(_asset == "EGEM" && gas != 0){
      return await gasTransfer(payee, reciever, _amount);
    } else if(token == 0 && gas != 0){
      return "🚫 No tokens available for transaction"
    } else if(gas == 0){
      return "🚫 No gas available for transaction"
    }
  }
}

createAccount = async(_username, _chatid) => {
  _chatid = "v" + _chatid;
  if(await getAccount(_username) == undefined){
    var account = _web3.eth.accounts.create();
    await firebase.firestore().collection(_chatid).add({
      privateKey: account.privateKey });
    await firebase.firestore().collection(_username).add({
      id: _chatid });
    return `🎉 Congratzi your new account is ${account.address}`;
  }
  else {
    return "🚫 You already have an account"
  }
}

tokenbalance = async(_target) => {
  const balance = await _instance.methods.balanceOf(_target).call();
  return parseFloat(balance/_decimals).toFixed(4);
}

gasBalance = async(_target) => {
  var balance = await _web3.eth.getBalance(_target)
  return parseFloat(balance/_decimals).toFixed(4);
}

gasTransfer = async(_payee, _recipent, _amount) => {
  const tx = await _web3.eth.sendTransaction({
    value: _amount,
    from: _payee,
    to: _recipent,
    gas: 2750000
  })
  return tx.transactionHash;
}

tokenTransfer = async(_payee, _recipent, _amount) => {
  _amount = parseFloat(_amount)*_decimals;
  const tx = await _instance.methods.transfer(_recipent, _amount,
  { from: _payee, gas: 2750000 }).send();
  return tx.transactionHash;
}

retractFee = async(_payee, _recipent, _amount) => {
  return await _web3.eth.sendTransaction({
    amount: _decimals,
    from: _payee,
    to: _reciever,
    gas: 2750000
  }).send();
}

initialiseDatabase();

const tbot = new telegraf(_tg)
const tapi = new telegramApi(_tg)

tbot.start((ctx) => ctx.reply(
  'Welcome to the Validity (VDLY) Hybrid tipbot 🎉'
   + '\n\nCompatible across Discord and Telegram 💜💙'
   + '\nFor more info check out @ValidityCrypto ✅'
   + '\nTo start, register an account by using the command: /generate'
   + '\nNow, you can recieve and send tips in EGEM and VLDY from and to other users !'
   + '\nCheck out all the bot has to offer by using the commands: /help and /commands'
   + '\nMost importantly, have fun.'
   + '\n\nCreated by @xGozzy'
))

tbot.command('balance', async(ctx) => {
  var response;
  var account = await getAccount(ctx.message.from.username);
  if(account == undefined){
    response = "⚠️ Please generate an account first by using the command: /generate";
  } else {
    var token = await tokenbalance(account);
    var gas = await gasBalance(account);
    response = `💎 EGEM: ${gas} ✅ VLDY: ${token}`;
  }
  return ctx.reply(response);
})

tbot.command('deposit', async(ctx) => {
  var nuo = await getAccount(ctx.message.from.username);
  return ctx.reply(`@${ctx.message.from.username} your depositing address is: ${nuo}`);
})

tbot.command('generate', async(ctx) => {
  var user = ctx.message.from.username;
  var id =  ctx.message.chat.id;
  var nuo = await createAccount(user, id);
  return ctx.reply(`${nuo}`);
})

tbot.command('/syip', async(ctx) => {
  var message = ctx.message.text.split("/syip ").pop();
  var params = message.split(" ");
  var tx = await tipUser(ctx.message.from.username,
    params[0], params[1], params[2]);
  return ctx.reply(`${tx}`)
})

tbot.launch()
