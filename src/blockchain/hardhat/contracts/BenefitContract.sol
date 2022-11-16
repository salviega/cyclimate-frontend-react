// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./RecipientContract.sol";

interface ICycliContract {
    function substractCycli(address _address, uint256 _amount)
        external
        returns (bool);

    function getSupplyBalance(address _address) external view returns (uint256);
}

// interface IPUSHCommInterface {
//     function sendNotification(
//         address _channel,
//         address _recipient,
//         bytes calldata _identity
//     ) external;
// }

contract BenefitContract is ERC721URIStorage, RecipientContract {
    using Roles for Roles.Role;

    Roles.Role private ADMIN;
    Roles.Role private MANAGER;
    using Counters for Counters.Counter;

    Counters.Counter public ItemCounter;
    Counters.Counter public tokenIdCounter;

    struct Token {
        uint256 id;
        string URI;
        bool checkIn;
        bool redeem;
        address buyer;
    }

    mapping(uint256 => Token) public tokens;
    mapping(address => uint256[]) public benefitsIdByCustomer;

    string public uri;
    uint256 public maxMint;
    uint256 public price;
    address public EPNS_COMM_ADDRESS =
        0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa; // Mumbai

    constructor(
        address _manager,
        uint256 _maxMint,
        string memory _uri,
        uint256 _price,
        address _erc777Address,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) RecipientContract(_erc777Address) {
        ADMIN.add(msg.sender);
        MANAGER.add(_manager);
        uri = _uri;
        price = _price;
        maxMint = _maxMint;
    }

    function safeMint(address _tokenAddress) public returns (uint256) {
        require(tokenIdCounter.current() < maxMint, "Mint limit completed");
        require(
            ICycliContract(_tokenAddress).getSupplyBalance(msg.sender) > price,
            "Insufficient tokens"
        );

        if (!ICycliContract(_tokenAddress).substractCycli(msg.sender, price)) {
            revert();
        }

        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        Token memory token = Token(tokenId, uri, false, false, msg.sender);
        tokens[tokenId] = token;
        benefitsIdByCustomer[msg.sender].push(tokenId);

        deposit(price);
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        // IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
        //     0xBd52B47c729F14f3E6232536E21902aD769FafA4, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
        //     msg.sender, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
        //     bytes(
        //         string(
        //             // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
        //             abi.encodePacked(
        //                 "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
        //                 "+", // segregator
        //                 "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
        //                 "+", // segregator
        //                 "Tranfer Alert", // this is notificaiton title
        //                 "+", // segregator
        //                 "Hooray! ",
        //                 "You minted ", // notification body
        //                 addressToString(msg.sender),
        //                 " 10 cycli "
        //             )
        //         )
        //     )
        // );
        return tokenId;
    }

    function checkIn(uint256 _tokenId) external returns (bool) {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You are not the owner of the NFT"
        );
        Token storage token = tokens[_tokenId];
        token.checkIn = true;
        return token.checkIn;
    }

    function redeemBenefit(address _customer, uint256 _tokenId)
        public
        returns (bool)
    {
        require(
            MANAGER.has(msg.sender) || ADMIN.has(msg.sender),
            "DOES_NOT_HAVE_MINTER_ROLE"
        );
        require(ownerOf(_tokenId) == _customer, "This token doesn't your");
        require(tokens[_tokenId].checkIn, "You need to do check-in");
        Token storage token = tokens[_tokenId];
        token.redeem = true;
        return token.redeem;
    }

    function getBenefitsIdsByCustomer(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        return benefitsIdByCustomer[_owner];
    }

    function isManagerOrAdmin() public view returns (bool) {
        if (MANAGER.has(msg.sender)) {
            return true;
        }
        if (ADMIN.has(msg.sender)) {
            return true;
        }
        return false;
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

library Roles {
    struct Role {
        mapping(address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account)
        internal
        view
        returns (bool)
    {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}
