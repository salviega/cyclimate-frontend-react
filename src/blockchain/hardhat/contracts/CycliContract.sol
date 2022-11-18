// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CycliContract is ERC777, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public reedemCounter;

    struct Data {
        uint256 id;
        string cid;
        string cidURI;
        uint256 counter;
        bool redeem;
        address owner;
    }

    mapping(address => address) public ownerBalances;
    mapping(address => uint256) public supplyCycliBalances;
    mapping(uint256 => Data) public reedemCycliBalances;

    uint256 public MATICtotal = 0;

    constructor() ERC777("Cycli", "CCL", new address[](0)) {}

    function safeMint(address _contract, uint256 _supply) public {
        ownerBalances[_contract] = _contract;
        supplyCycliBalances[_contract] += _supply;
        _mint(_contract, _supply, "", "");
    }

    function substractCycli(address _address, uint256 _amount)
        external
        returns (bool)
    {
        require(ownerBalances[_address] == _address, "You are not the owner");
        supplyCycliBalances[_address] -= _amount;
        return true;
    }

    function buyTokens(uint256 _value) public payable {
        require(msg.value >= _value, "Insuffcient funds");
        ownerBalances[msg.sender] = msg.sender;
        supplyCycliBalances[msg.sender] += _value;
        _mint(msg.sender, _value, "", "");
        MATICtotal += _value;
    }

    function withdrawMATIC() external onlyOwner {
        require(MATICtotal > 0, "Don't have funds");
        payable(owner()).transfer(MATICtotal);
        MATICtotal = 0;
    }

    function redeemTokens(
        address _to,
        string memory _cid,
        string memory _cidURL,
        uint256 _counter
    ) external {
        require(_counter > 0, "You don't have data packages for redeem");
        uint256 redeemedTokens = _counter * 10**18;
        _mint(_to, redeemedTokens, "", "");
        uint256 reedemId = reedemCounter.current();
        reedemCounter.increment();
        Data memory newData = Data(
            reedemId,
            _cid,
            _cidURL,
            redeemedTokens,
            true,
            _to
        );
        reedemCycliBalances[reedemId] = newData;
    }

    function getSupplyBalance(address _address)
        external
        view
        returns (uint256)
    {
        return supplyCycliBalances[_address];
    }
}
