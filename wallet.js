
const tokenLocation = "0x904da022abcf44eba68d4255914141298a7f7307";
const tipLocation = "0x51bb6fd1ab2cf10076549df44d4b6eda2a00e093";
const mvpLocation = "0x00c1c8821abc108711daa82950c3ba5452899a88";

const jsonMVP = require("./build/contracts/CommunalValidation.json");
const jsonTip = require("./build/contracts/Tipbot.json");
const jsonToken = require("./build/contracts/ERC20d.json");

const Web3 = require('web3');
const admin = require("firebase-admin");

const _provider = new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/<API-KEY>')
const _testnet = new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/<API-KEY>')
const _web3 = new Web3(_provider);
const _test3 = new Web3(_testnet);

const _instance = new _web3.eth.Contract(jsonToken.abi, tokenLocation);
const _mvp = new _test3.eth.Contract(jsonMVP.abi, mvpLocation);
const _rain = new _web3.eth.Contract(jsonTip.abi, tipLocation);

const _ether = Math.pow(10,18);

module.exports.initialiseDatabase  = initialiseDatabase = async(_preferences) => {
   await _web3.eth.accounts.wallet.clear();
   await admin.initializeApp(_preferences);
   await admin.firestore().settings({
     timestampsInSnapshots: true
   });

 }

 module.exports.presentNumber = presentNumber = (_number, _bool) => {
   var options = _bool ? { minimumFractionDigits: 6 } : {};
   return parseFloat(_number).toLocaleString(undefined, options);
}

 module.exports.proofNumber = proofNumber = (_number) => {
   if(_number.toString().charAt(0) == '0' && _number.toString().charAt(1) == "x"){
     return false;
   } else if(isNaN(_number)){
     return false;
   } else if(!isNaN(_number)){
     return true;
   }
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
      var gasFee = feeImplementation(_rain);
      var accountToken = await tokenBalance(_account);
      var approvalParse = await approved(_account);
      var accountGas = await gasBalance(_account);

      if(_rain == false){
        gasFee += 0.00015;
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
          } else if(approvalParse == 0){
            return ' Please approve first!  '
          } else if(approvalParse < _amount){
            return ' Amount exceeds approval  '
          } else {
            return true;
          }
      }
    } else if(_rain == true){
      gasFee += 0.0025;
      if(( _asset == "ETH" || _asset == "ETH")){
        var totalGas = gasFee + (_amount*5);
        if(totalGas > accountGas){
          return ' Insufficent gas balance available for transaction '
        } else {
          return true;
        }
      } else if(( _asset == "VLDY" || _asset == "vldy")){
        var totalToken = _amount*5;

        if(accountToken < _amount){
          return ' Insufficent token balance available for transaction '
        } else if(gasFee > accountGas){
          return ' Insufficent gas balance available for transaction '
        } else if(approvalParse == 0){
          return ' Please approve first!  '
        } else if(approvalParse < _amount){
          return ' Amount exceeds approval  '
        } else {
          return true;
        }
      }
    } else if(_rain === "withdraw"){
      gasFee += 0.00015;
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
        } else if(approvalParse == 0){
          return ' Please approve first!  '
        } else if(approvalParse < _amount){
          return ' Amount exceeds approval  '
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
     var transactionHash;

     if((_asset == "VLDY" || _asset == "vldy")){
       transactionHash = await tokenTransfer(_payee, _reciever, _amount, false);
     } else if((_asset == "ETH" || _asset == "ETH")){
       transactionHash = await gasTransfer(_payee, _reciever, _amount, false);
     } if(transactionHash !== undefined){
       await leaderboardInput(_platform, _username, _amount, _asset);
     }
     _web3.eth.accounts.wallet.remove(_payee);
     return transactionHash;
 }

 module.exports.withdrawFunds = withdrawFunds = async(_payee, _target, _amount, _asset) => {
   var transactionHash;

    if(_asset == "VLDY"){
      transactionHash = await tokenTransfer(_payee, _target, _amount, "withdraw");
    } else if(_asset == "ETH"){
      transactionHash = await gasTransfer(_payee, _target, _amount, "withdraw");
      _web3.eth.accounts.wallet.remove(_payee);
  }
  return transactionHash;
}

  module.exports.createAccount = createAccount = async(_username, _chatid) => {
   _chatid = "v" + _chatid.toString();
   if(await viewAccount(_username) === undefined){
    var account = _web3.eth.accounts.create();
     await admin.firestore().collection(_chatid).add({
       privateKey: account.privateKey,
       address: account.address,
       user: _username});
     await admin.firestore().collection(_username).add({
       id: _chatid
     }); return account.address;
   }
 }

   module.exports.logCall = logCall = async(_chatid) => {
     _chatid = "x" + _chatid;
    var timestampLimit = new Date();
    await timestampLimit.setSeconds(timestampLimit.getSeconds() + 3);
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
   const balance = await _instance.methods.balanceOf(_target).call();
   return parseFloat(balance/_ether).toFixed(2);
 }

  module.exports.validationMetadata = validationMetadata = async() => {
   const eventParticipants = await _mvp.methods.currentParticipants().call();
   const eventSubject = await _mvp.methods.currentEvent().call();
   const eventRound = await _mvp.methods.currentRound().call();

   var eventTicker = await _mvp.methods.eventTicker(eventSubject, eventRound).call();
   var eventType = await _mvp.methods.eventType(eventSubject, eventRound).call();

   const eventPositive = await _mvp.methods.eventPositive(eventSubject, eventRound).call();
   const eventNeutral = await _mvp.methods.eventNeutral(eventSubject, eventRound).call();
   const eventNegative = await _mvp.methods.eventNegative(eventSubject, eventRound).call();

   var eventName = await _web3.utils.toAscii(eventSubject);
   eventTicker = await _web3.utils.toAscii(eventTicker);
   eventType = await _web3.utils.toAscii(eventType);

   return {
     eventParticipants,
     eventPositive,
     eventNegative,
     eventNeutral,
     eventRound,
     eventTicker,
     eventName,
     eventType
   }

  }

  module.exports.gasBalance = gasBalance = async(_target) => {
   var balance = await _web3.eth.getBalance(_target);
   return parseFloat(balance/_ether).toFixed(6);
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
      _amount = parseFloat(_amount.replace(',', ''));
      if(_amount % 1 == 0){
           _amount = parseInt(_amount);
        } else if(_amount % 1 != 0 && _amount > 999){
           _amount = _amount - _amount % 1;
      } return _amount;
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
        if(result.charAt(0) != '0'&& result.charAt(1) != 'x'){
          result = "0x" + result;
        } result = _web3.eth.accounts.privateKeyToAccount(result);
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

 gasTransfer = async(_payee, _recipent, _amount, _feeState) => {
   var zeroAddress = _web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000");
   var feeCost = feeImplementation(_feeState);

   if(_amount % 1 == 0){
     feeCost = _web3.utils.toHex(_web3.utils.toBN(_amount+feeCost).mul(_web3.utils.toBN(1e18)));
     _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
   } else if(_amount % 1 != 0){
     feeCost = _web3.utils.toHex(parseInt((_amount+feeCost) * _ether));
     _amount = _web3.utils.toHex(parseInt((_amount) * _ether));
   }

    const properNonce = await _web3.eth.getTransactionCount(_payee);
    const pendingTxs = await pendingTransactions(_payee);
    const gasHeight = 1750000000;
    const gasLimit = 87500;

    return await new Promise((resolve, reject) =>
    _rain.methods.tipTransfer(zeroAddress, _recipent, _amount).send({
       nonce: _web3.utils.toHex(properNonce+pendingTxs),
       gasPrice: _web3.utils.toHex(gasHeight),
       gasLimit: _web3.utils.toHex(gasLimit),
       value:  _web3.utils.toHex(feeCost),
       from: _payee,
       to: _recipent
     }).on('transactionHash', (hash) => {
       resolve(hash);
     }));
 }

tokenTransfer = async(_payee, _recipent, _amount, _feeState) => {
  if(_amount % 1 == 0){
    _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
  } else if(_amount % 1 != 0){
    _amount = _web3.utils.toHex(_amount*_ether);
  }

   const properNonce = await _web3.eth.getTransactionCount(_payee);
   const pendingTxs = await pendingTransactions(_payee);
   const feeCost = feeImplementation(_feeState) * _ether;
   const gasHeight = 2100000000;
   const gasLimit = 100000;

   return await new Promise((resolve, reject) =>
      _rain.methods.tipTransfer(tokenLocation, _recipent, _amount).send({
       nonce: _web3.utils.toHex(properNonce+pendingTxs),
       gasPrice: _web3.utils.toHex(gasHeight),
       gasLimit: _web3.utils.toHex(gasLimit),
       value:  _web3.utils.toHex(feeCost),
       from: _payee
     }).on('transactionHash', (hash) => {
        resolve(hash);
     }));
   }

 rainTransfer = async(_payee, _users, _amount, _asset) => {
   var contract = _web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000");
   var gasIndex = 0;

   if(_asset != "ETH"){
   contract = tokenLocation;
  } else {
    gasIndex = _amount*5;
  } if(_amount % 1 == 0){
     _amount = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));
   } else if(_amount % 1 != 0){
     _amount = _web3.utils.toHex(_amount*_ether);
   }

   const properNonce = await _web3.eth.getTransactionCount(_payee);
   const feeCost = (feeImplementation(true) + gasIndex) * _ether;
   const pendingTxs = await pendingTransactions(_payee);
   const gasHeight = 5100000000;
   const gasLimit = 200000;

   return await new Promise((resolve, reject) =>
      _rain.methods.multiTransfer(contract, _users, _amount)
      .send({
        nonce: _web3.utils.toHex(properNonce+pendingTxs),
        gasPrice: _web3.utils.toHex(gasHeight),
        gasLimit: _web3.utils.toHex(gasLimit),
        value: _web3.utils.toHex(feeCost),
        from: _payee,
    }).on('transactionHash', (hash) => {
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
   var options =  { address: _payee, fromBlock: latestBlock.number-500 }
   var transactionStream = _web3.eth.subscribe('logs', options, () => { })
   return 0;
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
    var value = await _instance.methods.allowance(_payee, tipLocation).call();
    return parseFloat(value/_ether).toFixed(2);
  }

 module.exports.approveTokens = approveTokens = async(_payee, _amount) => {
     var standardApproval = _web3.utils.toHex(_web3.utils.toBN(_amount).mul(_web3.utils.toBN(1e18)));

     const properNonce = await _web3.eth.getTransactionCount(_payee);
     const pendingTxs = await pendingTransactions(_payee);
     const gasHeight = 1500000000;
     const gasLimit = 50000;

     return await new Promise((resolve, reject) =>
        _instance.methods.approve(tipLocation, standardApproval)
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
      return ((0.0001));
    } else if(_bool == true){
      return ((0.0001*5));
    } else if(_bool === "withdraw") {
      return (0);
    }
  }
