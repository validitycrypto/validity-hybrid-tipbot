
const location = "0x9b729a8f44e0cc028754aa84787f00dd96077710";
const json  = require("./build/contracts/ERC20d.json");

const firebase = require('firebase');
const Web3 = require('web3');

const _web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:9545');
const _instance = new _web3.eth.Contract(json.abi, location);

const _ether = Math.pow(10,18);

module.exports.initialiseDatabase  = initialiseDatabase = async() => {
   firebase.initializeApp(_preferences);
   firebase.firestore().settings({
     timestampsInSnapshots: true
   });
 }

 module.exports.getAccount = getAccount = async(_username) => {
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


  module.exports.getID = getID = async(_username) => {
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

  module.exports.tipUser = tipUser = async(_platform, _payee, _reciever, _amount, _asset) => {
    var transaction;
     if(_asset == "VLDY"){
       transaction = await tokenTransfer(_payee, _reciever, _amount);
     } else if(_asset == "EGEM"){
       transaction = await gasTransfer(_payee, _reciever, _amount);
     } if(transaction != undefined){
       await leaderboardInput(_platform, _user, _amount, _asset);
     }
     return transaction;
 }

  module.exports.createAccount = createAccount = async(_username, _chatid) => {
   _chatid = "v" + _chatid;
   if(await getAccount(_username) == undefined){
     var account = _web3.eth.accounts.create();
     await firebase.firestore().collection(_chatid).add({
       privateKey: account.privateKey });
     await firebase.firestore().collection(_username).add({
       id: _chatid });
     return `🎉  Congratzi your new account is ${account.address}`;
   }
   else {
     return "🚫  You already have an account"
   }
 }

  module.exports.tokenbalance = tokenBalance = async(_target) => {
   const balance = await _instance.methods.balanceOf(_target).call();
   return parseFloat(balance/_ether).toFixed(4);
 }

  module.exports.gasBalance = gasBalance = async(_target) => {
   var balance = await _web3.eth.getBalance(_target)
   return parseFloat(balance/_ether).toFixed(4);
 }

 gasTransfer = async(_payee, _recipent, _amount) => {
   _amount = _web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18));
   const tx = await _web3.eth.sendTransaction({
     value: _amount,
     from: _payee,
     to: _recipent,
     gas: 2750000
   })
   return tx.transactionHash;
 }

tokenTransfer = async(_payee, _recipent, _amount) => {
   _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
   const tx = await _instance.methods.transfer(_recipent, _amount)
   .send({ from: _payee, gas: 2750000 });
   return tx.transactionHash;
 }

retractFee = async(_payee, _recipent, _amount) => {
   return await _web3.eth.sendTransaction({
     amount: _ether,
     from: _payee,
     to: _reciever,
     gas: 2750000
   }).send();
 }

 userScore = async( _platform ,_user) => {
    return await firebase.firestore().collection(_user)
    .orderBy(`${_platform}`, 'desc').limit(1).get()
    .then(async(state) => {
      var array;
      await state.forEach((asset) => {
         array.push(asset.data()[_platform]);
         array.push(asset.data().token);
       })
     return array;
    })
  }

  scoreTotal = async( _platform, _asset) => {
     return await firebase.firestore().collection(_platform)
     .orderBy(`${_asset}`, 'desc').get()
     .then(async(state) => {
       var result;
       await state.forEach((asset) => {
          result = asset.data()[_asset];
        })
      return result;
     })
   }

 leaderboardInput = async(_platform, _user, _amount _asset) => {
    var score = await userScore(_platform, _user,);
    if(_asset == "EGEM"){ score = score[0]; }
    else if(_asset == "VLDY"){ score = score[1]; }
      return await firebase.firestore().collection(_user).add({
        [_asset]: score+_amount
      })
      return await firebase.firestore().collection(_platform).add({
        [_asset]: score+_amount
      })
 }
