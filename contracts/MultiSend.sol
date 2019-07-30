pragma solidity 0.5.8;

interface IERC20 {
    function transferFrom(address _from, address _to, uint256 _amount) external returns (bool);
    function transfer(address _to, uint _amount) external returns (bool);
}

contract MultiSend {

    IERC20 public ERC20;

    function multiSend(address _source, address[] memory _recievers, uint _amount) payable public {
        require(_recievers.length < 25);

        if(_source != address(0x0)){
            ERC20 = IERC20(_source);
            for(uint x = 0; x < _recievers.length; x++){
                ERC20.transferFrom(msg.sender, _recievers[x], _amount);
            }
        } else if(msg.value != 0) {
            for(uint y = 0; y < _recievers.length; y++){
                address payable payee = address(uint160(_recievers[y]));
                payee.transfer(_amount);
            }
        }
    }

}
