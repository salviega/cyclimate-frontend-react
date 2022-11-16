// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IPUSHCommInterface {
    function sendNotification(
        address _channel,
        address _recipient,
        bytes calldata _identity
    ) external;
}

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
    address public EPNS_COMM_ADDRESS =
        0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa; // Mumbai

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
        string memory _cid,
        string memory _cidURL,
        uint256 _counter
    ) external {
        require(_counter > 0, "You don't have data packages for redeem");
        _mint(msg.sender, _counter, "", "");
        uint256 reedemId = reedemCounter.current();
        reedemCounter.increment();
        Data memory newData = Data(
            reedemId,
            _cid,
            _cidURL,
            _counter,
            true,
            msg.sender
        );
        reedemCycliBalances[reedemId] = newData;

        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            0xBd52B47c729F14f3E6232536E21902aD769FafA4, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            msg.sender, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "Tranfer Alert", // this is notificaiton title
                        "+", // segregator
                        "Hooray! ",
                        "You redeemed ", // notification body
                        _counter,
                        " CYCLI tokens for your data "
                    )
                )
            )
        );
    }

    function getSupplyBalance(address _address)
        external
        view
        returns (uint256)
    {
        return supplyCycliBalances[_address];
    }

    function addressToString(address _address)
        internal
        pure
        returns (string memory)
    {
        bytes32 _bytes = bytes32(uint256(uint160(_address)));
        bytes memory HEX = "0123456789abcdef";
        bytes memory _string = new bytes(42);
        _string[0] = "0";
        _string[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            _string[2 + i * 2] = HEX[uint8(_bytes[i + 12] >> 4)];
            _string[3 + i * 2] = HEX[uint8(_bytes[i + 12] & 0x0f)];
        }
        return string(_string);
    }
}
