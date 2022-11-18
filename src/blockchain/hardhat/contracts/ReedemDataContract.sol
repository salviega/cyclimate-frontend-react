// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "./VulnerableRecipientContract.sol";

// ORACULO para el de pagos: 0xf7e113AF5C0e7D19002EEEbCdae11a2Da66Af00B
// JobId: 29b34c07e3824e8f90639200b5d63781
//cycliContract: 0x99a0Dab7a0B4c548db62f1344194271a336b7244

interface ICycliContract {
    function substractCycli(address _address, uint256 _amount)
        external
        returns (bool);

    function getSupplyBalance(address _address) external view returns (uint256);

    function redeemTokens(
        address _to,
        string memory _cid,
        string memory _cidURL,
        uint256 _counter
    ) external;
}

contract RedeemDataContract is
    VulnerableRecipientContract,
    ChainlinkClient,
    ConfirmedOwner
{
    using Chainlink for Chainlink.Request;

    address cycliContract;
    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; // 1 * 10**18
    string public lastRetrievedInfo;
    string public cid;
    string public cidURL;
    address public to;
    uint256 public claim;
    bool public boom;

    event RequestForInfoFulfilled(
        bytes32 indexed requestId,
        string indexed response
    );

    /**
     *  MUMBAI
     *@dev LINK address in Mumbai network: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * @dev Check https://docs.chain.link/docs/link-token-contracts/ for LINK address for the right network
     */
    constructor(address _oracle, address _cycliContract)
        ConfirmedOwner(msg.sender)
        VulnerableRecipientContract(_cycliContract)
    {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        cycliContract = _cycliContract;
        setChainlinkOracle(_oracle);
    }

    function requestPayOut(string memory _jobId) public {
        Chainlink.Request memory req = buildChainlinkRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillMultipleParameters.selector
        );

        req.add("to", addressToString(msg.sender));

        sendChainlinkRequest(req, ORACLE_PAYMENT); // MWR API.
    }

    function fulfillMultipleParameters(
        bytes32 _requestId,
        address _to,
        string memory _cid,
        string memory _ret_url,
        uint256 _claim
    ) public recordChainlinkFulfillment(_requestId) {
        to = _to;
        cid = _cid;
        cidURL = _ret_url;
        claim = _claim;

        try
            ICycliContract(cycliContract).redeemTokens(
                _to,
                _cid,
                _ret_url,
                _claim
            )
        {} catch {
            boom = true;
        }

        boom = false;
    }

    /*
    ========= UTILITY FUNCTIONS ==========
    */

    function contractBalances()
        public
        view
        returns (uint256 eth, uint256 link)
    {
        eth = address(this).balance;

        LinkTokenInterface linkContract = LinkTokenInterface(
            chainlinkTokenAddress()
        );
        link = linkContract.balanceOf(address(this));
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer Link"
        );
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(string memory source)
        private
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
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
