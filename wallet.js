
const location = "0x345ca3e014aaf5dca488057592ee47305d9b3e10";
const json  = require("./build/contracts/ERC20d.json");

const firebase = require('firebase');
const Web3 = require('web3');

const _web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:9545');
const _instance = new _web3.eth.Contract(json.abi, location);

const _ether = Math.pow(10,18);
const _feeWallet = "0x11905bd0863ba579023f662d1935e39d0c671933";


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
       if(result[0] != 0 && result[1] != 'x'){ result = "0x" + result; }
       await _web3.eth.accounts.wallet.clear();
       result = _web3.eth.accounts.privateKeyToAccount(result);
       return result.address;
     })
   } else {
     return id;
   }
 }

 module.exports.viewAccount = viewAccount = async(_username) => {
    var id = await getID(_username);
    if(id != undefined){
      return await firebase.firestore().collection(id)
      .orderBy('address', 'desc').limit(1).get()
      .then(async(state) => {
        var result;
        await state.forEach((asset) => {
           result = asset.data().address;
         })
       return result;
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

 module.exports.getUsername = getUsername = async(_chatid) => {
   return await firebase.firestore().collection(_chatid)
   .orderBy('user', 'desc').limit(1).get()
   .then(async(state) => {
     var result;
      await state.forEach((asset) => {
         result = asset.data().user;
      })
    return result;
 })
}

module.exports.tipRain = tipRain = async(_platform, _username, _payee, _amount, _asset) => {
    var totalTipped = 0;
    var tipped = { users: [] };
    var users = await rainUsers(_platform, _username);
    for(var x = 0; x < 50; x++){
      var randomIndex = Math.floor(Math.random() * users.length);
      var transaction;
      if(tipped[users[randomIndex]] != true && users[randomIndex] != undefined){
        var reciever =  await viewAccount(users[randomIndex]);
        if(_asset == "VLDY"){
          transaction = await tokenTransfer(_payee, reciever, _amount);
        } else if(_asset == "EGEM"){
          transaction = await gasTransfer(_payee, reciever, _amount);
        } if(transaction != undefined){
          tipped.users.push(users[randomIndex]);
          totalTipped = totalTipped + _amount;
          tipped[users[randomIndex]] = true;
        }
      }
    }
    if(totalTipped != 0){
      await leaderboardInput(_platform, _username, totalTipped, _asset);
      await retractFee(_payee);
    }
    await _web3.eth.accounts.wallet.remove(_payee);
    return tipped.users;
}

  module.exports.tipUser = tipUser = async(_platform, _username, _payee, _reciever, _amount, _asset) => {
    var transaction;
    await retractFee(_payee);
     if(_asset == "VLDY"){
       transaction = await tokenTransfer(_payee, _reciever, _amount);
     } else if(_asset == "EGEM"){
       transaction = await gasTransfer(_payee, _reciever, _amount);
     } if(transaction != undefined){
       await leaderboardInput(_platform, _username, _amount, _asset);
     }
     _web3.eth.accounts.wallet.remove(_payee);
     return transaction;
 }

 module.exports.withdrawFunds = tipUser = async(_payee, _target, _amount, _asset) => {
   var transaction;
    if(_asset == "VLDY"){
      transaction = await tokenTransfer(_payee, _target, _amount);
    } else if(_asset == "EGEM"){
      transaction = await gasTransfer(_payee, _target, _amount);
    _web3.eth.accounts.wallet.remove(_payee);
  }
  return transaction;
}

  module.exports.createAccount = createAccount = async(_username, _chatid) => {
   _chatid = "v" + _chatid.toString();
   if(await viewAccount(_username) == undefined){
    var account = _web3.eth.accounts.create();
	   console.log(account);
     await firebase.firestore().collection(_chatid).add({
       privateKey: account.privateKey,
       address: account.address,
       user: _username});
     await firebase.firestore().collection(_username).add({
       id: _chatid });
     return account.address;
   }
 }

  module.exports.tokenbalance = tokenBalance = async(_target) => {
   const balance = await _instance.methods.balanceOf(_target).call();
   return parseFloat(balance/_ether).toFixed(2);
 }

  module.exports.gasBalance = gasBalance = async(_target) => {
   var balance = await _web3.eth.getBalance(_target)
   return parseFloat(balance/_ether).toFixed(2);
 }

    module.exports.userGas = userGas = async(_platform ,_user) => {
     return await firebase.firestore().collection(_user)
     .orderBy(`${_platform}`, 'desc').limit(1).get()
     .then(async(state) => {
       var result;
       await state.forEach((asset) => {
          result = asset.data()[_platform];
        })
       return result;
     })
   }

     module.exports.userToken = userToken = async(_platform ,_user) => {
      return await firebase.firestore().collection(_user)
      .orderBy('token', 'desc').get()
      .then(async(state) => {
        var result;
        var x = 0;
        await state.forEach((asset) => {
          if(asset.data()[_platform] != undefined
             && x == 0){
            result = asset.data().token;
            x++;
          }
         })
        return result;
      })
    }

     module.exports.gasTotal = gasTotal = async( _platform) => {
      return await firebase.firestore().collection(_platform)
      .orderBy('gas', 'desc').get()
      .then(async(state) => {
        var score = {};
        var x = 0;
        await state.forEach((asset) => {
          if(score[asset.data().user] == undefined){
             score[asset.data().user] = parseFloat(asset.data().gas).toFixed(2);
             score[x] = asset.data().user;
             x++;
           }
         })
       return score;
      })
    }

     module.exports.tokenTotal =  tokenTotal = async( _platform) => {
       return await firebase.firestore().collection(_platform)
       .orderBy('token', 'desc').get()
       .then(async(state) => {
         var score = {};
         var x = 0;
         await state.forEach((asset) => {
           if(score[asset.data().user] == undefined){
              score[asset.data().user] =  parseFloat(asset.data().token).toFixed(2);
              score[x] = asset.data().user;
              x++;
            }
          })
        return score;
       })
     }

  rainUsers = async( _platform, _user) => {
       return await firebase.firestore().collection(_platform)
       .orderBy('user', 'desc').get()
       .then(async(state) => {
         var userList = [];
         var verif = {};
         await state.forEach((asset) => {
           if(verif[asset.data().user] == undefined
              && asset.data().user != _user) {
              userList.push(asset.data().user);
              verif[asset.data().user] = true;
            }
          })
        return userList;
       })
    }

 gasTransfer = async(_payee, _recipent, _amount) => {
   if(_amount % 1 == 0){
     _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
   } else if(_amount % 1 != 0){
     _amount = _web3.utils.toHex(_amount*_ether);
   }
   const tx = await _web3.eth.sendTransaction({
     value: _amount,
     from: _payee,
     to: _recipent,
     gas: 2750000
   })
   return tx.transactionHash;
 }

tokenTransfer = async(_payee, _recipent, _amount) => {
  if(_amount % 1 == 0){
    _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
  } else if(_amount % 1 != 0){
    _amount = _web3.utils.toHex(_amount*_ether);
  }
   const tx = await _instance.methods.transfer(_recipent, _amount)
   .send({ from: _payee, gas: 2750000 });
   return tx.transactionHash;
 }

retractFee = async(_payee) => {
   const tx = await _web3.eth.sendTransaction({
     value: _ether,
     from: _payee,
     to: _feeWallet,
     gas: 2750000
   });
 }

 leaderboardInput = async(_platform, _user, _amount, _asset) => {
    var gas = await userGas(_platform, _user);
    var token = await userToken(_platform, _user);
    if(isNaN(gas) == true ){ gas = 0; }
    if(isNaN(token) == true){ token = 0; }
    if(_asset == "EGEM"){
      gas = parseFloat(gas)+parseFloat(_amount);
    } else if(_asset == "VLDY"){
      token = parseFloat(token)+parseFloat(_amount);
    }
    await firebase.firestore().collection(_platform).add({
      token: token,
      user: _user,
      gas: gas
    })
    return await firebase.firestore().collection(_user).add({
      [_platform]: gas,
      token: token
    })
 }
