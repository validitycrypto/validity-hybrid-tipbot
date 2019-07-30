
const tokenLocation = "0x45be13da023d817832e7bd65eb40c15828f39aa2";
const multiLocation = "0xd3e06dc8cc3c21578d75fc6f255392539e84c53c";
const jsonMulti = require("./build/contracts/MultiTX.json");
const jsonToken = require("./build/contracts/ERC20d.json");

const Web3 = require('web3');
const admin = require("firebase-admin");

const _web3 = new Web3('wss://ropsten.infura.io/ws/v3/<API-KEY>');
const _instance = new _web3.eth.Contract(jsonToken.abi, tokenLocation);
const _rain = new _web3.eth.Contract(jsonMulti.abi, multiLocation);

const _ether = Math.pow(10,18);
const _feeWallet = "0xccCbF98AE04fD57810F4833fE6a9a5726A162a01";

module.exports.initialiseDatabase  = initialiseDatabase = async(_preferences) => {
   await _web3.eth.accounts.wallet.clear();
   await admin.initializeApp(_preferences);
   await admin.firestore().settings({
     timestampsInSnapshots: true
   });

 }

 module.exports.proofParameters = proofParameters = (_caller, _user, _amount, _asset, _rain) => {
  if(!_rain){
    if(_user == undefined){
      return '⚠️ Undefined recipent';
    } else if(_amount == undefined){
      return '⚠️ Undefined amount';
    } else if(isNaN(_amount)){
      return '⚠️ Not a number';
    } else if(_user == 'ValidityBot'){
      return '⚠️ Fudge you';
    } else if(_caller == _user){
      return '⚠️ You cannot tip yourself';
    } else if(_amount.toString().charAt(0) == '0'
    && _amount.toString().charAt(1) == "x"){
      return '⚠️ Invalid ';
    } else if(_amount < 0){
      return 'Want me to detuct that from your balance? 👋';
    } else if(_amount == 0){
      return 'Now why would you want to do that? 🤔';
    } else if(!(_asset == "VLDY" || _asset == "ETH" || _asset == "vldy" || _asset == "ETH")){
      return '⚠️ Incorrect asset type';
    } else {
      return true;
    }
  } else if(_rain){
    if(_amount == undefined){
      return '⚠️ Undefined amount';
    } else if(isNaN(_amount)){
      return '⚠️ Not a number';
    } else if(_amount.toString().charAt(0) == '0'
    && _amount.toString().charAt(1) == "x"){
      return '⚠️ Invalid ';
    } else if(_amount < 0){
      return 'Want me to detuct that from your balance? 👋';
    } else if(_amount == 0){
      return 'Now why would you want to do that? 🤔';
    } else if(!(_asset == "VLDY" || _asset == "ETH" || _asset == "vldy" || _asset == "ETH")){
      return '⚠️ Incorrect asset type';
    } else {
      return true;
    }
  }
}

  module.exports.proofAccount = proofAccount = async(_username) => {
    if(_username != undefined){
    var callingAccount = await getAccount(_username);
    if(callingAccount == undefined){
      return  '⚠️  Recipent or sender have not yet generated an account';
    } else {
      return callingAccount;
    }
    }
   }

   module.exports.proofBalances = proofBalances = async(_account, _amount, _asset, _rain) => {
      var accountToken = await tokenBalance(_account);
      var accountGas = await gasBalance(_account);
      var gasFee = feeImplementation(_rain);

      console.log("Amount:", _amount);
      console.log("Token:", accountToken);
      console.log("Gas:", accountGas);
      console.log("Fee:", gasFee);

      if(_rain == false){
        if(( _asset == "ETH" || _asset == "ETH")){
          var totalGas = gasFee + _amount;
          if(totalGas > accountGas){
            return ' Insufficent gas balance available for transaction '
          } else {
            return true;
          }
        } else if(( _asset == "VLDY" || _asset == "vldy")){
          if(accountToken < _amount){
            return ' Insufficent token balance available for transaction '
          } else if(gasFee > accountGas){
            return ' Insufficent gas balance available for transaction '
          } else {
            return true;
          }
      }
    } else if(_rain == true){
      if(( _asset == "ETH" || _asset == "ETH")){
        var totalGas = gasFee + (_amount*5);
        if(totalGas > accountGas){
          return ' Insufficent gas balance available for transaction '
        } else {
          return true;
        }
      } else if(( _asset == "VLDY" || _asset == "vldy")){
        var approvalParse = await approved(_account);
        var totalToken = _amount*5;

        console.log("Approved:", approvalParse);
        console.log("Total:", totalToken);

        if(accountToken < totalToken){
          return ' Insufficent token balance available for transaction '
        } else if(gasFee > accountGas){
          return ' Insufficent gas balance available for transaction '
        } else if(approvalParse == 0){
          return ' Please approve first!  '
        } else if(approvalParse <= totalToken){
          return ' Amount exceeds approval  '
        } else {
          return true;
        }
      }
    } else if(_rain === "withdraw"){
      if(( _asset == "ETH" || _asset == "ETH")){
        var totalGas = gasFee + _amount;
        if(totalGas > accountGas){
          return ' Insufficent gas balance available for transaction '
        } else {
          return true;
        }
      } else if(( _asset == "VLDY" || _asset == "vldy")){
        if(accountToken < _amount){
          return ' Insufficent token balance available for transaction '
        } else if(gasFee > accountGas){
          return ' Insufficent gas balance available for transaction '
        } else {
          return true;
        }
      }
    }
 }

 module.exports.viewAccount = viewAccount = async(_username) => {
    var id = await getID(_username);
    if(id != undefined){
      return await admin.firestore().collection(id)
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

 module.exports.getUsername = getUsername = async(_chatid) => {
   _chatid = "v" + _chatid.toString();
  return await admin.firestore().collection(_chatid)
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
    var tipped = { tx: "", accounts: [], users: [] };
    var users = await rainUsers(_platform, _username);

   for(var x = 0; x < 50; x++){
      var randomIndex = Math.floor(Math.random() * users.length);
      var transaction;
      if(tipped[users[randomIndex]] != true
        && users[randomIndex] != undefined
        && tipped.accounts.length != 5){
        var reciever =  await viewAccount(users[randomIndex]);
          tipped.users.push(users[randomIndex]);
          tipped.accounts.push(reciever);
          totalTipped = totalTipped + _amount;
          tipped[users[randomIndex]] = true;
        }
      }

    var tx = await rainTransfer(_payee, tipped.accounts, _amount, _asset);

    if(tx != undefined){
      await leaderboardInput(_platform, _username, totalTipped, _asset);
      tipped.tx = tx;
    }
    await _web3.eth.accounts.wallet.remove(_payee);
    return tipped;
}

  module.exports.tipUser = tipUser = async(_platform, _username, _payee, _reciever, _amount, _asset) => {
     var feeValue = feeImplementation(false);
     var transactionHash;

     if((_asset == "VLDY" || _asset == "vldy")){
       transactionHash = await tokenTransfer(_payee, _reciever, _amount);
     } else if((_asset == "ETH" || _asset == "ETH")){
       transactionHash = await gasTransfer(_payee, _reciever, _amount);
     } if(transactionHash !== undefined){
       await leaderboardInput(_platform, _username, _amount, _asset);
       await gasTransfer(_payee, _feeWallet, feeValue);
     }
     _web3.eth.accounts.wallet.remove(_payee);
     return transactionHash;
 }

 module.exports.withdrawFunds = withdrawFunds = async(_payee, _target, _amount, _asset) => {
   var feeValue = feeImplementation("withdraw");
   var transactionHash;

    if(_asset == "VLDY"){
      transactionHash = await tokenTransfer(_payee, _target, _amount);
    } else if(_asset == "ETH"){
      transactionHash = await gasTransfer(_payee, _target, _amount);
      _web3.eth.accounts.wallet.remove(_payee);
  } await gasTransfer(_payee, _feeWallet, feeValue);
  return transactionHash;
}

  module.exports.createAccount = createAccount = async(_username, _chatid) => {
   _chatid = "v" + _chatid.toString();
   if(await viewAccount(_username) == undefined){
    var account = _web3.eth.accounts.create();
	   console.log(account);
     await admin.firestore().collection(_chatid).add({
       privateKey: account.privateKey,
       address: account.address,
       user: _username});
     await admin.firestore().collection(_username).add({
       id: _chatid });
     return account.address;
   }
 }

   module.exports.logCall = logCall = async(_chatid) => {
     _chatid = "x" + _chatid;
    var timestampLimit = new Date();
    console.log("OLD", timestampLimit.getTime());
    await timestampLimit.setSeconds(timestampLimit.getSeconds() + 3);
    console.log("NEW", timestampLimit.getTime());
      await admin.firestore().collection(_chatid).add({
        call: timestampLimit.getTime()
      })
    }

    module.exports.getCall = getCall = async(_chatid) => {
      _chatid = "x" + _chatid;
     return await admin.firestore().collection(_chatid)
       .orderBy('call', 'desc').limit(1).get()
       .then(async(state) => {
         var result;
         await state.forEach((asset) => {
            result = asset.data().call;
        })
        return result;
       })
     }

  module.exports.tokenbalance = tokenBalance = async(_target) => {
    console.log(_target);
   const balance = await _instance.methods.balanceOf(_target).call();
   console.log(balance);
   return parseFloat(balance/_ether).toFixed(2);
 }

  module.exports.gasBalance = gasBalance = async(_target) => {
   var balance = await _web3.eth.getBalance(_target);
   return parseFloat(balance/_ether).toFixed(2);
 }

 module.exports.isAddress = isAddress = async(_address) => {
   if(_address != undefined){
     return _web3.utils.isAddress(_address);
   } else {
     return false;
   }
}

module.exports.gasTotal = gasTotal = async( _platform) => {
    return await admin.firestore().collection(_platform)
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
       return await admin.firestore().collection(_platform)
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

  module.exports.decimalLimit = decimalLimit = async(_amount) => {
      _amount = parseFloat(_amount);
      if(_amount % 1 == 0){
           _amount = parseInt(_amount);
        } else if(_amount % 1 != 0 && _amount > 999){
           _amount = _amount - _amount % 1;
        }
      return _amount;
  }


    module.exports.getAccount = getAccount = async(_username) => {
     var id = await getID(_username);
     if(id != undefined){
       return await admin.firestore().collection(id)
       .orderBy('privateKey', 'desc').limit(1).get()
       .then(async(state) => {
         var result;
        await state.forEach((asset) => {
            result = asset.data().privateKey;
          })
        if(result.charAt(0) != '0'
        	&& result.charAt(1) != 'x'){ result = "0x" + result; }
        console.log(result);
        result = _web3.eth.accounts.privateKeyToAccount(result);
        _web3.eth.accounts.wallet.add(result);
        return result.address;
      })
    } else {
      return id;
    }
  }

  rainUsers = async( _platform, _user) => {
       return await admin.firestore().collection(_platform)
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
    const properNonce = await _web3.eth.getTransactionCount(_payee);
    const pendingTxs = await pendingTransactions();
    const gasHeight = 750000000;
    const gasLimit = 4750000;

    return await new Promise((resolve, reject) =>
     _web3.eth.sendTransaction({
       nonce: _web3.utils.toHex(properNonce+pendingTxs),
       gasPrice: _web3.utils.toHex(gasHeight),
       gasLimit: _web3.utils.toHex(gasLimit),
       value: _amount,
       from: _payee,
       to: _recipent
     }).on('transactionHash', (hash) => {
       resolve(hash);
     }));
 }

tokenTransfer = async(_payee, _recipent, _amount) => {
  if(_amount % 1 == 0){
    _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
  } else if(_amount % 1 != 0){
    _amount = _web3.utils.toHex(_amount*_ether);
  }

   const properNonce = await _web3.eth.getTransactionCount(_payee);
   const pendingTxs = await pendingTransactions();
   const gasHeight = 1000000000;
   const gasLimit = 6000000;

   return await new Promise((resolve, reject) =>
      _instance.methods.transfer(_recipent, _amount).send({
       nonce: _web3.utils.toHex(properNonce+pendingTxs),
       gasPrice: _web3.utils.toHex(gasHeight),
       gasLimit: _web3.utils.toHex(gasLimit),
       from: _payee
     }).on('transactionHash', (hash) => {
        resolve(hash);
     }));
   }

 rainTransfer = async(_payee, _users, _amount, _asset) => {
   var contract = _web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000");
   var feeValue = feeImplementation(true);
   var inputValue = 0;
   if(_amount % 1 == 0){
     _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
   } else if(_amount % 1 != 0){
     _amount = _web3.utils.toHex(_amount*_ether);
   }
   if(_asset == "ETH"){
     inputValue = _amount*_users.length;
   } else {
     contract = tokenLocation;
   }

   const properNonce = await _web3.eth.getTransactionCount(_payee);
   const pendingTxs = await pendingTransactions();
   const gasHeight = 10000000000;
   const gasLimit = 6750000;

   console.log(contract, _users, _amount);

   return await new Promise((resolve, reject) =>
      _rain.methods.multiSend(contract, _users, _amount)
      .send({
        nonce: _web3.utils.toHex(properNonce+pendingTxs),
        gasPrice: _web3.utils.toHex(gasHeight),
        gasLimit: _web3.utils.toHex(gasLimit),
        from: _payee,
        value: inputValue
    }).on('transactionHash', (hash) => {
          gasTransfer(_payee, _feeWallet, feeValue);
          resolve(hash);
    }));
 }

 leaderboardInput = async(_platform, _user, _amount, _asset) => {
    var gas = await userGas(_platform, _user);
    var token = await userToken(_platform, _user);
    if(isNaN(gas) == true ){ gas = 0; }
    if(isNaN(token) == true){ token = 0; }
    if(_asset == "ETH"){
      gas = parseFloat(gas)+parseFloat(_amount);
    } else if(_asset == "VLDY"){
      token = parseFloat(token)+parseFloat(_amount);
    }
    await admin.firestore().collection(_platform).add({
      token: token,
      user: _user,
      gas: gas
    })
    return await admin.firestore().collection(_user).add({
      [_platform]: gas,
      token: token
    })
 }

 pendingTransactions =  async(_payee) => {
   var latestBlock = await _web3.eth.getBlock("latest");
   var subscriptionStream =  _web3.eth.subscribe('logs', {
   from: latestBlock.number-5,
   address: _payee })
    return new Promise((resolve, reject) =>
 (error, metaData) => {
          resolve(metaData.transactionIndex);
    }));
 }

userGas = async(_platform ,_user) => {
      return await admin.firestore().collection(_user)
      .orderBy(`${_platform}`, 'desc').limit(1).get()
      .then(async(state) => {
        var result;
        await state.forEach((asset) => {
           result = asset.data()[_platform];
         })
        return result;
      })
    }

   userToken = async(_platform ,_user) => {
       return await admin.firestore().collection(_user)
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

 module.exports.getID = getID = async(_username) => {
   if(_username != undefined){
     return await admin.firestore().collection(_username)
     .orderBy('id', 'desc').limit(1).get()
     .then(async(state) => {
       var result;
        await state.forEach((asset) => {
           result = asset.data().id;
        })
      return result;
   })
  }
  }

  module.exports.approved = approved = async(_payee) => {
    var value = await _instance.methods.allowance(_payee, multiLocation).call();
    return parseFloat(value/_ether).toFixed(2);
}

 module.exports.approveTokens = approveTokens = async(_payee) => {
   var _approved = await approved(_payee);
   console.log("APPROVED", _approved);
   if(_approved == 0){
     var standardApproval = _web3.utils.toHex(_web3.utils.toBN(100000).mul(_web3.utils.toBN(1e18)));

     const properNonce = await _web3.eth.getTransactionCount(_payee);
     const pendingTxs = await pendingTransactions();
     const gasHeight = 20000000000;
     const gasLimit = 8000000;

     return await new Promise((resolve, reject) =>
        _instance.methods.approve(multiLocation, standardApproval)
        .send({
          nonce: _web3.utils.toHex(properNonce+pendingTxs),
          gasPrice: _web3.utils.toHex(gasHeight),
          gasLimit: _web3.utils.toHex(gasLimit),
          from: _payee
        }).on('transactionHash', (hash) => {
           resolve(hash);
      }));
    }
  }

  module.exports.resetApprove = approveTokens = async(_payee) => {
      const currentValue = await _instance.methods.allowance(_payee, multiLocation).call()
      var subtractValue =  _web3.utils.toHex(_web3.utils.toBN(currentValue));

      const properNonce = await _web3.eth.getTransactionCount(_payee);
      const pendingTxs = await pendingTransactions();
      const gasHeight = 20000000000;
      const gasLimit = 8000000;

      return await new Promise((resolve, reject) =>
        _instance.methods.decreaseAllowance(multiLocation, subtractValue)
        .send({
         nonce: _web3.utils.toHex(properNonce+pendingTxs),
         gasPrice: _web3.utils.toHex(gasHeight),
         gasLimit: _web3.utils.toHex(gasLimit),
         from: _payee
       }).on('transactionHash', (hash) => {
          resolve(hash);
       }));
   }

  feeImplementation = (_bool) => {
    if(_bool == false){
      return ((0.001));
    } else if(_bool == true){
      return ((0.001*5));
    } else if(_bool === "withdraw") {
      return (0);
    }
  }
