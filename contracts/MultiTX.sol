pragma solidity ^0.4.24;

interface ERC20Interface {
    function transferFrom(address _from, address _to, uint256 _amount) external returns (bool);
    function transfer(address _to, uint _amount) external returns (bool);
}

contract MultiTX {

    ERC20Interface public _Token;

    function multiSend(address _source, address[] _recievers, uint _amount) payable public {
        require(_recievers.length < 25);

        if(_source != address(0x0)){
            _Token = ERC20Interface(_source);
            for(uint x = 0; x < _recievers.length; x++){
                _Token.transferFrom(msg.sender, _recievers[x], _amount);
            }
        } else if(msg.value != 0) {
            for(uint y = 0; y < _recievers.length; y++){
                _recievers[x].transfer(_amount);
            }
        }
    }

}
