pragma solidity ^0.4.24;

library SafeMath {

    int256 constant private INT256_MIN = -2**255;

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {

        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    function mul(int256 a, int256 b) internal pure returns (int256) {
        if (a == 0) {
            return 0;
        }

        require(!(a == -1 && b == INT256_MIN));

        int256 c = a * b;
        require(c / a == b);

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;

        return c;
    }

    function div(int256 a, int256 b) internal pure returns (int256) {
        require(b != 0);
        require(!(b == -1 && a == INT256_MIN));

        int256 c = a / b;

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    function sub(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a - b;
        require((b >= 0 && c <= a) || (b < 0 && c > a));

        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    function add(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a + b;
        require((b >= 0 && c >= a) || (b < 0 && c < a));

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}

contract ERC20d {

    using SafeMath for uint;

    bytes32 constant POS = 0x506f736974697665000000000000000000000000000000000000000000000000;
    bytes32 constant NEU = 0x4e65757472616c00000000000000000000000000000000000000000000000000;
    bytes32 constant NEG = 0x4e65676174697665000000000000000000000000000000000000000000000000;

    struct _delegate {
        bytes32 _delegationIdentity;
        bytes32 _positiveVotes;
        bytes32 _negativeVotes;
        bytes32 _neutralVotes;
        bytes32 _totalEvents;
        bytes32 _totalVotes;
        bytes32 _trustLevel;
    }

    mapping (address => mapping (address => uint)) private _allowed;
    mapping (address => uint) private _balances;

    mapping (bytes => _delegate) private _stats;
    mapping (bytes => address) private _wallet;
    mapping (address => bool) private _active;
    mapping (address => bool) private _stake;
    mapping (address => bytes) private _vID;
    mapping (bytes => uint) private _trust;
    mapping (bytes => bool) private _voted;

    address private _founder = msg.sender;
    address private _admin = address(0x0);

    uint private _totalSupply;
    uint private _maxSupply;
    uint private _decimals;

    string private _name;
    string private _symbol;

    modifier _stakeCheck(address _from , address _to) {
        require(!isStaking(_from) && !isStaking(_to));
        _;
    }

    modifier _verifyID(address _account) {
        if(!isActive(_account)) {
            createID(_account);
        }
        _;
    }

    modifier _trustLimit(bytes _id) {
        require(_trust[_id] < block.number);
        _;
    }

    modifier _onlyAdmin() {
        require(msg.sender == _admin);
        _;
    }

    modifier _onlyFounder() {
        require(msg.sender == _founder);
        _;
    }

    constructor() public {
        // 50,600,000,000 VLDY - Max supply
        // 48,070,000,000 VLDY - Initial supply
        //  2,530,000,000 VLDY - Delegation supply
        uint genesis = uint(48070000000).mul(10**uint(18));
        _maxSupply = uint(50600000000).mul(10**uint(18));
        _mint(_founder, genesis);
        _name = "Validity";
        _symbol = "VLDY";
        _decimals = 18;
    }

    function toggleStake() public {
        require(!isVoted(getvID(msg.sender)));
        require(isActive(msg.sender));

        _stake[msg.sender] = !_stake[msg.sender];
        emit Stake(msg.sender);
    }

    function setIdentity(bytes32 _identity) public {
        require(isActive(msg.sender));

        _stats[getvID(msg.sender)]._delegationIdentity = _identity;
    }

    function name() public view returns (string) {
        return _name;
    }

    function symbol() public view returns (string) {
        return _symbol;
    }

    function decimals() public view returns (uint) {
        return _decimals;
    }

    function maxSupply() public view returns (uint) {
        return _maxSupply;
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function isVoted(bytes _id)  public view returns (bool) {
        return _voted[_id];
    }

    function isActive(address _account)  public view returns (bool) {
        return _active[_account];
    }

    function isStaking(address _account)  public view returns (bool) {
        return _stake[_account];
    }

    function balanceOf(address _owner) public view returns (uint) {
        return _balances[_owner];
    }

    function getvID(address _account) public view returns (bytes) {
        return _vID[_account];
    }

    function getIdentity(bytes _id) public view returns (bytes32) {
         return _stats[_id]._delegationIdentity;
    }

    function getAddress(bytes _id) public view returns (address) {
        return _wallet[_id];
    }

    function trustLevel(bytes _id) public view returns (uint) {
        return uint(_stats[_id]._trustLevel);
    }

    function totalEvents(bytes _id) public view returns (uint) {
        return uint(_stats[_id]._totalEvents);
    }

    function totalVotes(bytes _id) public view returns (uint) {
        return uint(_stats[_id]._totalVotes);
    }

    function positiveVotes(bytes _id) public view returns (uint) {
        return uint(_stats[_id]._positiveVotes);
    }

    function negativeVotes(bytes _id) public view returns (uint) {
        return uint(_stats[_id]._negativeVotes);
    }

     function neutralVotes(bytes _id) public view returns (uint) {
        return uint(_stats[_id]._neutralVotes);
    }

    function allowance(address _owner, address _spender) public view returns (uint) {
        return _allowed[_owner][_spender];
    }

    function transfer(address _to, uint _value) public returns (bool) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) public returns (bool) {
        require(_allowed[msg.sender][_spender] == uint(0));
        require(_spender != address(0x0));

        _allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function _mint(address _account, uint _value) _verifyID(_account) internal {
        require(_totalSupply.add(_value) <= _maxSupply);
        require(_account != address(0x0));

        _totalSupply = _totalSupply.add(_value);
        _balances[_account] = _balances[_account].add(_value);
        emit Transfer(address(0x0), _account, _value);
    }

    function transferFrom(address _from, address _to, uint _value) public returns (bool) {
        _allowed[_from][msg.sender] = _allowed[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        emit Approval(_from, msg.sender, _allowed[_from][msg.sender]);
        return true;
    }

    function increaseAllowance(address _spender, uint _addedValue) public returns (bool) {
        require(_spender != address(0x0));

        _allowed[msg.sender][_spender] = _allowed[msg.sender][_spender].add(_addedValue);
        emit Approval(msg.sender, _spender, _allowed[msg.sender][_spender]);
        return true;
    }

    function decreaseAllowance(address _spender, uint _subtractedValue) public returns (bool) {
        require(_spender != address(0x0));

        _allowed[msg.sender][_spender] = _allowed[msg.sender][_spender].sub(_subtractedValue);
        emit Approval(msg.sender, _spender, _allowed[msg.sender][_spender]);
        return true;
    }

     function _transfer(address _from, address _to, uint _value) _stakeCheck(_from, _to) _verifyID(_to) internal {
        require(_to != address(0x0));

        _balances[_from] = _balances[_from].sub(_value);
        _balances[_to] = _balances[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    function delegationReward(bytes _id, address _account, uint _reward) _onlyAdmin public {
        require(isStaking(_account));
        require(isVoted(_id));

        _voted[_id] = false;
        _stake[_account] = false;
        _mint(_account, _reward);
        emit Reward(_id, _reward);
    }

    function delegationEvent(bytes _id, bytes32 _subject, bytes32 _choice, uint _weight) _onlyAdmin public {
        require(_choice == POS || _choice == NEU || _choice == NEG);
        require(isStaking(getAddress(_id)));
        require(!isVoted(_id));

        _voted[_id] = true;
        _delegate storage x = _stats[_id];
        if(_choice == POS) {
            x._positiveVotes = bytes32(positiveVotes(_id).add(_weight));
        } else if(_choice == NEU) {
            x._neutralVotes = bytes32(neutralVotes(_id).add(_weight));
        } else if(_choice == NEG) {
            x._negativeVotes = bytes32(negativeVotes(_id).add(_weight));
        }
        x._totalVotes = bytes32(totalVotes(_id).add(_weight));
        x._totalEvents = bytes32(totalEvents(_id).add(1));
        emit Vote(_id, _subject, _choice, _weight);
    }

    function delegationIdentifier(address _account) internal view returns (bytes) {
        bytes memory stamp = bytesStamp(block.timestamp);
        bytes32 prefix = 0x56616c6964697479;
        bytes memory id = new bytes(32);
        bytes32 x = bytes32(_account);
        for(uint v = 0; v < id.length; v++){
            uint prefixIndex = 24 + v;
            uint timeIndex = 20 + v;
            if(v < 8){
                id[v] = prefix[prefixIndex];
            } else if(v < 12){
                id[v] = stamp[timeIndex];
            } else {
                id[v] = x[v];
            }
        }
       return id;
    }

    function increaseTrust(bytes _id) _trustLimit(_id) _onlyAdmin public {
        _stats[_id]._trustLevel = bytes32(trustLevel(_id).add(1));
        _trust[_id] = block.number.add(1000);
        emit Trust(_id, POS);
    }

    function decreaseTrust(bytes _id) _trustLimit(_id) _onlyAdmin public {
        _stats[_id]._trustLevel = bytes32(trustLevel(_id).add(1));
        _trust[_id] = block.number.add(1000);
        emit Trust(_id, NEG);
    }

    function bytesStamp(uint _x) internal pure returns (bytes b) {
        b = new bytes(32);
        assembly {
            mstore(add(b, 32), _x)
        }
    }

    function adminControl(address _entity) _onlyFounder public {
        _admin = _entity;
    }

    function createID(address _account) internal {
         bytes memory id = delegationIdentifier(_account);
         emit Neo(_account, id, block.number);
         _active[_account] = true;
         _wallet[id] = _account;
         _vID[_account] = id;
    }

    event Approval(address indexed owner, address indexed spender, uint value);

    event Transfer(address indexed from, address indexed to, uint value);

    event Vote(bytes vID, bytes32 subject, bytes32 choice, uint weight);

    event Neo(address indexed subject, bytes vID, uint block);

    event Reward(bytes vID, uint reward);

    event Trust(bytes vID, bytes32 flux);

    event Stake(address indexed staker);

}
