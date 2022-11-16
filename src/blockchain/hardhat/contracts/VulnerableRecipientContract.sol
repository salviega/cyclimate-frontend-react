// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract VulnerableRecipientContract is IERC777Recipient {

    ERC777 public immutable erc777;
    address public immutable account;
    uint256 public amount;

    constructor (address _erc777Address)
    {
        IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24)
            .setInterfaceImplementer(
                address(this), 
                keccak256("ERC777TokensRecipient"), 
                address(this)
            );
        erc777 = ERC777(_erc777Address);
        account = msg.sender;
    }

    function tokensReceived (address _operator, address _from, address _to, uint256 _amount, bytes calldata _userData, bytes calldata _operatorData) override external {
        // revert();
        amount += _amount;
    }

    function deposit(uint _amount) internal {
        erc777.operatorSend(address(msg.sender), address(this), _amount, "", "");
        amount += _amount;
    }

    function withdrawTokens() external {
        require(amount > 0, "There don't be tokens");
        erc777.operatorSend(address(this), address(msg.sender), amount, "", "");
        amount = 0;
    }

    function transferTaxFee(address _from, address _artist, uint256 _taxFee) internal {
        erc777.operatorSend(_from, _artist, _taxFee, "", "");
    }
}