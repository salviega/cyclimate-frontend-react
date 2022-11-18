// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <=0.8.15;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "./VulnerableRecipientContract.sol";

// ORACULO para el de pagos: 0x40193c8518BB267228Fc409a613bDbD8eC5a97b3
// JobId: 5374949059814605a400982b797d84d5
// email: sb-kciyw21777306@business.example.com

interface ICycliContract {
    function substractCycli(address _address, uint256 _amount)
        external
        returns (bool);

    function getSupplyBalance(address _address) external view returns (uint256);
}

contract PaymentGatewayContract is
    VulnerableRecipientContract,
    ChainlinkClient,
    ConfirmedOwner
{
    using Chainlink for Chainlink.Request;

    address cycliContract;
    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; // 1 * 10**18
    string public lastRetrievedInfo;

    event RequestForInfoFulfilled(
        bytes32 indexed requestId,
        string indexed response
    );

    /**
     *  MUMBAI
     *@dev LINK address in Mumbai network: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * @dev Check https://docs.chain.link/docs/link-token-contracts/ for LINK address for the right network
     */
    constructor(address _cycliContract)
        ConfirmedOwner(msg.sender)
        VulnerableRecipientContract(_cycliContract)
    {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        cycliContract = _cycliContract;
    }

    function requestPayOut(
        address _oracle,
        string memory _jobId,
        string memory email,
        uint256 value,
        string memory valor
    ) public {
        require(
            ICycliContract(cycliContract).getSupplyBalance(msg.sender) > value,
            "Insufficient tokens"
        );

        deposit(value);

        Chainlink.Request memory req = buildOperatorRequest(
            stringToBytes32(_jobId),
            this.fulfillRequestInfo.selector
        );

        req.add("email", email);
        req.add("value", valor);
        req.add("hashTranx", "porImplentar");
        sendOperatorRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillRequestInfo(bytes32 _requestId, string memory _info)
        public
        recordChainlinkFulfillment(_requestId)
    {
        emit RequestForInfoFulfilled(_requestId, _info);
        lastRetrievedInfo = _info;
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
}
